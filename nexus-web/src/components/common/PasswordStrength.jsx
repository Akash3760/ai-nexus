export default function PasswordStrength({
    password,
}) {

    const getStrength = () => {

        if (!password) {
            return {
                label: "Password Strength",
                color: "bg-muted",
                width: "0%",
                textColor: "text-muted-foreground",
                isEmpty: true,
            };
        }

        if (password.length < 6) {
            return {
                label: "Weak",
                color: "bg-red-500",
                width: "33%",
                textColor: "text-red-500",
                isEmpty: false,
            };
        }

        if (password.length < 10) {
            return {
                label: "Medium",
                color: "bg-yellow-500",
                width: "66%",
                textColor: "text-yellow-500",
                isEmpty: false,
            };
        }

        return {
            label: "Strong",
            color: "bg-green-500",
            width: "100%",
            textColor: "text-green-500",
            isEmpty: false,
        };
    };

    const strength =
        getStrength();

    return (
        <div className="mt-3">

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

            <div className="mt-2 flex justify-end">

                <span
                    className={`
                        text-xs
                        font-medium
                        transition-all
                        duration-500
                        ${strength.textColor}
                    `}
                >
                    {strength.label}
                </span>

            </div>

        </div>
    );
}