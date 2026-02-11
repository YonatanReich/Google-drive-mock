import { StyleSheet } from 'react-native';

export const getStyles = (theme) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.background,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        paddingBottom: 50,
    },
    modalTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 24,
        color: theme.icon,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    menuItem: {
        alignItems: 'center',
        width: '25%',
        marginBottom: 24,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: theme.icon + '22',
        backgroundColor: theme.dark ? '#2d2e30' : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    menuLabel: {
        fontSize: 13,
        color: theme.text,
        fontWeight: '500',
    },
});