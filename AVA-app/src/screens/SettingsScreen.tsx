import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme';

type SubScreen = 'main' | 'subscription' | 'notifications' | 'privacy' | 'camouflage';

const ICONS = ['Aucune', 'Calculatrice', 'Météo', 'Agenda', 'Notes', 'Réglages', 'Santé', 'App Store', 'Plans'];
const ICON_EMOJIS: Record<string, string> = {
  Aucune: '🚫', Calculatrice: '🧮', Météo: '🌤', Agenda: '📅', Notes: '📝',
  Réglages: '⚙️', Santé: '❤️', 'App Store': '📦', Plans: '🗺',
};

export default function SettingsScreen({ navigation }: any) {
  const [screen, setScreen] = useState<SubScreen>('main');
  const [selectedIcon, setSelectedIcon] = useState('Aucune');
  const [pendingIcon, setPendingIcon] = useState('Aucune');
  const [renewActive, setRenewActive] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [notifications, setNotifications] = useState({ alerts: true, reminders: true, updates: false, discreet: true });
  const [privacy, setPrivacy] = useState({ hideRecents: false, biometric: true, hideNotifs: true, autoDelete: false, noScreenshot: true });

  const toggleNotif = (key: keyof typeof notifications) => setNotifications((p) => ({ ...p, [key]: !p[key] }));
  const togglePrivacy = (key: keyof typeof privacy) => setPrivacy((p) => ({ ...p, [key]: !p[key] }));

  const Row = ({ label, value, onPress, danger }: { label: string; value?: string; onPress: () => void; danger?: boolean }) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Text style={[styles.rowLabel, danger && { color: Colors.DANGER }]}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      <Text style={styles.rowChevron}>›</Text>
    </TouchableOpacity>
  );

  const ToggleRow = ({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: () => void }) => (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {desc && <Text style={styles.rowDesc}>{desc}</Text>}
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ false: Colors.PALE, true: Colors.ROSE_L }} thumbColor={value ? Colors.ROSE : Colors.MUTED} />
    </View>
  );

  // --- Main Screen ---
  if (screen === 'main') return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Réglages</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>👤</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Utilisatrice</Text>
            <Text style={styles.profileEmail}>contact@ava-app.fr</Text>
          </View>
          <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>Actif</Text></View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abonnement</Text>
          <View style={styles.card}>
            <Row label="Mon abonnement" value="10€/mois" onPress={() => setScreen('subscription')} />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <Row label="Notifications" onPress={() => setScreen('notifications')} />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confidentialité & Protection</Text>
          <View style={styles.card}>
            <Row label="Paramètres de confidentialité" onPress={() => setScreen('privacy')} />
            <View style={styles.cardDivider} />
            <Row label={`Icône de camouflage : ${selectedIcon}`} onPress={() => { setPendingIcon(selectedIcon); setScreen('camouflage'); }} />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          <View style={styles.card}>
            <Row label="Se déconnecter" danger onPress={() => navigation?.navigate('Splash')} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // --- Subscription ---
  if (screen === 'subscription') return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('main')}><Text style={styles.backBtn}>‹ Retour</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Mon abonnement</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.subCard}>
          <Text style={styles.subCardTitle}>Accès complet AVA</Text>
          <Text style={styles.subCardPrice}>10 € / mois</Text>
        </View>
        <View style={[styles.card, styles.statusBox]}>
          <View style={styles.onlineDot} />
          <View>
            <Text style={styles.rowLabel}>Renouvellement {renewActive ? 'actif' : 'désactivé'}</Text>
            <Text style={styles.rowDesc}>Prochain renouvellement : 18 juillet 2026</Text>
          </View>
        </View>
        <View style={styles.card}>
          <ToggleRow label="Renouvellement automatique" value={renewActive} onChange={() => setRenewActive((p) => !p)} />
        </View>
        {!renewActive && (
          <View style={styles.amberNotice}>
            <Text style={styles.amberNoticeText}>⚠️  Votre abonnement ne sera pas renouvelé. Vous conservez l'accès jusqu'au 18 juillet 2026.</Text>
          </View>
        )}
        <View style={[styles.card, { padding: Spacing.MD }]}>
          <Text style={styles.rowLabel}>🔒 Paiement sécurisé</Text>
          <Text style={styles.rowDesc}>Traitement via Stripe. Données bancaires chiffrées et jamais stockées.</Text>
        </View>
        <TouchableOpacity style={styles.dangerBtn} onPress={() => setShowCancelModal(true)}>
          <Text style={styles.dangerBtnText}>Résilier l'abonnement</Text>
        </TouchableOpacity>
        <Modal visible={showCancelModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Résilier l'abonnement ?</Text>
              <Text style={styles.modalDesc}>Vous conserverez l'accès jusqu'à la fin de la période en cours. Cette action est irréversible.</Text>
              <TouchableOpacity style={styles.dangerBtn} onPress={() => { setShowCancelModal(false); Alert.alert('Résiliation confirmée', 'Votre abonnement sera résilié à la fin de la période.'); }}>
                <Text style={styles.dangerBtnText}>Confirmer la résiliation</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ghostBtn} onPress={() => setShowCancelModal(false)}>
                <Text style={styles.ghostBtnText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );

  // --- Notifications ---
  if (screen === 'notifications') return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('main')}><Text style={styles.backBtn}>‹ Retour</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <ToggleRow label="Alertes juridiques" desc="Nouvelles importantes concernant vos droits" value={notifications.alerts} onChange={() => toggleNotif('alerts')} />
          <View style={styles.cardDivider} />
          <ToggleRow label="Rappels démarches" desc="Rappels pour vos démarches en cours" value={notifications.reminders} onChange={() => toggleNotif('reminders')} />
          <View style={styles.cardDivider} />
          <ToggleRow label="Mises à jour app" desc="Nouvelles fonctionnalités d'AVA" value={notifications.updates} onChange={() => toggleNotif('updates')} />
          <View style={styles.cardDivider} />
          <ToggleRow label="Mode discret" desc="Notifications sans aperçu du contenu" value={notifications.discreet} onChange={() => toggleNotif('discreet')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // --- Privacy ---
  if (screen === 'privacy') return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('main')}><Text style={styles.backBtn}>‹ Retour</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Confidentialité</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>🛡  Ces paramètres vous protègent en cas de surveillance. Activez-les selon votre situation.</Text>
        </View>
        <View style={styles.card}>
          <ToggleRow label="Masquer dans les apps récentes" desc="AVA n'apparaît pas dans le gestionnaire d'applications" value={privacy.hideRecents} onChange={() => togglePrivacy('hideRecents')} />
          <View style={styles.cardDivider} />
          <ToggleRow label="Face ID / Touch ID" desc="Déverrouillez AVA avec votre empreinte ou visage" value={privacy.biometric} onChange={() => togglePrivacy('biometric')} />
          <View style={styles.cardDivider} />
          <ToggleRow label="Masquer les notifications" desc="Les notifications n'affichent pas le contenu des messages" value={privacy.hideNotifs} onChange={() => togglePrivacy('hideNotifs')} />
          <View style={styles.cardDivider} />
          <ToggleRow label="Effacement automatique" desc="Supprime l'historique après 7 jours d'inactivité" value={privacy.autoDelete} onChange={() => togglePrivacy('autoDelete')} />
          <View style={styles.cardDivider} />
          <ToggleRow label="Désactiver les screenshots" desc="Empêche la capture d'écran dans AVA" value={privacy.noScreenshot} onChange={() => togglePrivacy('noScreenshot')} />
        </View>
        <TouchableOpacity style={styles.dangerBtn} onPress={() => Alert.alert('Effacement', "Tout l'historique a été effacé.")}>
          <Text style={styles.dangerBtnText}>Effacer tout l'historique</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  // --- Camouflage ---
  if (screen === 'camouflage') return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('main')}><Text style={styles.backBtn}>‹ Retour</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Icône de camouflage</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>🎭  Choisissez une icône neutre pour qu'AVA ressemble à une autre application sur votre écran d'accueil.</Text>
        </View>
        <View style={styles.iconGrid}>
          {ICONS.map((icon) => (
            <TouchableOpacity
              key={icon}
              style={[styles.iconCell, pendingIcon === icon && styles.iconCellActive]}
              onPress={() => setPendingIcon(icon)}
            >
              <Text style={styles.iconEmoji}>{ICON_EMOJIS[icon]}</Text>
              <Text style={[styles.iconLabel, pendingIcon === icon && { color: Colors.ROSE }]}>{icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => { setSelectedIcon(pendingIcon); setScreen('main'); }}>
          <Text style={styles.primaryBtnText}>Appliquer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.CREAM },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.WHITE, padding: Spacing.MD, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  headerTitle: { fontSize: FontSize.LG, fontWeight: '700', color: Colors.INK },
  backBtn: { fontSize: FontSize.LG, color: Colors.ROSE, minWidth: 60 },
  content: { padding: Spacing.MD, gap: Spacing.MD },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.MD, backgroundColor: Colors.WHITE, borderRadius: BorderRadius.LG, padding: Spacing.MD, borderWidth: 1, borderColor: Colors.BORDER },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.ROSE_FAINT, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24 },
  profileName: { fontSize: FontSize.MD, fontWeight: '700', color: Colors.INK },
  profileEmail: { fontSize: FontSize.SM, color: Colors.MUTED },
  activeBadge: { backgroundColor: Colors.SUCCESS, borderRadius: BorderRadius.FULL, paddingHorizontal: Spacing.SM, paddingVertical: 2 },
  activeBadgeText: { color: Colors.WHITE, fontSize: FontSize.XS, fontWeight: '600' },
  section: { gap: Spacing.XS },
  sectionTitle: { fontSize: FontSize.SM, fontWeight: '600', color: Colors.MUTED, textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: Colors.WHITE, borderRadius: BorderRadius.LG, borderWidth: 1, borderColor: Colors.BORDER, overflow: 'hidden' },
  cardDivider: { height: 1, backgroundColor: Colors.BORDER },
  row: { flexDirection: 'row', alignItems: 'center', padding: Spacing.MD, gap: Spacing.SM },
  rowLabel: { flex: 1, fontSize: FontSize.MD, color: Colors.INK },
  rowValue: { fontSize: FontSize.SM, color: Colors.MUTED },
  rowChevron: { fontSize: 20, color: Colors.MUTED },
  rowDesc: { fontSize: FontSize.XS, color: Colors.MUTED, marginTop: 2 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.MD, gap: Spacing.SM },
  subCard: { backgroundColor: Colors.ROSE, borderRadius: BorderRadius.LG, padding: Spacing.LG, alignItems: 'center' },
  subCardTitle: { fontSize: FontSize.MD, color: Colors.WHITE, fontWeight: '600' },
  subCardPrice: { fontSize: FontSize.XXXL, color: Colors.WHITE, fontWeight: '800', marginTop: Spacing.XS },
  statusBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.MD, padding: Spacing.MD },
  onlineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.SUCCESS },
  amberNotice: { backgroundColor: 'rgba(184,115,51,0.1)', borderRadius: BorderRadius.MD, padding: Spacing.MD, borderLeftWidth: 3, borderLeftColor: Colors.AMBER },
  amberNoticeText: { fontSize: FontSize.SM, color: Colors.AMBER, lineHeight: 20 },
  dangerBtn: { backgroundColor: 'rgba(192,57,43,0.1)', borderRadius: BorderRadius.MD, padding: Spacing.MD, alignItems: 'center', borderWidth: 1, borderColor: Colors.DANGER },
  dangerBtnText: { color: Colors.DANGER, fontWeight: '600', fontSize: FontSize.MD },
  ghostBtn: { borderRadius: BorderRadius.MD, padding: Spacing.MD, alignItems: 'center', borderWidth: 1, borderColor: Colors.BORDER },
  ghostBtnText: { color: Colors.MUTED, fontSize: FontSize.MD },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.WHITE, borderTopLeftRadius: BorderRadius.XL, borderTopRightRadius: BorderRadius.XL, padding: Spacing.LG, gap: Spacing.MD },
  modalTitle: { fontSize: FontSize.XL, fontWeight: '700', color: Colors.INK },
  modalDesc: { fontSize: FontSize.MD, color: Colors.MUTED, lineHeight: 22 },
  noticeCard: { backgroundColor: Colors.ROSE_FAINT, borderRadius: BorderRadius.MD, padding: Spacing.MD, borderLeftWidth: 3, borderLeftColor: Colors.ROSE },
  noticeText: { fontSize: FontSize.SM, color: Colors.ROSE_D, lineHeight: 20 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.SM },
  iconCell: { width: '30%', aspectRatio: 1, backgroundColor: Colors.WHITE, borderRadius: BorderRadius.LG, borderWidth: 2, borderColor: Colors.BORDER, alignItems: 'center', justifyContent: 'center', gap: Spacing.XS },
  iconCellActive: { borderColor: Colors.ROSE, backgroundColor: Colors.ROSE_FAINT },
  iconEmoji: { fontSize: 28 },
  iconLabel: { fontSize: FontSize.XS, color: Colors.MUTED, textAlign: 'center' },
  primaryBtn: { backgroundColor: Colors.ROSE, borderRadius: BorderRadius.MD, padding: Spacing.MD, alignItems: 'center' },
  primaryBtnText: { color: Colors.WHITE, fontWeight: '600', fontSize: FontSize.MD },
});
