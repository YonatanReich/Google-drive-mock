import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const getStyles = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    drawer: {
        width: width * 0.80,
        height: '100%',
        backgroundColor: theme.background,
        paddingTop: 50,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
    },
    logoContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    logoText: {
        fontSize: 22,
        fontWeight: '600',
        color: theme.text,
    },
    divider: {
        height: 1,
        backgroundColor: theme.icon + '33',
        marginVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 8,
        borderRadius: 25,
        marginBottom: 4,
    },
    menuText: {
        fontSize: 14,
        color: theme.text,
        marginLeft: 20,
        fontWeight: '500',
    }
});