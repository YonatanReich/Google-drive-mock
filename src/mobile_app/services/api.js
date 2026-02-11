import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const requestHeaders = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : null
        });

        if (response.status === 401) {
            return { error: "Invalid Token", status: 401 };
        }

        const data = await response.json();
        return response.ok ? { data, success: true } : { error: data.message };
    } catch (error) {
        console.error("Fetch error:", error);
        return { error: "Network Error. Is your server running?" };
    }
};

