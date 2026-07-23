import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-background">
            {/* Background Glow */}
            <div className="absolute h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative flex flex-col items-center">
                {/* Animated Rings */}
                <div className="relative flex h-28 w-28 items-center justify-center">
                    <motion.div
                        className="absolute h-28 w-28 rounded-full border border-cyan-500/20"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    <motion.div
                        className="absolute h-20 w-20 rounded-full border-2 border-cyan-400"
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    <motion.div
                        animate={{
                            scale: [1, 1.15, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                    >
                        <BrainCircuit className="h-10 w-10 text-cyan-400" />
                    </motion.div>
                </div>

                <motion.h2
                    className="mt-8 text-2xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    AI Nexus
                </motion.h2>

                <motion.p
                    className="mt-2 text-sm text-muted-foreground"
                    animate={{
                        opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                    }}
                >
                    Initializing AI Workspace...
                </motion.p>

                {/* Progress Dots */}
                <div className="mt-8 flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="h-3 w-3 rounded-full bg-cyan-400"
                            animate={{
                                y: [0, -10, 0],
                                opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                                duration: 0.8,
                                delay: i * 0.2,
                                repeat: Infinity,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}