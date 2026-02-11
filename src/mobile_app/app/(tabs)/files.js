import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import FileList from '../../components/FileList';
import FileActionsMenu from '../../components/FileActionsMenu';
import ShareModal from '../../components/ShareModal';
import { apiRequest } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useFileEditor } from '../../context/EditorContext';
import DetailsModal from '../../components/DetailsModal';
import { useTheme } from '../../hooks/useThemeColor';
import { getStyles } from '../../styles/fileActionsMenu.styles';
export default function FilesScreen() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { openFileEditor, setOnRefresh } = useFileEditor();
    const [detailsVisible, setDetailsVisible] = useState(false);
    const handleShareFile = async (targetUsername, access) => {
        const token = await AsyncStorage.getItem('token');
        const result = await apiRequest(
            `/api/files/${selectedFile.id}/permissions`,
            'POST',
            { targetUsername, access },
            token
        );

        if (result) {
            Alert.alert("Success", `Shared with ${targetUsername}`);
            setShareModalVisible(false);
            setMenuVisible(false);
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
            fetchFiles();
            setMenuVisible(false);
        }
    };

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                Alert.alert("Session Expired", "Please login again");
                router.replace('/login');
                return;
            }

            const result = await apiRequest('/api/files/owned', 'GET', null, token);
            if (result && result.success && Array.isArray(result.data)) {
                const mappedFiles = result.data.map(file => ({
                    id: file.id || file._id,
                    name: file.name,
                    isFolder: file.isFolder,
                    ownerId: file.ownerId || file.ownerID,
                    isStarred: file.isStarred || false,
                    permissions: file.permissions
                }));
                setFiles(mappedFiles);
            } else if (result.success === false) {
                Alert.alert("Error", result.message || "Failed to load shared files");
            }
        } catch (error) {
            console.error("Fetch Shared Error:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleRemoveFile = async () => {
        if (!selectedFile) return;
        try {
            const token = await AsyncStorage.getItem('token');
            const result = await apiRequest(`/api/files/${selectedFile.id}`, 'DELETE', null, token);

            if (result) {
                setMenuVisible(false);
                fetchFiles();
            }
        } catch (error) {
            console.error("Remove failed:", error);
            Alert.alert("Error", "Could not move file to trash");
        }
    };
    useFocusEffect(
        useCallback(() => {
            fetchFiles();
        }, [])
    );
    useEffect(() => {
        setOnRefresh(() => fetchFiles);
        return () => setOnRefresh(null); // Cleanup
    }, []);

    const handleMenuOpen = (file) => {
        setSelectedFile(file);
        setMenuVisible(true);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#4285F4" />
                </View>
            ) : (
                <FileList
                    data={files}
                    onFilePress={(item) => {
                        if (item.isFolder) {
                            router.push({
                                pathname: `/folder/${item.id}`
                            });
                        }
                        else {
                            openFileEditor(item);
                        }
                    }}
                    onMenuPress={handleMenuOpen}
                />
            )}

            <FileActionsMenu
                isVisible={menuVisible}
                onClose={() => setMenuVisible(false)}
                fileName={selectedFile?.name}
                onRemove={handleRemoveFile}
                inTrash={false}
                isStarred={selectedFile?.isStarred}
                onToggleStar={handleToggleStar}
                onSharePress={() => {
                    setMenuVisible(false);
                    setTimeout(() => {
                        setShareModalVisible(true);
                    }, 500);
                }}
                onDetailsPress={() => setDetailsVisible(true)}
            />
            <DetailsModal
                isVisible={detailsVisible}
                onClose={() => setDetailsVisible(false)}
                fileId={selectedFile?.id || selectedFile?._id}
                theme={theme}
            />

            {/* THE SHARE MODAL */}
            <ShareModal
                isVisible={shareModalVisible}
                onClose={() => setShareModalVisible(false)}
                onShare={handleShareFile}
            />
        </View>
    );
}