import React, { useState } from 'react';
import { View, TextInput, Image, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getStyles } from "../styles/topBar.styles.js"
import { useTheme } from '../hooks/useThemeColor';
import { useFocusEffect, useRouter } from 'expo-router';

export default function TopBar({ onMenuPress, onProfilePress, searchText, setSearchText, profileImage }) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const router = useRouter();

    return (
        <View style={styles.outerContainer}>
            <View style={styles.searchWrapper}>
                {/* Hamburger Menu */}
                <Pressable onPress={onMenuPress} style={styles.iconButton}>
                    <Feather name="menu" size={20} color={theme.icon} />
                </Pressable>

                {/* Search input */}
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search in Drive"
                    placeholderTextColor={theme.icon}
                    value={searchText}
                    onChangeText={setSearchText}
                    selectionColor={theme.tint}
                    onSubmitEditing={() => {
                        if (searchText.trim()) {
                            router.push(`/search?q=${searchText}`);
                        }
                    }}
                />

                {/* Profile picture */}
                <Pressable onPress={onProfilePress} style={styles.iconButton}>
                    <Image
                        source={profileImage ? { uri: profileImage } : require('../assets/profile.jpg')}
                        style={styles.profileImage}
                    />
                </Pressable>
            </View>
        </View>
    );
}