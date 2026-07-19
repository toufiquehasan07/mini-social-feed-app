import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, List, Text } from 'react-native-paper';
import Avatar from '@/components/Avatar';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, selectNotificationStatus } from '@/store/notificationsSlice';
import { selectNotifications } from '@/store/notificationsSlice';
import { formatTimeAgo } from '@/utils/date';


const NotificationsScreen = () => {
    const dispatch = useDispatch<any>();
    const [refreshing, setRefreshing] = useState(false);

    const notifications = useSelector(selectNotifications);
    const status = useSelector(selectNotificationStatus);

    const handleRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchNotifications());
        setRefreshing(false);
    };

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    return (
        <SafeAreaView style={styles.screen} edges={["top"]}>
            <Text variant="headlineMedium" style={styles.title}>
                Notifications
            </Text>

            <View style={styles.container}>
                {status === "loading" ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <FlatList
                        data={notifications}
                        onRefresh={handleRefresh}
                        refreshing={refreshing}
                        keyExtractor={(item) => item._id}
                        ItemSeparatorComponent={Divider}
                        ListEmptyComponent={
                            <View style={styles.center}>
                                <Text variant="bodyMedium">
                                    No notifications found.
                                </Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <List.Item
                                style={styles.listItem}
                                title={item.from.name}
                                description={`${item.type} your post`}
                                left={() => (
                                    <Avatar
                                        user={item.from}
                                        size="md"
                                    />
                                )}
                                right={() => (
                                    <Text
                                        variant="bodySmall"
                                        style={styles.time}
                                    >
                                        {`${formatTimeAgo(item.createdAt)} ago`}
                                    </Text>
                                )}
                                contentStyle={styles.content}
                                titleStyle={styles.name}
                                descriptionStyle={styles.message}
                            />
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.phoneBg,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 32,
    },
    title: {
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        marginBottom: Spacing.md,
        fontWeight: '700',
        color: Colors.text,
    },
    listItem: {
        paddingLeft: 5,
    },
    container: {
        marginHorizontal: Spacing.lg,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        overflow: 'hidden',
    },
    content: {
        justifyContent: 'center',
    },
    name: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.text,
    },

    message: {
        fontSize: FontSize.base,
        color: Colors.text3,
        marginTop: 2,
    },

    time: {
        alignSelf: 'center',
        marginRight: Spacing.sm,
        color: Colors.text4,
    },
});
