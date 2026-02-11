import { StyleSheet, Platform } from "react-native";

export const getStyles = (theme) => StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: theme.background,
    },
    safeArea: {
        backgroundColor: theme.background,
    },
    tabBar: {
        height: 85,
        backgroundColor: theme.background,
        borderTopWidth: 1,
        borderTopColor: theme.icon + '33',
        paddingBottom: 10,
        paddingTop: 10
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    tabIcon: {
        fontSize: 20,
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