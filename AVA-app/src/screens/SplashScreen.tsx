import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Linking, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AVALogo from '../components/AVALogo';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme';

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.inner, { opacity: fadeAnim }]}>
          <View style={styles.logoSection}>
            <AVALogo size={120} />
            <Text style={styles.title}>AVA</Text>
            <Text style={styles.tagline}>VOTRE AVOCAT DE POCHE</Text>
          </View>
          <Text style={styles.description}>
            Un espace confidentiel et sécurisé pour vous accompagner dans vos démarches face aux violences conjugales.
          </Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.btnPrimaryText}>Commencer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnGhost} onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.btnGhostText}>J'ai déjà un compte</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
      <View style={styles.urgenceContainer}>
        <TouchableOpacity style={styles.urgencePill} onPress={() => Linking.openURL('tel:3919')}>
          <Animated.View style={[styles.dot, { transform: [{ scale: pulseAnim }] }]} />
          <Text style={styles.urgenceText}>Urgence : 3919</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.CREAM },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.LG, paddingVertical: Spacing.XL },
  inner: { alignItems: 'center', width: '100%' },
  logoSection: { alignItems: 'center', marginBottom: Spacing.XL },
  title: { fontSize: 64, color: Colors.INK, letterSpacing: 4, marginTop: Spacing.MD, fontWeight: '300' },
  tagline: { fontSize: FontSize.SM, color: Colors.MUTED, letterSpacing: 2, marginTop: Spacing.XS, textTransform: 'uppercase' },
  description: { fontSize: 15, color: Colors.MUTED, lineHeight: 26, textAlign: 'center', marginBottom: Spacing.XL, paddingHorizontal: Spacing.MD },
  buttons: { width: '100%', gap: Spacing.MD },
  btnPrimary: { backgroundColor: Colors.ROSE, borderRadius: BorderRadius.LG, paddingVertical: 16, alignItems: 'center' },
  btnPrimaryText: { color: Colors.WHITE, fontSize: FontSize.LG, fontWeight: '600' },
  btnGhost: { borderWidth: 1.5, borderColor: Colors.ROSE, borderRadius: BorderRadius.LG, paddingVertical: 16, alignItems: 'center' },
  btnGhostText: { color: Colors.ROSE, fontSize: FontSize.LG, fontWeight: '500' },
  urgenceContainer: { alignItems: 'center', paddingBottom: Spacing.LG },
  urgencePill: { flexDirection: 'row', alignItems: 'center', gap: Spacing.SM, backgroundColor: 'rgba(192,57,43,0.08)', borderWidth: 1, borderColor: Colors.DANGER, borderRadius: BorderRadius.FULL, paddingHorizontal: Spacing.MD, paddingVertical: Spacing.SM },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.DANGER },
  urgenceText: { color: Colors.DANGER, fontSize: FontSize.SM, fontWeight: '600' },
});
