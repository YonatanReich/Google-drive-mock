import React from 'react';
import { View, Text, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useThemeColor';
import { getStyles } from '../styles/sideMenu.styles';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function SideMenu({ isVisible, onClose }) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const router = useRouter();

    const navigation = useNavigation();

    const handleNavigation = (path) => {
        onClose();
        if (path) {
            router.push(path);
        }
    };

    const handleSettingsPress = () => {
        onClose();
        router.push('/settings');
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    {/* Stop propagation so clicking drawer doesn't close it */}
                    <TouchableWithoutFeedback>
                        <View style={styles.drawer}>
                            <View style={styles.logoContainer}>
                                <Text style={styles.logoText}>Drive</Text>
                            </View>

                            <DrawerItem
                                icon="clock"
                                label="Recent"
                                theme={theme}
                                styles={styles}
                                onPress={() => handleNavigation('/recent')}
                            />
                            <DrawerItem
                                icon="upload-cloud"
                                label="Uploads"
                                theme={theme}
                                styles={styles}
                                onPress={() => handleNavigation('/uploads')}
                            />
                            <DrawerItem
                                icon="trash-2"
                                label="Trash"
                                theme={theme}
                                styles={styles}
                                onPress={() => handleNavigation('/trash')}
                            />

                            <View style={styles.divider} />
                            <DrawerItem
                                icon="settings"
                                label="Settings"
                                theme={theme}
                                styles={styles}
                                onPress={() => {
                                    handleSettingsPress()
                                }}
                            />
                            <DrawerItem
                                icon="help-circle"
                                label="Help & About"
                                theme={theme}
                                styles={styles}
                                onPress={() => handleNavigation('/help')}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const DrawerItem = ({ icon, label, onPress, theme, styles }) => (
    <Pressable
        style={({ pressed }) => [
            styles.menuItem,
            {
                backgroundColor: pressed
                    ? (theme.surface)
                    : 'transparent'
            }
        ]}
        onPress={onPress}
    >
        <Feather name={icon} size={20} color={theme.icon} />
        <Text style={styles.menuText}>{label}</Text>
    </Pressable>
);