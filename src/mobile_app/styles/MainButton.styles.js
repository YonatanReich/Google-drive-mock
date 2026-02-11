import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from './Theme';

export const styles = StyleSheet.create({
    button: {
        height: FONTS.inputHeight,
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.md
    },
    buttonText: {
        color: COLORS.background,
        fontSize: FONTS.standard,
        fontWeight: FONTS.semiBold
    }
});