import { StyleSheet } from 'react-native';

export const getStyles = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: theme.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 30,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: theme.icon + '33',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 10,
    },
    header: {
        padding: 20,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: theme.icon + '1A',
    },
    fileName: {
        fontSize: 16,
        color: theme.text,
        marginLeft: 15,
        fontWeight: '500',
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: theme.icon + '1A',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
    },
    menuText: {
        fontSize: 15,
        marginLeft: 15,
        fontWeight: '400',
    }
});