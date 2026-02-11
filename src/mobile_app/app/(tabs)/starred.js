import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import FileList from '../../components/FileList';
import FileActionsMenu from '../../components/FileActionsMenu';
import { apiRequest } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useFileEditor } from '../../context/EditorContext';
import DetailsModal from '../../components/DetailsModal';
import { useTheme } from '../../hooks/useThemeColor';
import ShareModal from '../../components/ShareModal';
import { getStyles } from '../../styles/tabs._layout.styles';

export default function StarredScreen() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { openFileEditor, setOnRefresh } = useFileEditor();
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [shareModalVisible, setShareModalVisible] = useState(false);

    const handleShareFile = async (targetUsername, access) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userData = await apiRequest(`/api/users/by-username/${targetUsername}`, 'GET', null, token);
            const userFound = userData?.data;
            if (!userFound || !userFound.id) {
                Alert.alert("Error", "User not found");
                return;
            }

            const shareResult = await apiRequest(`/api/files/${selectedFile.id}/permissions`, 'POST',
                { targetUsername, access },
                token
            );
            console.log(selectedFile.id);
            console.log(shareResult);
            if (shareResult) {
                Alert.alert("Success", `Shared with ${targetUsername}`);
                setShareModalVisible(false);
            }
        } catch (error) {
            console.error("Share Sequence Error:", error);
            Alert.alert("Network Error", "Could not connect to server. Check your config file.");
        }
    };
    const handleToggleStar = async () => {
        if (!selectedFile) return;

        const newState = !selectedFile.isStarred;
        const result = await apiRequest(
            `/api/files/${selectedFile.id}`,
            'PATCH',
            { isStarred: newState },
            token
        );

        if (result) {
            fetchFolderContent();
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

            const result = await apiRequest('/api/files/starred', 'GET', null, token);

            if (result.success) {
                setFiles(result.data);
            } else {
                Alert.alert("Error", result.error);
            }
        } catch (error) {
            console.error(error);
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
        return () => setOnRefresh(null);
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
                                pathname: `../folder/${item.id}`,
                                params: { name: item.name }
                            });
                        } else {
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

            <ShareModal
                isVisible={shareModalVisible}
                onClose={() => setShareModalVisible(false)}
                onShare={handleShareFile}
            />
        </View>
    );
}