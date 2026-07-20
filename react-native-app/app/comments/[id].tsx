import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Card, Divider, Text, TextInput } from 'react-native-paper';
import { Colors } from '@/constants/theme';
import { useDispatch, useSelector } from 'react-redux';
import { addCommentThunk, selectPosts } from '@/store/postsSlice';
import { useLocalSearchParams } from 'expo-router';
import Avatar from '@/components/Avatar';
import { Comment, Post } from '@/types';
import { formatTimeAgo } from '@/utils/date';
import { selectUser } from '@/store/authSlice';

export default function CommentsScreen() {
    const router = useRouter();
    const dispatch = useDispatch<any>();
    const posts = useSelector(selectPosts);
    const user = useSelector(selectUser);
    // console.log("info post: ", posts);
    const { id: postId } = useLocalSearchParams();

    const comments: Comment[] =
        posts.find((post: Post) => post._id === postId)?.comments ?? [];
    // console.log("info comments: ", comments)

    // const [comments, setComments] = useState([]);
    const [text, setText] = useState('');

    const submit = async () => {
        const message = text.trim();
        if (!message || !postId) return;

        try {
            await dispatch(
                addCommentThunk({
                    postId: postId.toString(),
                    message,
                }),
            ).unwrap();
            setText('');
            // router.back();
        } catch (err) {
            console.error('Failed to create comment:', err);
        }
    };

    return (
        <SafeAreaView style={styles.screen} edges={['bottom']}>
            <Appbar.Header mode="small" elevated={false}>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Comments" />
            </Appbar.Header>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <FlatList
                    data={comments}
                    keyboardShouldPersistTaps="handled"
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <Card mode="contained" style={styles.commentCard}>
                            <Card.Content style={styles.commentRow}>
                                <Avatar user={item.user} size="md" />

                                <View style={styles.commentBody}>
                                    <View style={styles.commentHeader}>
                                        <Text variant="titleSmall">
                                            {item.user.name}
                                        </Text>

                                        <Text
                                            variant="bodySmall"
                                            style={styles.time}
                                        >
                                            {formatTimeAgo(item.createdAt)}
                                        </Text>
                                    </View>

                                    <Text
                                        variant="bodyMedium"
                                        style={styles.commentText}
                                    >
                                        {item.message}
                                    </Text>
                                </View>
                            </Card.Content>
                        </Card>
                    )}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text variant="bodyMedium">No comments yet.</Text>
                        </View>
                    }
                />

                <Divider />

                <View style={styles.inputContainer}>
                    <Avatar user={user} size="md" />

                    <TextInput
                        mode="outlined"
                        placeholder="Write a comment..."
                        value={text}
                        onChangeText={setText}
                        style={styles.input}
                        dense
                        right={
                            <TextInput.Icon
                                icon="send"
                                disabled={!text.trim()}
                                onPress={() => submit()}
                            />
                        }
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.phoneBg,
    },

    list: {
        padding: 16,
        paddingBottom: 100,
    },

    username: {
        opacity: 0.6,
        marginTop: 2,
    },

    postText: {
        marginTop: 14,
        lineHeight: 22,
    },

    commentCard: {
        backgroundColor: Colors.surface,
        marginBottom: 10,
        borderRadius: 14,
    },

    commentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    commentBody: {
        flex: 1,
        marginLeft: 12,
    },

    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    commentText: {
        marginTop: 6,
        lineHeight: 21,
    },

    time: {
        opacity: 0.55,
    },

    empty: {
        alignItems: 'center',
        marginTop: 60,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },

    input: {
        flex: 1,
        marginLeft: 12,
        backgroundColor: '#FFFFFF',
    },
});
