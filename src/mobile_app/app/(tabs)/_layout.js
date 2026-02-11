import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Tabs, useFocusEffect } from 'expo-router';
import { getStyles } from '../../styles/tabs._layout.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { apiRequest } from '../../services/api';
import { useTheme } from '../../hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { EditorContext } from '../../context/EditorContext';
//components:
import CreateMenu from '../../components/CreateMenu';
import TopBar from '../../components/TopBar';
import SideMenu from '../../components/SideMenu';
import ProfileMenu from '../../components/ProfileMenu';
import CreateFileDialog from '../../components/CreateFileDialog';


export default function TabsLayout() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState(''); //for search, implement later
    const [refreshTrigger, setRefreshTrigger] = useState(null);
    //for menu visibilities:
    const [menuVisible, setMenuVisible] = useState(false);
    const [sideMenuVisible, setSideMenuVisible] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);
    const [fileDialogVisible, setFileDialogVisible] = useState(false);
    const [dialogMode, setDialogMode] = useState('file');
    const [userImage, setUserImage] = useState(null);
    const [editingFile, setEditingFile] = useState(null);

    //File editing
    const openFileEditor = async (file) => {
        const extension = file.name?.split('.').pop().toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'ico', 'gif'];
        const isImage = imageExtensions.includes(extension);

        if (file.origin !== 'manual' && !isImage) {
            Alert.alert(
                "Unsupported File",
                `Cannot display file of type: .${extension || 'unknown'}`,
                [{ text: "OK" }]
            );
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await apiRequest(`/api/files/${file.id || file._id}`, 'GET', null, token);
            const actualFileData = response.data?.data;

            if (response.success && actualFileData) {
                setEditingFile(actualFileData);

                if (file.origin === 'manual') {
                    setDialogMode('file'); // Normal text editing
                } else {
                    setDialogMode('viewer');
                }
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
                if (refreshTrigger) refreshTrigger();
                fetchFiles();
            } else {
                Alert.alert("Update Failed", result.error || "Could not save changes");
            }
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setLoading(false);
        }
    };

    //File upload:
    const handleFileUploadLaunch = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const file = result.assets[0];

                setLoading(true);

                const response = await fetch(file.uri);
                const blob = await response.blob();
                const base64Content = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });

                const uploadResult = await apiRequest('/api/files', 'POST', {
                    name: file.name,
                    content: base64Content,
                    isFolder: false,
                    parentID: null,
                    origin: 'upload'
                });

                if (uploadResult.success) {
                    Alert.alert("Success", `Uploaded: ${file.name}`);
                    if (refreshTrigger) refreshTrigger();
                    fetchFiles();
                } else {
                    Alert.alert("Upload Error", uploadResult.error);
                }
            }
        } catch (error) {
            console.error("Upload process error:", error);
            Alert.alert("Error", "An error occurred during upload.");
        } finally {
            setLoading(false);
        }
    };

    //Scan functionality:
    const handleCameraLaunch = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Denied", "We need camera access to take photos.");
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeImages,
            allowsEditing: true,
            quality: 0.7,
            base64: true,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0]);
        }
    };

    const uploadImage = async (asset) => {
        try {
            const fileName = `Scan_${Date.now()}.jpg`;

            const result = await apiRequest('/api/files', 'POST', {
                name: fileName,
                content: `data:image/jpeg;base64,${asset.base64}`,
                isFolder: false,
                parentID: null,
                origin: 'scan'
            });

            if (result.success) {
                Alert.alert("Success", "Photo uploaded!");
                if (refreshTrigger) refreshTrigger();
                fetchFiles();
            } else {
                Alert.alert("Upload Failed", result.error || "Server rejected the file");
            }
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Upload Failed", "Could not connect to the server.");
        }
    };

    const fetchUser = async () => {
        const token = await AsyncStorage.getItem('token');
        const res = await apiRequest('/api/users/me', 'GET', null, token);
        if (res?.success && res.data) {
            setUserImage(res.data.userImage || res.data.data?.userImage);
        }
    };
    useEffect(() => {
        fetchUser();
        fetchFiles();
    }, []);
    useFocusEffect(
        useCallback(() => {
            fetchUser();
            fetchFiles();
        }, [])
    );

    const fetchFiles = async () => {
        setLoading(true);
        const result = await apiRequest('/api/files');
        if (result.success) setFiles(result.data);
        setLoading(false);
    };
    //File creation
    const handleCreateSubmit = async (name, content, isFolder) => {
        const result = await apiRequest('/api/files', 'POST', {
            name,
            content: isFolder ? undefined : content,
            isFolder: isFolder
        });

        if (result.success) {
            setFileDialogVisible(false);
            if (refreshTrigger) refreshTrigger();
            fetchFiles();
        } else {
            Alert.alert("Error", result.error);
        }
    };

    //Folder rename
    const openFolderRenamer = (folder) => {
        setEditingFile(folder);
        setDialogMode('folder');
        setFileDialogVisible(true);
    };


    return (
        <EditorContext.Provider value={{ openFileEditor, openFolderRenamer, setOnRefresh: setRefreshTrigger }}>
            <View style={styles.wrapper}>
                <SafeAreaView edges={['top']} style={styles.safeArea} />

                <TopBar
                    profileImage={userImage}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    onMenuPress={() => setSideMenuVisible(true)}
                    onProfilePress={() => setProfileVisible(true)}
                />

                <Tabs screenOptions={{
                    headerShown: false,
                    tabBarStyle: styles.tabBar,
                    tabBarActiveTintColor: theme.tint,
                    tabBarInactiveTintColor: theme.icon,
                }}>
                    <Tabs.Screen
                        name="home"
                        options={{
                            tabBarLabel: 'Home',
                            tabBarIcon: ({ color }) => (
                                <Feather name="home" size={22} color={color} />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="starred"
                        options={{
                            tabBarLabel: 'Starred',
                            tabBarIcon: ({ color }) => (
                                <Feather name="star" size={22} color={color} />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="shared"
                        options={{
                            tabBarLabel: 'Shared',
                            tabBarIcon: ({ color }) => (
                                <Feather name="users" size={22} color={color} />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="files"
                        options={{
                            tabBarLabel: 'My Files',
                            tabBarIcon: ({ color }) => (
                                <Feather name="folder" size={22} color={color} />
                            ),
                        }}
                    />
                </Tabs>

                {/* Plus Button */}
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setMenuVisible(true)}
                >
                    {/* Drive icon often has the 4-color plus, but solid theme color looks pro too */}
                    <Feather name="plus" size={32} color={theme.tint} />
                </TouchableOpacity>
                {/* Plus Button menu */}
                <CreateMenu
                    isVisible={menuVisible}
                    onClose={() => setMenuVisible(false)}
                    onOpenFileCreate={() => {
                        setDialogMode('file');
                        setMenuVisible(false);
                        setFileDialogVisible(true);
                    }}
                    onOpenFolderCreate={() => {
                        setDialogMode('folder');
                        setMenuVisible(false);
                        setFileDialogVisible(true);
                    }}
                    onCameraPress={handleCameraLaunch}
                    onUploadPress={handleFileUploadLaunch}
                />
                {/* Side Menu (Left) */}
                <SideMenu isVisible={sideMenuVisible} onClose={() => setSideMenuVisible(false)} />
                {/*Profile Menu */}
                <ProfileMenu isVisible={profileVisible} onClose={() => setProfileVisible(false)} profileImage={userImage} />

                <CreateFileDialog
                    isVisible={fileDialogVisible}
                    mode={dialogMode}
                    onClose={() => {
                        setFileDialogVisible(false);
                        setEditingFile(null);
                    }}
                    onCreate={editingFile ? handleUpdateSubmit : handleCreateSubmit}
                    initialData={editingFile}
                />
            </View >
        </EditorContext.Provider>
    );
}
