import {
    useEffect,
    useRef,
} from "react";

/* =========================================================
   PORTAL OVERLAY
========================================================= */

export default function PortalOverlay({
    x = 0.5,
    y = 0.5,
    size = 220,
    shape = "circle",
    effect = "classic",
    visible = false,
}) {
    const canvasRef = useRef(null);

    const animationRef =
        useRef(null);

    /* =======================================================
       TARGET
    ======================================================= */

    const targetRef = useRef({
        x,
        y,
        size,
        visible,
    });

    /* =======================================================
       CURRENT
    ======================================================= */

    const currentRef = useRef({
        x,
        y,
        size,
        opacity: 0,
    });

    /* =======================================================
       UPDATE TARGET
    ======================================================= */

    useEffect(() => {
        targetRef.current = {
            x,
            y,
            size,
            visible,
        };
    }, [
        x,
        y,
        size,
        visible,
    ]);

    /* =======================================================
       PORTAL RENDERER
    ======================================================= */

    useEffect(() => {
        const canvas =
            canvasRef.current;

        if (!canvas) {
            return;
        }

        const container =
            canvas.parentElement;

        if (!container) {
            return;
        }

        const ctx =
            canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        /* ===================================================
           RESIZE
        =================================================== */

        const resizeCanvas = () => {
            const rect =
                container.getBoundingClientRect();

            const dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    2
                );

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

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );
        };

        resizeCanvas();

        window.addEventListener(
            "resize",
            resizeCanvas
        );

        /* ===================================================
           ANIMATION
        =================================================== */

        let stopped = false;

        const draw = (time) => {
            if (stopped) {
                return;
            }

            const width =
                canvas.clientWidth;

            const height =
                canvas.clientHeight;

            if (
                width <= 0 ||
                height <= 0
            ) {
                animationRef.current =
                    requestAnimationFrame(
                        draw
                    );

                return;
            }

            const target =
                targetRef.current;

            const current =
                currentRef.current;

            /* =================================================
               SMOOTH POSITION
            ================================================= */

            current.x +=
                (
                    target.x -
                    current.x
                ) * 0.62;

            current.y +=
                (
                    target.y -
                    current.y
                ) * 0.62;

            current.size +=
                (
                    target.size -
                    current.size
                ) * 0.50;

            /* =================================================
               SMOOTH VISIBILITY
            ================================================= */

            const targetOpacity =
                target.visible
                    ? 1
                    : 0;

            current.opacity +=
                (
                    targetOpacity -
                    current.opacity
                ) * 0.18;

            /* =================================================
               CLEAR
            ================================================= */

            ctx.clearRect(
                0,
                0,
                width,
                height
            );

            /* =================================================
               NOTHING TO DRAW
            ================================================= */

            if (
                current.opacity <
                0.005
            ) {
                animationRef.current =
                    requestAnimationFrame(
                        draw
                    );

                return;
            }

            /* =================================================
               POSITION
            ================================================= */

            const centerX =
                current.x * width;

            const centerY =
                current.y * height;

            const radius =
                Math.max(
                    40,
                    current.size / 2
                );

            const seconds =
                time / 1000;

            /* =================================================
               GLOBAL FADE
            ================================================= */

            ctx.save();

            ctx.globalAlpha =
                current.opacity;

            /* =================================================
               OUTER ATMOSPHERE
            ================================================= */

            drawAtmosphere(
                ctx,
                centerX,
                centerY,
                radius,
                seconds,
                effect
            );

            /* =================================================
               ENERGY STREAMS OUTSIDE
            ================================================= */

            drawEnergyStreams(
                ctx,
                centerX,
                centerY,
                radius,
                seconds,
                effect
            );

            /* =================================================
               PORTAL INTERIOR
            ================================================= */

            ctx.save();

            createShapePath(
                ctx,
                shape,
                centerX,
                centerY,
                radius
            );

            ctx.clip();

            /* -------------------------------------------------
               DARK SPACE
            ------------------------------------------------- */

            drawPortalCore(
                ctx,
                centerX,
                centerY,
                radius,
                seconds
            );

            /* -------------------------------------------------
               VORTEX
            ------------------------------------------------- */

            drawVortex(
                ctx,
                centerX,
                centerY,
                radius,
                seconds,
                effect
            );

            /* -------------------------------------------------
               SUCTION PARTICLES
            ------------------------------------------------- */

            drawSuctionParticles(
                ctx,
                centerX,
                centerY,
                radius,
                seconds
            );

            /* -------------------------------------------------
               INNER SPIRAL
            ------------------------------------------------- */

            drawInnerSpiral(
                ctx,
                centerX,
                centerY,
                radius,
                seconds
            );

            /* -------------------------------------------------
               SINGULARITY
            ------------------------------------------------- */

            drawSingularity(
                ctx,
                centerX,
                centerY,
                radius,
                seconds
            );

            ctx.restore();

            /* =================================================
               PORTAL EDGE
            ================================================= */

            drawPortalRing(
                ctx,
                centerX,
                centerY,
                radius,
                seconds,
                shape
            );

            /* =================================================
               FLASHING ENERGY PULSES
            ================================================= */

            drawEnergyPulse(
                ctx,
                centerX,
                centerY,
                radius,
                seconds,
                shape
            );

            ctx.restore();

            animationRef.current =
                requestAnimationFrame(
                    draw
                );
        };

        animationRef.current =
            requestAnimationFrame(
                draw
            );

        return () => {
            stopped = true;

            cancelAnimationFrame(
                animationRef.current
            );

            window.removeEventListener(
                "resize",
                resizeCanvas
            );
        };
    }, [
        shape,
        effect,
    ]);

    return (
        <canvas
            ref={canvasRef}
            className="
                pointer-events-none
                absolute
                inset-0
                z-20
                h-full
                w-full
            "
        />
    );
}

