import { StyleSheet } from 'react-native';

export const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    listContent: {
        paddingBottom: 120,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.icon + '1A',
    },
    headerText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.icon,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: theme.icon,
        marginTop: 12,
        opacity: 0.6,
    }
});