import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as apiService from '@/services/api';
import { Comment, Post, ToggleLikeResponse } from '@/types';

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
            return rejectWithValue(err.message || "Failed to load posts");
        }
    },
);

export const createPostThunk = createAsyncThunk(
    'posts/createPost',
    async (content: string, { rejectWithValue }) => {
        try {
            return await apiService.createPost({
                content,
            });
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to create post");
        }
    },
);

export const toggleLikeThunk = createAsyncThunk(
    'posts/toggleLike',
    async (id: string, { rejectWithValue }) => {
        try {
            return await apiService.toggleLike(id);
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to toggle like");
        }
    },
);

export const addCommentThunk = createAsyncThunk(
    "posts/comment",
    async (payload: { postId: string; message: string }, { rejectWithValue }) => {
        try {
            return await apiService.createComment(payload);
        } catch (err: any) {
            console.error('error in add comments', err);
            rejectWithValue(err.message || "failed to add comments");
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
                (state, _) => {
                    state.creating = false;
                    // state.items.unshift(action.payload);
                },
            )
            .addCase(createPostThunk.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload as string;
            })


            .addCase(toggleLikeThunk.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(toggleLikeThunk.fulfilled, (state, action: PayloadAction<ToggleLikeResponse>) => {
                state.creating = false;
                const { postId, liked, likes } = action.payload;

                const post = state.items.find(
                    (item) => item._id === postId
                );

                if (post) {
                    post.liked = liked;
                    post.likes = likes;
                }
            })
            .addCase(toggleLikeThunk.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload as string;
            })



            .addCase(addCommentThunk.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(addCommentThunk.fulfilled, (state, action: PayloadAction<Comment>) => {
                state.creating = false;
                const comment = action.payload;

                const post = state.items.find(
                    p => p._id === comment.post
                );

                if (post) {
                    post.comments.unshift(comment);
                    post.commented = true;
                }
            })
            .addCase(addCommentThunk.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload as string;
            })
    },
});

// export const { toggleLike, addComment } = postsSlice.actions;

export const selectPosts = (state: any) => state.posts.items;
export const isLoadingPosts = (state: any) => state.posts.status === 'loading';
export const isCreatingPost = (state: any) => state.posts.creating;
export const selectPostsStatus = (state: any) => state.posts.status;

export default postsSlice.reducer;
