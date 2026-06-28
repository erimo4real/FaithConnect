import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { api, Sermon } from '../services/api';

export default function SermonsScreen() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await api.getSermons();
      setSermons(data.filter((x: Sermon) => x.status === 'published'));
      setError('');
    } catch {
      setError('Could not load sermons.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sermons</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <ActivityIndicator size="large" color="#1a4b8c" /> :
        sermons.map(s => (
          <TouchableOpacity key={s.id} accessibilityRole="button" accessibilityLabel={`Watch ${s.title}`} style={styles.card} onPress={() => s.video_url && Linking.openURL(s.video_url)}>
            <Text style={styles.sermonTitle}>{s.title}</Text>
            {s.speaker && <Text style={styles.speaker}>{s.speaker}</Text>}
            {s.description && <Text style={styles.desc} numberOfLines={3}>{s.description}</Text>}
            {s.date && <Text style={{ color: '#64748b', fontSize: 12, marginTop: 8 }}>{new Date(s.date).toLocaleDateString()}</Text>}
          </TouchableOpacity>
        ))
      }
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 28, fontWeight: '700', color: '#1a4b8c', marginBottom: 20 },
  error: { backgroundColor: '#fef2f2', color: '#dc2626', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14, textAlign: 'center' },
  card: { padding: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  sermonTitle: { fontSize: 17, fontWeight: '600', color: '#1a1a2e' },
  speaker: { fontSize: 14, fontWeight: '500', color: '#1a4b8c', marginTop: 4 },
  desc: { fontSize: 14, lineHeight: 22, color: '#64748b', marginTop: 8 },
});
