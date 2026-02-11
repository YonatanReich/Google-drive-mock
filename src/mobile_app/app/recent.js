import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { apiRequest } from '../services/api';
import { useTheme } from '../hooks/useThemeColor';
import { getStyles } from '../styles/folderView.styles';
import FileList from '../components/FileList';
import CreateFileDialog from '../components/CreateFileDialog';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecentScreen() {
    const theme = useTheme();
    const router = useRouter();
    const styles = getStyles(theme);

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingFile, setEditingFile] = useState(null);
    const [fileDialogVisible, setFileDialogVisible] = useState(false);
    const [dialogMode, setDialogMode] = useState('file');

    const fetchRecents = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await apiRequest('/api/files', 'GET', null, token);

            if (response.success) {
                const allFiles = response.data?.data || response.data || [];

                const recentFiles = [...allFiles]
                    .sort((a, b) => {
                        const dateA = new Date(a.updatedAt || a.createdAt || 0);
                        const dateB = new Date(b.updatedAt || b.createdAt || 0);
                        return dateB - dateA;
                    })
                    .slice(0, 10);

                setFiles(recentFiles);
            }
        } catch (error) {
            console.error("Fetch recent error:", error);
            Alert.alert("Error", "Could not load recent files");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecents();
    }, []);

    const openFileEditor = async (file) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await apiRequest(`/api/files/${file.id || file._id}`, 'GET', null, token);
            const actualFileData = response.data?.data || response.data;

            if (response.success && actualFileData) {
                setEditingFile(actualFileData);
                setDialogMode('file');
                setFileDialogVisible(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSubmit = async (name, content, isFolder) => {
        if (!editingFile) return;
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const result = await apiRequest(`/api/files/${editingFile.id || editingFile._id}`, 'PATCH', {
                name,
                content: isFolder ? undefined : content,
                isFolder
            }, token);

            if (result.success) {
                setFileDialogVisible(false);
                setEditingFile(null);
                fetchRecents();
            }
        } catch (error) {
            Alert.alert("Error", "Failed to update file");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerTitle: "Recent",
                headerStyle: {
                    backgroundColor: theme.background,
                },
                headerTitleStyle: {
                    color: theme.text,
                },
                headerShown: true,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                        <Feather name="arrow-left" size={24} color={theme.icon} />
                    </TouchableOpacity>
                ),
            }} />

            {loading && files.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.tint} />
                </View>
            ) : (
                <FileList
                    data={files}
                    onRefresh={fetchRecents}
                    onFilePress={(item) => {
                        if (item.isFolder) {
                            router.push({
                                pathname: `/folder/${item.id || item._id}`,
                                params: { name: item.name }
                            });
                        } else {
                            openFileEditor(item);
                        }
                    }}
                />
            )}

            <CreateFileDialog
                isVisible={fileDialogVisible}
                initialData={editingFile}
                mode={dialogMode}
                onClose={() => setFileDialogVisible(false)}
                onSubmit={handleUpdateSubmit}
            />
        </View>
    );
}