import ThemeProvider from "@/components/common/ThemeProvider";

export default function Providers({
    children,
}) {
    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    );
}