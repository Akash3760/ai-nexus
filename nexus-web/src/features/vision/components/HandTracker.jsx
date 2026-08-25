import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    FilesetResolver,
    HandLandmarker,
} from "@mediapipe/tasks-vision";

/* =========================================================
   MEDIAPIPE
========================================================= */

const WASM_PATH = "/mediapipe/wasm";

const MODEL_PATH =
    "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

/* =========================================================
   HAND CONNECTIONS
========================================================= */

const HAND_CONNECTIONS = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],

    [0, 5],
    [5, 6],
    [6, 7],
    [7, 8],

    [5, 9],
    [9, 10],
    [10, 11],
    [11, 12],

    [9, 13],
    [13, 14],
    [14, 15],
    [15, 16],

    [13, 17],
    [17, 18],
    [18, 19],
    [19, 20],

    [0, 17],
];

/* =========================================================
   GESTURE THRESHOLDS
========================================================= */

const PINCH_START = 0.075;
const PINCH_END = 0.095;

/*
 * IMPORTANT:
 *
 * This is intentionally high.
 *
 * The old value 0.32 caused noticeable lag.
 *
 * We want the portal to feel attached to the hand.
 */
const POSITION_SMOOTHING = 0.78;

/*
 * Size can be slightly smoother than position.
 */
const SIZE_SMOOTHING = 0.45;

/* =========================================================
   DISTANCE
========================================================= */

function distance(a, b) {
    if (!a || !b) {
        return 1;
    }

    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = (a.z || 0) - (b.z || 0);

    return Math.sqrt(
        dx * dx +
        dy * dy +
        dz * dz
    );
}

/* =========================================================
   PALM CENTER
========================================================= */

function getPalmCenter(landmarks) {
    if (!landmarks || landmarks.length < 21) {
        return null;
    }

    /*
     * Wrist + MCP joints.
     *
     * This is much more stable than using
     * the index fingertip.
     */
    const indexes = [
        0,
        5,
        9,
        13,
        17,
    ];

    let x = 0;
    let y = 0;
    let z = 0;
    let count = 0;

    for (const index of indexes) {
        const point = landmarks[index];

        if (!point) {
            continue;
        }

        x += point.x;
        y += point.y;
        z += point.z || 0;

        count++;
    }

    if (!count) {
        return null;
    }

    return {
        x: x / count,
        y: y / count,
        z: z / count,
    };
}

/* =========================================================
   FINGER EXTENSION
========================================================= */

function isFingerExtended(
    landmarks,
    tipIndex,
    pipIndex
) {
    const tip = landmarks[tipIndex];
    const pip = landmarks[pipIndex];

    if (!tip || !pip) {
        return false;
    }

    return tip.y < pip.y;
}

/* =========================================================
   GESTURE
========================================================= */

function detectGesture(
    landmarks,
    previousPinching = false
) {
    if (!landmarks || landmarks.length < 21) {
        return {
            gesture: "none",
            pinchDistance: 1,
            isPinching: false,
        };
    }

    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];

    const pinchDistance = distance(
        thumbTip,
        indexTip
    );

    /*
     * Hysteresis.
     *
     * Start:
     *     0.075
     *
     * Release:
     *     0.095
     *
     * This prevents flickering.
     */
    const isPinching = previousPinching
        ? pinchDistance < PINCH_END
        : pinchDistance < PINCH_START;

    if (isPinching) {
        return {
            gesture: "pinch",
            pinchDistance,
            isPinching: true,
        };
    }

    const indexExtended =
        isFingerExtended(
            landmarks,
            8,
            6
        );

    const middleExtended =
        isFingerExtended(
            landmarks,
            12,
            10
        );

    const ringExtended =
        isFingerExtended(
            landmarks,
            16,
            14
        );

    const pinkyExtended =
        isFingerExtended(
            landmarks,
            20,
            18
        );

    /*
     * Open palm
     */
    if (
        indexExtended &&
        middleExtended &&
        ringExtended &&
        pinkyExtended
    ) {
        return {
            gesture: "open_palm",
            pinchDistance,
            isPinching: false,
        };
    }

    /*
     * Two fingers
     */
    if (
        indexExtended &&
        middleExtended &&
        !ringExtended &&
        !pinkyExtended
    ) {
        return {
            gesture: "two_fingers",
            pinchDistance,
            isPinching: false,
        };
    }

    /*
     * Point
     */
    if (
        indexExtended &&
        !middleExtended &&
        !ringExtended &&
        !pinkyExtended
    ) {
        return {
            gesture: "point",
            pinchDistance,
            isPinching: false,
        };
    }

    return {
        gesture: "none",
        pinchDistance,
        isPinching: false,
    };
}

