import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather, Entypo } from '@expo/vector-icons';
import { apiRequest } from '../services/api';
import { useTheme } from '../hooks/useThemeColor';
import { getStyles } from '../styles/folderView.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import FileList from '../components/FileList';
import FileActionsMenu from '../components/FileActionsMenu';


export default function UploadsScreen() {
    const theme = useTheme();
    const router = useRouter();
    const styles = getStyles(theme);
    const [uploads, setUploads] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [actionMenuVisible, setActionMenuVisible] = useState(false);

    useEffect(() => {
        fetchUploads();
    }, []);

    const fetchUploads = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const result = await apiRequest('/api/files', 'GET', null, token);
            console.log(result);
            if (result.success) {
                const onlyUploads = result.data.filter(f => {
                    if (f.origin) {
                        return f.origin === 'upload' || f.origin === 'scan';
                    }
                    return f.isFolder === false;
                });
                setFiles(onlyUploads);
            }
        } catch (error) {
            console.error("Fetch error:", error);
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
    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerTitle: "My Uploads",
                headerShown: true,
                headerShadowVisible: false,
                headerStyle: { backgroundColor: theme.background },
                headerTintColor: theme.text,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                        <Feather name="arrow-left" size={24} color={theme.icon} />
                    </TouchableOpacity>
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
                        console.log("Pressed file:", item.name);
                    }}
                    onMenuPress={(file) => {
                        setSelectedFile(file);
                        setActionMenuVisible(true);
                    }}
                    onRefresh={fetchUploads}
                    refreshing={loading}
                />
            )}

            <FileActionsMenu
                isVisible={actionMenuVisible}
                onClose={() => setActionMenuVisible(false)}
                fileName={selectedFile?.name}
                onRemove={handleRemoveFile}
                isStarred={selectedFile?.isStarred}
                onToggleStar={handleToggleStar}
            />
        </View>
    );
}
