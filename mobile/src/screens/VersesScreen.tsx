import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import VerseCard from '../components/VerseCard';
import { api, BibleVerse } from '../services/api';

export default function VersesScreen() {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [tod, setTod] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [v, t] = await Promise.all([
        api.getVerses().catch(() => [] as BibleVerse[]),
        api.getVerseOfTheDay().catch(() => null as BibleVerse | null),
      ]);
      setVerses(v);
      setTod(t);
      setError('');
    } catch {
      setError('Could not load verses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bible Verses</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <ActivityIndicator size="large" color="#1a4b8c" /> : <>
        {tod && <View style={{ marginBottom: 24 }}><Text style={styles.sectionTitle}>Verse of the Day</Text><VerseCard verse={tod} large /></View>}
        <Text style={styles.sectionTitle}>All Verses</Text>
        {verses.map(v => <VerseCard key={v.id} verse={v} />)}
      </>}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 28, fontWeight: '700', color: '#1a4b8c', marginBottom: 20 },
  error: { backgroundColor: '#fef2f2', color: '#dc2626', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14, textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#1a1a2e', marginBottom: 12 },
});
