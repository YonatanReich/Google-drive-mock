
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = (width - 48) / 3;

export const getStyles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.dark ? '#3c4043' : '#f1f3f4',
        minHeight: 60,
    },
    iconContainer: {
        marginRight: 16,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: theme.text,
        textAlignVertical: 'center',
        includeFontPadding: false,
    },
    menu: {
        padding: 8,
    },
    gridContainer: {
        width: GRID_ITEM_WIDTH,
        height: GRID_ITEM_WIDTH,
        maxWidth: GRID_ITEM_WIDTH,
        margin: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.dark ? '#3c4043' : '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.background,
    },
    gridIconContainer: {
        marginBottom: 12,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridText: {
        fontSize: 14,
        color: theme.text,
        textAlign: 'center',
        includeFontPadding: false,
    },
    gridMenu: {
        position: 'absolute',
        top: 4,
        right: 4,
        padding: 8,
    },
});