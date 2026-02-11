import React, { useState, useEffect } from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router'; // Added useRouter for better navigation
import FileList from '../components/FileList';
import FileActionsMenu from '../components/FileActionsMenu';
import { apiRequest } from '../services/api';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../hooks/useThemeColor';
import DetailsModal from '../components/DetailsModal';
import { getStyles } from '../styles/fileActionsMenu.styles';

export default function TrashScreen() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [detailsVisible, setDetailsVisible] = useState(false);


    const router = useRouter();

    useEffect(() => { fetchTrash(); }, []);

    const fetchTrash = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const result = await apiRequest('/api/files?inTrash=true', 'GET', null, token);

            if (result && result.success && Array.isArray(result.data)) {
                setFiles(result.data);
            } else if (Array.isArray(result)) {
                setFiles(result);
            }
        } catch (error) {
            console.error("Fetch trash error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleHardDelete = async () => {
        Alert.alert("Delete Permanently?", "This action cannot be undone.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive", onPress: async () => {
                    const token = await AsyncStorage.getItem('token');
                    await apiRequest(`/api/files/${selectedFile.id}`, 'DELETE', null, token);
                    setMenuVisible(false);
                    fetchTrash();
                }
            }
        ]);
    };

    const handleRestore = async () => {
        if (!selectedFile) return;
        try {
            const token = await AsyncStorage.getItem('token');
            const result = await apiRequest(`/api/files/${selectedFile.id}/restore`, 'POST', null, token);
            if (result) {
                setMenuVisible(false);
                fetchTrash();
            }
        } catch (error) {
            console.error("Restore failed:", error);
        }
    };

    const handleEmptyTrash = async () => {
        if (files.length === 0) return; // Don't prompt if already empty

        Alert.alert(
            "Empty Trash?",
            "All items in the trash will be permanently deleted.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Empty Trash",
                    style: "destructive",
                    onPress: async () => {
                        const token = await AsyncStorage.getItem('token');
                        const result = await apiRequest('/api/files/trash/empty', 'DELETE', null, token);
                        if (result) fetchTrash();
                    }
                }
            ]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{
                title: 'Trash',
                headerShown: true,
                headerShadowVisible: false,
                headerStyle: { backgroundColor: theme.background },
                headerTintColor: theme.text, // Sets the title color
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ padding: 8, marginLeft: 5 }}
                    >
                        <Feather name="arrow-left" size={24} color={theme.icon} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity
                        onPress={handleEmptyTrash}
                        style={{ padding: 8, marginRight: 5 }}
                        disabled={files.length === 0}
                    >
                        <Feather
                            name="trash-2"
                            size={22}
                            color={files.length === 0 ? theme.icon + '44' : theme.icon}
                        />
                    </TouchableOpacity>
                ),
            }} />

            <FileList
                data={files}
                onMenuPress={(file) => { setSelectedFile(file); setMenuVisible(true); }}
                onRefresh={fetchTrash}
                refreshing={loading}
            />

            <FileActionsMenu
                isVisible={menuVisible}
                onClose={() => setMenuVisible(false)}
                fileName={selectedFile?.name}
                inTrash={true}
                onDelete={handleHardDelete}
                onRestore={handleRestore}
                onDetailsPress={() => setDetailsVisible(true)}
            />

            <DetailsModal
                isVisible={detailsVisible}
                onClose={() => setDetailsVisible(false)}
                fileId={selectedFile?.id || selectedFile?._id}
                theme={theme}
            />
        </View>
    );
}