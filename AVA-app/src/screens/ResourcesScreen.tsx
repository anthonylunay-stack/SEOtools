import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Linking } from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../theme';

interface AccordionItem {
  id: string;
  title: string;
  sub: string;
  color: string;
  content: React.ReactNode;
}

function Accordion({ item, isOpen, onToggle }: { item: AccordionItem; isOpen: boolean; onToggle: () => void }) {
  const anim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(anim, { toValue: isOpen ? 1 : 0, duration: 300, useNativeDriver: false }).start();
  }, [isOpen]);

  const maxHeight = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 600] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={acc.item}>
      <TouchableOpacity style={acc.trigger} onPress={onToggle}>
        <View style={[acc.ico, { backgroundColor: item.color + '22' }]}>
          <Text style={[acc.icoText, { color: item.color }]}>●</Text>
        </View>
        <View style={acc.text}>
          <Text style={acc.title}>{item.title}</Text>
          <Text style={acc.sub}>{item.sub}</Text>
        </View>
        <Animated.Text style={[acc.chevron, { transform: [{ rotate }] }]}>›</Animated.Text>
      </TouchableOpacity>
      <Animated.View style={[acc.content, { maxHeight }]}>
        <View style={acc.inner}>{item.content}</View>
      </Animated.View>
    </View>
  );
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>{title}</Text>
      <Text style={s.cardText}>{text}</Text>
    </View>
  );
}

function Step({ num, title, text }: { num: number; title: string; text: string }) {
  return (
    <View style={s.stepRow}>
      <View style={s.stepNum}><Text style={s.stepNumText}>{num}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={s.stepTitle}>{title}</Text>
        <Text style={s.stepText}>{text}</Text>
      </View>
    </View>
  );
}

