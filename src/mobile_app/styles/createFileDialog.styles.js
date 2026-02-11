import { StyleSheet } from 'react-native';

export const getStyles = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 0,
    },
    alertBox: {
        width: '85%',
        height: '70%',
        backgroundColor: theme.background,
        borderRadius: 24,
        padding: 24,
        elevation: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '500',
        marginBottom: 20,
        color: theme.text
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: theme.tint,
        marginBottom: 20,
        paddingVertical: 10,
        fontSize: 16,
        color: theme.text,
    },
    contentInput: {
        minHeight: 210,
        textAlignVertical: 'top',
        backgroundColor: theme.icon + '30',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 0,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    button: {
        marginLeft: 10,
        paddingVertical: 1,
        paddingHorizontal: 16
    },
    cancelText: {
        color: theme.text,
        fontWeight: '600',
        fontSize: 15
    },
    createText: {
        color: theme.tint,
        fontWeight: '700',
        fontSize: 15
    },
    viewerContainer: {
        width: '100%',
        aspectRatio: 1,
        maxHeight: 350,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.dark ? '#1a1a1a' : '#f0f0f0',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    fullImage: {
        width: '100%',
        height: '100%',
    }
});