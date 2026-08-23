import {
    useCallback,
    useRef,
    useState,
} from "react";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
    ArrowLeft,
    Camera,
    Sparkles,
    Hand,
    ScanFace,
    Zap,
    Circle,
    Hexagon,
    Star,
    Info,
    PanelRightClose,
    PanelRightOpen,
} from "lucide-react";

import CameraView from "../components/CameraView";
import HandTracker from "@/features/vision/components/HandTracker";
import PortalOverlay from "@/features/vision/components/PortalOverlay";

/* =========================================================
   VISION EFFECTS
========================================================= */

const effects = [
    {
        id: "classic",
        name: "Classic",
        description: "Background reveal",
    },
    {
        id: "swirl",
        name: "Swirl",
        description: "Dynamic distortion",
    },
    {
        id: "pixel",
        name: "Pixelation",
        description: "Digital pixel effect",
    },
    {
        id: "thermal",
        name: "Thermal",
        description: "Thermal vision",
    },
    {
        id: "neon",
        name: "Neon Edge",
        description: "Edge detection",
    },
    {
        id: "mirror",
        name: "Mirror",
        description: "Mirror distortion",
    },
    {
        id: "grayscale",
        name: "Grayscale",
        description: "Monochrome vision",
    },
];

/* =========================================================
   PORTAL SHAPES
========================================================= */

