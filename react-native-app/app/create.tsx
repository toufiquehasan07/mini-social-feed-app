import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '@/components/Avatar';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '@/store/authSlice';
import { createPostThunk } from '@/store/postsSlice';

const CreateScreen = () => {
    const router = useRouter();
    const dispatch = useDispatch<any>();
    const user = useSelector(selectUser);

    const [text, setText] = useState('');

    const handlePost = async () => {
        Keyboard.dismiss();
        if (!text.trim()) return;
        try {
            const response = await dispatch(createPostThunk(text)).unwrap();
            setText('');
            Alert.alert('Greetings', response.message || 'Post created successfully!', [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            Alert.alert('Failed', 'Unable to create post');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()}>
                        <Text style={styles.cancel}>Cancel</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.postButton,
                            !text.trim() && styles.postButtonDisabled,
                        ]}
                        disabled={!text.trim()}
                        onPress={handlePost}
                    >
                        <Text style={styles.postButtonText}>Post</Text>
                    </Pressable>
                </View>

                <View style={styles.profileRow}>
                    <Avatar user={user} />

                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>
                            {user.name ?? 'Unknown'}
                        </Text>
                    </View>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="What's on your mind?"
                    placeholderTextColor={Colors.text3}
                    multiline
                    autoFocus
                    value={text}
                    onChangeText={setText}
                    textAlignVertical="top"
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CreateScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.phoneBg,
    },

    header: {
        height: 56,
        paddingHorizontal: Spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
    },

    cancel: {
        fontSize: FontSize.lg,
        color: Colors.text,
        fontWeight: '500',
    },

    postButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
    },

    postButtonDisabled: {
        opacity: 0.5,
    },

    postButtonText: {
        color: '#fff',
        fontSize: FontSize.md,
        fontWeight: '600',
    },

    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.md,
    },

    profileInfo: {
        marginLeft: Spacing.md,
        justifyContent: 'center',
    },

    name: {
        fontSize: FontSize.lg,
        fontWeight: '600',
        color: Colors.text,
    },

    input: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        fontSize: 18,
        lineHeight: 28,
        color: Colors.text,
    },
});
