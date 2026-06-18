import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Radius, FontSize } from '../theme';

type Props = { navigation: NativeStackNavigationProp<any> };

const CGU_SECTIONS = [
  { title: '1. Objet de l\'application', text: 'La présente application est mise à disposition des utilisateurs afin de leur permettre d\'obtenir des informations juridiques générales concernant notamment : les procédures devant le juge aux affaires familiales ; les procédures de séparation et de divorce ; l\'exercice de l\'autorité parentale et les modalités de résidence des enfants ; les procédures pénales liées aux violences conjugales ou intrafamiliales.\n\nL\'utilisation de l\'application est soumise à l\'acceptation préalable des présentes Conditions Générales d\'Utilisation.' },
  { title: '2. Fonctionnement de l\'application', text: 'L\'application fournit des réponses automatisées à partir d\'une base documentaire élaborée et alimentée par notre expertise. Les réponses générées reposent exclusivement sur les contenus juridiques, pratiques et documentaires sélectionnés par nos soins. L\'application ne constitue pas un moteur de recherche juridique exhaustif et ne prétend pas couvrir l\'ensemble des situations susceptibles de se présenter.' },
  { title: '3. Information juridique et absence de conseil personnalisé', text: 'L\'application constitue un outil d\'information juridique. Les réponses fournies ont un caractère général ; sont délivrées de manière automatisée ; ne tiennent pas nécessairement compte de l\'ensemble des éléments propres à la situation de l\'utilisatrice ; ne constituent pas un conseil juridique individualisé.\n\nAucune réponse fournie par l\'application ne doit être interprétée comme une recommandation personnalisée.' },
  { title: '4. Nécessité d\'une analyse individualisée', text: 'Chaque situation juridique dépend de circonstances particulières qui ne peuvent être intégralement appréhendées par un système automatisé. L\'utilisatrice reconnaît que seule une analyse complète de son dossier par un avocat permet d\'apprécier les spécificités de sa situation, d\'évaluer les risques juridiques et de définir une stratégie adaptée.' },
  { title: '5. Exclusion des situations d\'urgence', text: 'L\'application ne doit pas être utilisée pour une situation de danger immédiat, une situation nécessitant une intervention urgente, la gestion d\'un délai procédural imminent, ou toute situation nécessitant une réponse juridique rapide et individualisée.\n\nEn cas d\'urgence, l\'utilisatrice doit contacter directement son avocat, les services compétents ou les autorités concernées.' },
  { title: '6. Absence de garantie de résultat', text: 'AVA ne garantit ni l\'exhaustivité des réponses, ni l\'absence d\'erreur ou d\'omission, ni l\'adéquation des réponses à une situation particulière, ni l\'obtention d\'un résultat judiciaire ou administratif déterminé.' },
  { title: '7. Limitation de responsabilité', text: 'L\'application constitue un outil d\'assistance et d\'information. L\'utilisatrice reconnaît utiliser les informations fournies sous sa responsabilité. AVA ne pourra être tenu responsable d\'une mauvaise compréhension ou interprétation des réponses, d\'une décision prise sur la seule base des informations fournies, ou des conséquences directes ou indirectes résultant de l\'utilisation de l\'application.' },
  { title: '8. Absence de remplacement de l\'avocat', text: 'L\'application est conçue comme un outil complémentaire destiné à faciliter l\'accès à l\'information juridique. Elle n\'a pas vocation à remplacer l\'intervention d\'un avocat, son analyse juridique, ses consultations, ses conseils ou son assistance dans le cadre d\'une procédure.' },
  { title: '9. Confidentialité', text: 'Les échanges réalisés via l\'application sont traités dans le respect des obligations de confidentialité. Toutefois, l\'utilisatrice est invitée à ne communiquer que les informations strictement nécessaires à sa demande et à éviter la transmission de données sans lien avec sa question.' },
  { title: '10. Évolution des conditions d\'utilisation', text: 'AVA se réserve le droit de modifier à tout moment les présentes Conditions Générales d\'Utilisation afin de tenir compte de l\'évolution de la réglementation, de l\'évolution des fonctionnalités de l\'application, ou de toute nécessité juridique ou technique.' },
];

const CHECKBOXES = [
  'Je reconnais avoir lu et compris les présentes Conditions Générales d\'Utilisation.',
  'Je comprends que les réponses fournies constituent uniquement des informations juridiques générales et ne remplacent pas un conseil personnalisé.',
  'Je comprends que les réponses ne constituent ni une consultation juridique, ni une stratégie procédurale, ni une garantie de résultat.',
  'J\'accepte les présentes Conditions Générales d\'Utilisation et souhaite accéder à l\'application.',
];

export default function CGUScreen({ navigation }: Props) {
  const [checked, setChecked] = useState([false, false, false, false]);
  const allChecked = checked.every(Boolean);

  const toggle = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Conditions d'utilisation</Text>
        <Text style={s.sub}>Veuillez lire et accepter avant de continuer</Text>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {CGU_SECTIONS.map((sec, i) => (
          <View key={i} style={s.section}>
            <Text style={s.secTitle}>{sec.title}</Text>
            <Text style={s.secText}>{sec.text}</Text>
          </View>
        ))}
        <View style={s.notice}>
          <Text style={s.noticeText}>
            Cette application est un outil d'information juridique. Les réponses fournies sont générales et automatisées. Elles ne remplacent pas une consultation juridique individualisée avec votre avocat.
          </Text>
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={s.footer}>
        {CHECKBOXES.map((label, i) => (
          <TouchableOpacity key={i} style={s.chkRow} onPress={() => toggle(i)}>
            <View style={[s.chkBox, checked[i] && s.chkBoxOn]}>
              {checked[i] && <Text style={s.chkMark}>✓</Text>}
            </View>
            <Text style={s.chkLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[s.btnRose, !allChecked && s.btnDisabled]}
          onPress={() => allChecked && navigation.navigate('Payment')}
          disabled={!allChecked}
        >
          <Text style={s.btnText}>Accéder à l'application</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  header: { paddingTop: 56, paddingHorizontal: Spacing.LG, paddingBottom: Spacing.MD, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  title: { fontFamily: 'serif', fontSize: 24, fontWeight: '400', color: Colors.INK },
  sub: { fontSize: FontSize.SM, color: Colors.MUTED, marginTop: 3 },
  scroll: { flex: 1, paddingHorizontal: Spacing.LG },
  section: { marginBottom: 20, marginTop: 16 },
  secTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase', color: Colors.ROSE_D, marginBottom: 8 },
  secText: { fontSize: FontSize.SM, color: Colors.MUTED, lineHeight: 20 },
  notice: { backgroundColor: Colors.ROSE_FAINT, borderWidth: 1.5, borderColor: 'rgba(184,92,114,0.2)', borderRadius: Radius.MD, padding: 14, marginVertical: 8 },
  noticeText: { fontSize: FontSize.SM, color: Colors.ROSE_D, lineHeight: 22, fontWeight: '500', textAlign: 'center' },
  footer: { borderTopWidth: 1, borderTopColor: Colors.BORDER, paddingHorizontal: Spacing.LG, paddingTop: 16, paddingBottom: 28, backgroundColor: Colors.WHITE },
  chkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  chkBox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: Colors.BORDER, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  chkBoxOn: { backgroundColor: Colors.ROSE, borderColor: Colors.ROSE },
  chkMark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  chkLabel: { flex: 1, fontSize: FontSize.SM, color: Colors.MUTED, lineHeight: 20 },
  btnRose: { height: 52, borderRadius: Radius.MD, backgroundColor: Colors.ROSE, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '500' },
});
