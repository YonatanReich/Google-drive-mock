import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useThemeColor';
import { getStyles } from '../styles/fileItem.styles';

export default function FileItem({ name, isFolder, onPress, onMenuPress, viewMode }) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const isGrid = viewMode === 'grid';
    return (
        <Pressable
            style={({ pressed }) => [
                isGrid ? styles.gridContainer : styles.container,
                {
                    backgroundColor: pressed ? theme.surface : theme.background
                }
            ]}
            onPress={onPress}
        >
            <View style={isGrid ? styles.gridIconContainer : styles.iconContainer}>
                {isFolder ? (
                    <MaterialCommunityIcons
                        name="folder"
                        size={isGrid ? 50 : 28}
                        color={theme.dark ? '#9aa0a6' : '#5f6368'}
                    />
                ) : (
                    <MaterialCommunityIcons
                        name="file-document-outline"
                        size={isGrid ? 40 : 26}
                        color={theme.tint}
                    />
                )}
            </View>

            <View style={isGrid ? styles.gridTextContainer : { flex: 1 }}>
                <Text style={isGrid ? styles.gridText : styles.text} numberOfLines={1}>
                    {name}
                </Text>
            </View>

            <Pressable
                onPress={onMenuPress}
                style={isGrid ? styles.gridMenu : styles.menu}
                hitSlop={20}
            >
                <Entypo
                    name="dots-three-vertical"
                    size={16}
                    color={theme.icon}
                />
            </Pressable>
        </Pressable>
    );
}