export default function PasswordStrength({
    password,
}) {

    const getStrength = () => {

        if (!password) {
            return {
                text: "Weak",
                color: "bg-muted",
                width: "0%",
            };
        }

        if (password.length < 6) {
            return {
                text: "Weak",
                color: "bg-red-500",
                width: "33%",
            };
        }

        if (password.length < 10) {
            return {
                text: "Medium",
                color: "bg-yellow-500",
                width: "66%",
            };
        }

        return {
            text: "Strong",
            color: "bg-green-500",
            width: "100%",
        };
    };

    const strength =
        getStrength();


    return (
        <div className={`
            mt-3
            transition-all
            duration-300
        `}>

            <div className="h-2 overflow-hidden rounded-full bg-muted">

                <div
                    className={`
                        h-full
                        transition-all
                        duration-500
                        ease-in-out
                        ${strength.color}
                    `}
                    style={{
                        width: strength.width,
                    }}
                />

            </div>

            <div
                className={`
        mt-2
        flex
        justify-end

        transition-all
        duration-300

        ${password
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-1"
                    }
    `}
            >

                <span
                    className={`
            text-xs
            font-medium
            transition-colors
            duration-500

            ${strength.text === "Weak"
                            ? "text-red-500"
                            : strength.text === "Medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                        }
        `}
                >
                    Password Strength:
                    {" "}
                    {strength.text}
                </span>

            </div>

        </div>
    );
}