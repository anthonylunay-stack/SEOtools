import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme';

const INFO_CARDS = [
  {
    icon: '🤖',
    title: "Qu'est-ce qu'AVA ?",
    content: "AVA (Assistante Virtuelle Avocate) est une application mobile conçue pour accompagner les victimes de violences conjugales dans leurs démarches juridiques. Elle fournit des informations juridiques générales, disponibles 24h/24, dans un espace strictement confidentiel.",
  },
  {
    icon: '🔒',
    title: 'Confidentialité garantie',
    content: "Tous vos échanges sont chiffrés de bout en bout. Vos données personnelles sont stockées sur des serveurs sécurisés en France, conformément au RGPD. AVA ne partage jamais vos informations avec des tiers sans votre consentement explicite.",
  },
  {
    icon: '⚖️',
    title: "Limites d'AVA",
    content: "AVA fournit des informations juridiques générales et ne remplace pas un avocat. Pour toute démarche juridique spécifique, consultez un professionnel du droit. AVA n'est pas un service d'urgence — en cas de danger, appelez le 17 ou le 3919.",
  },
];

export default function InfoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Informations</Text>
        <Text style={styles.headerSub}>À propos d'AVA</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>À propos</Text>
        {INFO_CARDS.map((card, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardIcon}>{card.icon}</Text>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardContent}>{card.content}</Text>
          </View>
        ))}
        <Text style={styles.sectionTitle}>Version</Text>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>📱</Text>
          <Text style={styles.cardTitle}>AVA — Version 1.0</Text>
          <Text style={styles.cardContent}>
            Données hébergées en France{'\n'}
            Conformité RGPD{'\n'}
            Chiffrement bout en bout{'\n'}
            © 2024 AVA — Tous droits réservés
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.CREAM },
  header: { backgroundColor: Colors.WHITE, padding: Spacing.LG, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  headerTitle: { fontSize: FontSize.XL, fontWeight: '700', color: Colors.INK },
  headerSub: { fontSize: FontSize.SM, color: Colors.MUTED, marginTop: 2 },
  content: { padding: Spacing.MD, gap: Spacing.MD },
  sectionTitle: { fontSize: FontSize.LG, fontWeight: '700', color: Colors.INK, marginBottom: Spacing.XS },
  card: { backgroundColor: Colors.WHITE, borderRadius: BorderRadius.LG, padding: Spacing.MD, borderWidth: 1, borderColor: Colors.BORDER, gap: Spacing.XS },
  cardIcon: { fontSize: 28 },
  cardTitle: { fontSize: FontSize.MD, fontWeight: '700', color: Colors.INK },
  cardContent: { fontSize: FontSize.MD, color: Colors.MUTED, lineHeight: 22 },
});
