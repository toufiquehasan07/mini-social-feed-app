import { axiosAuthClient, axiosClient } from './axios';
import {
    AUTH_LOGIN,
    AUTH_SIGNUP,
    NOTIFICATION,
    POSTS,
} from '@/constants/endpoints';
import { AuthResponse, Comment, Post, ToggleLikeResponse } from '@/types';

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
    const { data } = await axiosClient({
        method: 'POST',
        url: AUTH_SIGNUP,
        data: payload,
    });

    return data;
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
    // console.log('info data: ', data);
    return data?.data;
};

export const getUserNotifications = async (): Promise<Notification[]> => {
    const { data } = await axiosAuthClient({
        method: 'GET',
        url: NOTIFICATION,
    });
    // console.log('info get notification data: ', data);
    return data?.data;
};

export const toggleLike = async (id: string): Promise<ToggleLikeResponse> => {
    const { data } = await axiosAuthClient({
        method: 'POST',
        url: `${POSTS}/${id}/like`,
    });
    // console.log('info data: ', data);
    return data?.data;
};

export const createComment = async (payload: {
    postId: string;
    message: string;
}): Promise<Comment> => {
    const { data } = await axiosAuthClient({
        method: 'POST',
        url: `${POSTS}/${payload.postId}/comment`,
        data: {
            message: payload.message,
        },
    });
    // console.log('info data: ', data);
    return data?.data;
};

export const refreshFcmToken = async (
    token: string,
): Promise<{
    success: boolean;
    message: string;
}> => {
    const { data } = await axiosAuthClient({
        method: 'PUT',
        url: `${NOTIFICATION}/fcm-token`,
        data: {
            token,
        },
    });
    return data;
};
