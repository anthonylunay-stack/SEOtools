import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, Linking, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../theme';
import AVALogo from '../components/AVALogo';

interface Message {
  id: string;
  text: string;
  role: 'bot' | 'user';
  time: string;
}

const now = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const REPLIES: Record<string, string> = {
  droit: "Vous bénéficiez de plusieurs droits fondamentaux :\n\n• Déposer plainte à tout moment, sans preuves physiques\n• Ordonnance de protection (délai : 6 jours)\n• Éviction du conjoint violent du domicile\n• Aide juridictionnelle selon vos ressources\n\nConsultez l'onglet Ressources pour tous les détails.",
  plaint: "Pour déposer une plainte :\n\n1. Rendez-vous au commissariat ou à la gendarmerie\n2. Apportez tout élément disponible : certificats médicaux, messages, photos\n3. La police est légalement tenue d'enregistrer votre plainte\n4. Conservez le récépissé de dépôt\n\nEn cas de difficulté, appelez le 3919.",
  ordonnance: "L'ordonnance de protection :\n\n• Délivrée par le Juge aux Affaires Familiales\n• Délai maximum : 6 jours\n• Peut interdire tout approchement\n• Peut vous attribuer la jouissance du domicile\n• Suspend les droits de visite si nécessaire",
  heberg: "Solutions d'hébergement :\n\n• 115 — Urgence logement, 24h/24\n• Centres spécialisés pour femmes victimes\n• 116 006 — France Victimes\n• Associations locales : CIDFF, Planning Familial\n\nTous les détails dans l'onglet Ressources.",
  default: "Je comprends. Je peux vous aider sur :\n\n• Vos droits en tant que victime\n• Comment porter plainte\n• L'ordonnance de protection\n• L'hébergement d'urgence\n• L'aide juridictionnelle\n\nL'onglet Ressources contient aussi de nombreuses informations pratiques.",
};

function getReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('droit')) return REPLIES.droit;
  if (t.includes('plaint')) return REPLIES.plaint;
  if (t.includes('ordonnance')) return REPLIES.ordonnance;
  if (t.includes('hébergement') || t.includes('logement')) return REPLIES.heberg;
  return REPLIES.default;
}

