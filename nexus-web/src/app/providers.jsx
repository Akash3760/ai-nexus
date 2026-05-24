import ThemeProvider from "@/components/common/ThemeProvider";
import AuthProvider from "@/app/AuthProvider";

export default function Providers({
    children,
}) {
    return (
        <ThemeProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
    );
}