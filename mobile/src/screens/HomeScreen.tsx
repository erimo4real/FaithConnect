import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LiveIndicator from '../components/LiveIndicator';
import VerseCard from '../components/VerseCard';
import { api, LiveStream, Sermon, BibleVerse } from '../services/api';

export default function HomeScreen({ navigation }: any) {
  const [stream, setStream] = useState<LiveStream | null>(null);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [s, sermonsData, v] = await Promise.all([
        api.getLiveStream().catch(() => null),
        api.getSermons().catch(() => [] as Sermon[]),
        api.getVerseOfTheDay().catch(() => null as BibleVerse | null),
      ]);
      setStream(s);
      setSermons(sermonsData.filter((x: Sermon) => x.status === 'published'));
      setVerse(v);
      setError('');
    } catch (e) {
      setError('Could not load data. Check your connection.');
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <ScrollView style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.title}>Bethel Church</Text>
      {stream && (
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go to live stream" style={styles.liveBanner} onPress={() => navigation.navigate('Live')}>
          <LiveIndicator />
          <Text style={styles.liveTitle} numberOfLines={1}>{stream.title}</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      )}
      {verse && (
        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Verse of the Day</Text>
          <VerseCard verse={verse} large />
        </View>
      )}
      {sermons[0] && (
        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Latest Sermon</Text>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="View sermons" style={styles.card} onPress={() => navigation.navigate('Sermons')}>
            <Text style={styles.sermonTitle}>{sermons[0].title}</Text>
            {sermons[0].speaker && <Text style={styles.speaker}>{sermons[0].speaker}</Text>}
            <Text style={{ color: '#1a4b8c', marginTop: 8, fontWeight: '600' }}>Watch →</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.grid}>
        {([
          { t: 'Live', icon: 'tv' as const },
          { t: 'Sermons', icon: 'book' as const },
          { t: 'Verses', icon: 'heart' as const },
          { t: 'About', icon: 'information-circle' as const },
        ]).map(({ t, icon }) => (
          <TouchableOpacity key={t} accessibilityRole="button" accessibilityLabel={`Go to ${t}`} style={styles.gridBtn} onPress={() => navigation.navigate(t)}>
            <Ionicons name={icon} size={28} color="#1a4b8c" />
            <Text style={styles.gridText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 28, fontWeight: '700', color: '#1a4b8c', marginBottom: 20 },
  error: { backgroundColor: '#fef2f2', color: '#dc2626', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14, textAlign: 'center' },
  liveBanner: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', gap: 12 },
  liveTitle: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1a1a2e' },
  arrow: { fontSize: 18, color: '#1a4b8c', fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#1a1a2e', marginBottom: 12 },
  card: { padding: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  sermonTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a2e' },
  speaker: { fontSize: 13, color: '#64748b', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 32, paddingBottom: 40 },
  gridBtn: { width: '47%', padding: 20, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', gap: 8 },
  gridText: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
});
