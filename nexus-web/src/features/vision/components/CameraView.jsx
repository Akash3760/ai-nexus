import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import {
    Camera,
    CameraOff,
    Loader2,
    ShieldAlert,
} from "lucide-react";

const CameraView = forwardRef(function CameraView(
    {
        onCameraStart,
        onCameraStop,
        onVideoReady,
        trackingEnabled = false,
        children,
    },
    ref
) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const trackRef = useRef(null);

    const [cameraActive, setCameraActive] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    /* =========================================================
       START CAMERA
    ========================================================= */

    const startCamera = async () => {
        if (cameraActive || loading) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            if (
                !navigator.mediaDevices?.getUserMedia
            ) {
                throw new Error(
                    "Camera access is not supported by this browser."
                );
            }

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "user",

                        width: {
                            ideal: 1280,
                        },

                        height: {
                            ideal: 720,
                        },

                        frameRate: {
                            ideal: 30,
                            max: 30,
                        },
                    },

                    audio: false,
                });

            const videoTrack =
                stream.getVideoTracks()[0];

            if (!videoTrack) {
                stream
                    .getTracks()
                    .forEach((track) =>
                        track.stop()
                    );

                throw new Error(
                    "No camera video track was found."
                );
            }

            streamRef.current = stream;
            trackRef.current = videoTrack;

            const video =
                videoRef.current;

            if (!video) {
                stream
                    .getTracks()
                    .forEach((track) =>
                        track.stop()
                    );

                streamRef.current = null;
                trackRef.current = null;

                throw new Error(
                    "Camera video element is unavailable."
                );
            }

            /*
             * Set the stream once.
             */

            video.srcObject = stream;

            /*
             * Wait for metadata before playback.
             */

            await new Promise(
                (resolve) => {
                    if (
                        video.readyState >= 1
                    ) {
                        resolve();
                        return;
                    }

                    const handleLoadedMetadata =
                        () => {
                            video.removeEventListener(
                                "loadedmetadata",
                                handleLoadedMetadata
                            );

                            resolve();
                        };

                    video.addEventListener(
                        "loadedmetadata",
                        handleLoadedMetadata
                    );
                }
            );

            try {
                await video.play();
            } catch (playError) {
                /*
                 * Browser may interrupt playback
                 * during initialization.
                 */

                if (
                    playError?.name !==
                    "AbortError"
                ) {
                    throw playError;
                }
            }

            onVideoReady?.(video);

            setCameraActive(true);

            onCameraStart?.(stream);
        } catch (err) {
            console.error(
                "Camera start error:",
                err
            );

            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) =>
                        track.stop()
                    );
            }

            streamRef.current = null;
            trackRef.current = null;

            setCameraActive(false);

            if (
                err?.name ===
                "NotAllowedError"
            ) {
                setError(
                    "Camera permission was denied. Please allow camera access in your browser."
                );
            } else if (
                err?.name ===
                "NotFoundError"
            ) {
                setError(
                    "No camera was found on this device."
                );
            } else if (
                err?.name ===
                "NotReadableError"
            ) {
                setError(
                    "Your camera is being used by another application."
                );
            } else {
                setError(
                    err?.message ||
                    "Unable to access the camera."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       STOP CAMERA
    ========================================================= */

    const stopCamera = () => {
        const video =
            videoRef.current;

        if (video) {
            video.pause();
            video.srcObject = null;
        }

        if (streamRef.current) {
            streamRef.current
                .getTracks()
                .forEach((track) =>
                    track.stop()
                );
        }

        streamRef.current = null;
        trackRef.current = null;

        setCameraActive(false);

        onCameraStop?.();
    };

    /* =========================================================
       IMPERATIVE CAMERA API
    ========================================================= */

    useImperativeHandle(
        ref,
        () => ({
            startCamera,

            stopCamera,

            getVideoElement: () =>
                videoRef.current,

            getStream: () =>
                streamRef.current,

            getTrack: () =>
                trackRef.current,

            isActive: () =>
                cameraActive,
        }),
        [cameraActive, loading]
    );

    /* =========================================================
       CLEANUP
    ========================================================= */

    useEffect(() => {
        return () => {
            const video =
                videoRef.current;

            if (video) {
                video.pause();
                video.srcObject = null;
            }

            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) =>
                        track.stop()
                    );
            }

            streamRef.current = null;
            trackRef.current = null;
        };
    }, []);

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className="space-y-4">
            {/* =====================================================
                CAMERA VIEWPORT
            ===================================================== */}

            <div
                className="
                    relative
                    aspect-video
                    overflow-hidden
                    rounded-3xl
                    border
                    border-border
                    bg-black
                    shadow-lg
                "
            >
                {/* Camera */}

                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        scale-x-[-1]
                    "
                />

                {/* =================================================
                    VISION LAYERS

                    Only render portal + hand tracking when
                    camera is actually active.
                ================================================= */}

                {cameraActive && children}

                {/* =================================================
                    LIVE BADGE
                ================================================= */}

                {cameraActive && (
                    <div
                        className="
                            absolute
                            left-4
                            top-4
                            z-50
                            flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-white/10
                            bg-black/60
                            px-3
                            py-1.5
                            backdrop-blur-md
                        "
                    >
                        <span
                            className="
                                h-2
                                w-2
                                animate-pulse
                                rounded-full
                                bg-red-500
                            "
                        />

                        <span
                            className="
                                text-xs
                                font-semibold
                                text-white
                            "
                        >
                            LIVE
                        </span>
                    </div>
                )}

                {/* =================================================
                    CAMERA OFF
                ================================================= */}

                {!cameraActive &&
                    !loading && (
                        <div
                            className="
                                absolute
                                inset-0
                                z-40
                                flex
                                flex-col
                                items-center
                                justify-center
                                bg-black
                                px-6
                                text-center
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-16
                                    w-16
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-cyan-500/10
                                "
                            >
                                <Camera className="h-8 w-8 text-cyan-500" />
                            </div>

                            <h3
                                className="
                                    mt-5
                                    text-lg
                                    font-semibold
                                    text-white
                                "
                            >
                                AI Vision Camera
                            </h3>

                            <p
                                className="
                                    mt-2
                                    max-w-md
                                    text-sm
                                    leading-6
                                    text-white/60
                                "
                            >
                                Start your camera to begin
                                real-time vision tracking.
                            </p>
                        </div>
                    )}

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (
                    <div
                        className="
                            absolute
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-black/80
                            backdrop-blur-sm
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                items-center
                                gap-4
                            "
                        >
                            <Loader2
                                className="
                                    h-8
                                    w-8
                                    animate-spin
                                    text-cyan-500
                                "
                            />

                            <p
                                className="
                                    text-sm
                                    text-white/70
                                "
                            >
                                Starting camera...
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (
                <div
                    className="
                        flex
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        border-red-500/20
                        bg-red-500/10
                        px-4
                        py-3
                    "
                >
                    <ShieldAlert
                        className="
                            mt-0.5
                            h-5
                            w-5
                            shrink-0
                            text-red-500
                        "
                    />

                    <div>
                        <p
                            className="
                                text-sm
                                font-medium
                                text-red-500
                            "
                        >
                            Camera unavailable
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-red-500/80
                            "
                        >
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {/* =====================================================
                CAMERA CONTROLS

                Button remains centered.
                Tracking badge is aligned to the left.
            ===================================================== */}

            <div
                className="
                    relative
                    flex
                    min-h-12
                    items-center
                    justify-center
                "
            >
                {/* Tracking Badge */}

                {trackingEnabled && (
                    <div
                        className="
                            absolute
                            left-0
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-emerald-500/20
                            bg-emerald-500/5
                            px-3
                            py-1.5
                            backdrop-blur-sm
                        "
                    >
                        <span
                            className="
                                h-2
                                w-2
                                animate-pulse
                                rounded-full
                                bg-emerald-500
                            "
                        />

                        <span
                            className="
                                text-xs
                                font-medium
                            "
                        >
                            Hand Tracking Active
                        </span>

                        <span
                            className="
                                text-xs
                                text-muted-foreground
                            "
                        >
                            • MediaPipe
                        </span>
                    </div>
                )}

                {/* =================================================
                    CENTER CAMERA BUTTON
                ================================================= */}

                <div>
                    {!cameraActive ? (
                        <button
                            type="button"
                            onClick={startCamera}
                            disabled={loading}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-cyan-600
                                px-6
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                transition-all
                                hover:bg-cyan-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />

                                    Starting...
                                </>
                            ) : (
                                <>
                                    <Camera className="h-4 w-4" />

                                    Start Camera
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={stopCamera}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-border
                                px-6
                                py-3
                                text-sm
                                font-semibold
                                transition-all
                                hover:bg-muted
                            "
                        >
                            <CameraOff className="h-4 w-4" />

                            Stop Camera
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});

export default CameraView;