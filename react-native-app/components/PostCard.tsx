import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from './Avatar';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { Post } from '@/types';
import { formatTimeAgo } from '@/utils/date';

interface Props {
    post: Post;
    onLike: (id: string) => void;
}

const PostCard = ({ post, onLike }: Props) => {
    const router = useRouter();

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Avatar user={{ ...post.author, id: post.author._id }} />

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.name}>{post.author.name}</Text>
                        <Text style={styles.username}>
                            {post.author.username}
                        </Text>
                        <Text style={styles.time}>
                            {formatTimeAgo(post.createdAt)}
                        </Text>
                    </View>

                    <Text style={styles.body}>{post.content}</Text>

                    <View style={styles.actions}>
                        <Pressable
                            style={styles.action}
                            onPress={() => onLike(post._id)}
                        >
                            <Feather
                                name="heart"
                                size={18}
                                color={
                                    post.liked ? Colors.likeRed : Colors.text3
                                }
                            />
                            <Text
                                style={[
                                    styles.count,
                                    post.liked && { color: Colors.likeRed },
                                ]}
                            >
                                {post.likes}
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.action}
                            onPress={() => router.push(`/comments/${post._id}`)}
                        >
                            <Feather
                                name="message-circle"
                                size={18}
                                color={Colors.text3}
                            />
                            <Text style={styles.count}>
                                {post.comments.length}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PostCard;

const styles = StyleSheet.create({
    card: {
        padding: Spacing.lg,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dividerFaint,
    },

    row: {
        flexDirection: 'row',
        gap: Spacing.md,
    },

    content: {
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    name: {
        fontSize: FontSize.lg,
        fontWeight: '600',
        color: Colors.text,
    },

    username: {
        marginLeft: 6,
        color: Colors.text3,
    },

    time: {
        marginLeft: 'auto',
        color: Colors.text4,
        fontSize: FontSize.sm,
    },

    body: {
        marginTop: 6,
        color: Colors.text2,
        fontSize: FontSize.lg,
        lineHeight: 22,
    },

    actions: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 20,
    },

    action: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    count: {
        color: Colors.text3,
        fontSize: FontSize.base,
    },
});
