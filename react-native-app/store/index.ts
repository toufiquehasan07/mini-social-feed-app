import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice';
import postsReducer from '@/store/postsSlice';

const appReducer = combineReducers({
    auth: authReducer,
    posts: postsReducer
});

const rootReducer = (state: any, action: any) => {
    if (action.type === 'auth/logout') {
        state = undefined;
    }
    return appReducer(state, action);
};

const store = configureStore({
    reducer: rootReducer
});

export default store;