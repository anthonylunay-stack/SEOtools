import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../theme';

function Card({ title, text }: { title: string; text: string }) {
  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>{title}</Text>
      <Text style={s.cardText}>{text}</Text>
    </View>
  );
}

export default function InfoScreen() {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Informations</Text>
        <Text style={s.sub}>À propos d'AVA</Text>
      </View>
      <ScrollView style={s.body} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>À PROPOS</Text>
        <Card title="Qu'est-ce qu'AVA ?" text="AVA est une assistante juridique IA spécialisée dans l'accompagnement des victimes de violences conjugales. Elle fournit des informations juridiques fiables et vous aide à comprendre vos droits et vos options." />
        <Card title="Confidentialité garantie" text="Toutes vos conversations sont chiffrées de bout en bout. Aucun contenu de vos échanges n'est partagé avec des tiers. Vous pouvez effacer votre historique à tout moment depuis les Réglages." />
        <Card title="Limites d'AVA" text="AVA est une assistante IA et ne remplace pas un avocat. Pour toute situation nécessitant un conseil personnalisé, consultez un professionnel du droit ou contactez une association spécialisée." />

        <Text style={[s.sectionTitle, { marginTop: 20 }]}>VERSION</Text>
        <Card title="AVA — Version 1.0" text="Application d'assistance juridique IA · Spécialisation violences conjugales · Données hébergées en France · Conformité RGPD." />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.CREAM },
  header: { backgroundColor: Colors.WHITE, paddingTop: 16, paddingHorizontal: Spacing.LG, paddingBottom: Spacing.MD, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  title: { fontFamily: 'serif', fontSize: FontSize.XXL, fontWeight: '400', color: Colors.INK },
  sub: { fontSize: FontSize.SM, color: Colors.MUTED, marginTop: 3 },
  body: { flex: 1, padding: Spacing.MD },
  sectionTitle: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.MUTED, opacity: 0.7, marginBottom: 10, marginTop: 6 },
  card: { backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BORDER, borderRadius: Radius.MD, padding: 15, marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: '500', color: Colors.INK, marginBottom: 5 },
  cardText: { fontSize: FontSize.SM, color: Colors.MUTED, lineHeight: 22 },
});
