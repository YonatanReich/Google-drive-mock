import { StyleSheet, Platform } from "react-native";

export const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        marginRight: 10,
    },
    iconButton: {
        padding: 8,
        marginLeft: 5,
    },
    fab: {
        position: 'absolute',
        right: 25,
        bottom: Platform.OS === 'ios' ? 110 : 90,
        backgroundColor: theme.background,
        width: 66,
        height: 66,
        borderRadius: 33,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
        zIndex: 99,
    },
});