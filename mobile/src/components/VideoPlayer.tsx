import { View, Text, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props { url: string; title?: string }

function getEmbedUrl(url: string): string {
  const u = url.trim();
  const ytMatch = u.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|live\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&controls=1&rel=0`;
  if (u.includes('facebook.com') || u.includes('fb.watch'))
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&show_text=false`;
  const vimeoId = u.match(/vimeo\.com\/(\d+)/)?.[1];
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return '';
}

export default function VideoPlayer({ url, title }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.webviewContainer}>
        <WebView source={{ uri: getEmbedUrl(url) }} style={styles.webview} allowsFullscreenVideo javaScriptEnabled domStorageEnabled />
      </View>
      {title && <Text style={styles.title}>{title}</Text>}
      <TouchableOpacity accessibilityRole="link" accessibilityLabel="Open video in browser" onPress={() => Linking.openURL(url)}>
        <Text style={styles.link}>Open in browser</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  webviewContainer: { width: '100%', height: 220, borderRadius: 12, overflow: 'hidden' },
  webview: { width: '100%', height: '100%' },
  title: { fontSize: 16, fontWeight: '600', marginTop: 8, color: '#1a1a2e' },
  link: { fontSize: 12, color: '#3b82f6', marginTop: 4 },
});
