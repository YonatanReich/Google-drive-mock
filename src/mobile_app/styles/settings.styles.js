import { StyleSheet } from 'react-native';

export const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 100,
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: theme.text,
    },
    form: {
        gap: 15,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.dark ? '#9aa0a6' : '#5f6368',
        marginLeft: 4,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: theme.text,
        borderColor: theme.surface,
        backgroundColor: theme.surface
    },
    disabledInput: {
        backgroundColor: theme.disabledBackground,
        color: theme.disabledText,
        borderColor: theme.border,
    },
    saveButton: {
        backgroundColor: theme.tint,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    saveButtonText: {
        color: theme.tabIconDefault + '-10',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footerText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 12,
        color: '#80868b',
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    largeProfilePic: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 1,
        borderColor: theme.icon + '33',
    },
});