/* =========================================================
   HAND TRACKER
========================================================= */

export default function HandTracker({
    videoRef,
    enabled = false,
    onResults,
}) {
    const landmarkerRef =
        useRef(null);

    const animationRef =
        useRef(null);

    const canvasRef =
        useRef(null);

    const onResultsRef =
        useRef(onResults);

    const lastVideoTimeRef =
        useRef(-1);

    /* =======================================================
       INTERACTION STATE
    ======================================================= */

    const handStateRef =
        useRef({
            /*
             * One-hand pinch state
             */
            oneHandPinching: false,

            /*
             * Two-hand pinch state
             */
            hand1Pinching: false,
            hand2Pinching: false,

            /*
             * Portal grabbed
             */
            grabbed: false,

            /*
             * Smoothed portal position
             */
            smoothX: 0.5,
            smoothY: 0.5,

            /*
             * Previous hand distance
             */
            lastTwoHandDistance: null,

            /*
             * Current portal scale
             */
            scale: 1,

            /*
             * Last timestamp
             */
            lastFrameTime: 0,
        });

    const [ready, setReady] =
        useState(false);

    const [error, setError] =
        useState("");

    /* =======================================================
       CALLBACK
    ======================================================= */

    useEffect(() => {
        onResultsRef.current =
            onResults;
    }, [onResults]);

    /* =======================================================
       INITIALIZE MEDIAPIPE
    ======================================================= */

    useEffect(() => {
        let cancelled = false;

        async function initialize() {
            try {
                setError("");

                const vision =
                    await FilesetResolver.forVisionTasks(
                        WASM_PATH
                    );

                if (cancelled) {
                    return;
                }

                const handLandmarker =
                    await HandLandmarker.createFromOptions(
                        vision,
                        {
                            baseOptions: {
                                modelAssetPath:
                                    MODEL_PATH,

                                /*
                                 * CPU is more compatible.
                                 */
                                delegate: "CPU",
                            },

                            runningMode: "VIDEO",

                            /*
                             * We need two hands.
                             */
                            numHands: 2,

                            minHandDetectionConfidence:
                                0.50,

                            minHandPresenceConfidence:
                                0.50,

                            minTrackingConfidence:
                                0.50,
                        }
                    );

                if (cancelled) {
                    handLandmarker.close();
                    return;
                }

                landmarkerRef.current =
                    handLandmarker;

                setReady(true);

                console.log(
                    "MediaPipe Hand Tracker ready."
                );
            } catch (err) {
                console.error(
                    "MediaPipe initialization failed:",
                    err
                );

                if (!cancelled) {
                    setError(
                        err?.message ||
                        "Unable to initialize MediaPipe hand tracking."
                    );

                    setReady(false);
                }
            }
        }

        initialize();

        return () => {
            cancelled = true;

            cancelAnimationFrame(
                animationRef.current
            );

            if (
                landmarkerRef.current
            ) {
                landmarkerRef.current.close();

                landmarkerRef.current =
                    null;
            }

            setReady(false);
        };
    }, []);

    /* =======================================================
       CLEAR CANVAS
    ======================================================= */

    const clearCanvas =
        useCallback(() => {
            const canvas =
                canvasRef.current;

            if (!canvas) {
                return;
            }

            const ctx =
                canvas.getContext("2d");

            if (!ctx) {
                return;
            }

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );
        }, []);

    /* =======================================================
       RESIZE CANVAS
    ======================================================= */

    const resizeCanvas =
        useCallback(() => {
            const video =
                videoRef?.current;

            const canvas =
                canvasRef.current;

            if (!video || !canvas) {
                return;
            }

            const rect =
                video.getBoundingClientRect();

            if (
                rect.width <= 0 ||
                rect.height <= 0
            ) {
                return;
            }

            const dpr =
                window.devicePixelRatio || 1;

            canvas.width =
                Math.round(
                    rect.width * dpr
                );

            canvas.height =
                Math.round(
                    rect.height * dpr
                );

            canvas.style.width =
                `${rect.width}px`;

            canvas.style.height =
                `${rect.height}px`;

            const ctx =
                canvas.getContext("2d");

            if (!ctx) {
                return;
            }

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );
        }, [videoRef]);

    /* =======================================================
       COORDINATE MAPPER
    ======================================================= */

    const getCoordinateMapper =
        useCallback(
            (
                video,
                width,
                height
            ) => {
                const videoWidth =
                    video.videoWidth;

                const videoHeight =
                    video.videoHeight;

                if (
                    !videoWidth ||
                    !videoHeight
                ) {
                    return null;
                }

                const videoAspect =
                    videoWidth /
                    videoHeight;

                const containerAspect =
                    width /
                    height;

                let renderedWidth;
                let renderedHeight;

                let offsetX = 0;
                let offsetY = 0;

                /*
                 * object-cover calculation.
                 */
                if (
                    videoAspect >
                    containerAspect
                ) {
                    renderedHeight =
                        height;

                    renderedWidth =
                        height *
                        videoAspect;

                    offsetX =
                        (
                            width -
                            renderedWidth
                        ) / 2;
                } else {
                    renderedWidth =
                        width;

                    renderedHeight =
                        width /
                        videoAspect;

                    offsetY =
                        (
                            height -
                            renderedHeight
                        ) / 2;
                }

                return (landmark) => {
                    /*
                     * Camera is mirrored.
                     */
                    return {
                        x:
                            (1 - landmark.x) *
                            renderedWidth +
                            offsetX,

                        y:
                            landmark.y *
                            renderedHeight +
                            offsetY,
                    };
                };
            },
            []
        );

    /* =======================================================
       DRAW POINT
    ======================================================= */

    const drawPoint =
        useCallback(
            (
                ctx,
                x,
                y,
                radius = 3
            ) => {
                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    radius,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    "#22d3ee";

                ctx.fill();

                ctx.lineWidth = 1.5;

                ctx.strokeStyle =
                    "rgba(255,255,255,0.9)";

                ctx.stroke();
            },
            []
        );

    /* =======================================================
       DRAW HAND
    ======================================================= */

    const drawHand =
        useCallback(
            (
                ctx,
                landmarks,
                mapper
            ) => {
                if (
                    !landmarks?.length ||
                    !mapper
                ) {
                    return;
                }

                ctx.beginPath();

                ctx.lineWidth = 2.2;

                ctx.strokeStyle =
                    "#22d3ee";

                ctx.lineCap =
                    "round";

                ctx.lineJoin =
                    "round";

                for (
                    const [
                        startIndex,
                        endIndex,
                    ] of HAND_CONNECTIONS
                ) {
                    const start =
                        landmarks[
                        startIndex
                        ];

                    const end =
                        landmarks[
                        endIndex
                        ];

                    if (
                        !start ||
                        !end
                    ) {
                        continue;
                    }

                    const startPoint =
                        mapper(start);

                    const endPoint =
                        mapper(end);

                    ctx.moveTo(
                        startPoint.x,
                        startPoint.y
                    );

                    ctx.lineTo(
                        endPoint.x,
                        endPoint.y
                    );
                }

                ctx.stroke();

                /*
                 * Landmark dots.
                 */
                for (
                    const landmark of
                    landmarks
                ) {
                    const point =
                        mapper(
                            landmark
                        );

                    drawPoint(
                        ctx,
                        point.x,
                        point.y
                    );
                }
            },
            [drawPoint]
        );

    /* =======================================================
       SMOOTH POSITION
    ======================================================= */

    const smoothPosition =
        useCallback(
            (targetX, targetY) => {
                const state =
                    handStateRef.current;

                state.smoothX +=
                    (
                        targetX -
                        state.smoothX
                    ) *
                    POSITION_SMOOTHING;

                state.smoothY +=
                    (
                        targetY -
                        state.smoothY
                    ) *
                    POSITION_SMOOTHING;

                return {
                    x: state.smoothX,
                    y: state.smoothY,
                };
            },
            []
        );

    /* =======================================================
       PROCESS ONE HAND
    ======================================================= */

    const processOneHand =
        useCallback(
            (hand) => {
                const state =
                    handStateRef.current;

                const palm =
                    getPalmCenter(
                        hand
                    );

                if (!palm) {
                    return null;
                }

                const gesture =
                    detectGesture(
                        hand,
                        state.oneHandPinching
                    );

                state.oneHandPinching =
                    gesture.isPinching;

                /*
                 * Mirror X.
                 */
                const targetX =
                    Math.min(
                        0.94,
                        Math.max(
                            0.06,
                            1 -
                            palm.x
                        )
                    );

                const targetY =
                    Math.min(
                        0.92,
                        Math.max(
                            0.08,
                            palm.y
                        )
                    );

                const position =
                    smoothPosition(
                        targetX,
                        targetY
                    );

                /* =================================================
                   PINCH = HOLD PORTAL
                ================================================= */

                if (
                    gesture.isPinching
                ) {
                    state.grabbed = true;

                    return {
                        interaction: "grab",

                        grabbed: true,

                        x: position.x,
                        y: position.y,

                        scale: 1,

                        gesture: "pinch",

                        pinchDistance:
                            gesture.pinchDistance,

                        hands: 1,
                    };
                }

                /* =================================================
                   RELEASE
                ================================================= */

                if (
                    state.grabbed
                ) {
                    state.grabbed = false;

                    state.lastTwoHandDistance =
                        null;

                    return {
                        interaction: "release",

                        grabbed: false,

                        x: position.x,
                        y: position.y,

                        scale: 1,

                        gesture: "none",

                        hands: 1,
                    };
                }

                /* =================================================
                   POINT = MOVE
                ================================================= */

                if (
                    gesture.gesture ===
                    "point"
                ) {
                    return {
                        interaction: "move",

                        grabbed: false,

                        x: position.x,
                        y: position.y,

                        scale: 1,

                        gesture: "point",

                        hands: 1,
                    };
                }

                /* =================================================
                   OPEN PALM
                   Keep following the palm.
                ================================================= */

                if (
                    gesture.gesture ===
                    "open_palm"
                ) {
                    return {
                        interaction: "move",

                        grabbed: false,

                        x: position.x,
                        y: position.y,

                        scale: 1,

                        gesture: "open_palm",

                        hands: 1,
                    };
                }

                return {
                    interaction: "none",

                    grabbed:
                        state.grabbed,

                    x: position.x,
                    y: position.y,

                    scale: 1,

                    gesture:
                        gesture.gesture,

                    hands: 1,

                    pinchDistance:
                        gesture.pinchDistance,
                };
            },
            [smoothPosition]
        );

    /* =======================================================
       PROCESS TWO HANDS
    ======================================================= */

    const processTwoHands =
        useCallback(
            (hands) => {
                const state =
                    handStateRef.current;

                const hand1 =
                    getPalmCenter(
                        hands[0]
                    );

                const hand2 =
                    getPalmCenter(
                        hands[1]
                    );

                if (
                    !hand1 ||
                    !hand2
                ) {
                    return null;
                }

                const gesture1 =
                    detectGesture(
                        hands[0],
                        state.hand1Pinching
                    );

                const gesture2 =
                    detectGesture(
                        hands[1],
                        state.hand2Pinching
                    );

                state.hand1Pinching =
                    gesture1.isPinching;

                state.hand2Pinching =
                    gesture2.isPinching;

                /*
                 * Center between both palms.
                 */
                const centerX =
                    (
                        hand1.x +
                        hand2.x
                    ) / 2;

                const centerY =
                    (
                        hand1.y +
                        hand2.y
                    ) / 2;

                /*
                 * Mirror X.
                 */
                const targetX =
                    Math.min(
                        0.94,
                        Math.max(
                            0.06,
                            1 -
                            centerX
                        )
                    );

                const targetY =
                    Math.min(
                        0.92,
                        Math.max(
                            0.08,
                            centerY
                        )
                    );

                const position =
                    smoothPosition(
                        targetX,
                        targetY
                    );

                /*
                 * Distance between palms.
                 */
                const dx =
                    hand1.x -
                    hand2.x;

                const dy =
                    hand1.y -
                    hand2.y;

                const handDistance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );

                /*
                 * One or both hands pinching
                 * means the portal is being held.
                 */
                const grabbing =
                    gesture1.isPinching ||
                    gesture2.isPinching;

                if (grabbing) {
                    state.grabbed = true;
                }

                /*
                 * Relative scaling.
                 */
                let scale = 1;

                if (
                    state.lastTwoHandDistance !==
                    null &&
                    state.lastTwoHandDistance >
                    0
                ) {
                    const rawScale =
                        handDistance /
                        state.lastTwoHandDistance;

                    /*
                     * Prevent huge jumps from
                     * occasional MediaPipe noise.
                     */
                    scale =
                        Math.min(
                            1.08,
                            Math.max(
                                0.92,
                                rawScale
                            )
                        );
                }

                state.lastTwoHandDistance =
                    handDistance;

                /*
                 * Smooth scale slightly.
                 */
                state.scale +=
                    (
                        scale -
                        state.scale
                    ) *
                    SIZE_SMOOTHING;

                /*
                 * If both hands are present,
                 * always treat the portal as
                 * sitting between them.
                 */
                return {
                    interaction:
                        grabbing
                            ? "grab"
                            : "two_hand",

                    grabbed:
                        state.grabbed ||
                        grabbing,

                    x: position.x,
                    y: position.y,

                    scale: state.scale,

                    handDistance,

                    hands: 2,

                    gesture:
                        grabbing
                            ? "pinch"
                            : "two_hand",

                    pinchDistance:
                        Math.min(
                            gesture1.pinchDistance,
                            gesture2.pinchDistance
                        ),
                };
            },
            [smoothPosition]
        );

    /* =======================================================
       PROCESS INTERACTION
    ======================================================= */

    const processInteraction =
        useCallback(
            (hands) => {
                const state =
                    handStateRef.current;

                /*
                 * No hands.
                 */
                if (!hands.length) {
                    const wasGrabbed =
                        state.grabbed;

                    state.grabbed = false;

                    state.oneHandPinching =
                        false;

                    state.hand1Pinching =
                        false;

                    state.hand2Pinching =
                        false;

                    state.lastTwoHandDistance =
                        null;

                    state.scale = 1;

                    return {
                        interaction:
                            wasGrabbed
                                ? "release"
                                : "none",

                        grabbed: false,

                        x: state.smoothX,
                        y: state.smoothY,

                        scale: 1,

                        hands: 0,
                    };
                }

                /*
                 * One hand.
                 */
                if (
                    hands.length === 1
                ) {
                    /*
                     * Reset two-hand state.
                     */
                    state.hand1Pinching =
                        false;

                    state.hand2Pinching =
                        false;

                    state.lastTwoHandDistance =
                        null;

                    state.scale = 1;

                    return processOneHand(
                        hands[0]
                    );
                }

                /*
                 * Two hands.
                 */
                return processTwoHands(
                    hands
                );
            },
            [
                processOneHand,
                processTwoHands,
            ]
        );

    /* =======================================================
       DRAW + RESULTS
    ======================================================= */

    const drawResults =
        useCallback(
            (results) => {
                const video =
                    videoRef?.current;

                const canvas =
                    canvasRef.current;

                if (
                    !video ||
                    !canvas
                ) {
                    return;
                }

                const rect =
                    video.getBoundingClientRect();

                const width =
                    rect.width;

                const height =
                    rect.height;

                if (
                    width <= 0 ||
                    height <= 0
                ) {
                    return;
                }

                const ctx =
                    canvas.getContext(
                        "2d"
                    );

                if (!ctx) {
                    return;
                }

                /*
                 * Clear previous skeleton.
                 */
                ctx.clearRect(
                    0,
                    0,
                    width,
                    height
                );

                const mapper =
                    getCoordinateMapper(
                        video,
                        width,
                        height
                    );

                if (!mapper) {
                    return;
                }

                const hands =
                    results?.landmarks ||
                    [];

                /*
                 * Draw hands.
                 */
                for (
                    const landmarks of
                    hands
                ) {
                    drawHand(
                        ctx,
                        landmarks,
                        mapper
                    );
                }

                /*
                 * Process interaction.
                 */
                const interaction =
                    processInteraction(
                        hands
                    );

                /*
                 * Send data to VisionStudio.
                 */
                onResultsRef.current?.({
                    ...results,

                    interaction,

                    hands,

                    handCount:
                        hands.length,

                    gesture:
                        interaction?.gesture ||
                        "none",

                    grabbed:
                        interaction?.grabbed ||
                        false,

                    portalX:
                        interaction?.x ??
                        0.5,

                    portalY:
                        interaction?.y ??
                        0.5,

                    portalScale:
                        interaction?.scale ??
                        1,

                    pinchDistance:
                        interaction?.pinchDistance ??
                        1,
                });
            },
            [
                videoRef,
                getCoordinateMapper,
                drawHand,
                processInteraction,
            ]
        );

    /* =======================================================
       DETECTION LOOP
    ======================================================= */

    useEffect(() => {
        if (
            !enabled ||
            !ready ||
            !videoRef?.current ||
            !landmarkerRef.current
        ) {
            cancelAnimationFrame(
                animationRef.current
            );

            clearCanvas();

            lastVideoTimeRef.current =
                -1;

            return;
        }

        resizeCanvas();

        const handleResize =
            () => {
                resizeCanvas();
            };

        window.addEventListener(
            "resize",
            handleResize
        );

        let stopped = false;

        const detectHands =
            () => {
                if (stopped) {
                    return;
                }

                const video =
                    videoRef.current;

                const landmarker =
                    landmarkerRef.current;

                if (
                    !video ||
                    !landmarker
                ) {
                    animationRef.current =
                        requestAnimationFrame(
                            detectHands
                        );

                    return;
                }

                if (
                    video.readyState >= 2 &&
                    video.videoWidth > 0 &&
                    video.videoHeight > 0
                ) {
                    const currentTime =
                        video.currentTime;

                    /*
                     * Only run MediaPipe once
                     * for every actual video frame.
                     */
                    if (
                        currentTime !==
                        lastVideoTimeRef.current
                    ) {
                        try {
                            const results =
                                landmarker.detectForVideo(
                                    video,
                                    performance.now()
                                );

                            lastVideoTimeRef.current =
                                currentTime;

                            drawResults(
                                results
                            );
                        } catch (err) {
                            console.error(
                                "Hand detection failed:",
                                err
                            );
                        }
                    }
                }

                animationRef.current =
                    requestAnimationFrame(
                        detectHands
                    );
            };

        animationRef.current =
            requestAnimationFrame(
                detectHands
            );

        return () => {
            stopped = true;

            cancelAnimationFrame(
                animationRef.current
            );

            window.removeEventListener(
                "resize",
                handleResize
            );

            clearCanvas();

            lastVideoTimeRef.current =
                -1;
        };
    }, [
        enabled,
        ready,
        videoRef,
        resizeCanvas,
        clearCanvas,
        drawResults,
    ]);

    /* =======================================================
       RENDER
    ======================================================= */

    return (
        <>
            <canvas
                ref={canvasRef}
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-30
                    h-full
                    w-full
                "
                style={{
                    display:
                        enabled && ready
                            ? "block"
                            : "none",
                }}
            />

            {enabled && error && (
                <div
                    className="
                        pointer-events-none
                        absolute
                        bottom-4
                        left-4
                        z-50
                        max-w-[calc(100%-2rem)]
                        rounded-xl
                        border
                        border-red-500/20
                        bg-black/70
                        px-3
                        py-2
                        text-xs
                        text-red-300
                        backdrop-blur-md
                    "
                >
                    Unable to initialize
                    hand tracking.
                </div>
            )}
        </>
    );
}