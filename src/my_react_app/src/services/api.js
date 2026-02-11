// src/services/api.js
const API_URL = 'http://localhost:3000/api/files';
const BASE_URL = "http://localhost:3000/api";

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {})
        },
        ...options
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "API request failed");
    }

    // If no content (204), don't try to parse JSON
    if (res.status === 204) return null;

    return res.json();
}
const getHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

export const getFiles = async (token) => {
    const res = await fetch(API_URL, { headers: getHeaders(token) });
    return res.json();
};

export const getTrashFiles = async (token) => {
    const res = await fetch(`${API_URL}/trash`, { headers: getHeaders(token) });
    return res.json();
};

export const deleteFile = async (id, token) => {
    // for soft and hard delete
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token)
    });
};

export const restoreFile = async (id, token) => {
    await fetch(`${API_URL}/${id}/restore`, {
        method: 'POST',
        headers: getHeaders(token)
    });
};