import api from "@/api/axios";

export const register = async (userData) => {
    const response = await api.post(
        "auth/register/",
        userData
    );

    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post(
        "auth/login/",
        credentials
    );

    localStorage.setItem(
        "access",
        response.data.access
    );

    localStorage.setItem(
        "refresh",
        response.data.refresh
    );

    return response.data;
};

export const getProfile = async () => {
    const response = await api.get(
        "auth/profile/"
    );

    return response.data;
};

export const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};