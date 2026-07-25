import { useState } from "react";

import SettingsHeader from "../components/SettingsHeader";
import SettingsSidebar from "../components/SettingsSidebar";
import ProfileSection from "../components/ProfileSection";

export default function Settings() {
    const [activeSection, setActiveSection] =
        useState("profile");

    return (
        <div className="space-y-8">
            <SettingsHeader />

            <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <SettingsSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />

                <div className="flex-1">
                    {activeSection === "profile" && (
                        <ProfileSection />
                    )}

                    {activeSection === "security" && (
                        <div
                            className="
                                rounded-[32px]
                                border
                                border-border
                                bg-card
                                p-8
                                shadow-sm
                            "
                        >
                            <h2 className="text-2xl font-bold">
                                Security
                            </h2>
                        </div>
                    )}

                    {activeSection === "appearance" && (
                        <div
                            className="
                                rounded-[32px]
                                border
                                border-border
                                bg-card
                                p-8
                                shadow-sm
                            "
                        >
                            <h2 className="text-2xl font-bold">
                                Appearance
                            </h2>
                        </div>
                    )}
                </div>

            </section>
        </div>
    );
}