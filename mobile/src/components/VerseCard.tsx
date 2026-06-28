import { View, Text, StyleSheet } from 'react-native';
import { BibleVerse } from '../services/api';

interface Props { verse: BibleVerse; large?: boolean }

export default function VerseCard({ verse, large }: Props) {
  return (
    <View style={styles.card}>
      <Text style={[styles.verse, large && styles.large]}>{verse.verse_text}</Text>
      <Text style={styles.ref}>{verse.reference}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12, backgroundColor: '#fff' },
  verse: { fontSize: 16, lineHeight: 26, fontStyle: 'italic', color: '#1a1a2e' },
  large: { fontSize: 20, lineHeight: 32 },
  ref: { fontSize: 14, fontWeight: '600', marginTop: 12, textAlign: 'right', color: '#1a4b8c' },
});
