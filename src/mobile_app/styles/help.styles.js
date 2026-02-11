import { StyleSheet } from "react-native";

export const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    headerArea: {
        alignItems: 'center',
        marginVertical: 40,
    },
    appName: {
        fontSize: 26,
        fontWeight: '700',
        marginTop: 15,
        color: theme.text,
    },
    version: {
        fontSize: 14,
        marginTop: 5,
        color: theme.icon,
    },
    card: {
        backgroundColor: theme.surface || (theme.background === '#000' ? '#1c1c1e' : '#f2f2f7'),
        padding: 16,
        borderRadius: 16,
        marginBottom: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 6,
        color: theme.tint,
    },
    sectionContent: {
        fontSize: 15,
        lineHeight: 22,
        color: theme.text,
        opacity: 0.9,
    },
    feedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 14,
        marginTop: 20,
        backgroundColor: theme.tint,
    },
    feedbackText: {
        color: theme.text + '5',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 10,
    },
    footer: {
        alignItems: 'center',
        marginTop: 50,
    },
    footerText: {
        fontSize: 13,
        color: theme.icon,
    }
});