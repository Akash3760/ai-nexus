import { useState }
    from "react";

import {
    Eye,
    EyeOff,
} from "lucide-react";

import PasswordStrength
    from "./PasswordStrength";

export default function PasswordInput({
    label,
    name,
    value,
    onChange,
    onKeyDown,
}) {

    const [showPassword,
        setShowPassword] =
        useState(false);

    return (
        <div>

            <div className="relative">

                <input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    name={name}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder=" "
                    className="
                        peer
                        h-14
                        w-full
                        rounded-xl
                        border
                        border-border
                        bg-background
                        px-4
                        pt-5
                        pr-12
                        outline-none
                        transition
                        focus:border-cyan-500
                    "
                />

                <label
                    className="
                        pointer-events-none
                        absolute
                        left-4
                        top-4
                        bg-background
                        px-1
                        text-muted-foreground
                        transition-all

                        peer-focus:-top-2
                        peer-focus:text-xs
                        peer-focus:text-cyan-500

                        peer-[&:not(:placeholder-shown)]:-top-2
                        peer-[&:not(:placeholder-shown)]:text-xs
                    "
                >
                    {label}
                </label>

                {value && (

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }
                        className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            rounded-md
                            p-1
                            text-muted-foreground
                            transition-colors
                            duration-200
                            hover:text-foreground
                        "
                    >
                        {showPassword ? (
                            <EyeOff
                                size={18}
                            />
                        ) : (
                            <Eye
                                size={18}
                            />
                        )}
                    </button>

                )}

            </div>

            <PasswordStrength
                password={value}
            />

        </div>
    );
}