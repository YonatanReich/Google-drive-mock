import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useThemeColor';
import { getStyles } from '../styles/profileMenu.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, Link } from 'expo-router';
import { apiRequest } from '../services/api';

export default function ProfileMenu({ isVisible, onClose, profileImage }) {
    const router = useRouter();
    const theme = useTheme();
    const styles = getStyles(theme);
    const [userData, setUserData] = useState({ name: 'User', email: '', image: null });

    useEffect(() => {
        if (isVisible) {
            loadUserProfile();
        }
    }, [isVisible]);

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await AsyncStorage.removeItem('token');
                    onClose();
                    router.replace('/login');
                }
            }
        ]);
    };

    const loadUserProfile = async () => {
        const token = await AsyncStorage.getItem('token');
        const result = await apiRequest('/api/users/me', 'GET', null, token);
        if (result && result.success && result.data && result.data.data) {
            const user = result.data.data;
            setUserData({
                name: user.firstName || 'User',
                email: user.email || '',
                image: user.userImage || null
            });
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            {/* Header */}
                            <View style={styles.header}>
                                <View style={styles.headerSpacer} />
                                <Text style={styles.emailText}>{userData.email}</Text>
                                <Pressable onPress={onClose} hitSlop={10}>
                                    <Text style={styles.doneButtonText}>Done</Text>
                                </Pressable>
                            </View>

                            {/* Profile Details */}
                            <View style={styles.profileSection}>
                                <Image
                                    source={profileImage ? { uri: profileImage } : require('../assets/profile.jpg')}
                                    style={styles.largeProfilePic}
                                />
                                <Text style={styles.userName}>Hi, {userData.name}!</Text>
                            </View>

                            {/* Settings Link */}
                            <Pressable
                                style={({ pressed }) => [
                                    styles.settingsButton,
                                    { opacity: pressed ? 0.7 : 1 }
                                ]}
                                onPress={() => {
                                    onClose();
                                    router.push('/settings');
                                }}
                            >
                                <Feather name="settings" size={20} color={theme.icon} />
                                <Text style={styles.settingsText}>Manage your Account</Text>
                            </Pressable>

                            {/* Logout Button */}
                            <Pressable
                                style={({ pressed }) => [
                                    styles.logoutButton,
                                    { backgroundColor: pressed ? (theme.dark ? '#3c4043' : '#fff5f5') : 'transparent' }
                                ]}
                                onPress={handleLogout}
                            >
                                <Feather name="log-out" size={20} color="#d93025" />
                                <Text style={styles.logoutText}>Sign out</Text>
                            </Pressable>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}