/* =========================================================
   SHAPE PATH
========================================================= */

function createShapePath(
    ctx,
    shape,
    x,
    y,
    radius
) {
    ctx.beginPath();

    /* =======================================================
       HEXAGON
    ======================================================= */

    if (shape === "hexagon") {
        const sides = 6;

        for (
            let i = 0;
            i < sides;
            i++
        ) {
            const angle =
                (
                    Math.PI * 2 * i
                ) /
                sides -
                Math.PI / 2;

            const px =
                x +
                Math.cos(angle) *
                radius;

            const py =
                y +
                Math.sin(angle) *
                radius;

            if (i === 0) {
                ctx.moveTo(
                    px,
                    py
                );
            } else {
                ctx.lineTo(
                    px,
                    py
                );
            }
        }

        ctx.closePath();

        return;
    }

    /* =======================================================
       STAR
    ======================================================= */

    if (shape === "star") {
        const points = 5;

        for (
            let i = 0;
            i < points * 2;
            i++
        ) {
            const angle =
                (
                    Math.PI * i
                ) /
                points -
                Math.PI / 2;

            const r =
                i % 2 === 0
                    ? radius
                    : radius * 0.46;

            const px =
                x +
                Math.cos(angle) *
                r;

            const py =
                y +
                Math.sin(angle) *
                r;

            if (i === 0) {
                ctx.moveTo(
                    px,
                    py
                );
            } else {
                ctx.lineTo(
                    px,
                    py
                );
            }
        }

        ctx.closePath();

        return;
    }

    /* =======================================================
       CIRCLE
    ======================================================= */

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );
}

/* =========================================================
   ATMOSPHERE
========================================================= */

function drawAtmosphere(
    ctx,
    x,
    y,
    radius,
    time,
) {
    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    const pulse =
        1 +
        Math.sin(
            time * 2.2
        ) *
        0.045;

    const outerRadius =
        radius *
        1.55 *
        pulse;

    const glow =
        ctx.createRadialGradient(
            x,
            y,
            radius * 0.25,
            x,
            y,
            outerRadius
        );

    glow.addColorStop(
        0,
        "rgba(34,211,238,0.16)"
    );

    glow.addColorStop(
        0.35,
        "rgba(34,211,238,0.09)"
    );

    glow.addColorStop(
        0.62,
        "rgba(59,130,246,0.045)"
    );

    glow.addColorStop(
        1,
        "rgba(34,211,238,0)"
    );

    ctx.fillStyle =
        glow;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        outerRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /* =======================================================
       SECOND ATMOSPHERE
    ======================================================= */

    const glow2 =
        ctx.createRadialGradient(
            x,
            y,
            radius * 0.75,
            x,
            y,
            radius * 1.8
        );

    glow2.addColorStop(
        0,
        "rgba(34,211,238,0)"
    );

    glow2.addColorStop(
        0.65,
        "rgba(34,211,238,0.035)"
    );

    glow2.addColorStop(
        1,
        "rgba(34,211,238,0)"
    );

    ctx.fillStyle =
        glow2;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius * 1.8,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}

