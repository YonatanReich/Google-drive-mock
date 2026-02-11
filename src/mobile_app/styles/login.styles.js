import { StyleSheet } from 'react-native';

export const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        padding: 40,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoImage: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
        marginBottom: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        color: theme.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: theme.text,
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        height: 55,
        borderWidth: 1,
        borderColor: theme.icon,
        borderRadius: 4,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 20,
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
        marginBottom: 20,
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
        marginTop: 15,
    },
    createAccountText: {
        color: theme.tint,
        fontWeight: '600',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: theme.tint,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 4,
    },
    loginButtonText: {
        color: theme.buttonText,
        fontWeight: '600',
        fontSize: 14,
    },
});