const shapes = [
    {
        id: "circle",
        name: "Circle",
        icon: Circle,
    },
    {
        id: "hexagon",
        name: "Hexagon",
        icon: Hexagon,
    },
    {
        id: "star",
        name: "Star",
        icon: Star,
    },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function VisionStudio() {
    const cameraRef = useRef(null);

    /* -------------------------------------------------------
       UI
    ------------------------------------------------------- */

    const [controlsOpen, setControlsOpen] =
        useState(true);

    /* -------------------------------------------------------
       CAMERA
    ------------------------------------------------------- */

    const [videoElement, setVideoElement] =
        useState(null);

    /* -------------------------------------------------------
       PORTAL
    ------------------------------------------------------- */

    const [portalPosition, setPortalPosition] =
        useState({
            x: 0.5,
            y: 0.5,
        });

    const [portalSize, setPortalSize] =
        useState(220);

    /* -------------------------------------------------------
       EFFECT
    ------------------------------------------------------- */

    const [selectedEffect, setSelectedEffect] =
        useState("classic");

    /* -------------------------------------------------------
       SHAPE
    ------------------------------------------------------- */

    const [selectedShape, setSelectedShape] =
        useState("circle");

    /* -------------------------------------------------------
       HAND TRACKING
    ------------------------------------------------------- */

    const [trackingEnabled, setTrackingEnabled] =
        useState(false);

    /* =======================================================
       CURRENT EFFECT
    ======================================================= */

    const currentEffect = effects.find(
        (effect) =>
            effect.id === selectedEffect
    );

    /* =======================================================
       HAND RESULTS
       -------------------------------------------------------
       MediaPipe coordinates:
           x = 0 → left
           x = 1 → right

       Camera is mirrored using scale-x-[-1],
       therefore we invert X here.
    ======================================================= */

    const handleHandResults = useCallback(
        (results) => {
            if (
                !trackingEnabled ||
                !results?.landmarks?.length
            ) {
                return;
            }

            const landmarks =
                results.landmarks[0];

            if (!landmarks) {
                return;
            }

            /* -----------------------------------------------
               Index fingertip = landmark 8
            ----------------------------------------------- */

            const indexTip =
                landmarks[8];

            if (!indexTip) {
                return;
            }

            /* -----------------------------------------------
               Keep portal inside camera
            ----------------------------------------------- */

            const x = Math.min(
                0.95,
                Math.max(
                    0.05,
                    1 - indexTip.x
                )
            );

            const y = Math.min(
                0.90,
                Math.max(
                    0.10,
                    indexTip.y
                )
            );

            setPortalPosition({
                x,
                y,
            });
        },
        [trackingEnabled]
    );

    /* =======================================================
       RENDER
    ======================================================= */

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.35,
            }}
            className="space-y-8"
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <div>
                <Link
                    to="/dashboard"
                    className="
                        mb-5
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-cyan-500
                        transition-colors
                        hover:text-cyan-400
                        hover:underline
                    "
                >
                    <ArrowLeft className="h-4 w-4" />

                    Back to Dashboard
                </Link>

                <div
                    className="
                        flex
                        flex-col
                        justify-between
                        gap-5
                        lg:flex-row
                        lg:items-end
                    "
                >
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-cyan-500/10
                                "
                            >
                                <Sparkles className="h-4 w-4 text-cyan-500" />
                            </div>

                            <span
                                className="
                                    text-sm
                                    font-semibold
                                    text-cyan-500
                                "
                            >
                                AI Nexus Vision
                            </span>
                        </div>

                        <h1
                            className="
                                text-3xl
                                font-bold
                                tracking-tight
                                md:text-4xl
                            "
                        >
                            Vision Studio
                        </h1>

                        <p
                            className="
                                mt-2
                                max-w-2xl
                                text-sm
                                leading-6
                                text-muted-foreground
                                md:text-base
                            "
                        >
                            Explore real-time computer vision
                            using your camera, gesture tracking,
                            and interactive visual effects.
                        </p>
                    </div>

                    {/* Status */}

                    <div
                        className="
                            inline-flex
                            w-fit
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-border
                            bg-card
                            px-4
                            py-2
                            text-sm
                            shadow-sm
                        "
                    >
                        <span
                            className={`
                                h-2
                                w-2
                                rounded-full
                                ${trackingEnabled
                                    ? "animate-pulse bg-emerald-500"
                                    : "bg-slate-400"
                                }
                            `}
                        />

                        <span className="font-medium">
                            {trackingEnabled
                                ? "Tracking Active"
                                : "Ready"}
                        </span>
                    </div>
                </div>
            </div>

            {/* =================================================
                MAIN GRID
            ================================================= */}

            <div
                className={`
                    grid
                    gap-6
                    ${controlsOpen
                        ? "xl:grid-cols-[minmax(0,1fr)_360px]"
                        : "xl:grid-cols-1"
                    }
                `}
            >
                {/* =================================================
                    CAMERA AREA
                ================================================= */}

                <div
                    className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-border
                        bg-card
                        shadow-sm
                    "
                >
                    {/* Camera Header */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-border
                            px-5
                            py-4
                            md:px-6
                        "
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="
                                    hidden
                                    items-center
                                    gap-2
                                    rounded-full
                                    bg-muted
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    text-muted-foreground
                                    sm:flex
                                "
                            >
                                <Zap className="h-3.5 w-3.5" />

                                Real-time
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setControlsOpen(
                                        (value) =>
                                            !value
                                    )
                                }
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-border
                                    bg-background
                                    text-muted-foreground
                                    transition
                                    hover:bg-muted
                                    hover:text-foreground
                                "
                                title={
                                    controlsOpen
                                        ? "Hide controls"
                                        : "Show controls"
                                }
                            >
                                {controlsOpen ? (
                                    <PanelRightClose className="h-4 w-4" />
                                ) : (
                                    <PanelRightOpen className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        <div
                            className="
                                hidden
                                items-center
                                gap-2
                                rounded-full
                                bg-muted
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                text-muted-foreground
                                sm:flex
                            "
                        >
                            <Zap className="h-3.5 w-3.5" />

                            Real-time
                        </div>
                    </div>

                    {/* =================================================
                        CAMERA
                    ================================================= */}

                    <div className="relative">
                        <CameraView
                            ref={cameraRef}
                            onVideoReady={setVideoElement}
                            trackingEnabled={
                                trackingEnabled
                            }
                        >
                            {/* -------------------------------------------------
                                PORTAL

                                CameraView only renders children while
                                cameraActive is true.
                            ------------------------------------------------- */}

                            <PortalOverlay
                                x={
                                    portalPosition.x
                                }
                                y={
                                    portalPosition.y
                                }
                                size={portalSize}
                                shape={
                                    selectedShape
                                }
                                effect={
                                    selectedEffect
                                }
                            />

                            {/* -------------------------------------------------
                                HAND TRACKER
                            ------------------------------------------------- */}

                            {videoElement &&
                                trackingEnabled && (
                                    <HandTracker
                                        videoRef={{
                                            current:
                                                videoElement,
                                        }}
                                        enabled={
                                            trackingEnabled
                                        }
                                        onResults={
                                            handleHandResults
                                        }
                                    />
                                )}
                        </CameraView>
                    </div>
                </div>

                {/* =================================================
                    CONTROLS
                ================================================= */}

                {controlsOpen && (
                    <div className="space-y-6">
                        {/* =================================================
                            HAND TRACKING
                        ================================================= */}

                        <div
                            className="
                                rounded-3xl
                                border
                                border-border
                                bg-card
                                p-5
                                shadow-sm
                            "
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                                        rounded-xl
                                        bg-violet-500/10
                                        p-2.5
                                    "
                                >
                                    <Hand className="h-5 w-5 text-violet-500" />
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        Hand Tracking
                                    </h3>

                                    <p className="text-xs text-muted-foreground">
                                        Gesture controls
                                    </p>
                                </div>
                            </div>

                            <div
                                className="
                                    mt-5
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                    rounded-xl
                                    bg-muted/50
                                    p-3
                                "
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-medium">
                                        Tracking
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        MediaPipe
                                    </p>
                                </div>

                                {/* Toggle */}

                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={
                                        trackingEnabled
                                    }
                                    onClick={() =>
                                        setTrackingEnabled(
                                            (value) =>
                                                !value
                                        )
                                    }
                                    className={`
                                        relative
                                        flex
                                        h-6
                                        w-11
                                        shrink-0
                                        items-center
                                        overflow-hidden
                                        rounded-full
                                        p-0.5
                                        transition-colors
                                        duration-200
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-cyan-500/30
                                        ${trackingEnabled
                                            ? "bg-cyan-600"
                                            : "bg-muted-foreground/30"
                                        }
                                    `}
                                >
                                    <span
                                        className={`
                                            block
                                            h-5
                                            w-5
                                            shrink-0
                                            rounded-full
                                            bg-white
                                            shadow-sm
                                            transition-transform
                                            duration-200
                                            ${trackingEnabled
                                                ? "translate-x-5"
                                                : "translate-x-0"
                                            }
                                        `}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* =================================================
                            EFFECTS
                        ================================================= */}

                        <div
                            className="
                                rounded-3xl
                                border
                                border-border
                                bg-card
                                p-5
                                shadow-sm
                            "
                        >
                            <div className="mb-4">
                                <h3 className="font-semibold">
                                    Vision Effects
                                </h3>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Choose a real-time visual
                                    effect.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {effects.map(
                                    (effect) => {
                                        const active =
                                            selectedEffect ===
                                            effect.id;

                                        return (
                                            <button
                                                key={
                                                    effect.id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setSelectedEffect(
                                                        effect.id
                                                    )
                                                }
                                                className={`
                                                    rounded-xl
                                                    border
                                                    p-3
                                                    text-left
                                                    transition-all
                                                    ${active
                                                        ? "border-cyan-500/50 bg-cyan-500/10"
                                                        : "border-border hover:bg-muted"
                                                    }
                                                `}
                                            >
                                                <div
                                                    className={`
                                                        text-sm
                                                        font-medium
                                                        ${active
                                                            ? "text-cyan-500"
                                                            : ""
                                                        }
                                                    `}
                                                >
                                                    {
                                                        effect.name
                                                    }
                                                </div>

                                                <div
                                                    className="
                                                        mt-1
                                                        text-[11px]
                                                        leading-4
                                                        text-muted-foreground
                                                    "
                                                >
                                                    {
                                                        effect.description
                                                    }
                                                </div>
                                            </button>
                                        );
                                    }
                                )}
                            </div>

                            {/* Selected Effect */}

                            {currentEffect && (
                                <div
                                    className="
                                        mt-4
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-muted/50
                                        px-3
                                        py-2.5
                                        text-xs
                                    "
                                >
                                    <Sparkles className="h-3.5 w-3.5 text-cyan-500" />

                                    <span className="text-muted-foreground">
                                        Selected:
                                    </span>

                                    <span className="font-medium">
                                        {
                                            currentEffect.name
                                        }
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* =================================================
                            SHAPES
                        ================================================= */}

                        <div
                            className="
                                rounded-3xl
                                border
                                border-border
                                bg-card
                                p-5
                                shadow-sm
                            "
                        >
                            <div className="mb-4">
                                <h3 className="font-semibold">
                                    Portal Shape
                                </h3>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Select the shape used by
                                    the vision effect.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {shapes.map(
                                    (shape) => {
                                        const ShapeIcon =
                                            shape.icon;

                                        const active =
                                            selectedShape ===
                                            shape.id;

                                        return (
                                            <button
                                                key={
                                                    shape.id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setSelectedShape(
                                                        shape.id
                                                    )
                                                }
                                                className={`
                                                    flex
                                                    flex-col
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    border
                                                    p-3
                                                    transition-all
                                                    ${active
                                                        ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-500"
                                                        : "border-border hover:bg-muted"
                                                    }
                                                `}
                                            >
                                                <ShapeIcon className="h-5 w-5" />

                                                <span className="text-[11px] font-medium">
                                                    {
                                                        shape.name
                                                    }
                                                </span>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* =================================================
                GESTURE GUIDE
            ================================================= */}

            <div
                className="
                    rounded-3xl
                    border
                    border-border
                    bg-card
                    p-6
                    shadow-sm
                "
            >
                <div className="flex items-start gap-3">
                    <div
                        className="
                            rounded-xl
                            bg-amber-500/10
                            p-2.5
                        "
                    >
                        <Info className="h-5 w-5 text-amber-500" />
                    </div>

                    <div>
                        <h2 className="font-semibold">
                            Gesture Controls
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Once hand tracking is enabled,
                            use these gestures to interact
                            with Vision Studio.
                        </p>
                    </div>
                </div>

                <div
                    className="
                        mt-6
                        grid
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-4
                    "
                >
                    {/* Point */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-border
                            bg-muted/30
                            p-4
                        "
                    >
                        <div className="text-2xl">
                            ☝️
                        </div>

                        <h3 className="mt-3 text-sm font-semibold">
                            Point
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Move the portal around
                            the screen.
                        </p>
                    </div>

                    {/* Pinch */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-border
                            bg-muted/30
                            p-4
                        "
                    >
                        <div className="text-2xl">
                            🤏
                        </div>

                        <h3 className="mt-3 text-sm font-semibold">
                            Pinch
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Resize the active portal.
                        </p>
                    </div>

                    {/* Open Palm */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-border
                            bg-muted/30
                            p-4
                        "
                    >
                        <div className="text-2xl">
                            ✋
                        </div>

                        <h3 className="mt-3 text-sm font-semibold">
                            Open Palm
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Switch between visual
                            effects.
                        </p>
                    </div>

                    {/* Two Fingers */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-border
                            bg-muted/30
                            p-4
                        "
                    >
                        <div className="text-2xl">
                            ✌️
                        </div>

                        <h3 className="mt-3 text-sm font-semibold">
                            Two Fingers
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Change the active portal
                            shape.
                        </p>
                    </div>
                </div>
            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    rounded-2xl
                    border
                    border-border
                    bg-muted/20
                    px-5
                    py-4
                    text-xs
                    text-muted-foreground
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div className="flex items-center gap-2">
                    <ScanFace className="h-4 w-4" />

                    <span>
                        Vision processing is performed
                        locally in your browser.
                    </span>
                </div>

                <span>
                    AI Nexus Vision Studio
                </span>
            </div>
        </motion.div>
    );
}