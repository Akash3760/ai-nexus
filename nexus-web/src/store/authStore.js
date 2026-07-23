import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: !!user,
        }),

    setLoading: (loading) =>
        set({
            loading,
        }),

    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
            loading: false,
        }),
}));

export default useAuthStore;