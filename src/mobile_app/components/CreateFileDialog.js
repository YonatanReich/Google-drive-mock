import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Image
} from 'react-native';
import { useTheme } from '../hooks/useThemeColor';
import { getStyles } from '../styles/createFileDialog.styles';

export default function CreateFileDialog({ isVisible, onClose, onCreate, mode = 'file', initialData }) {
    const theme = useTheme();
    const styles = getStyles(theme);

    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setName(initialData?.name || '');
            setContent(initialData?.content || '');
        }
    }, [isVisible, initialData]);

    const handleSubmit = () => {
        onCreate(name, content, mode === 'folder');
    };

    const handleCreate = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            await onCreate(name, content, mode === 'folder');
        } finally {
            setLoading(false);
            onClose();
        }
    };
    const getTitle = () => {
        if (mode === 'viewer') return 'File Viewer';
        if (mode === 'folder') return initialData ? 'Rename Folder' : 'Create New Folder';
        return initialData ? 'Edit File' : 'Create New File';
    };
    return (
        <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ width: '100%', alignItems: 'center' }}
                    >
                        <TouchableWithoutFeedback>
                            <View style={[styles.alertBox, mode === 'viewer' && { maxHeight: '80%' }]}>
                                <Text style={styles.title}>{getTitle()}</Text>

                                {mode === 'viewer' ? (
                                    /* --- IMAGE VIEWER MODE --- */
                                    <View style={{ width: '100%' }}>
                                        <Text style={[styles.input, { borderBottomWidth: 0, marginBottom: 5, textAlign: 'center' }]}>
                                            {name}
                                        </Text>
                                        <View style={styles.viewerContainer}>
                                            <Image
                                                source={{ uri: content }}
                                                style={styles.fullImage}
                                                resizeMode="contain"
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    /* --- EDITOR MODE (File/Folder) --- */
                                    <>
                                        <TextInput
                                            style={styles.input}
                                            placeholder={mode === 'folder' ? "Untitled folder" : "Untitled file"}
                                            placeholderTextColor={theme.icon + '80'}
                                            value={name}
                                            onChangeText={setName}
                                            autoFocus={!initialData}
                                            selectionColor={theme.tint}
                                        />

                                        {mode === 'file' && (
                                            <TextInput
                                                style={[styles.input, styles.contentInput]}
                                                placeholder="Add content here..."
                                                placeholderTextColor={theme.icon + '80'}
                                                value={content}
                                                onChangeText={setContent}
                                                multiline
                                                selectionColor={theme.tint}
                                            />
                                        )}
                                    </>
                                )}

                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        onPress={onClose}
                                        style={styles.button}
                                        disabled={loading}
                                    >
                                        <Text style={styles.cancelText}>
                                            {mode === 'viewer' ? 'Close' : 'Cancel'}
                                        </Text>
                                    </TouchableOpacity>

                                    {mode !== 'viewer' && (
                                        <TouchableOpacity
                                            onPress={handleCreate}
                                            style={styles.button}
                                            disabled={loading || !name.trim()}
                                        >
                                            {loading ? (
                                                <ActivityIndicator size="small" color={theme.tint} />
                                            ) : (
                                                <Text style={[styles.createText, !name.trim() && { opacity: 0.4 }]}>
                                                    {initialData ? 'Save' : 'Create'}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}