import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert,
    Keyboard,
    TouchableWithoutFeedback
    , Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { apiRequest } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../hooks/useThemeColor';
import { getStyles } from '../styles/settings.styles';
import * as ImagePicker from 'expo-image-picker';

export default function SettingsScreen() {
    const router = useRouter();
    const theme = useTheme();
    const styles = getStyles(theme);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '', // View only
        phoneNumber: '',
        image: null
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const token = await AsyncStorage.getItem('token');
        const result = await apiRequest('/api/users/me', 'GET', null, token);
        if (result && result.success && result.data) {
            setFormData({
                firstName: result.data.firstName || '',
                lastName: result.data.lastName || '',
                email: result.data.email || '',
                phoneNumber: result.data.phoneNumber || '',
                image: result.data.userImage || null
            });
        }
        setLoading(false);
    };
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need access to your photos to change your profile picture.');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            width: 500,
            height: 500,
            base64: true,
        });

        if (!result.canceled) {
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setFormData({ ...formData, image: base64Image });
        }
    };
    const handleSave = async () => {
        setSaving(true);
        const token = await AsyncStorage.getItem('token');
        const result = await apiRequest('/api/users/update', 'PATCH', {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            userImage: formData.image
        }, token);

        setSaving(false);
        if (result) {
            Alert.alert("Success", "Settings updated!");
            router.back();
        }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.form}>
                    <View style={styles.profileSection}>
                        <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
                            <Image
                                source={formData.image ? { uri: formData.image } : require('../assets/profile.jpg')}
                                style={styles.largeProfilePic}
                            />
                            <View style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: theme.tint,
                                padding: 8,
                                borderRadius: 20
                            }}>
                                <Feather name="camera" size={16} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.firstName}
                            placeholderTextColor={theme.dark ? '#5f6368' : '#9aa0a6'}
                            onChangeText={(t) => setFormData({ ...formData, firstName: t })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.lastName}
                            placeholderTextColor={theme.dark ? '#5f6368' : '#9aa0a6'}
                            onChangeText={(t) => setFormData({ ...formData, lastName: t })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.phoneNumber}
                            placeholder="Enter phone number"
                            placeholderTextColor={theme.disabledText}
                            keyboardType="phone-pad"
                            onChangeText={(t) => setFormData({ ...formData, phoneNumber: t })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={formData.email}
                            editable={false}
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}