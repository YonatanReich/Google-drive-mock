import { StyleSheet, Dimensions } from 'react-native';


const { height } = Dimensions.get('window');

export const getStyles = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        width: '100%',
        height: height * 0.75,
        backgroundColor: theme.background,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginBottom: 20,
    },
    headerSpacer: {
        width: 60,
    },
    emailText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: theme.text,
        textAlign: 'center',
    },
    doneButtonText: {
        width: 60,
        fontSize: 15,
        fontWeight: '700',
        color: theme.tint,
        textAlign: 'right',
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    largeProfilePic: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme.icon + '33',
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.text,
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        backgroundColor: theme.icon + '33',
        borderRadius: 16,
        marginTop: 10,
    },
    settingsText: {
        fontSize: 15,
        color: theme.text,
        marginLeft: 15,
        fontWeight: '500',
    },
    logoutText: {
        fontSize: 15,
        color: '#d93025',
        marginLeft: 15,
        fontWeight: '600',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderWidth: 1,
        borderColor: theme.icon + '33',
        borderRadius: 16,
        marginTop: 12,
    }
});