const INITIAL: Message[] = [
  { id: '1', text: "Bonjour, je suis AVA, votre assistante juridique spécialisée dans l'accompagnement des victimes de violences conjugales.\n\nTout ce que vous me confiez reste strictement confidentiel.", role: 'bot', time: now() },
  { id: '2', text: "En quoi puis-je vous aider ?", role: 'bot', time: now() },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList>(null);
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!typing) return;
    const anim = (d: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(d, { toValue: -5, duration: 300, useNativeDriver: true }),
        Animated.timing(d, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]));
    const a = Animated.parallel([anim(dot1, 0), anim(dot2, 200), anim(dot3, 400)]);
    a.start();
    return () => a.stop();
  }, [typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: input.trim(), role: 'user', time: now() };
    const txt = input.trim();
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: getReply(txt), role: 'bot', time: now() };
      setMessages(m => [...m, botMsg]);
    }, 1200 + Math.random() * 600);
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={s.header}>
        <AVALogo size={40} />
        <View style={s.headerInfo}>
          <Text style={s.headerName}>AVA</Text>
          <Text style={s.headerSub}>votre avocat de poche</Text>
        </View>
        <View style={s.onlineRow}>
          <View style={s.onlineDot} />
          <Text style={s.onlineText}>En ligne</Text>
        </View>
      </View>

      <TouchableOpacity style={s.urgBar} onPress={() => Linking.openURL('tel:3919')}>
        <View>
          <View style={s.urgLeft}>
            <View style={s.urgDot} />
            <Text style={s.urgTitle}>Numéro d'urgence gratuit · 24h/24</Text>
          </View>
          <Text style={s.urgSub}>Ligne d'écoute nationale destinée aux femmes victimes de violences</Text>
        </View>
        <Text style={s.urgNum}>3919</Text>
      </TouchableOpacity>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={m => m.id}
        contentContainerStyle={s.msgs}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[s.msg, item.role === 'user' ? s.msgUser : s.msgBot]}>
            <View style={[s.bubble, item.role === 'user' ? s.bubbleUser : s.bubbleBot]}>
              <Text style={[s.bubbleText, item.role === 'user' && { color: '#fff' }]}>{item.text}</Text>
            </View>
            <Text style={[s.btime, item.role === 'user' && { textAlign: 'right' }]}>{item.time}</Text>
          </View>
        )}
        ListFooterComponent={typing ? (
          <View style={[s.msg, s.msgBot]}>
            <View style={[s.bubble, s.bubbleBot, { flexDirection: 'row', gap: 4, paddingVertical: 13, paddingHorizontal: 16 }]}>
              {[dot1, dot2, dot3].map((d, i) => (
                <Animated.View key={i} style={[s.typDot, { transform: [{ translateY: d }] }]} />
              ))}
            </View>
          </View>
        ) : null}
      />

      <View style={s.inputBar}>
        <View style={s.inputWrap}>
          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            placeholder="Écrivez votre message…"
            placeholderTextColor={Colors.MUTED + '88'}
            multiline
            maxLength={500}
            onSubmitEditing={send}
          />
        </View>
        <TouchableOpacity style={[s.sendBtn, !input.trim() && s.sendBtnOff]} onPress={send} disabled={!input.trim()}>
          <Text style={s.sendIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: Spacing.MD, borderBottomWidth: 1, borderBottomColor: Colors.BORDER, backgroundColor: Colors.WHITE },
  headerInfo: { flex: 1 },
  headerName: { fontFamily: 'serif', fontSize: FontSize.XL, fontWeight: '400', color: Colors.INK },
  headerSub: { fontSize: 12, color: Colors.MUTED },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.GREEN },
  onlineText: { fontSize: 11, color: Colors.GREEN },
  urgBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, backgroundColor: '#FFF2F5', borderBottomWidth: 1, borderBottomColor: 'rgba(184,92,114,0.15)', paddingHorizontal: Spacing.MD, paddingVertical: 10 },
  urgLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  urgDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.ROSE },
  urgTitle: { fontSize: 12, fontWeight: '500', color: Colors.ROSE_D, letterSpacing: 0.3 },
  urgSub: { fontSize: 11, color: Colors.MUTED, lineHeight: 16, paddingLeft: 12 },
  urgNum: { fontFamily: 'serif', fontSize: 28, fontWeight: '600', color: Colors.ROSE, flexShrink: 0 },
  msgs: { padding: Spacing.MD, gap: 10 },
  msg: { maxWidth: '80%', gap: 3 },
  msgBot: { alignSelf: 'flex-start' },
  msgUser: { alignSelf: 'flex-end' },
  bubble: { padding: 10, paddingHorizontal: 13, borderRadius: 18 },
  bubbleBot: { backgroundColor: Colors.CREAM, borderWidth: 1, borderColor: Colors.BORDER, borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: Colors.ROSE, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: FontSize.MD, lineHeight: 22, color: Colors.INK },
  btime: { fontSize: 10, color: Colors.MUTED, opacity: 0.55, paddingHorizontal: 3 },
  typDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.MUTED },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 9, padding: Spacing.SM, paddingHorizontal: 14, paddingBottom: 26, backgroundColor: Colors.WHITE, borderTopWidth: 1, borderTopColor: Colors.BORDER },
  inputWrap: { flex: 1, backgroundColor: Colors.CREAM, borderWidth: 1, borderColor: Colors.PALE, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  input: { fontSize: FontSize.MD, color: Colors.INK, maxHeight: 72, lineHeight: 20 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.ROSE_L, alignItems: 'center', justifyContent: 'center' },
  sendBtnOff: { backgroundColor: Colors.PALE },
  sendIcon: { fontSize: 18, color: Colors.ROSE, fontWeight: '600' },
});
