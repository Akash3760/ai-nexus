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
   MediaPipe configuration
========================================================= */

const WASM_PATH = "/mediapipe/wasm";

const MODEL_PATH =
    "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

/* =========================================================
   Hand connections
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
   HandTracker
========================================================= */

export default function HandTracker({
    videoRef,
    enabled = false,
    onResults,
}) {
    const landmarkerRef = useRef(null);

    const animationRef = useRef(null);

    const canvasRef = useRef(null);

    const lastVideoTimeRef = useRef(-1);

    const mountedRef = useRef(true);

    const onResultsRef = useRef(onResults);

    const [ready, setReady] = useState(false);

    const [error, setError] = useState("");

    /* =======================================================
       Keep callback stable
    ======================================================= */

    useEffect(() => {
        onResultsRef.current = onResults;
    }, [onResults]);

    /* =======================================================
       Initialize MediaPipe
    ======================================================= */

    useEffect(() => {
        mountedRef.current = true;

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

                                delegate: "CPU",
                            },

                            runningMode: "VIDEO",

                            numHands: 2,

                            minHandDetectionConfidence:
                                0.5,

                            minHandPresenceConfidence:
                                0.5,

                            minTrackingConfidence:
                                0.5,
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

            mountedRef.current = false;

            cancelAnimationFrame(
                animationRef.current
            );

            if (landmarkerRef.current) {
                landmarkerRef.current.close();

                landmarkerRef.current =
                    null;
            }

            setReady(false);
        };
    }, []);

    /* =======================================================
       Clear canvas
    ======================================================= */

    const clearCanvas = useCallback(() => {
        const canvas = canvasRef.current;

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
       Resize canvas
    ======================================================= */

    const resizeCanvas = useCallback(() => {
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
       Draw point
    ======================================================= */

    const drawPoint = useCallback(
        (
            ctx,
            x,
            y,
            radius = 3.5
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
       Calculate camera/object-cover coordinates
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
                    width / height;

                let renderedWidth;

                let renderedHeight;

                let offsetX = 0;

                let offsetY = 0;

                /*
                 * Same object-cover calculation
                 * used by the camera.
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

                return (
                    landmark
                ) => {
                    /*
                     * Camera is mirrored.
                     *
                     * MediaPipe:
                     * 0 = left
                     * 1 = right
                     *
                     * Mirrored camera:
                     * invert X.
                     */

                    const x =
                        (1 - landmark.x) *
                        renderedWidth +
                        offsetX;

                    const y =
                        landmark.y *
                        renderedHeight +
                        offsetY;

                    return {
                        x,
                        y,
                    };
                };
            },
            []
        );

    /* =======================================================
       Draw one hand
    ======================================================= */

    const drawHand = useCallback(
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

            /* ------------------------------------------------
               Connections
            ------------------------------------------------ */

            ctx.beginPath();

            ctx.lineWidth = 2.5;

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

                if (!start || !end) {
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

            /* ------------------------------------------------
               Landmarks
            ------------------------------------------------ */

            for (
                const landmark of landmarks
            ) {
                const point =
                    mapper(landmark);

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
       Draw results
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
                 * Clear previous frame.
                 */

                ctx.clearRect(
                    0,
                    0,
                    width,
                    height
                );

                /*
                 * Get coordinate mapper.
                 */

                const mapper =
                    getCoordinateMapper(
                        video,
                        width,
                        height
                    );

                if (!mapper) {
                    return;
                }

                /*
                 * Draw all detected hands.
                 */

                if (
                    results?.landmarks
                        ?.length
                ) {
                    for (
                        const landmarks of
                        results.landmarks
                    ) {
                        drawHand(
                            ctx,
                            landmarks,
                            mapper
                        );
                    }
                }

                /*
                 * Send MediaPipe results
                 * to VisionStudio.
                 */

                onResultsRef.current?.(
                    results
                );
            },
            [
                videoRef,
                getCoordinateMapper,
                drawHand,
            ]
        );

    /* =======================================================
       Detection loop
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

                /*
                 * Wait until video has
                 * real dimensions.
                 */

                if (
                    video.readyState >= 2 &&
                    video.videoWidth > 0 &&
                    video.videoHeight > 0
                ) {
                    /*
                     * Reset canvas dimensions
                     * if camera dimensions
                     * have changed.
                     */

                    const canvas =
                        canvasRef.current;

                    if (canvas) {
                        const rect =
                            video.getBoundingClientRect();

                        const expectedWidth =
                            Math.round(
                                rect.width *
                                (
                                    window.devicePixelRatio ||
                                    1
                                )
                            );

                        const expectedHeight =
                            Math.round(
                                rect.height *
                                (
                                    window.devicePixelRatio ||
                                    1
                                )
                            );

                        if (
                            canvas.width !==
                            expectedWidth ||
                            canvas.height !==
                            expectedHeight
                        ) {
                            resizeCanvas();
                        }
                    }

                    const currentTime =
                        video.currentTime;

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
                            /*
                             * Don't kill the
                             * animation loop if
                             * one frame fails.
                             */

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
       Render
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

            {/* -------------------------------------------------
                Error indicator

                Keep this outside the canvas.
            ------------------------------------------------- */}

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