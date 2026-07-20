export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
}

interface Response {
    // success: boolean,
    // message: string,
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: {
        _id: string;
        name: string;
        username: string;
        email: string;
    };
    accessToken: string;
    refreshToken: string;
}

export interface Comment extends Response {
    _id: string;
    message: string;
    post: string;
    user: ResponseUser;
}

export interface Post extends Response {
    _id: string;
    author: {
        _id: string;
        email: string;
        username: string;
        name: string;
    };
    content: string;
    likes: number;
    liked: boolean;
    commented: boolean;
    comments: Comment[];
}

interface ResponseUser extends User {
    _id: string;
}

export interface Notification extends Response {
    _id: string,
    type: "liked" | "disliked" | "commented",
    from: ResponseUser,
    to: ResponseUser,
    post: ResponseUser,
}

export interface ToggleLikeResponse {
    postId: string
    liked: boolean,
    likes: number
}