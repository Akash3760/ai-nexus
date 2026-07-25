import { useEffect, useState } from "react";
import {
    Camera,
    ShieldAlert,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import FloatingInput from "@/components/common/FloatingInput";
import FloatingTextarea from "@/components/common/FloatingTextarea";

import useAuthStore from "@/store/authStore";

export default function ProfileSection() {

    const { user } = useAuthStore();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        bio: "",
    });

    const [loading,
        setLoading] =
        useState(false);

    useEffect(() => {
        if (!user) return;

        setFormData({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            username: user.username || "",
            email: user.email || "",
            bio: user.bio || "",
        });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const initials =
        user?.first_name || user?.last_name
            ? `${user?.first_name?.charAt(0) ?? ""}${user?.last_name?.charAt(0) ?? ""}`.toUpperCase()
            : user?.username?.charAt(0)?.toUpperCase() || "U";

    const handleSave = async () => {
        // call update profile API
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">
                    Profile Settings
                </h2>

                <p className="mt-2 text-muted-foreground">
                    Manage your personal information and account details.
                </p>
            </div>

            {/* Profile Picture */}
            <Card className="rounded-[32px]">
                <CardContent className="flex flex-col items-start justify-between gap-8 p-8 md:flex-row md:items-center">

                    <div className="flex items-center gap-5">

                        <Avatar
                            className="
                                h-24
                                w-24
                                rounded-full
                                border-2
                                border-cyan-500/40
                                shadow-lg
                                shadow-cyan-500/20
                                transition-all
                                duration-300
                                hover:border-cyan-500
                                hover:shadow-cyan-500/30
                            "
                        >
                            <AvatarImage
                                src={user?.profile_picture}
                                alt={user?.username}
                            />

                            <AvatarFallback
                                className="
                                    bg-card
                                    text-xl
                                    font-bold
                                    text-cyan-500
                                "
                            >
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <div>

                            <h3 className="text-lg font-semibold">
                                Profile Picture
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Upload a profile photo for your account.
                            </p>

                            <div className="mt-4">

                                {user?.is_verified ? (
                                    <Badge className="gap-1 bg-emerald-500">
                                        <ShieldCheck className="h-3 w-3" />
                                        Verified Account
                                    </Badge>
                                ) : (
                                    <Badge
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        <ShieldAlert className="h-3 w-3" />
                                        Not Verified
                                    </Badge>
                                )}

                            </div>

                        </div>

                    </div>

                    <div className="flex items-center gap-3">

                        <Button
                            type="button"
                            variant="outline"
                            className="
                                h-10
                                rounded-xl
                                px-3
                                text-sm
                                font-medium
                            "
                        >
                            <Camera className="mr-2 h-4 w-4" />
                            Upload
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            className="
                            h-10
                            rounded-xl
                            px-3
                            text-sm
                            font-medium
                            text-red-500
                            hover:bg-red-500/10
                            hover:text-red-500
                        "
                        >
                            Remove
                        </Button>

                    </div>

                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="rounded-[32px]">

                <CardHeader>
                    <CardTitle>
                        Personal Information
                    </CardTitle>

                    <CardDescription>
                        Update your account information.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-6 md:grid-cols-2">

                    <FloatingInput
                        label="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                    />

                    <FloatingInput
                        label="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                    />

                    <FloatingInput
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />

                    <FloatingInput
                        type="email"
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                </CardContent>

            </Card>

            {/* Bio */}
            <Card className="rounded-[32px]">

                <CardHeader>
                    <CardTitle>
                        About
                    </CardTitle>

                    <CardDescription>
                        Tell others a little about yourself.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">

                    <div className="space-y-2">

                        <FloatingTextarea
                            label="Bio"
                            name="bio"
                            rows={6}
                            value={formData.bio}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="flex justify-end">

                        <div className="flex justify-end pt-6">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-12 rounded-xl px-8"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>

                    </div>

                </CardContent>

            </Card>

        </div>
    );
}