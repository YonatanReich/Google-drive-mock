import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useThemeColor';
import { getStyles } from '../styles/help.styles';

export default function HelpScreen() {
    const theme = useTheme();
    const router = useRouter();
    const styles = getStyles(theme);
    const InfoCard = ({ title, content, icon }) => (
        <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                {icon && <Feather name={icon} size={18} color={theme.tint} style={{ marginRight: 8 }} />}
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <Text style={styles.sectionContent}>{content}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: "Help & Feedback",
                    headerShown: true,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                            <Feather name="arrow-left" size={24} color={theme.text} />
                        </TouchableOpacity>
                    ),
                    headerStyle: { backgroundColor: theme.background },
                    headerTintColor: theme.text,
                    headerShadowVisible: false,
                }}
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.headerArea}>
                    <View style={{ backgroundColor: theme.tint + '20', padding: 20, borderRadius: 30 }}>
                        <Feather name="cloud" size={50} color={theme.tint} />
                    </View>
                    <Text style={styles.appName}>Our Drive</Text>
                    <Text style={styles.version}>v1.0.26</Text>
                </View>

                <InfoCard
                    icon="upload"
                    title="Quick Upload"
                    content="Use the plus button to quickly add files from your device or use the camera to scan documents instantly."
                />

                <InfoCard
                    icon="star"
                    title="Favorites"
                    content="Star important documents to access them quickly from the Starred tab in your bottom navigation."
                />

                <InfoCard
                    icon="shield"
                    title="Privacy & Security"
                    content="All your data is encrypted and tied to your personal account. We never share your files with third parties."
                />

                <TouchableOpacity
                    style={styles.feedbackButton}
                    activeOpacity={0.8}
                    onPress={() => Linking.openURL('mailto:lol@there-is-no-support.the-semester-is-over-yay')}
                >
                    <Feather style={styles.feedbackText} name="send" size={20} color="#FFF" />
                    <Text style={styles.feedbackText}>Contact Support</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2026 ASP class</Text>
                    <Text style={[styles.footerText, { marginTop: 4 }]}>Built with React Native & Expo</Text>
                </View>
            </ScrollView>
        </View>
    );
}
