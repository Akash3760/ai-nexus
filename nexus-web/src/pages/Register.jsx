import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import FloatingInput from "@/components/common/FloatingInput";
import PasswordInput from "@/components/common/PasswordInput";

import { register }
    from "@/services/authService";

export default function Register() {

    const navigate =
        useNavigate();

    const [formData,
        setFormData] =
        useState({
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });

    const [loading,
        setLoading] =
        useState(false);

    const [error,
        setError] =
        useState("");

    const handleChange =
        (e) => {

            setFormData(
                (prev) => ({
                    ...prev,
                    [e.target.name]:
                        e.target.value,
                })
            );

        };

    const handleRegister =
        async () => {

            try {

                setError("");

                if (
                    formData.password !==
                    formData.confirmPassword
                ) {

                    return setError(
                        "Passwords do not match."
                    );

                }

                setLoading(true);

                await register({
                    first_name:
                        formData.first_name,

                    last_name:
                        formData.last_name,

                    username:
                        formData.username,

                    email:
                        formData.email,

                    password:
                        formData.password,
                });

                navigate("/login");

            } catch (err) {

                setError(
                    err.response?.data?.detail ||
                    "Registration failed."
                );

            } finally {

                setLoading(false);

            }

        };

    const handleKeyDown =
        (e) => {

            if (
                e.key === "Enter"
            ) {
                handleRegister();
            }

        };

    const isFormValid =
        formData.username.trim() &&
        formData.email.trim() &&
        formData.password.trim() &&
        formData.confirmPassword.trim();

    return (
        <div>

            <h2 className="text-3xl font-bold">
                Create Account
            </h2>

            <p className="mt-2 text-muted-foreground">
                Create your AI Nexus workspace
                and start building intelligent
                AI-powered solutions.
            </p>

            {error && (

                <div
                    className="
                        mt-6
                        rounded-xl
                        border
                        border-destructive/20
                        bg-destructive/10
                        p-3
                        text-sm
                        text-destructive
                    "
                >
                    {error}
                </div>

            )}

            <div className="mt-8 space-y-6">

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FloatingInput
                        label="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onClear={() =>
                            setFormData((prev) => ({
                                ...prev,
                                first_name: "",
                            }))
                        }
                    />

                    <FloatingInput
                        label="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onClear={() =>
                            setFormData((prev) => ({
                                ...prev,
                                last_name: "",
                            }))
                        }
                    />
                </div>

                <FloatingInput
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onClear={() =>
                        setFormData(
                            (prev) => ({
                                ...prev,
                                username: "",
                            })
                        )
                    }
                />

                <FloatingInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onClear={() =>
                        setFormData(
                            (prev) => ({
                                ...prev,
                                email: "",
                            })
                        )
                    }
                />

                <PasswordInput
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />

                <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    value={
                        formData.confirmPassword
                    }
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />

            </div>

            <Button
                onClick={handleRegister}
                disabled={
                    loading ||
                    !isFormValid
                }
                className="
                    mt-8
                    h-14
                    w-full
                    rounded-xl
                    text-base
                "
            >
                {loading ? (
                    <>
                        <Loader2
                            className="
                                mr-2
                                h-4
                                w-4
                                animate-spin
                            "
                        />

                        Creating Account...
                    </>
                ) : (
                    "Create Account"
                )}
            </Button>

            <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?
                {" "}
                <Link
                    to="/login"
                    className="
                    font-medium
                    text-cyan-500
                    hover:underline
                "
                >
                    Login
                </Link>
            </p>

        </div>
    );
}