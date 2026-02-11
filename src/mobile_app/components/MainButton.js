import { Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/MainButton.styles';

export default function AppButton({ title, onPress }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity >
    );
}