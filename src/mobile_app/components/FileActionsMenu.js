import React from 'react';
import { View, Text, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useThemeColor';
import { getStyles } from '../styles/fileActionsMenu.styles';

export default function FileActionsMenu({
    isVisible,
    onClose,
    fileName,
    isFolder,
    onRemove,
    onRestore,
    onDelete,
    inTrash,
    isStarred,
    onToggleStar,
    onSharePress,
    onDetailsPress,
    onRename
}) {
    const theme = useTheme();
    const styles = getStyles(theme);

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
                            <View style={styles.handle} />

                            {/* Header */}
                            <View style={styles.header}>
                                <Feather name="file" size={20} color={theme.icon} />
                                <Text style={styles.fileName} numberOfLines={1}>
                                    {fileName || 'File name'}
                                </Text>
                            </View>
                            {isFolder && (
                                <ActionItem
                                    icon="edit-2"
                                    label="Rename"
                                    theme={theme}
                                    styles={styles}
                                    onPress={() => {
                                        onClose();
                                        setTimeout(() => {
                                            onRename();
                                        }, 500);
                                    }}
                                />
                            )}
                            {!inTrash && (
                                <ActionItem
                                    icon="share"
                                    label="Share"
                                    theme={theme}
                                    styles={styles}
                                    onPress={onSharePress}
                                />
                            )}
                            <ActionItem
                                icon="info"
                                label="Details"
                                theme={theme}
                                styles={styles}
                                onPress={() => {
                                    onClose();
                                    setTimeout(() => {
                                        onDetailsPress();
                                    }, 500);
                                }}
                            />

                            <View style={styles.divider} />

                            {inTrash ? (
                                <>
                                    <ActionItem
                                        icon="refresh-cw"
                                        label="Restore"
                                        theme={theme}
                                        styles={styles}
                                        onPress={onRestore}
                                    />
                                    <ActionItem
                                        icon="x-circle"
                                        label="Delete permanently"
                                        theme={theme}
                                        styles={styles}
                                        onPress={onDelete}
                                        isDestructive
                                    />
                                </>
                            ) : (
                                <>
                                    <ActionItem
                                        icon="star"
                                        label={isStarred ? "Remove from Starred" : "Add to Starred"}

                                        iconColor={isStarred ? "#f4b400" : theme.text}

                                        theme={theme}
                                        styles={styles}
                                        onPress={() => {
                                            onToggleStar();
                                            onClose();
                                        }}
                                    />
                                    <ActionItem
                                        icon="trash-2"
                                        label="Remove"
                                        theme={theme}
                                        styles={styles}
                                        onPress={onRemove}
                                        isDestructive
                                    />
                                </>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const ActionItem = ({ icon, label, onPress, theme, styles, isDestructive }) => {
    const iconColor = isDestructive ? '#d93025' : theme.icon;
    const textColor = isDestructive ? '#d93025' : theme.text;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.menuItem,
                { backgroundColor: pressed ? (theme.surface) : 'transparent' }
            ]}
            onPress={onPress}
        >
            <Feather name={icon} size={20} color={iconColor} />
            <Text style={[styles.menuText, { color: textColor }]}>
                {label}
            </Text>
        </Pressable>
    );
};