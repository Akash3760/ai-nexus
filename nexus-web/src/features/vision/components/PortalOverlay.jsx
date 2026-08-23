import { useMemo } from "react";

/* =========================================================
   PortalOverlay
   ---------------------------------------------------------
   Renders the visual portal on top of the camera.

   Props:
   - x: normalized X position (0 → 1)
   - y: normalized Y position (0 → 1)
   - size: portal size in pixels
   - shape: circle | hexagon | star
   - effect: classic | swirl | pixel | thermal | neon | mirror | grayscale
   ========================================================= */

export default function PortalOverlay({
    x = 0.5,
    y = 0.5,
    size = 220,
    shape = "circle",
    effect = "classic",
}) {
    const portalStyle = useMemo(() => {
        return {
            left: `${x * 100}%`,
            top: `${y * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            transform: "translate(-50%, -50%)",
        };
    }, [x, y, size]);

    const clipPath = useMemo(() => {
        switch (shape) {
            case "hexagon":
                return "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)";

            case "star":
                return "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 94%, 50% 72%, 21% 94%, 32% 57%, 2% 35%, 39% 35%)";

            case "circle":
            default:
                return "circle(50% at 50% 50%)";
        }
    }, [shape]);

    const effectClass = useMemo(() => {
        switch (effect) {
            case "swirl":
                return "animate-spin";

            case "pixel":
                return "contrast-125 saturate-150";

            case "thermal":
                return "hue-rotate-90 saturate-200";

            case "neon":
                return "brightness-125 saturate-200";

            case "mirror":
                return "scale-x-[-1]";

            case "grayscale":
                return "grayscale";

            case "classic":
            default:
                return "";
        }
    }, [effect]);

    return (
        <div
            className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
        >
            {/* =====================================================
                Portal
            ===================================================== */}

            <div
                className="absolute transition-all duration-150 ease-out"
                style={portalStyle}
            >
                {/* Outer glow */}

                <div
                    className="
                        absolute
                        inset-[-14px]
                        rounded-full
                        bg-cyan-400/20
                        blur-2xl
                    "
                    style={{
                        clipPath,
                    }}
                />

                {/* Main portal */}

                <div
                    className="
                        absolute
                        inset-0
                        overflow-hidden
                        border-2
                        border-cyan-300/80
                        bg-black/70
                        shadow-[0_0_30px_rgba(34,211,238,0.45)]
                        backdrop-blur-sm
                    "
                    style={{
                        clipPath,
                    }}
                >
                    {/* Portal interior */}

                    <div
                        className={`
                            absolute
                            inset-0
                            bg-gradient-to-br
                            from-cyan-300/30
                            via-cyan-500/10
                            to-violet-500/30
                            ${effectClass}
                        `}
                    />

                    {/* Inner ring */}

                    <div
                        className="
                            absolute
                            inset-[8%]
                            rounded-full
                            border
                            border-cyan-300/40
                        "
                    />

                    {/* Center */}

                    <div
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            h-[18%]
                            w-[18%]
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-full
                            bg-cyan-300/30
                            blur-md
                        "
                    />
                </div>

                {/* Portal highlight */}

                <div
                    className="
                        absolute
                        left-1/2
                        top-[-4px]
                        h-2
                        w-[45%]
                        -translate-x-1/2
                        rounded-full
                        bg-cyan-200
                        opacity-80
                        blur-[2px]
                    "
                />
            </div>
        </div>
    );
}