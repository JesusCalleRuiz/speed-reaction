import axios from "axios";

const api = axios.create({
    baseURL: "https://speedreaction.dev-alicenter.es/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;