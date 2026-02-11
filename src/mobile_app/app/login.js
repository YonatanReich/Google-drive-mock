import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useThemeColor';
import { getStyles } from '../styles/login.styles';

export default function Login() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please enter both username and password");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/tokens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.status === 201) {
                await AsyncStorage.setItem('token', data.token);
                router.replace('/home');
            } else {
                Alert.alert("Error", data.message || "Invalid credentials");
            }
        } catch (error) {
            Alert.alert("Network Error", "Could not connect to server.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/favicon.png')}
                    style={styles.logoImage}
                />
            </View>

            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.subtitle}>Use your Account</Text>

            <TextInput
                placeholder="Username"
                placeholderTextColor="#5f6368"
                onChangeText={setUsername}
                autoCapitalize="none"
                style={styles.input}
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#5f6368"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    // ONLY use inputNoBorder here, NOT styles.input
                    style={styles.inputNoBorder}
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                    <Feather
                        name={showPassword ? "eye" : "eye-off"}
                        size={20}
                        color="#5f6368"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.footerRow}>
                <Link href="/signup" asChild>
                    <TouchableOpacity>
                        <Text style={styles.createAccountText}>Create account</Text>
                    </TouchableOpacity>
                </Link>

                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.loginButton}
                >
                    <Text style={styles.loginButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}