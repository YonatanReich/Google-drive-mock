import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { apiRequest } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailsModal({ isVisible, onClose, fileId, theme }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isVisible && fileId) {
            fetchDetails();
        }
    }, [isVisible, fileId]);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const result = await apiRequest(`/api/files/${fileId}`, 'GET', null, token);
            const actualDetails = result.data?.data || result.data || result;
            setDetails(actualDetails);
        } catch (error) {
            console.error("Details fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.background }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text }]}>Details</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color={theme.icon} />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color={theme.tint} style={{ margin: 20 }} />
                    ) : details ? (
                        <View style={styles.content}>
                            <DetailRow label="Name" value={details.name} theme={theme} />
                            <DetailRow label="Type" value={details.isFolder ? 'Folder' : 'File'} theme={theme} />
                            <DetailRow label="Created" value={new Date(details.dateOfCreation).toLocaleString()} theme={theme} />
                            <DetailRow label="Starred" value={details.isStarred ? 'Yes' : 'No'} theme={theme} />
                            <DetailRow label="In Trash" value={details.inTrash ? 'Yes' : 'No'} theme={theme} />
                            <DetailRow label="Origin" value={details.origin} theme={theme} />
                        </View>
                    ) : (
                        <Text style={{ color: theme.text, textAlign: 'center' }}>No details found.</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const DetailRow = ({ label, value, theme }) => (
    <View style={styles.row}>
        <Text style={[styles.label, { color: theme.icon }]}>{label}:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    container: { borderRadius: 12, padding: 20, elevation: 5 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold' },
    content: { gap: 12 },
    row: { borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingBottom: 8 },
    label: { fontSize: 12, marginBottom: 2 },
    value: { fontSize: 16, fontWeight: '500' }
});