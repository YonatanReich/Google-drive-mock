import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Feather, Entypo } from '@expo/vector-icons';
import FileList from '../../components/FileList';
import FileActionsMenu from '../../components/FileActionsMenu';
import { apiRequest } from '../../services/api';
import { getStyles } from '../../styles/folderView.styles'; // Use dynamic styles
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateMenu from '../../components/CreateMenu';
import CreateFileDialog from '../../components/CreateFileDialog';
import { useTheme } from '../../hooks/useThemeColor';

export default function FolderView() {
    const { id, name } = useLocalSearchParams();
    const router = useRouter();
    const theme = useTheme();
    const styles = getStyles(theme);

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createMenuVisible, setCreateMenuVisible] = useState(false);
    const [actionMenuVisible, setActionMenuVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileDialogVisible, setFileDialogVisible] = useState(false);
    const [dialogMode, setDialogMode] = useState('file');

    const fetchFolderContent = async () => {
        if (!id || id === 'undefined') return;
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const result = await apiRequest(`/api/files?parentId=${id}`, 'GET', null, token);

            if (result.success) {
                setFiles(result.data || []);
            } else {
                Alert.alert("Error", result.error || "Failed to load content");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFolderContent();
    }, [id]);

    const handleRemoveFile = async () => {
        if (!selectedFile) return;
        try {
            const token = await AsyncStorage.getItem('token');
            const result = await apiRequest(`/api/files/${selectedFile.id}`, 'DELETE', null, token);
            if (result) {
                setActionMenuVisible(false);
                fetchFolderContent();
            }
        } catch (error) {
            Alert.alert("Error", "Could not remove file");
        }
    };

    const handleToggleStar = async () => {
        if (!selectedFile) return;
        const token = await AsyncStorage.getItem('token');
        const newState = !selectedFile.isStarred;

        const result = await apiRequest(
            `/api/files/${selectedFile.id}`,
            'PATCH',
            { isStarred: newState },
            token
        );

        if (result) {
            fetchFolderContent();
            setActionMenuVisible(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerTitle: name || "Folder",
                headerShown: true,
                headerShadowVisible: false,
                headerStyle: { backgroundColor: theme.background },
                headerTintColor: theme.text,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                        <Feather name="arrow-left" size={24} color={theme.icon} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.iconButton}>
                            <Feather name="search" size={22} color={theme.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Entypo name="dots-three-vertical" size={20} color={theme.icon} />
                        </TouchableOpacity>
                    </View>
                ),
            }} />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.tint} />
                </View>
            ) : (
                <FileList
                    data={files}
                    onFilePress={(item) => {
                        if (item.isFolder) {
                            router.push({ pathname: `/folder/${item._id}`, params: { name: item.name } });
                        }
                    }}
                    onMenuPress={(file) => {
                        setSelectedFile(file);
                        setActionMenuVisible(true);
                    }}
                    onRefresh={fetchFolderContent}
                    refreshing={loading}
                />
            )}

            {/* FAB (Floating Action Button) */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setCreateMenuVisible(true)}
                activeOpacity={0.8}
            >
                <Feather name="plus" size={28} color={theme.tint} />
            </TouchableOpacity>

            <CreateMenu
                isVisible={createMenuVisible}
                onClose={() => setCreateMenuVisible(false)}
                onOpenFileCreate={() => {
                    setDialogMode('file');
                    setCreateMenuVisible(false);
                    setFileDialogVisible(true);
                }}
                onOpenFolderCreate={() => {
                    setDialogMode('folder');
                    setCreateMenuVisible(false);
                    setFileDialogVisible(true);
                }}
            />

            <FileActionsMenu
                isVisible={actionMenuVisible}
                onClose={() => setActionMenuVisible(false)}
                fileName={selectedFile?.name}
                onRemove={handleRemoveFile}
                isStarred={selectedFile?.isStarred}
                onToggleStar={handleToggleStar}
            />

            <CreateFileDialog
                isVisible={fileDialogVisible}
                mode={dialogMode}
                onClose={() => setFileDialogVisible(false)}
                onCreate={async (name, content, isFolder) => {
                    const token = await AsyncStorage.getItem('token');
                    const body = { name, isFolder, parentID: id, content };
                    const result = await apiRequest('/api/files', 'POST', body, token);
                    if (result.success) {
                        fetchFolderContent();
                        setFileDialogVisible(false);
                    } else {
                        Alert.alert("Error", result.error);
                    }
                }}
            />
        </View>
    );
}