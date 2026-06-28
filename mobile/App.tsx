import { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import LiveScreen from './src/screens/LiveScreen';
import SermonsScreen from './src/screens/SermonsScreen';
import VersesScreen from './src/screens/VersesScreen';
import AboutScreen from './src/screens/AboutScreen';

const Tab = createBottomTabNavigator();
const iconMap: Record<string, { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }> = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  Live: { focused: 'tv', unfocused: 'tv-outline' },
  Sermons: { focused: 'book', unfocused: 'book-outline' },
  Verses: { focused: 'heart', unfocused: 'heart-outline' },
  About: { focused: 'information-circle', unfocused: 'information-circle-outline' },
};

const splashSlides = [
  { image: require('./assets/slide-1.jpeg'), subtitle: 'Connecting People to God and Each Other' },
  { image: require('./assets/slide-2.png'), subtitle: 'Worship From Anywhere' },
  { image: require('./assets/slide-3.jpg'), subtitle: 'Bible Study & Discipleship' },
  { image: require('./assets/slide-4.jpeg'), subtitle: 'Building the Next Generation' },
  { image: require('./assets/slide-5.jpeg'), subtitle: 'Serving Our Neighbors' },
];

export default function App() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % splashSlides.length);
    }, 2500);

    Animated.sequence([
      Animated.delay(splashSlides.length * 2500 + 400),
      Animated.timing(splashOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => { clearInterval(slideTimer); setReady(true); });

    return () => clearInterval(slideTimer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const icons = iconMap[route.name];
            return <Ionicons name={focused ? icons.focused : icons.unfocused} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1a4b8c',
          tabBarInactiveTintColor: '#64748b',
          headerStyle: { backgroundColor: '#1a4b8c' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          tabBarStyle: { paddingBottom: Platform.OS === 'ios' ? 20 : 8, paddingTop: 8, height: Platform.OS === 'ios' ? 85 : 65 },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        })}>
          <Tab.Screen name="Home" component={HomeScreen} options={{ headerTitle: 'Bethel Church' }} />
          <Tab.Screen name="Live" component={LiveScreen} />
          <Tab.Screen name="Sermons" component={SermonsScreen} />
          <Tab.Screen name="Verses" component={VersesScreen} />
          <Tab.Screen name="About" component={AboutScreen} />
        </Tab.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>

      {!ready && (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: splashOpacity }]}>
          <ImageBackground source={splashSlides[slideIndex].image} style={StyleSheet.absoluteFill} resizeMode="cover">
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(26, 75, 140, 0.5)' }]} />
            <View style={styles.splashContent}>
              <Text style={styles.splashTitle}>BETHEL CHURCH</Text>
              <Text style={styles.splashSub}>{splashSlides[slideIndex].subtitle}</Text>
            </View>
            <View style={styles.dots}>
              {splashSlides.map((_, i) => (
                <View key={i} style={[styles.dot, i === slideIndex && styles.dotActive]} />
              ))}
            </View>
          </ImageBackground>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  splashContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  splashTitle: { fontSize: 36, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 12 },
  splashSub: { fontSize: 16, color: '#eab308', textAlign: 'center' },
  dots: { position: 'absolute', bottom: 60, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { backgroundColor: '#eab308', width: 26, borderRadius: 5 },
});
