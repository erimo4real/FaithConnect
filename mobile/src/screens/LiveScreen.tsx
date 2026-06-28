import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import LiveIndicator from '../components/LiveIndicator';
import VideoPlayer from '../components/VideoPlayer';
import { api, LiveStream, StreamLog } from '../services/api';

export default function LiveScreen() {
  const [stream, setStream] = useState<LiveStream | null>(null);
  const [past, setPast] = useState<StreamLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [endedMessage, setEndedMessage] = useState<{ title: string } | null>(null);
  const prevLiveRef = useRef(false);
  const lastLiveRef = useRef<LiveStream | null>(null);

  const load = useCallback(async () => {
    try {
      const [s, p] = await Promise.all([
        api.getLiveStream().catch(() => null),
        api.getStreamArchive().catch(() => [] as StreamLog[]),
      ]);
      if (!s && prevLiveRef.current) {
        setEndedMessage({ title: lastLiveRef.current?.title || '' });
        setTimeout(() => setEndedMessage(null), 3600000);
      }
      if (s?.is_live) lastLiveRef.current = s;
      prevLiveRef.current = s?.is_live || false;
      setStream(s);
      setError('');
    } catch {
      setError('Could not load stream data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Live Stream</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {stream ? (
        <View style={{ marginBottom: 24 }}>
          <LiveIndicator />
          <Text style={styles.streamTitle}>{stream.title}</Text>
          <VideoPlayer url={stream.youtube_url} title={stream.title} />
        </View>
      ) : !loading && (
        <View style={styles.offline}>
          <Text style={{ color: '#64748b', fontSize: 18, fontWeight: '600' }}>
            {endedMessage ? 'Live Stream Has Ended' : 'No live stream right now'}
          </Text>
          {endedMessage ? (
            <Text style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
              {endedMessage.title ? `"${endedMessage.title}" has ended. ` : ''}View past streams below to watch today's, last week's, and previous services.
            </Text>
          ) : (
            <Text style={{ color: '#94a3b8', fontSize: 13, marginTop: 6 }}>Check back for upcoming services</Text>
          )}
        </View>
      )}
      {past.length > 0 && <Text style={styles.sectionTitle}>Past Streams</Text>}
      {loading ? <ActivityIndicator size="large" color="#1a4b8c" /> :
        past.map(s => (
          <View key={s.id} style={styles.pastCard}>
            {s.youtube_url && <VideoPlayer url={s.youtube_url} />}
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1a1a2e' }}>{s.title}</Text>
            <Text style={{ color: '#64748b', fontSize: 12 }}>{new Date(s.deactivated_at).toLocaleDateString()}</Text>
          </View>
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
  streamTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e', marginBottom: 12, marginTop: 8 },
  offline: { padding: 32, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#1a1a2e', marginBottom: 12 },
  pastCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
});
