import { axiosClient } from './axios';
import { AUTH_LOGIN, AUTH_SIGNUP } from '@/constants/endpoints';
import { AuthResponse } from '@/types';

export const login = async (payload: {
    email: string,
    password: string;
}): Promise<AuthResponse> => {

    const resp = await axiosClient({
        method: 'POST',
        url: AUTH_LOGIN,
        data: payload
    });

    return resp.data.data;
}

export const signup = async (payload: {
    email: string,
    name: string,
    username: string,
    password: string;
}): Promise<AuthResponse> => {

    const resp = await axiosClient({
        method: 'POST',
        url: AUTH_SIGNUP,
        data: payload
    });

    return resp.data.data;
}

