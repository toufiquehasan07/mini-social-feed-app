export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
}

interface Response {
    // success: boolean,
    // message: string,
    createdAt: string,
    updatedAt: string
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

export interface Post extends Response {
    _id: string,
    author: {
        _id: string,
        email: string,
        username: string,
        name: string
    },
    content: string,
}

export interface Comment {
    id: string;
    userId: string;
    user: User;
    text: string;
    time: string;
}

export interface Post {
    id: string;
    userId: string;
    user: User;
    text: string;
    time: string;
    likes: string[];
    comments: Comment[];
}

export interface Notif {
    id: string;
    type: "like" | "comment";
    fromUser: User;
    postPreview: string;
    time: string;
    read: boolean;
}