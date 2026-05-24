import { create } from "zustand";

const useAppStore = create((set) => ({
    theme: "dark",

    setTheme: (theme) =>
        set({ theme }),
}));

export default useAppStore;