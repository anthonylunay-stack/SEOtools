import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Radius, FontSize } from '../theme';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <TouchableOpacity
      style={[tg.track, value && tg.trackOn]}
      onPress={() => onChange(!value)}
      activeOpacity={0.8}
    >
      <View style={[tg.knob, value && tg.knobOn]} />
    </TouchableOpacity>
  );
}

const tg = StyleSheet.create({
  track: { width: 44, height: 26, borderRadius: 13, backgroundColor: Colors.PALE, justifyContent: 'center', paddingHorizontal: 3 },
  trackOn: { backgroundColor: Colors.ROSE },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 },
  knobOn: { alignSelf: 'flex-end' },
});

function Row({ ico, title, sub, onPress }: { ico: string; title: string; sub?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={r.row} onPress={onPress}>
      <View style={r.ico}><Text style={r.icoText}>{ico}</Text></View>
      <View style={r.text}>
        <Text style={r.title}>{title}</Text>
        {!!sub && <Text style={r.sub}>{sub}</Text>}
      </View>
      <Text style={r.arr}>›</Text>
    </TouchableOpacity>
  );
}

const r = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  ico: { width: 32, height: 32, borderRadius: Radius.SM, backgroundColor: Colors.ROSE_L, alignItems: 'center', justifyContent: 'center' },
  icoText: { fontSize: 16 },
  text: { flex: 1 },
  title: { fontSize: 14, color: Colors.INK },
  sub: { fontSize: 12, color: Colors.MUTED, marginTop: 2 },
  arr: { fontSize: 20, color: Colors.INK, opacity: 0.2 },
});

type SubScreen = null | 'subscription' | 'notif' | 'privacy' | 'disguise';

