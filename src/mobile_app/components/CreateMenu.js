import React from 'react';
import { View, Text, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useThemeColor';
import { getStyles } from '../styles/createMenu.styles';

export default function CreateMenu({ isVisible, onClose, onOpenFileCreate, onOpenFolderCreate, onCameraPress, onUploadPress }) {
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
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create new</Text>

                            <View style={styles.menuGrid}>
                                <MenuOption
                                    icon="file-text"
                                    label="File"
                                    theme={theme}
                                    styles={styles}
                                    onPress={onOpenFileCreate}
                                />
                                <MenuOption
                                    icon="folder"
                                    label="Folder"
                                    theme={theme}
                                    styles={styles}
                                    onPress={onOpenFolderCreate}
                                />
                                <MenuOption
                                    icon="upload"
                                    label="Upload"
                                    theme={theme}
                                    styles={styles}
                                    onPress={() => {
                                        onClose();
                                        setTimeout(() => {
                                            onUploadPress();
                                        }, 1000);
                                    }}
                                />
                                <MenuOption
                                    icon="camera"
                                    label="Scan"
                                    theme={theme}
                                    styles={styles}
                                    onPress={() => {
                                        onClose();
                                        setTimeout(() => {
                                            onCameraPress();
                                        }, 1000);
                                    }}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const MenuOption = ({ icon, label, onPress, theme, styles }) => (
    <Pressable
        style={({ pressed }) => [
            styles.menuItem,
            { opacity: pressed ? 0.6 : 1 }
        ]}
        onPress={onPress}
    >
        <View style={styles.iconCircle}>
            <Feather name={icon} size={24} color={theme.icon} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
    </Pressable>
);