/* =========================================================
   ENERGY STREAMS
========================================================= */

function drawEnergyStreams(
    ctx,
    centerX,
    centerY,
    radius,
    time,
    effect
) {
    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    const streamCount =
        effect === "swirl"
            ? 36
            : 26;

    for (
        let i = 0;
        i < streamCount;
        i++
    ) {
        const seed =
            i * 13.371;

        const progress =
            (
                seed * 0.07 +
                time * 0.12
            ) % 1;

        const angle =
            seed +
            Math.sin(
                time * 0.7 +
                seed
            ) *
            0.35;

        const outerDistance =
            radius *
            (
                1.55 +
                (
                    i % 5
                ) *
                0.16
            );

        const innerDistance =
            radius *
            0.85;

        const distance =
            outerDistance -
            (
                outerDistance -
                innerDistance
            ) *
            progress;

        const curve =
            Math.sin(
                progress * Math.PI
            ) *
            0.75;

        const px =
            centerX +
            Math.cos(
                angle + curve
            ) *
            distance;

        const py =
            centerY +
            Math.sin(
                angle + curve
            ) *
            distance;

        const tailDistance =
            distance +
            radius * 0.18;

        const tailX =
            centerX +
            Math.cos(angle) *
            tailDistance;

        const tailY =
            centerY +
            Math.sin(angle) *
            tailDistance;

        ctx.beginPath();

        ctx.moveTo(
            tailX,
            tailY
        );

        ctx.lineTo(
            px,
            py
        );

        ctx.strokeStyle =
            `rgba(103,232,249,${0.02 +
            (1 - progress) * 0.16
            })`;

        ctx.lineWidth =
            0.7 +
            (1 - progress) * 1.4;

        ctx.stroke();
    }

    ctx.restore();
}

/* =========================================================
   PORTAL CORE
========================================================= */

function drawPortalCore(
    ctx,
    centerX,
    centerY,
    radius,
    time
) {
    const core =
        ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            radius
        );

    core.addColorStop(
        0,
        "rgba(0,0,0,1)"
    );

    core.addColorStop(
        0.28,
        "rgba(0,2,10,0.99)"
    );

    core.addColorStop(
        0.55,
        "rgba(2,12,27,0.97)"
    );

    core.addColorStop(
        0.78,
        "rgba(5,25,43,0.88)"
    );

    core.addColorStop(
        1,
        "rgba(8,40,55,0.32)"
    );

    ctx.fillStyle =
        core;

    ctx.fillRect(
        centerX - radius * 1.5,
        centerY - radius * 1.5,
        radius * 3,
        radius * 3
    );

    /* =======================================================
       MOVING INNER GLOW
    ======================================================= */

    const pulse =
        (
            Math.sin(
                time * 3
            ) +
            1
        ) /
        2;

    const inner =
        ctx.createRadialGradient(
            centerX,
            centerY,
            radius * 0.05,
            centerX,
            centerY,
            radius * 0.65
        );

    inner.addColorStop(
        0,
        "rgba(0,0,0,1)"
    );

    inner.addColorStop(
        0.35,
        `rgba(0,10,22,${0.9 -
        pulse * 0.08
        })`
    );

    inner.addColorStop(
        0.7,
        "rgba(10,60,80,0.18)"
    );

    inner.addColorStop(
        1,
        "rgba(34,211,238,0)"
    );

    ctx.fillStyle =
        inner;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius * 0.75,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

/* =========================================================
   VORTEX
========================================================= */

