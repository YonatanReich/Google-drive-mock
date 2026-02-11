import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { getStyles } from '../styles/shareModal.styles';
import { useTheme } from '../hooks/useThemeColor';

export default function ShareModal({ isVisible, onClose, onShare }) {
    const [username, setUsername] = useState('');
    const [access, setAccess] = useState('viewer');
    const theme = useTheme();
    const styles = getStyles(theme);
    const handleShare = () => {
        if (!username.trim()) return;
        onShare(username, access);
        setUsername('');
    };

    return (
        <Modal visible={isVisible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Share File</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <View style={styles.accessRow}>
                        <TouchableOpacity
                            onPress={() => setAccess('viewer')}
                            style={[styles.btn, access === 'viewer' && styles.activeBtn]}
                        >
                            <Text>Viewer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setAccess('editor')}
                            style={[styles.btn, access === 'editor' && styles.activeBtn]}
                        >
                            <Text>Editor</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={onClose}><Text>Cancel</Text></TouchableOpacity>
                        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
                            <Text style={{ color: 'white' }}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}