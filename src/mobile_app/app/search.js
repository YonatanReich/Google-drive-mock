import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { apiRequest } from '../services/api';
import { useTheme } from '../hooks/useThemeColor';
import { getStyles } from '../styles/folderView.styles';
import FileList from '../components/FileList';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateFileDialog from '../components/CreateFileDialog';

export default function SearchScreen() {
    const { q } = useLocalSearchParams();
    const theme = useTheme();
    const router = useRouter();
    const styles = getStyles(theme);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingFile, setEditingFile] = useState(null);
    const [fileDialogVisible, setFileDialogVisible] = useState(false);
    const [dialogMode, setDialogMode] = useState('file');


    const openFileEditor = async (file) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await apiRequest(`/api/files/${file.id || file._id}`, 'GET', null, token);
            console.log(response);
            const actualFileData = response.data?.data;

            if (response.success && actualFileData) {
                setEditingFile(actualFileData);
                setDialogMode('file');
                setFileDialogVisible(true);
            } else {
                Alert.alert("Error", "Could not load file content");
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
            const fileId = editingFile.id || editingFile._id;
            const result = await apiRequest(`/api/files/${fileId}`, 'PATCH', {
                name,
                content: isFolder ? undefined : content,
                isFolder: isFolder,
                origin: editingFile.origin
            });

            if (result.success) {
                setFileDialogVisible(false);
                setEditingFile(null);
                performSearch();
            } else {
                Alert.alert("Update Failed", result.error || "Could not save changes");
            }
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setLoading(false);
        }
    };
    const performSearch = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const response = await apiRequest(`/api/search/${encodeURIComponent(q)}`, 'GET', null, token);
        console.log(response);
        if (response.success) {
            setResults(response.data?.data || []);
        }
        setLoading(false);
    };
    useEffect(() => {
        performSearch();
    }, [q]);
    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerTitle: `Search: ${q}`, headerShown: true, headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                        <Feather name="arrow-left" size={24} color={theme.icon} />
                    </TouchableOpacity>
                ),
            }} />

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color={theme.tint} /></View>
            ) : (
                <FileList
                    data={results}
                    onRefresh={() => { }}
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
                mode={dialogMode}
                onClose={() => {
                    setFileDialogVisible(false);
                    setEditingFile(null);
                }}
                onCreate={handleUpdateSubmit}
                initialData={editingFile}
            />
        </View>
    );
}