function drawVortex(
    ctx,
    centerX,
    centerY,
    radius,
    time,
    effect
) {
    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    const lines =
        effect === "swirl"
            ? 56
            : 40;

    for (
        let i = 0;
        i < lines;
        i++
    ) {
        const progress =
            i / lines;

        const baseRadius =
            radius *
            (
                0.12 +
                progress *
                0.86
            );

        const rotation =
            time *
            (
                0.65 +
                progress *
                0.5
            );

        const startAngle =
            rotation +
            progress * 9;

        const length =
            Math.PI *
            (
                0.55 +
                progress *
                0.65
            );

        ctx.beginPath();

        for (
            let step = 0;
            step <= 24;
            step++
        ) {
            const t =
                step / 24;

            const angle =
                startAngle +
                length * t;

            /*
             * Stronger contraction
             * near the center.
             */

            const contraction =
                Math.pow(
                    1 - t,
                    1.65
                );

            const r =
                baseRadius *
                (
                    0.10 +
                    contraction *
                    0.90
                );

            const wobble =
                Math.sin(
                    time * 2 +
                    i * 0.8 +
                    t * 8
                ) *
                radius *
                0.012;

            const px =
                centerX +
                Math.cos(angle) *
                (r + wobble);

            const py =
                centerY +
                Math.sin(angle) *
                (r + wobble);

            if (step === 0) {
                ctx.moveTo(
                    px,
                    py
                );
            } else {
                ctx.lineTo(
                    px,
                    py
                );
            }
        }

        const alpha =
            0.025 +
            progress * 0.20;

        ctx.strokeStyle =
            `rgba(34,211,238,${alpha})`;

        ctx.lineWidth =
            0.8 +
            progress * 1.8;

        ctx.stroke();
    }

    ctx.restore();
}

/* =========================================================
   SUCTION PARTICLES
========================================================= */

