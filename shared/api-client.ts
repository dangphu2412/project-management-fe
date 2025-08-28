'use client'

import axios, {AxiosRequestConfig} from "axios";

const API_URL = 'http://localhost:8080';
export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
axiosInstance.interceptors.request.use((requestConfig) => {
    requestConfig.headers['authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;

    return requestConfig;
})

let refreshment: null | (Promise<{ accessToken: string }>) = null;

axiosInstance.interceptors.response.use(async (response) => {
    if (response.data.code === 'RENEW_REQUIRED') {
        if (!refreshment) {
            refreshment = apiClient.request({
                url: '/renew',
                method: 'POST',
                body: { refreshToken: localStorage.getItem('refreshToken') }, // ??
            }) as (Promise<{ accessToken: string }>)
        }
        // Concurrent request
        try {
            const { accessToken } = await refreshment;
            localStorage.setItem('accessToken', accessToken);
        } catch (e) {
            console.error(e);
        } finally {
            refreshment = null;
        }
        // CAll renew API
        // Retry current API
        // Return result
    }

    return response;
})

type HttpRequest<D> = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: D;
    url: string;
}

interface ApiClient {
    request<D = any, R = any>(httpRequest?: HttpRequest<D>): Promise<R>;
}

export const apiClient: ApiClient = {
    async request<D, R>(httpRequest: HttpRequest<D>): Promise<R> {
        function mapToAxiosRequestConfig(httpRequest: HttpRequest<D>): AxiosRequestConfig {
            return {...httpRequest, data: httpRequest.body};
        }

        return (await axiosInstance.request(mapToAxiosRequestConfig(httpRequest))).data
    }
}
