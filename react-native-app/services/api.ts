import { axiosAuthClient, axiosClient } from './axios';
import { AUTH_LOGIN, AUTH_SIGNUP, POSTS } from '@/constants/endpoints';
import { AuthResponse, Post } from '@/types';

export const login = async (payload: {
    email: string;
    password: string;
}): Promise<AuthResponse> => {
    const resp = await axiosClient({
        method: 'POST',
        url: AUTH_LOGIN,
        data: payload,
    });

    return resp.data.data;
};

export const signup = async (payload: {
    email: string;
    name: string;
    username: string;
    password: string;
}): Promise<AuthResponse> => {
    const resp = await axiosClient({
        method: 'POST',
        url: AUTH_SIGNUP,
        data: payload,
    });

    return resp.data.data;
};

export const getPosts = async (): Promise<Post[]> => {
    const { data } = await axiosAuthClient({
        method: 'GET',
        url: POSTS,
    });

    return data?.data;
};

export const createPost = async (payload: { content: string }) => {
    const { data } = await axiosAuthClient({
        method: 'POST',
        url: POSTS,
        data: payload,
    });
    console.log('info data: ', data);
    return data?.data?.message;
};
