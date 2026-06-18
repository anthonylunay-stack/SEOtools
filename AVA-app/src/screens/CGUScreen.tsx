import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme';

const CGU_SECTIONS = [
  {
    title: "1. Objet de l'application",
    content: "AVA est une application mobile conçue pour fournir des informations juridiques générales aux victimes de violences conjugales. Elle a pour vocation d'accompagner les utilisatrices dans leur compréhension du droit applicable à leur situation, en leur offrant un accès simplifié à des informations juridiques générales relatives aux violences conjugales.",
  },
  {
    title: '2. Fonctionnement de l\'application',
    content: "L'application fonctionne grâce à une intelligence artificielle qui traite vos questions et y répond sur la base d'informations juridiques générales. Les réponses sont générées automatiquement et peuvent être complétées par l'intervention d'un professionnel du droit dans certains cas.",
  },
  {
    title: '3. Information juridique et absence de conseil personnalisé',
    content: "Les informations fournies par AVA constituent uniquement des informations juridiques générales et ne sauraient être assimilées à des consultations juridiques personnalisées au sens de la loi du 31 décembre 1971. Ces informations ne prennent pas en compte les spécificités de votre situation personnelle.",
  },
  {
    title: '4. Nécessité d\'une analyse individualisée',
    content: "Toute situation juridique requiert une analyse individualisée par un professionnel qualifié. Les informations fournies par AVA ne peuvent se substituer à l'examen approfondi de votre dossier par un avocat, qui seul est habilité à vous fournir un conseil juridique personnalisé.",
  },
  {
    title: '5. Exclusion des situations d\'urgence',
    content: "AVA n'est pas un service d'urgence. En cas de danger immédiat, vous devez contacter les services d'urgence (17 pour la police, 15 pour le SAMU, 112 pour les urgences européennes) ou le numéro national de référence (3919). L'application ne peut pas se substituer à ces services.",
  },
  {
    title: '6. Absence de garantie de résultat',
    content: "Les informations juridiques fournies par AVA le sont à titre indicatif. Elles ne constituent pas une garantie de résultat dans le cadre de démarches juridiques ou judiciaires. Le droit évolue et les informations peuvent ne pas refléter les dernières évolutions législatives ou jurisprudentielles.",
  },
  {
    title: '7. Limitation de responsabilité',
    content: "AVA et ses éditeurs ne sauraient être tenus responsables de toute décision prise sur la base des informations fournies par l'application, ni des conséquences directes ou indirectes résultant de l'utilisation de ces informations. L'utilisation de l'application se fait sous votre entière responsabilité.",
  },
  {
    title: '8. Absence de remplacement de l\'avocat',
    content: "AVA ne se substitue pas à un avocat. Seul un avocat inscrit au barreau est habilité à vous fournir des consultations juridiques et à vous représenter en justice. Nous vous encourageons vivement à consulter un professionnel du droit pour toute démarche juridique.",
  },
  {
    title: '9. Confidentialité',
    content: "Vos données personnelles et les échanges effectués sur AVA sont traités dans le strict respect du Règlement Général sur la Protection des Données (RGPD). Les données sont chiffrées et stockées sur des serveurs sécurisés situés en France. Elles ne sont jamais transmises à des tiers sans votre consentement explicite.",
  },
  {
    title: '10. Évolution des conditions',
    content: "Les présentes conditions générales d'utilisation peuvent être modifiées à tout moment. Vous serez informée de toute modification substantielle. La poursuite de l'utilisation de l'application après notification des modifications vaut acceptation des nouvelles conditions.",
  },
];

const CHECKBOXES = [
  "Je reconnais avoir lu et compris les présentes Conditions Générales d'Utilisation.",
  "Je comprends que les réponses fournies constituent uniquement des informations juridiques générales et non des consultations juridiques personnalisées.",
  "Je comprends que les réponses ne constituent ni une consultation juridique ni un conseil personnalisé et ne remplacent pas l'intervention d'un avocat.",
  "J'accepte les présentes Conditions Générales d'Utilisation et m'engage à utiliser l'application conformément à son objet.",
];

export default function CGUScreen({ navigation }: any) {
  const [checked, setChecked] = useState([false, false, false, false]);
  const allChecked = checked.every(Boolean);

  const toggle = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conditions d'utilisation</Text>
        <Text style={styles.headerSub}>Veuillez lire attentivement avant de continuer</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            ⚖️  AVA fournit des informations juridiques générales. Ces informations ne constituent pas une consultation juridique personnalisée.
          </Text>
        </View>
        {CGU_SECTIONS.map((s, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <Text style={styles.sectionContent}>{s.content}</Text>
          </View>
        ))}
        <View style={{ height: 200 }} />
      </ScrollView>
      <View style={styles.footer}>
        {CHECKBOXES.map((label, i) => (
          <TouchableOpacity key={i} style={styles.checkRow} onPress={() => toggle(i)}>
            <View style={[styles.checkbox, checked[i] && styles.checkboxChecked]}>
              {checked[i] && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.btn, !allChecked && styles.btnDisabled]}
          onPress={() => allChecked && navigation.navigate('Payment')}
          disabled={!allChecked}
        >
          <Text style={styles.btnText}>Accéder à l'application</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.CREAM },
  header: { backgroundColor: Colors.WHITE, padding: Spacing.LG, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  headerTitle: { fontSize: FontSize.XL, fontWeight: '700', color: Colors.INK },
  headerSub: { fontSize: FontSize.SM, color: Colors.MUTED, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.MD },
  notice: { backgroundColor: Colors.ROSE_FAINT, borderRadius: BorderRadius.MD, padding: Spacing.MD, marginBottom: Spacing.LG, borderLeftWidth: 3, borderLeftColor: Colors.ROSE },
  noticeText: { fontSize: FontSize.SM, color: Colors.ROSE_D, lineHeight: 20 },
  section: { marginBottom: Spacing.MD },
  sectionTitle: { fontSize: FontSize.MD, fontWeight: '700', color: Colors.INK, marginBottom: Spacing.XS },
  sectionContent: { fontSize: FontSize.MD, color: Colors.MUTED, lineHeight: 22 },
  footer: { backgroundColor: Colors.WHITE, padding: Spacing.MD, borderTopWidth: 1, borderTopColor: Colors.BORDER, gap: Spacing.SM },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.SM },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: Colors.BORDER, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
  checkboxChecked: { backgroundColor: Colors.ROSE, borderColor: Colors.ROSE },
  checkmark: { color: Colors.WHITE, fontSize: 12, fontWeight: '700' },
  checkLabel: { flex: 1, fontSize: FontSize.XS, color: Colors.MUTED, lineHeight: 16 },
  btn: { backgroundColor: Colors.ROSE, borderRadius: BorderRadius.MD, paddingVertical: 14, alignItems: 'center', marginTop: Spacing.XS },
  btnDisabled: { backgroundColor: Colors.PALE },
  btnText: { color: Colors.WHITE, fontSize: FontSize.MD, fontWeight: '600' },
});
