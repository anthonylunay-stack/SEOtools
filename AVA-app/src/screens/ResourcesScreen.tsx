import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme';

const EMERGENCY_NUMBERS = [
  { number: '3919', label: 'Violences Femmes Info', desc: '24h/24, 7j/7, gratuit', color: Colors.ROSE },
  { number: '17', label: 'Police Secours', desc: 'En cas de danger immédiat', color: '#1565C0' },
  { number: '115', label: 'SAMU Social', desc: "Hébergement d'urgence", color: Colors.SUCCESS },
  { number: '116006', label: 'Aide aux victimes', desc: 'Soutien psychologique', color: '#6A1B9A' },
];

const ACCORDIONS = [
  {
    id: 'droits',
    icon: '🛡',
    iconColor: Colors.ROSE,
    title: 'Vos droits',
    items: [
      { title: 'Ordonnance de protection', desc: "Mesure d'urgence délivrée par le JAF en 6 jours pour vous protéger." },
      { title: 'Dépôt de plainte', desc: "Vous pouvez déposer plainte au commissariat ou à la gendarmerie, même sans certificat médical." },
      { title: 'Éviction du conjoint violent', desc: "Le juge peut ordonner l'éviction du conjoint violent du domicile conjugal." },
      { title: 'Aide juridictionnelle', desc: "Accès gratuit à un avocat si vos ressources sont insuffisantes." },
      { title: "Avocat d'urgence", desc: "Un avocat commis d'office peut intervenir immédiatement en garde à vue ou en urgence." },
    ],
  },
  {
    id: 'procedure',
    icon: '⏱',
    iconColor: '#1565C0',
    title: 'Étapes de la procédure',
    items: [
      { title: 'Étape 1 — Signalement / Plainte', desc: "Déposez plainte au commissariat ou à la gendarmerie. Décrivez les faits précisément." },
      { title: 'Étape 2 — Enquête', desc: "Les forces de l'ordre enquêtent et recueillent les preuves (constat, témoignages, etc.)." },
      { title: 'Étape 3 — Décision du parquet', desc: "Le procureur décide des poursuites : classement, médiation, ou renvoi en jugement." },
      { title: 'Étape 4 — Mesures de protection', desc: "Ordonnance de protection, interdiction d'approche, bracelet anti-rapprochement." },
      { title: 'Étape 5 — Jugement', desc: "L'auteur des violences est jugé. Des dommages et intérêts peuvent vous être alloués." },
    ],
  },
  {
    id: 'logement',
    icon: '🏠',
    iconColor: Colors.SUCCESS,
    title: 'Aide au logement',
    items: [
      { title: '115 — SAMU Social', desc: "Hébergement d'urgence disponible 24h/24. Appelez le 115 pour être orientée." },
      { title: 'Centres spécialisés', desc: "Centres d'hébergement réservés aux femmes victimes de violences avec accompagnement." },
      { title: 'DALO', desc: "Droit au Logement Opposable : recours possible si vous êtes sans domicile." },
      { title: 'Associations locales', desc: "De nombreuses associations proposent des hébergements temporaires et un accompagnement social." },
    ],
  },
  {
    id: 'urgence',
    icon: '📞',
    iconColor: Colors.AMBER,
    title: "Numéros d'urgence",
    isEmergency: true,
  },
];

export default function ResourcesScreen() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ressources</Text>
        <Text style={styles.headerSub}>Informations juridiques et contacts utiles</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {ACCORDIONS.map((acc) => (
          <View key={acc.id} style={styles.accordion}>
            <TouchableOpacity style={styles.accordionHeader} onPress={() => toggle(acc.id)}>
              <Text style={[styles.accordionIcon, { color: acc.iconColor }]}>{acc.icon}</Text>
              <Text style={styles.accordionTitle}>{acc.title}</Text>
              <Text style={styles.accordionChevron}>{openId === acc.id ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {openId === acc.id && (
              <View style={styles.accordionBody}>
                {acc.isEmergency ? (
                  EMERGENCY_NUMBERS.map((n) => (
                    <TouchableOpacity key={n.number} style={[styles.emergencyCard, { borderLeftColor: n.color }]} onPress={() => Linking.openURL(`tel:${n.number}`)}>
                      <Text style={[styles.emergencyNumber, { color: n.color }]}>{n.number}</Text>
                      <View>
                        <Text style={styles.emergencyLabel}>{n.label}</Text>
                        <Text style={styles.emergencyDesc}>{n.desc}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  acc.items?.map((item, i) => (
                    <View key={i} style={styles.item}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemDesc}>{item.desc}</Text>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        ))}
        <Text style={styles.disclaimer}>
          Ces informations sont fournies à titre indicatif et ne constituent pas un conseil juridique personnalisé. Consultez un avocat pour votre situation spécifique.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.CREAM },
  header: { backgroundColor: Colors.WHITE, padding: Spacing.LG, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  headerTitle: { fontSize: FontSize.XL, fontWeight: '700', color: Colors.INK },
  headerSub: { fontSize: FontSize.SM, color: Colors.MUTED, marginTop: 2 },
  content: { padding: Spacing.MD, gap: Spacing.SM },
  accordion: { backgroundColor: Colors.WHITE, borderRadius: BorderRadius.LG, overflow: 'hidden', borderWidth: 1, borderColor: Colors.BORDER },
  accordionHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.MD, gap: Spacing.SM },
  accordionIcon: { fontSize: 20, width: 28 },
  accordionTitle: { flex: 1, fontSize: FontSize.MD, fontWeight: '600', color: Colors.INK },
  accordionChevron: { fontSize: FontSize.XS, color: Colors.MUTED },
  accordionBody: { padding: Spacing.MD, gap: Spacing.SM, backgroundColor: Colors.ROSE_FAINT, borderTopWidth: 1, borderTopColor: Colors.BORDER },
  item: { backgroundColor: Colors.WHITE, borderRadius: BorderRadius.MD, padding: Spacing.MD },
  itemTitle: { fontSize: FontSize.MD, fontWeight: '600', color: Colors.INK, marginBottom: 4 },
  itemDesc: { fontSize: FontSize.SM, color: Colors.MUTED, lineHeight: 20 },
  emergencyCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.MD, backgroundColor: Colors.WHITE, borderRadius: BorderRadius.MD, padding: Spacing.MD, borderLeftWidth: 4 },
  emergencyNumber: { fontSize: FontSize.XL, fontWeight: '800', minWidth: 60 },
  emergencyLabel: { fontSize: FontSize.MD, fontWeight: '600', color: Colors.INK },
  emergencyDesc: { fontSize: FontSize.SM, color: Colors.MUTED },
  disclaimer: { fontSize: FontSize.XS, color: Colors.MUTED, lineHeight: 18, textAlign: 'center', paddingVertical: Spacing.MD },
});