function ECall({ num, label, color, tel }: { num: string; label: string; color: string; tel: string }) {
  return (
    <TouchableOpacity style={[s.ecall, { backgroundColor: color }]} onPress={() => Linking.openURL(`tel:${tel}`)}>
      <Text style={s.ecallNum}>{num}</Text>
      <Text style={s.ecallLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ResourcesScreen() {
  const [open, setOpen] = useState<string | null>(null);

  const items: AccordionItem[] = [
    {
      id: 'droits', title: 'Vos droits', sub: 'Ce que la loi vous garantit', color: Colors.ROSE,
      content: (
        <>
          <Card title="Ordonnance de protection" text="Le Juge aux Affaires Familiales peut délivrer une ordonnance en urgence dans un délai de 6 jours. Elle peut interdire au conjoint de vous approcher, vous attribuer la jouissance du domicile et suspendre les droits de visite." />
          <Card title="Dépôt de plainte" text="Vous pouvez déposer plainte à tout moment, même sans preuves physiques. La police ou la gendarmerie est légalement tenue d'enregistrer votre plainte." />
          <Card title="Éviction du conjoint violent" text="Le juge peut ordonner l'expulsion du conjoint violent du domicile conjugal, même s'il en est propriétaire ou co-propriétaire." />
          <Card title="Aide juridictionnelle" text="Selon vos ressources, vous pouvez bénéficier d'une prise en charge totale ou partielle des frais d'avocat et de procédure judiciaire." />
          <Card title="Accès à un avocat d'urgence" text="Via le barreau de votre département, vous pouvez obtenir une consultation juridique gratuite, même en dehors des heures d'ouverture." />
        </>
      ),
    },
    {
      id: 'etapes', title: 'Étapes de la procédure', sub: 'De la plainte au jugement', color: '#3B82F6',
      content: (
        <View style={s.card}>
          <Step num={1} title="Signalement ou plainte" text="Commissariat, gendarmerie ou directement au procureur. Vous recevez un récépissé." />
          <Step num={2} title="Enquête de police" text="Auditions, collecte de preuves, certificats médicaux. Peut durer quelques semaines." />
          <Step num={3} title="Décision du parquet" text="Le procureur décide de classer, d'un rappel à la loi, ou de poursuites pénales." />
          <Step num={4} title="Mesures de protection" text="Ordonnance de protection, bracelet électronique anti-rapprochement, interdiction de contact." />
          <Step num={5} title="Jugement" text="Tribunal correctionnel. Vous pouvez vous constituer partie civile pour obtenir réparation." />
        </View>
      ),
    },
    {
      id: 'logement', title: 'Aide au logement', sub: 'Hébergement d\'urgence et solutions', color: Colors.SUCCESS,
      content: (
        <>
          <Card title="115 — Numéro national d'urgence" text="Gratuit, disponible 24h/24 et 7j/7. Oriente vers des centres d'hébergement d'urgence disponibles près de chez vous." />
          <Card title="Centres d'hébergement spécialisés" text="Des structures dédiées aux femmes victimes de violences proposent un accueil confidentiel, sécurisé et gratuit, parfois avec vos enfants." />
          <Card title="Demande de logement social prioritaire" text="Les victimes de violences conjugales bénéficient d'une priorité dans l'attribution de logements sociaux (DALO). Un travailleur social peut vous accompagner." />
          <Card title="Associations d'accompagnement" text="France Victimes (116 006), Le Planning Familial, CIDFF — ces associations proposent un soutien global : logement, juridique, psychologique." />
        </>
      ),
    },
    {
      id: 'urgences', title: 'Numéros d\'urgence', sub: 'Contacts essentiels', color: Colors.AMBER,
      content: (
        <>
          <ECall num="3919" label="Violence Femmes Info · Gratuit 24h/24" color={Colors.ROSE} tel="3919" />
          <ECall num="17" label="Police secours · Danger immédiat" color="#1D4ED8" tel="17" />
          <ECall num="115" label="Hébergement d'urgence · 24h/24" color={Colors.SUCCESS} tel="115" />
          <ECall num="116 006" label="France Victimes · Gratuit" color="#5B21B6" tel="116006" />
        </>
      ),
    },
  ];

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Ressources</Text>
        <Text style={s.sub}>Informations juridiques et pratiques</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {items.map(item => (
          <Accordion
            key={item.id}
            item={item}
            isOpen={open === item.id}
            onToggle={() => setOpen(open === item.id ? null : item.id)}
          />
        ))}
        <Text style={s.disclaimer}>
          AVA est une assistante IA. Elle ne remplace pas un avocat qualifié.{'\n'}
          En cas de danger immédiat, appelez le 17 ou le 3919.
        </Text>
      </ScrollView>
    </View>
  );
}

const acc = StyleSheet.create({
  item: { borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  trigger: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: Spacing.MD, paddingVertical: 18, backgroundColor: Colors.WHITE },
  ico: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  icoText: { fontSize: 16 },
  text: { flex: 1 },
  title: { fontSize: 15, fontWeight: '500', color: Colors.INK },
  sub: { fontSize: 12, color: Colors.MUTED, marginTop: 2 },
  chevron: { fontSize: 22, color: Colors.MUTED, fontWeight: '300' },
  content: { overflow: 'hidden', backgroundColor: Colors.CREAM },
  inner: { padding: Spacing.MD, gap: 8 },
});

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.CREAM },
  header: { backgroundColor: Colors.WHITE, paddingTop: 16, paddingHorizontal: Spacing.LG, paddingBottom: Spacing.MD, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  title: { fontFamily: 'serif', fontSize: FontSize.XXL, fontWeight: '400', color: Colors.INK },
  sub: { fontSize: FontSize.SM, color: Colors.MUTED, marginTop: 3 },
  card: { backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BORDER, borderRadius: Radius.MD, padding: 15, marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: '500', color: Colors.INK, marginBottom: 5 },
  cardText: { fontSize: FontSize.SM, color: Colors.MUTED, lineHeight: 22 },
  stepRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  stepNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.ROSE_L, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  stepNumText: { fontSize: 11, fontWeight: '500', color: Colors.ROSE_D },
  stepTitle: { fontSize: FontSize.SM, fontWeight: '500', color: Colors.INK },
  stepText: { fontSize: 12, color: Colors.MUTED, marginTop: 2, lineHeight: 18 },
  ecall: { borderRadius: Radius.MD, padding: 13, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  ecallNum: { fontFamily: 'serif', fontSize: 26, color: '#fff', fontWeight: '600' },
  ecallLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 1 },
  disclaimer: { fontSize: 11, color: Colors.MUTED, textAlign: 'center', lineHeight: 18, opacity: 0.7, padding: 20 },
});
