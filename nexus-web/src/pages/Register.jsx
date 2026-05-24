import { useState } from "react";
import { Link, useNavigate }
    from "react-router-dom";

import { Button }
    from "@/components/ui/button";

import { register }
    from "@/services/authService";

export default function Register() {
    const navigate =
        useNavigate();

    const [formData,
        setFormData] =
        useState({
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
                setLoading(true);
                setError("");

                if (
                    formData.password !==
                    formData.confirmPassword
                ) {
                    return setError(
                        "Passwords do not match"
                    );
                }

                await register({
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
                    err.response?.data
                        ?.detail ||
                    "Registration failed"
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">

            <div className="w-full max-w-md rounded-2xl border p-6 shadow-md">

                <h1 className="mb-6 text-3xl font-bold">
                    Create Account
                </h1>

                {error && (
                    <p className="mb-4 text-red-500">
                        {error}
                    </p>
                )}

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={
                        formData.username
                    }
                    onChange={
                        handleChange
                    }
                    className="mb-3 w-full rounded-md border p-3"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={
                        formData.email
                    }
                    onChange={
                        handleChange
                    }
                    className="mb-3 w-full rounded-md border p-3"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={
                        formData.password
                    }
                    onChange={
                        handleChange
                    }
                    className="mb-3 w-full rounded-md border p-3"
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={
                        formData.confirmPassword
                    }
                    onChange={
                        handleChange
                    }
                    className="mb-4 w-full rounded-md border p-3"
                />

                <Button
                    onClick={
                        handleRegister
                    }
                    className="w-full"
                    disabled={
                        loading
                    }
                >
                    {loading
                        ? "Creating account..."
                        : "Register"}
                </Button>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Already have an account?
                    {" "}
                    <Link
                        to="/login"
                        className="font-medium text-primary"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}