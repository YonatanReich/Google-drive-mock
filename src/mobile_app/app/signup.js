import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { styles } from '../styles/signup.styles';
import { useTheme } from '../hooks/useThemeColor';
import { getStyles } from '../styles/signup.styles';
import * as ImagePicker from 'expo-image-picker';

export default function Signup() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const [form, setForm] = useState({
        userFirstName: '',
        userLastName: '',
        username: '',
        userEmail: '',
        userPassword: '',
        userDateOfBirth: '',
        userPhoneNumber: '',
        userImage: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleSignup = async () => {
        const hasErrors = Object.values(errors).some(error => error !== '');
        if (!form.username || !form.userPassword || !form.userEmail || !form.userDateOfBirth) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }
        if (hasErrors) {
            Alert.alert("Error", "Please fix errors before submitting");
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.status === 201) {
                await AsyncStorage.setItem('token', data.token);
                router.replace('/home');
            } else {
                Alert.alert("Error", data.message || "Signup failed");
            }
        } catch (error) {
            Alert.alert("Error", "Network error. Check your connection.");
        }
    };
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Denied", "We need access to your gallery to set a profile picture.");
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
            setImage(result.assets[0].uri);
            setForm({ ...form, userImage: `data:image/jpeg;base64,${result.assets[0].base64}` });
        }
    };

    const validate = (name, value) => {
        let error = '';
        switch (name) {
            case 'username':
                if (value.length > 0 && value.length <= 5) error = 'Username must be at least 6 characters';
                break;
            case 'userEmail':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value.length > 0 && !emailRegex.test(value)) error = 'Enter a valid email (e.g., name@mail.com)';
                break;
            case 'userPassword':
                const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
                if (value.length > 0 && !passRegex.test(value)) error = 'At least 8 digits, including letters and numbers';
                break;
            case 'confirmPassword':
                if (value.length > 0 && value !== form.userPassword) error = 'Passwords do not match';
                break;
            case 'userPhoneNumber':
                if (value.length > 0 && value.length < 8) error = 'Phone number must be at least 8 digits';
                break;
            default:
                break;
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
        validate(name, value);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: theme.background }}
        >
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.title}>Create your Account</Text>
                <Text style={styles.subtitle}>Enter your details to get started</Text>

                {/* Profile Picture Picker */}
                <TouchableOpacity style={styles.imagePickerContainer} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.profilePreview} />
                    ) : (
                        <View style={styles.column}>
                            <Text style={styles.placeholderText}>Add Photo</Text>
                            <Feather style={styles.cameraIcon} name="camera" size={30} color="#5f6368" />
                        </View>
                    )}
                </TouchableOpacity>

                {/* Name Row */}
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="First Name"
                        placeholderTextColor="#5f6368"
                        onChangeText={(val) => handleChange('userFirstName', val)}
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="Last Name"
                        placeholderTextColor="#5f6368"
                        onChangeText={(val) => handleChange('userLastName', val)}
                    />
                </View>

                {/* Username */}
                <TextInput
                    style={[styles.input, errors.username ? styles.inputError : null]}
                    placeholder="Username"
                    placeholderTextColor="#5f6368"
                    autoCapitalize="none"
                    onChangeText={(val) => handleChange('username', val)}
                />
                {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

                {/* Email */}
                <TextInput
                    style={[styles.input, errors.userEmail ? styles.inputError : null]}
                    placeholder="Email"
                    placeholderTextColor="#5f6368"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(val) => handleChange('userEmail', val)}
                />
                {errors.userEmail ? <Text style={styles.errorText}>{errors.userEmail}</Text> : null}

                {/* Password */}
                <View style={[styles.passwordContainer, errors.userPassword ? styles.inputError : null]}>
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#5f6368"
                        secureTextEntry={!showPassword}
                        onChangeText={(val) => handleChange('userPassword', val)}
                        style={styles.inputNoBorder}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#5f6368" />
                    </TouchableOpacity>
                </View>
                {errors.userPassword ? <Text style={styles.errorText}>{errors.userPassword}</Text> : null}

                {/* Confirm Password */}
                <View style={[styles.passwordContainer, errors.confirmPassword ? styles.inputError : null]}>
                    <TextInput
                        placeholder="Confirm Password"
                        placeholderTextColor="#5f6368"
                        secureTextEntry={!showPassword}
                        onChangeText={(val) => {
                            setConfirmPassword(val);
                            validate('confirmPassword', val);
                        }}
                        style={styles.inputNoBorder}
                    />
                </View>
                {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

                {/* Birth Date */}
                <TextInput
                    style={styles.input}
                    placeholder="Birth Date (YYYY-MM-DD)"
                    placeholderTextColor="#5f6368"
                    onChangeText={(val) => handleChange('userDateOfBirth', val)}
                />

                {/* Phone Number */}
                <TextInput
                    style={[styles.input, errors.userPhoneNumber ? styles.inputError : null]}
                    placeholder="Phone Number"
                    placeholderTextColor="#5f6368"
                    keyboardType="phone-pad"
                    onChangeText={(val) => handleChange('userPhoneNumber', val)}
                />
                {errors.userPhoneNumber ? <Text style={styles.errorText}>{errors.userPhoneNumber}</Text> : null}

                <View style={styles.footerRow}>
                    <Link href="/login" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Sign in instead</Text>
                        </TouchableOpacity>
                    </Link>

                    <TouchableOpacity style={styles.button} onPress={handleSignup}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}