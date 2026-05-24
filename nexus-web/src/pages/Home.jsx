import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Button }
    from "@/components/ui/button";

export default function Home() {
    return (
        <div className="overflow-hidden bg-[#050816] text-white">

            {/* Background Glow */}
            <div className="fixed left-[-10%] top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

            <div className="fixed right-[-10%] top-20 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[140px]" />

            {/* HERO */}
            <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6">

                <div className="grid w-full items-center gap-12 lg:grid-cols-2">

                    {/* LEFT CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="max-w-3xl"
                    >

                        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl">
                            AI Powered Workspace
                        </span>

                        <h1 className="mt-6 text-5xl font-bold tracking-tight lg:text-7xl">
                            Build Your{" "}
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                AI Nexus
                            </span>
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-zinc-400">
                            Create, manage and scale intelligent
                            AI agents in one unified workspace.
                        </p>

                        {/* KEEP BUTTONS */}
                        <div className="mt-8 flex gap-4">

                            <Button
                                asChild
                                size="lg"
                            >
                                <Link to="/register">
                                    Get Started
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                asChild
                                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                            >
                                <Link to="/login">
                                    Login
                                </Link>
                            </Button>

                        </div>

                    </motion.div>

                    {/* HERO ROBOT */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative flex justify-center"
                    >
                        <img
                            src="/images/robot-hero.png"
                            alt="Robot"
                            className="max-h-[620px] w-full object-contain lg:max-h-[680px]"
                        />
                    </motion.div>

                </div>

            </section>

            {/* ROBOT + TEXT SECTION */}
            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="grid items-center gap-16 lg:grid-cols-2">

                    {/* Left Robot Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="overflow-hidden rounded-[40px] border border-white/10 bg-white/5"
                    >
                        <img
                            src="/images/robot-1.png"
                            alt="Robot"
                            className="h-[600px] w-full object-cover"
                        />
                    </motion.div>

                    {/* Right Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >

                        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
                            Smart Intelligence
                        </span>

                        <h2 className="mt-6 text-5xl font-bold leading-tight lg:text-6xl">
                            Smarter Decisions
                            <span className="text-cyan-400">
                                {" "}with Artificial Intelligence
                            </span>
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-zinc-400">
                            Artificial Intelligence refers to the
                            development of computer systems that
                            can perform tasks that would typically
                            require human intelligence. It enables
                            machines to learn, reason, perceive,
                            predict and make intelligent decisions.
                        </p>

                        <p className="mt-6 text-zinc-500">
                            AI Nexus empowers businesses through
                            intelligent automation, smart workflows,
                            and next-generation AI technology.
                        </p>

                    </motion.div>

                </div>

            </section>

            {/* SLIDER */}
            <section className="overflow-hidden py-20">

                <motion.div
                    animate={{
                        x: ["0%", "-40%"],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="flex w-max gap-6 px-6"
                >

                    {[1, 2, 3, 4, 5, 1, 2].map((item, index) => (
                        <div
                            key={index}
                            className="relative min-w-[380px] overflow-hidden rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-xl"
                        >

                            <img
                                src={`/images/thumb-${item}.png`}
                                alt=""
                                className="h-[320px] w-full object-cover transition duration-700 hover:scale-105"
                            />

                            {/* Static Text */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-6">

                                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">
                                    AI Technology
                                </span>

                                <h3 className="mt-4 text-2xl font-bold">
                                    Intelligent Automation
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-zinc-300">
                                    Smart AI systems built for
                                    automation, scalability and
                                    intelligent business growth.
                                </p>

                            </div>

                        </div>
                    ))}

                </motion.div>

            </section>

            {/* ABOUT */}
            <section className="mx-auto max-w-6xl px-6 py-32 text-center">

                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >

                    <h2 className="text-5xl font-bold lg:text-6xl">
                        About
                        <span className="text-cyan-400">
                            {" "}AI Nexus
                        </span>
                    </h2>

                    <p className="mx-auto mt-8 max-w-4xl text-lg leading-9 text-zinc-400">
                        AI Nexus empowers businesses with intelligent
                        automation, smarter workflows and scalable
                        next-generation artificial intelligence systems.
                    </p>

                </motion.div>

            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-black/40 py-12">

                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 text-zinc-400 lg:flex-row">

                    <div>
                        <h3 className="text-2xl font-bold text-white">
                            AI Nexus
                        </h3>

                        <p className="mt-2 text-sm">
                            Scalable Intelligence. Automated Growth.
                        </p>
                    </div>

                    <div className="flex gap-8 text-sm">
                        <a href="#">About</a>
                        <a href="#">Contact</a>
                        <a href="#">Support</a>
                        <a href="#">Privacy</a>
                    </div>

                </div>

            </footer>

        </div>
    );
}