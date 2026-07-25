import {
    User,
    Shield,
    Palette,
    Bell,
    Brain,
    Users,
    KeyRound,
    Plug,
    CreditCard,
    TriangleAlert,
} from "lucide-react";

const menuItems = [
    {
        id: "profile",
        label: "Profile",
        icon: User,
    },
    {
        id: "security",
        label: "Security",
        icon: Shield,
    },
    {
        id: "appearance",
        label: "Appearance",
        icon: Palette,
    },
    {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
    },
    {
        id: "ai",
        label: "AI Preferences",
        icon: Brain,
    },
    {
        id: "workspace",
        label: "Workspace",
        icon: Users,
    },
    {
        id: "apikeys",
        label: "API Keys",
        icon: KeyRound,
    },
    {
        id: "integrations",
        label: "Integrations",
        icon: Plug,
    },
    {
        id: "billing",
        label: "Billing",
        icon: CreditCard,
    },
    {
        id: "danger",
        label: "Danger Zone",
        icon: TriangleAlert,
        danger: true,
    },
];

export default function SettingsSidebar({
    activeSection,
    onSectionChange,
}) {
    return (
        <aside
            className="
                rounded-[32px]
                border
                border-border
                bg-card
                p-4
                shadow-sm
                lg:sticky
                lg:top-6
                lg:h-fit
            "
        >
            <div className="mb-5 px-2">
                <h2 className="text-lg font-semibold">
                    Settings
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Configure your workspace.
                </p>
            </div>

            <nav className="space-y-1.5">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active =
                        activeSection === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() =>
                                onSectionChange(item.id)
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-2xl
                                px-4
                                py-3
                                text-left
                                transition-all
                                duration-200

                                ${active
                                    ? "bg-cyan-500 text-white shadow"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }

                                ${item.danger && !active
                                    ? "hover:bg-red-500/10 hover:text-red-500"
                                    : ""
                                }
                            `}
                        >
                            <Icon className="h-5 w-5 shrink-0" />

                            <span className="text-sm font-medium">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}