const ICONS = [
  { name: 'Aucune', emoji: '☀️' },
  { name: 'Calculatrice', emoji: '🧮' },
  { name: 'Météo', emoji: '🌤️' },
  { name: 'Agenda', emoji: '📅' },
  { name: 'Notes', emoji: '📝' },
  { name: 'Réglages', emoji: '⚙️' },
  { name: 'Santé', emoji: '❤️' },
  { name: 'App Store', emoji: '📦' },
  { name: 'Plans', emoji: '🗺️' },
];

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const [sub, setSub] = useState<SubScreen>(null);
  const [renewOn, setRenewOn] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('Aucune');
  const [pendingIcon, setPendingIcon] = useState('Aucune');
  const [notif, setNotif] = useState({ alerts: true, reminders: true, updates: false, discreet: true });
  const [privacy, setPrivacy] = useState({ hideRecents: false, biometric: true, hideNotifs: true, autoDelete: false, noScreenshot: true });

  const open = (s: SubScreen) => setSub(s);
  const close = () => setSub(null);

  return (
    <View style={s.container}>
      <View style={s.header}><Text style={s.title}>Réglages</Text></View>

      <ScrollView style={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.profileCard}>
          <View style={s.avatar}><Text style={{ fontSize: 22 }}>👤</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.profileName}>Utilisatrice</Text>
            <Text style={s.profileEmail}>compte@exemple.fr</Text>
          </View>
          <View style={s.badge}><Text style={s.badgeText}>Actif</Text></View>
        </View>

        <Text style={s.secTitle}>ABONNEMENT</Text>
        <View style={s.group}>
          <Row ico="⭐" title="Mon abonnement" sub="Accès complet · 10 €" onPress={() => open('subscription')} />
        </View>

        <Text style={s.secTitle}>NOTIFICATIONS</Text>
        <View style={s.group}>
          <Row ico="🔔" title="Gérer les notifications" sub="Alertes, rappels, mode discret" onPress={() => open('notif')} />
        </View>

        <Text style={s.secTitle}>CONFIDENTIALITÉ & PROTECTION</Text>
        <View style={s.group}>
          <Row ico="🔒" title="Paramètres de confidentialité" sub="Masquage, verrouillage, effacement" onPress={() => open('privacy')} />
          <Row ico="👁️" title="Icône de camouflage" sub={selectedIcon === 'Aucune' ? 'Non activé' : `Actif — ${selectedIcon}`} onPress={() => open('disguise')} />
        </View>

        <Text style={s.secTitle}>COMPTE</Text>
        <View style={[s.group, { marginBottom: 40 }]}>
          <Row ico="🚪" title="Se déconnecter" onPress={() => navigation.replace('Splash')} />
        </View>
      </ScrollView>

      {/* SUB: SUBSCRIPTION */}
      <Modal visible={sub === 'subscription'} animationType="slide">
        <View style={m.container}>
          <View style={m.header}>
            <TouchableOpacity onPress={close}><Text style={m.back}>‹</Text></TouchableOpacity>
            <Text style={m.title}>Mon abonnement</Text>
          </View>
          <ScrollView style={m.body}>
            <View style={m.subCard}>
              <Text style={m.subCardTitle}>Accès complet AVA</Text>
              <Text style={m.subCardDesc}>Conversations illimitées, accès à toutes les ressources juridiques et mises à jour incluses.</Text>
              <View style={m.subPrice}><Text style={m.subPriceAmt}>10 €</Text><Text style={m.subPricePer}> / mois</Text></View>
            </View>
            <View style={m.statusBox}>
              <View style={[m.statusDot, { backgroundColor: cancelled ? Colors.DANGER : renewOn ? Colors.GREEN : Colors.AMBER }]} />
              <View style={{ flex: 1 }}>
                <Text style={m.statusTitle}>{cancelled ? 'Abonnement résilié' : renewOn ? 'Renouvellement actif' : 'Renouvellement désactivé'}</Text>
                <Text style={m.statusSub}>{cancelled ? 'Accès actif jusqu\'au 26 juin 2026' : renewOn ? 'Prochain prélèvement le 26 juin 2026' : 'Accès actif jusqu\'au 26 juin 2026'}</Text>
              </View>
            </View>
            {!cancelled && (
              <View style={m.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={m.toggleTitle}>Renouvellement automatique</Text>
                  <Text style={m.toggleSub}>Désactivez pour ne pas renouveler à échéance</Text>
                </View>
                <Toggle value={renewOn} onChange={setRenewOn} />
              </View>
            )}
            {!renewOn && !cancelled && (
              <View style={m.notice}>
                <Text style={m.noticeText}>⚠️ Le renouvellement automatique est désactivé. Votre accès restera actif jusqu'au 26 juin 2026.</Text>
              </View>
            )}
            {!cancelled && (
              <TouchableOpacity style={m.dangerBtn} onPress={() => setCancelModal(true)}>
                <Text style={m.dangerBtnText}>Résilier l'abonnement</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
        <Modal visible={cancelModal} transparent animationType="slide">
          <View style={cm.overlay}>
            <View style={cm.sheet}>
              <Text style={cm.title}>Résilier l'abonnement ?</Text>
              <Text style={cm.text}>Votre accès restera actif jusqu'au <Text style={{ color: Colors.INK, fontWeight: '600' }}>26 juin 2026</Text>. Après cette date, vous n'aurez plus accès à AVA.</Text>
              <TouchableOpacity style={cm.confirmBtn} onPress={() => { setCancelled(true); setRenewOn(false); setCancelModal(false); }}>
                <Text style={cm.confirmText}>Confirmer la résiliation</Text>
              </TouchableOpacity>
              <TouchableOpacity style={cm.cancelBtn} onPress={() => setCancelModal(false)}>
                <Text style={cm.cancelText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Modal>

      {/* SUB: NOTIFICATIONS */}
      <Modal visible={sub === 'notif'} animationType="slide">
        <View style={m.container}>
          <View style={m.header}>
            <TouchableOpacity onPress={close}><Text style={m.back}>‹</Text></TouchableOpacity>
            <Text style={m.title}>Notifications</Text>
          </View>
          <ScrollView style={m.body}>
            <View style={m.group}>
              {([['alerts', 'Alertes juridiques', 'Nouvelles informations sur vos droits'], ['reminders', 'Rappels de démarches', 'Suivi de vos procédures en cours'], ['updates', 'Mises à jour de l\'app', 'Nouvelles fonctionnalités AVA'], ['discreet', 'Mode discret', 'Notifications sans aperçu visible']] as const).map(([key, title, sub]) => (
                <View key={key} style={m.notifRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={m.notifTitle}>{title}</Text>
                    <Text style={m.notifSub}>{sub}</Text>
                  </View>
                  <Toggle value={notif[key]} onChange={v => setNotif(n => ({ ...n, [key]: v }))} />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* SUB: PRIVACY */}
      <Modal visible={sub === 'privacy'} animationType="slide">
        <View style={m.container}>
          <View style={m.header}>
            <TouchableOpacity onPress={close}><Text style={m.back}>‹</Text></TouchableOpacity>
            <Text style={m.title}>Confidentialité</Text>
          </View>
          <ScrollView style={m.body}>
            <View style={m.privNotice}><Text style={m.privNoticeText}><Text style={{ fontWeight: '600', color: Colors.INK }}>Protection contre la surveillance</Text> — Ces options protègent votre vie privée si votre téléphone est consulté par un tiers.</Text></View>
            <View style={m.group}>
              {([['hideRecents', 'Masquer de l\'écran d\'accueil', 'L\'app n\'apparaît pas dans les apps récentes'], ['biometric', 'Verrouillage Face ID / Touch ID', 'Authentification requise à l\'ouverture'], ['hideNotifs', 'Masquer les notifications', 'Aucun aperçu sur l\'écran de verrouillage'], ['autoDelete', 'Effacement automatique', 'Supprimer l\'historique après 24h'], ['noScreenshot', 'Capture d\'écran désactivée', 'Empêche les screenshots dans l\'app']] as const).map(([key, title, sub]) => (
                <View key={key} style={m.notifRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={m.notifTitle}>{title}</Text>
                    <Text style={m.notifSub}>{sub}</Text>
                  </View>
                  <Toggle value={privacy[key]} onChange={v => setPrivacy(p => ({ ...p, [key]: v }))} />
                </View>
              ))}
            </View>
            <TouchableOpacity style={m.dangerBtn} onPress={() => Alert.alert('Historique effacé', 'Toutes vos conversations ont été supprimées.')}>
              <Text style={m.dangerBtnText}>Effacer tout l'historique</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* SUB: DISGUISE */}
      <Modal visible={sub === 'disguise'} animationType="slide">
        <View style={m.container}>
          <View style={m.header}>
            <TouchableOpacity onPress={close}><Text style={m.back}>‹</Text></TouchableOpacity>
            <Text style={m.title}>Icône de camouflage</Text>
          </View>
          <ScrollView style={m.body}>
            <View style={m.privNotice}><Text style={m.privNoticeText}>Choisissez une fausse icône. Sur votre écran d'accueil, AVA apparaîtra comme une autre application.</Text></View>
            <View style={dg.grid}>
              {ICONS.map(ic => (
                <TouchableOpacity key={ic.name} style={[dg.opt, pendingIcon === ic.name && dg.optSel]} onPress={() => setPendingIcon(ic.name)}>
                  <Text style={dg.emoji}>{ic.emoji}</Text>
                  <Text style={[dg.label, pendingIcon === ic.name && { color: Colors.ROSE_D, fontWeight: '500' }]}>{ic.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[m.roseBtn, { marginTop: 16 }]} onPress={() => { setSelectedIcon(pendingIcon); close(); }}>
              <Text style={m.roseBtnText}>Appliquer</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const dg = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  opt: { width: '30%', backgroundColor: Colors.WHITE, borderWidth: 1.5, borderColor: Colors.BORDER, borderRadius: Radius.MD, padding: 14, alignItems: 'center', gap: 8 },
  optSel: { borderColor: Colors.ROSE, backgroundColor: Colors.ROSE_FAINT },
  emoji: { fontSize: 32 },
  label: { fontSize: 11, color: Colors.MUTED, textAlign: 'center' },
});

const cm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(34,30,27,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.WHITE, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 24, paddingBottom: 36 },
  title: { fontFamily: 'serif', fontSize: 22, fontWeight: '400', color: Colors.INK, marginBottom: 8 },
  text: { fontSize: FontSize.SM, color: Colors.MUTED, lineHeight: 22, marginBottom: 24 },
  confirmBtn: { height: 50, backgroundColor: Colors.DANGER, borderRadius: Radius.MD, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  confirmText: { color: '#fff', fontSize: 15, fontWeight: '500' },
  cancelBtn: { height: 46, borderWidth: 1, borderColor: Colors.BORDER, borderRadius: Radius.MD, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 15, color: Colors.MUTED },
});

const m = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.CREAM },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.WHITE, borderBottomWidth: 1, borderBottomColor: Colors.BORDER, paddingTop: 56, paddingHorizontal: Spacing.MD, paddingBottom: 14 },
  back: { fontSize: 28, color: Colors.INK, opacity: 0.55, marginRight: 4 },
  title: { fontFamily: 'serif', fontSize: FontSize.XL, fontWeight: '400', color: Colors.INK },
  body: { flex: 1, padding: Spacing.MD },
  subCard: { backgroundColor: Colors.ROSE, borderRadius: 18, padding: 22, marginBottom: 12 },
  subCardTitle: { fontFamily: 'serif', fontSize: 22, color: '#fff', marginBottom: 4 },
  subCardDesc: { fontSize: FontSize.SM, color: 'rgba(255,255,255,0.75)', lineHeight: 20 },
  subPrice: { flexDirection: 'row', alignItems: 'baseline', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, marginTop: 14, alignSelf: 'flex-start' },
  subPriceAmt: { fontFamily: 'serif', fontSize: 28, color: '#fff' },
  subPricePer: { fontSize: FontSize.SM, color: 'rgba(255,255,255,0.7)' },
  statusBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BORDER, borderRadius: Radius.MD, padding: 14, marginBottom: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusTitle: { fontSize: 14, fontWeight: '500', color: Colors.INK },
  statusSub: { fontSize: 12, color: Colors.MUTED, marginTop: 2 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BORDER, borderRadius: Radius.MD, padding: 14, gap: 12, marginBottom: 8 },
  toggleTitle: { fontSize: 14, fontWeight: '500', color: Colors.INK },
  toggleSub: { fontSize: 12, color: Colors.MUTED, marginTop: 2 },
  notice: { backgroundColor: '#FFF8ED', borderWidth: 1, borderColor: 'rgba(184,135,51,0.2)', borderRadius: Radius.MD, padding: 14, marginBottom: 12 },
  noticeText: { fontSize: FontSize.SM, color: '#7A5C1E', lineHeight: 22 },
  group: { backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BORDER, borderRadius: Radius.MD, overflow: 'hidden', marginBottom: 12 },
  notifRow: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  notifTitle: { fontSize: 14, fontWeight: '500', color: Colors.INK },
  notifSub: { fontSize: 12, color: Colors.MUTED, marginTop: 2 },
  privNotice: { backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BORDER, borderRadius: Radius.MD, padding: 16, marginBottom: 14 },
  privNoticeText: { fontSize: FontSize.SM, color: Colors.MUTED, lineHeight: 22 },
  dangerBtn: { height: 46, borderWidth: 1, borderColor: 'rgba(192,57,43,0.3)', borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  dangerBtnText: { color: Colors.DANGER, fontSize: 14, fontWeight: '500' },
  roseBtn: { height: 52, backgroundColor: Colors.ROSE, borderRadius: Radius.MD, alignItems: 'center', justifyContent: 'center' },
  roseBtnText: { color: '#fff', fontSize: 15, fontWeight: '500' },
});

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.CREAM },
  header: { backgroundColor: Colors.WHITE, paddingTop: 16, paddingHorizontal: Spacing.LG, paddingBottom: Spacing.MD, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  title: { fontFamily: 'serif', fontSize: FontSize.XXL, fontWeight: '400', color: Colors.INK },
  body: { flex: 1, padding: Spacing.MD },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BORDER, borderRadius: Radius.LG, padding: 18, marginBottom: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.ROSE_L, alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 16, fontWeight: '500', color: Colors.INK },
  profileEmail: { fontSize: 12, color: Colors.MUTED, marginTop: 2 },
  badge: { backgroundColor: Colors.ROSE_L, borderWidth: 1, borderColor: 'rgba(184,92,114,0.2)', borderRadius: Radius.SM, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, color: Colors.ROSE_D, fontWeight: '500' },
  secTitle: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.MUTED, opacity: 0.7, marginBottom: 8, marginTop: 4 },
  group: { backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BORDER, borderRadius: Radius.MD, overflow: 'hidden', marginBottom: 22 },
});
