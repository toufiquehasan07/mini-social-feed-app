import { Feather } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '@/components/Avatar';
import PostCard from '@/components/PostCard';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { fetchPosts, selectPosts, selectPostsStatus, toggleLikeThunk } from '@/store/postsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@/store/authSlice';
import { FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function FeedScreen() {
    const router = useRouter();
    const dispatch = useDispatch<any>();
    const posts = useSelector(selectPosts);
    // console.log('info posts: ', posts);
    const user = useSelector(selectUser);
    const status = useSelector(selectPostsStatus);

    const [filter, setFilter] = useState('');

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPosts());
        }
    }, [status]);

    const filteredPosts = useMemo(() => {
        if (!filter.trim()) return posts;
        const q = filter.toLowerCase();
        return posts.filter((post: any) => {
            return (
                post.author?.name?.toLowerCase().includes(q) ||
                post.author?.username?.toLowerCase().includes(q)
            );
        });
    }, [posts, filter]);

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            <FAB
                icon="plus"
                color={Colors.surface}
                style={styles.fab}
                onPress={() => {
                    // console.log('info clicked');
                    return router.push('/create');
                }}
            />
            <View style={styles.header}>
                <View style={styles.topRow}>
                    <View style={styles.brandRow}>
                        <Text style={styles.brandText}>SocialFeed</Text>
                    </View>
                    <Avatar user={user} size="sm" />
                </View>
                <View style={styles.searchBar}>
                    <Feather name="search" size={16} color={Colors.text3} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        placeholderTextColor={Colors.text3}
                        value={filter}
                        onChangeText={setFilter}
                    />
                    {!!filter && (
                        <Pressable onPress={() => setFilter('')}>
                            <Feather name="x" size={18} color={Colors.text4} />
                        </Pressable>
                    )}
                </View>
            </View>

            <FlatList
                data={filteredPosts}
                keyExtractor={(item: any) => item._id}
                renderItem={({ item }) => (
                    <PostCard post={item} onLike={() => dispatch(toggleLikeThunk(item._id))}
                    // onComment={() => handleComment(item._id)} 
                    />
                )}
                refreshing={status === 'loading'}
                onRefresh={() => dispatch(fetchPosts())}
                ListEmptyComponent={() => {
                    if (status === 'loading') {
                        return (
                            <View style={styles.empty}>
                                <ActivityIndicator color={Colors.primary} />
                            </View>
                        );
                    }
                    return (
                        <View style={styles.empty}>
                            <Text>No posts available.</Text>
                        </View>
                    );
                }}
                contentContainerStyle={{
                    paddingBottom: 20,
                    flexGrow: filteredPosts.length === 0 ? 1 : 0,
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.phoneBg,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        zIndex: 999,
        backgroundColor: Colors.primary,
    },
    header: {
        padding: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandIcon: {
        width: 30,
        height: 30,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    brandText: {
        fontSize: FontSize.xxl,
        fontWeight: '700',
        color: Colors.text,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.inputBg,
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        marginLeft: 8,
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
