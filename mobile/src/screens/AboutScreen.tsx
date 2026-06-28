import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About</Text>
      <View style={styles.card}>
        <Text style={styles.churchName}>Bethel Church</Text>
        <Text style={styles.desc}>A community of faith dedicated to spreading the love of God and the teachings of Jesus Christ.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Service Times</Text>
        <Text style={styles.info}>Sundays: 9:00 AM - 11:00 AM</Text>
        <Text style={styles.info}>Wednesdays: 6:30 PM - 8:00 PM</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <TouchableOpacity accessibilityRole="link" accessibilityLabel="Visit website" onPress={() => Linking.openURL('https://bethelchurchng.com')}>
          <Text style={styles.link}>bethelchurchng.com</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="link" accessibilityLabel="Call church" onPress={() => Linking.openURL('tel:+2349034720201')}>
          <Text style={styles.link}>+234 903 4720 201</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 28, fontWeight: '700', color: '#1a4b8c', marginBottom: 20 },
  card: { padding: 20, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  churchName: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  desc: { fontSize: 15, lineHeight: 24, color: '#1a1a2e' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e', marginBottom: 8 },
  info: { fontSize: 14, lineHeight: 22, color: '#64748b' },
  link: { fontSize: 14, fontWeight: '500', color: '#1a4b8c', marginTop: 8 },
});
