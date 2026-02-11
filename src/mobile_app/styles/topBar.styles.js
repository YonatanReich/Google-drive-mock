import { StyleSheet } from "react-native";

export const getStyles = (theme) => StyleSheet.create({
    outerContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: theme.background,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.surface,
        borderRadius: 30,
        paddingHorizontal: 12,
        height: 52,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: theme.dark ? 0.3 : 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    iconButton: {
        padding: 4,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        marginHorizontal: 8,
        fontSize: 16,
        color: theme.text,
    },
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.icon,
    },
});