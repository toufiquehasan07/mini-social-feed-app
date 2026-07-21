import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Gradients } from '@/constants/theme';

const TabIcon = ({
    name,
    focused,
}: {
    name: React.ComponentProps<typeof Feather>['name'];
    focused: boolean;
}) => {
    return (
        <Feather
            name={name}
            size={22}
            color={focused ? Colors.primary : Colors.text3}
        />
    );
};

const CreateTabIcon = ({ focused }: { focused: boolean }) => {
    return (
        <LinearGradient
            colors={
                focused ? Gradients.primary : ['transparent', 'transparent']
            }
            style={[
                styles.createIcon,
                !focused && { backgroundColor: Colors.primaryBg },
            ]}
        >
            <Feather
                name="plus"
                size={22}
                color={focused ? '#fff' : Colors.primary}
            />
        </LinearGradient>
    );
};

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.text4,
                tabBarStyle: {
                    borderTopColor: Colors.divider,
                    backgroundColor: Colors.surface,
                },
                tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="home" focused={focused} />
                    ),
                }}
            />
            {/* <Tabs.Screen
                name="create"
                options={{
                    title: '',
                    tabBarIconStyle: {
                        marginTop: 4,
                    },
                    tabBarIcon: ({ focused }) => (
                        <CreateTabIcon focused={focused} />
                    ),
                }}
            /> */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="user" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Alerts',
                    tabBarIcon: ({ focused }) => (
                        <View>
                            <TabIcon name="bell" focused={focused} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;

const styles = StyleSheet.create({
    createIcon: {
        width: 40,
        height: 40,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -8,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.likeRed,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    badgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '700',
    },
});
