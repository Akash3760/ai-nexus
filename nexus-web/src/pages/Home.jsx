import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Bot,
    Workflow,
    Brain,
    ShieldCheck,
    BarChart3,
    Users,
    ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
    {
        icon: Bot,
        title: "AI Agents",
        description:
            "Create intelligent AI agents that automate business operations.",
    },
    {
        icon: Workflow,
        title: "Automation",
        description:
            "Build workflows that execute tasks without manual intervention.",
    },
    {
        icon: Brain,
        title: "Knowledge Engine",
        description:
            "Turn company knowledge into actionable intelligence.",
    },
    {
        icon: Users,
        title: "Collaboration",
        description:
            "Work together with teams inside a unified workspace.",
    },
    {
        icon: BarChart3,
        title: "Analytics",
        description:
            "Monitor performance and gain actionable insights.",
    },
    {
        icon: ShieldCheck,
        title: "Enterprise Security",
        description:
            "Built with modern authentication and access controls.",
    },
];

export default function Home() {
    return (
        <div className="bg-background text-foreground">

            {/* Background Effects */}
            <div className="fixed left-[-200px] top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[160px]" />

            <div className="fixed right-[-200px] top-20 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[160px]" />

            {/* HERO */}
            <section className="relative pt-10">
                <div className="mx-auto flex min-h-[85vh] max-w-7xl items-center px-6">

                    <div className="grid w-full gap-16 lg:grid-cols-2">

                        {/* LEFT */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col justify-center lg:-mt-32"
                        >
                            <div className="mb-6 inline-flex w-fit rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                                Enterprise AI Platform
                            </div>

                            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
                                Build Your
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    {" "}AI Nexus
                                </span>
                            </h1>

                            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
                                Create intelligent AI agents, automate workflows,
                                collaborate with teams, and scale operations from a
                                single unified workspace.
                            </p>

                            <div className="mt-10 flex flex-wrap gap-4">
                                <Button size="lg" asChild>
                                    <Link to="/register">
                                        Get Started
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    asChild
                                >
                                    <Link to="/login">
                                        Login
                                    </Link>
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="mt-10 grid grid-cols-3 gap-8">
                                <div>
                                    <h3 className="text-3xl font-bold">100K+</h3>
                                    <p className="text-sm text-muted-foreground">
                                        AI Tasks
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-3xl font-bold">99.9%</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Uptime
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-3xl font-bold">50+</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Integrations
                                    </p>
                                </div>
                            </div>

                        </motion.div>

                        {/* RIGHT */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative flex justify-center"
                        >

                            <img
                                src="/images/robot-hero.png"
                                alt="AI Nexus Robot"
                                className="
                                max-h-[650px]
                                w-full
                                object-contain
                                lg:max-h-[760px]
                                animate-float
                                drop-shadow-[0_0_80px_rgba(6,182,212,0.25)]
                                "
                            />

                        </motion.div>


                    </div>
                </div>
            </section>

            {/* TRUSTED TECHNOLOGIES */}
            <section className="border-y border-border py-8">

                <div className="mx-auto max-w-7xl px-6">

                    <p className="mb-6 text-center text-sm uppercase tracking-[0.3em] text-muted-foreground">
                        Powered By Modern Technologies
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-10 text-lg font-semibold text-muted-foreground">

                        <span>Django</span>
                        <span>React</span>
                        <span>Redis</span>
                        <span>Celery</span>
                        <span>MySQL</span>
                        <span>AI Agents</span>

                    </div>

                </div>

            </section>

            {/* FEATURES */}
            <section className="mx-auto max-w-7xl px-6 py-32">

                <div className="text-center">
                    <h2 className="text-5xl font-bold">
                        Everything You Need
                    </h2>

                    <p className="mt-6 text-lg text-muted-foreground">
                        Built for modern AI-first organizations.
                    </p>
                </div>

                <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={index}
                                whileHover={{
                                    y: -10,
                                    scale: 1.02,
                                }}
                                className="rounded-3xl border border-border bg-card p-8"
                            >
                                <Icon className="mb-6 h-10 w-10 text-cyan-500" />

                                <h3 className="text-xl font-semibold">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 text-muted-foreground">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

            </section>

            {/* WHY AI NEXUS */}
            <section className="mx-auto max-w-7xl px-6 py-32">

                <div className="grid items-center gap-16 lg:grid-cols-2">

                    {/* LEFT IMAGE */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center"
                    >

                        <img
                            src="/images/robot-1.png"
                            alt="AI Nexus"
                            className="
                            w-full
                            max-h-[900px]
                            scale-110
                            rounded-[40px]
                            border
                            border-border
                            bg-card
                            object-cover
                            drop-shadow-[0_0_60px_rgba(6,182,212,0.15)]
                        "
                        />

                    </motion.div>

                    {/* RIGHT CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >

                        <span className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                            Why AI Nexus
                        </span>

                        <h2 className="mt-6 text-5xl font-bold leading-tight">
                            Human Creativity.
                            <br />
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Artificial Intelligence.
                            </span>
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            AI Nexus empowers teams with intelligent automation,
                            AI-powered insights, and scalable solutions designed
                            for the future of work.
                        </p>

                        <div className="mt-8 space-y-4">

                            <div className="flex items-center gap-3">
                                <span className="text-cyan-400 text-lg">✓</span>
                                <span className="font-medium">
                                    AI-Powered Decision Making
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-cyan-400 text-lg">✓</span>
                                <span className="font-medium">
                                    Intelligent Workflow Automation
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-cyan-400 text-lg">✓</span>
                                <span className="font-medium">
                                    Scalable Enterprise Architecture
                                </span>
                            </div>

                        </div>

                    </motion.div>

                </div>

            </section>

            {/* CTA */}
            <section className="mx-auto max-w-6xl px-6 py-32 text-center">

                <h2 className="text-5xl font-bold md:text-6xl">
                    Ready to Build
                    <span className="text-cyan-500">
                        {" "}AI Nexus?
                    </span>
                </h2>

                <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
                    Start building intelligent systems, AI agents and
                    automated workflows today.
                </p>

                <div className="mt-10 flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link to="/register">
                            Start Free
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                    >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

            </section>

            {/* FOOTER */}
            <footer className="border-t border-border py-10">

                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 lg:flex-row">

                    <div>
                        <h3 className="text-2xl font-bold">
                            AI Nexus
                        </h3>

                        <p className="mt-2 text-muted-foreground">
                            Scalable Intelligence. Automated Growth.
                        </p>
                    </div>

                    <div className="flex gap-8 text-muted-foreground">
                        <a href="#">About</a>
                        <a href="#">Features</a>
                        <a href="#">Support</a>
                        <a href="#">Contact</a>
                    </div>

                </div>

            </footer>

        </div>
    );
}