function drawSuctionParticles(
    ctx,
    centerX,
    centerY,
    radius,
    time
) {
    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    const particles = 110;

    for (
        let i = 0;
        i < particles;
        i++
    ) {
        const seed =
            i * 17.731;

        const cycle =
            (
                seed +
                time * 0.42
            ) % 1;

        /*
         * Outside → inside.
         */

        const startDistance =
            radius *
            (
                1.05 +
                (
                    i % 7
                ) *
                0.13
            );

        const distance =
            startDistance *
            (
                1 -
                Math.pow(
                    cycle,
                    0.72
                )
            );

        const spiral =
            seed +
            time * 0.35 +
            cycle * 5.5;

        const wobble =
            Math.sin(
                time * 2.5 +
                seed
            ) *
            radius *
            0.035;

        const px =
            centerX +
            Math.cos(
                spiral
            ) *
            (
                distance +
                wobble
            );

        const py =
            centerY +
            Math.sin(
                spiral
            ) *
            (
                distance +
                wobble
            );

        const particleSize =
            0.7 +
            (
                1 -
                cycle
            ) *
            2.8;

        const alpha =
            0.08 +
            (
                1 -
                cycle
            ) *
            0.82;

        /* ===================================================
           PARTICLE
        =================================================== */

        ctx.beginPath();

        ctx.arc(
            px,
            py,
            particleSize,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(103,232,249,${alpha})`;

        ctx.fill();

        /* ===================================================
           PARTICLE TRAIL
        =================================================== */

        const trailDistance =
            distance +
            radius * 0.045;

        const trailX =
            centerX +
            Math.cos(
                spiral
            ) *
            trailDistance;

        const trailY =
            centerY +
            Math.sin(
                spiral
            ) *
            trailDistance;

        ctx.beginPath();

        ctx.moveTo(
            trailX,
            trailY
        );

        ctx.lineTo(
            px,
            py
        );

        ctx.strokeStyle =
            `rgba(34,211,238,${alpha * 0.28})`;

        ctx.lineWidth =
            0.7;

        ctx.stroke();
    }

    ctx.restore();
}

/* =========================================================
   INNER SPIRAL
========================================================= */

function drawInnerSpiral(
    ctx,
    centerX,
    centerY,
    radius,
    time
) {
    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    for (
        let arm = 0;
        arm < 4;
        arm++
    ) {
        ctx.beginPath();

        for (
            let step = 0;
            step < 100;
            step++
        ) {
            const progress =
                step / 99;

            const r =
                radius *
                (
                    0.62 -
                    progress * 0.56
                );

            const angle =
                time * 0.9 +
                arm *
                (
                    Math.PI * 2 /
                    4
                ) +
                progress * 7.5;

            const x =
                centerX +
                Math.cos(angle) *
                r;

            const y =
                centerY +
                Math.sin(angle) *
                r;

            if (step === 0) {
                ctx.moveTo(
                    x,
                    y
                );
            } else {
                ctx.lineTo(
                    x,
                    y
                );
            }
        }

        ctx.strokeStyle =
            "rgba(165,243,252,0.22)";

        ctx.lineWidth =
            1.1;

        ctx.stroke();
    }

    ctx.restore();
}

/* =========================================================
   SINGULARITY
========================================================= */

function drawSingularity(
    ctx,
    centerX,
    centerY,
    radius,
    time
) {
    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    const pulse =
        (
            Math.sin(
                time * 4
            ) +
            1
        ) /
        2;

    /* =======================================================
       INNER GLOW
    ======================================================= */

    const glow =
        ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            radius * 0.28
        );

    glow.addColorStop(
        0,
        "rgba(0,0,0,1)"
    );

    glow.addColorStop(
        0.45,
        "rgba(34,211,238,0.18)"
    );

    glow.addColorStop(
        1,
        "rgba(34,211,238,0)"
    );

    ctx.fillStyle =
        glow;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius *
        (
            0.28 +
            pulse * 0.035
        ),
        0,
        Math.PI * 2
    );

    ctx.fill();

    /* =======================================================
       BLACK SINGULARITY
    ======================================================= */

    ctx.fillStyle =
        "rgba(0,0,0,0.98)";

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius * 0.115,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /* =======================================================
       HOT EDGE
    ======================================================= */

    ctx.strokeStyle =
        `rgba(103,232,249,${0.5 +
        pulse * 0.4
        })`;

    ctx.lineWidth =
        1.5;

    ctx.shadowBlur =
        15;

    ctx.shadowColor =
        "rgba(34,211,238,0.8)";

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius * 0.14,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}

/* =========================================================
   PORTAL RING
========================================================= */

function drawPortalRing(
    ctx,
    centerX,
    centerY,
    radius,
    time,
    shape
) {
    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    /* =======================================================
       OUTER GLOW
    ======================================================= */

    ctx.shadowBlur =
        34;

    ctx.shadowColor =
        "rgba(34,211,238,0.75)";

    ctx.strokeStyle =
        "rgba(34,211,238,0.88)";

    ctx.lineWidth =
        3;

    createShapePath(
        ctx,
        shape,
        centerX,
        centerY,
        radius
    );

    ctx.stroke();

    /* =======================================================
       SECOND RING
    ======================================================= */

    ctx.shadowBlur = 0;

    ctx.strokeStyle =
        "rgba(165,243,252,0.8)";

    ctx.lineWidth =
        1;

    ctx.setLineDash([
        3,
        9,
        14,
        7,
    ]);

    ctx.lineDashOffset =
        -time * 35;

    createShapePath(
        ctx,
        shape,
        centerX,
        centerY,
        radius + 6
    );

    ctx.stroke();

    /* =======================================================
       THIRD RING
    ======================================================= */

    ctx.strokeStyle =
        "rgba(34,211,238,0.42)";

    ctx.lineWidth =
        1.4;

    ctx.setLineDash([
        18,
        12,
    ]);

    ctx.lineDashOffset =
        time * 25;

    createShapePath(
        ctx,
        shape,
        centerX,
        centerY,
        radius + 11
    );

    ctx.stroke();

    /* =======================================================
       INNER RING
    ======================================================= */

    ctx.setLineDash([]);

    ctx.strokeStyle =
        "rgba(34,211,238,0.32)";

    ctx.lineWidth =
        1.5;

    createShapePath(
        ctx,
        shape,
        centerX,
        centerY,
        radius * 0.92
    );

    ctx.stroke();

    ctx.restore();
}

/* =========================================================
   ENERGY PULSE
========================================================= */

function drawEnergyPulse(
    ctx,
    centerX,
    centerY,
    radius,
    time,
    shape
) {
    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    const cycle =
        (
            time * 0.45
        ) % 1;

    const pulseRadius =
        radius *
        (
            1 +
            cycle * 0.28
        );

    const alpha =
        (
            1 -
            cycle
        ) *
        0.32;

    ctx.strokeStyle =
        `rgba(103,232,249,${alpha})`;

    ctx.lineWidth =
        2;

    createShapePath(
        ctx,
        shape,
        centerX,
        centerY,
        pulseRadius
    );

    ctx.stroke();

    ctx.restore();
}