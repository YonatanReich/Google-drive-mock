import { StyleSheet } from 'react-native';

export const getStyles = (theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.background,
        paddingHorizontal: 40,
        paddingTop: 60,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 2,
    },
    logoImage: {
        width: 110,
        height: 110,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        color: theme.text,
        textAlign: 'center',
        paddingTop: 25
    },
    subtitle: {
        fontSize: 16,
        color: theme.text,
        textAlign: 'center',
        marginBottom: 20,
        opacity: 0.7,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    input: {
        height: 55,
        borderWidth: 1,
        borderColor: theme.icon,
        borderRadius: 4,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 16,
        color: theme.text,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.icon,
        borderRadius: 4,
        height: 55,
        paddingHorizontal: 15,
        marginBottom: 16,
    },
    inputNoBorder: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: theme.text,
        paddingVertical: 0,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    linkText: {
        color: theme.tint,
        fontWeight: '600',
        fontSize: 14,
    },
    button: {
        backgroundColor: theme.tint,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 4,
    },
    buttonText: {
        color: theme.buttonText,
        fontWeight: '600',
        fontSize: 14,
    },
    imagePickerContainer: {
        alignSelf: 'center',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.border,
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    profilePreview: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholderText: {
        color: '#5f6368',
        fontSize: 14,
    },
    cameraIcon: {
        paddingLeft: 18,
        paddingTop: 3
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: -12,
        marginBottom: 10,
        marginLeft: 4,
    },
    inputError: {
        borderColor: '#ff4444',
    },
});