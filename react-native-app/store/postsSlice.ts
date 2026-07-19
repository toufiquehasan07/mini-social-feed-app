import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as apiService from '@/services/api';
import { Post } from '@/types';

interface PostsState {
    items: Post[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    creating: boolean;
}

const initialState: PostsState = {
    items: [],
    status: 'idle',
    error: null,
    creating: false,
};

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (_, { rejectWithValue }) => {
        try {
            const posts = await apiService.getPosts();
            // console.log('info posts: ', posts);
            return posts;
        } catch (err: any) {
            // console.log('info error in getting posts: ', { ...err });
            return rejectWithValue(
                err.response?.data?.message ?? 'Failed to fetch posts',
            );
        }
    },
);

export const createPostThunk = createAsyncThunk(
    'posts/createPost',
    async (content: string, { rejectWithValue }) => {
        try {
            const resp = await apiService.createPost({
                content,
            });
            console.log('info response: ', resp);
            return resp;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? 'Failed to create post',
            );
        }
    },
);

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                fetchPosts.fulfilled,
                (state, action: PayloadAction<Post[]>) => {
                    state.status = 'succeeded';
                    state.items = action.payload;
                },
            )
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            .addCase(createPostThunk.pending, (state) => {
                state.creating = true;
            })

            .addCase(
                createPostThunk.fulfilled,
                (state, action: PayloadAction<Post>) => {
                    state.creating = false;

                    state.items.unshift(action.payload);
                },
            )

            .addCase(createPostThunk.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload as string;
            });
    },
});

// export const { toggleLike, addComment } = postsSlice.actions;

export const selectPosts = (state: any) => state.posts.items;
export const isLoadingPosts = (state: any) => state.posts.status === 'loading';
export const isCreatingPost = (state: any) => state.posts.creating;
export const selectPostsStatus = (state: any) => state.posts.status;

export default postsSlice.reducer;
