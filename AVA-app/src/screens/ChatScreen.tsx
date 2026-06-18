import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Linking, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AVALogo from '../components/AVALogo';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const LOCAL_RESPONSES: [string, string][] = [
  ['droit', "En tant que victime de violences conjugales, vous disposez de plusieurs droits fondamentaux :\n\n• Déposer plainte au commissariat ou à la gendarmerie\n• Demander une ordonnance de protection\n• Bénéficier de l'aide juridictionnelle gratuite\n• Être accompagnée par une association spécialisée\n\nSouhaitez-vous des informations sur l'une de ces démarches ?"],
  ['plaint', "Pour déposer une plainte :\n\n1. Rendez-vous au commissariat ou à la gendarmerie\n2. Vous pouvez être accompagnée par une personne de confiance\n3. Demandez un certificat médical si vous avez des blessures\n4. La plainte peut être déposée même sans certificat médical\n5. Vous recevrez un récépissé de dépôt de plainte"],
  ['ordonnance', "L'ordonnance de protection est délivrée par le juge aux affaires familiales.\n\nElle peut :\n• Interdire à votre conjoint de vous approcher\n• Vous attribuer la jouissance du domicile\n• Fixer temporairement la résidence des enfants\n• Être délivrée en 6 jours\n\nContactez un avocat ou l'association locale d'aide aux victimes."],
  ['hébergement', "Solutions d'hébergement d'urgence :\n\n• 115 : SAMU Social\n• 3919 : orientation vers des structures spécialisées\n• Centres d'hébergement pour femmes victimes\n• CHRS (Centres d'Hébergement et de Réinsertion Sociale)"],
  ['logement', "Solutions d'hébergement d'urgence :\n\n• 115 : SAMU Social\n• 3919 : orientation vers des structures spécialisées\n• Centres d'hébergement pour femmes victimes\n• CHRS"],
  ['aide jurid', "L'aide juridictionnelle vous permet d'accéder gratuitement à un avocat.\n\nConditions :\n• Ressources < 1 000€/mois (aide totale)\n• Ressources entre 1 000€ et 1 500€ (aide partielle)\n\nDémarche :\n1. Formulaire au tribunal judiciaire\n2. Joignez vos justificatifs\n3. Décision sous 1 mois"],
  ['avocat', "Un avocat commis d'office peut intervenir immédiatement en urgence.\n\nPour l'aide juridictionnelle :\n• Ressources < 1 000€/mois = aide totale (gratuit)\n• Retirez le formulaire au tribunal judiciaire\n• Joignez vos justificatifs de ressources"],
];

function getResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, response] of LOCAL_RESPONSES) {
    if (lower.includes(key)) return response;
  }
  return "Je comprends votre situation et je suis là pour vous aider. Pourriez-vous me préciser votre question ?\n\nJe peux vous informer sur :\n• Vos droits en tant que victime\n• Comment déposer une plainte\n• L'ordonnance de protection\n• Les solutions d'hébergement\n• L'aide juridictionnelle\n\nEn cas de danger immédiat, appelez le 3919 ou le 17.";
}

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  return (
    <View style={typingStyles.container}>
      {[dot1, dot2, dot3].map((d, i) => (
        <Animated.View key={i} style={[typingStyles.dot, { transform: [{ translateY: d }] }]} />
      ))}
    </View>
  );
}

const typingStyles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 4, padding: Spacing.MD, backgroundColor: Colors.CREAM, borderRadius: BorderRadius.LG, alignSelf: 'flex-start', marginBottom: Spacing.SM },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.MUTED },
});

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Bonjour, je suis AVA, votre assistante juridique. Tout ce que vous me confiez reste strictement confidentiel.\n\nEn quoi puis-je vous aider ?", isBot: true, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: input.trim(), isBot: false, timestamp: new Date() };
    const userInput = input.trim();
    setInput('');
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: getResponse(userInput), isBot: true, timestamp: new Date() };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const formatTime = (d: Date) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.msgRow, item.isBot ? styles.msgRowBot : styles.msgRowUser]}>
      <View style={[styles.bubble, item.isBot ? styles.bubbleBot : styles.bubbleUser]}>
        <Text style={[styles.bubbleText, item.isBot ? styles.bubbleTextBot : styles.bubbleTextUser]}>{item.text}</Text>
      </View>
      <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AVALogo size={40} />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerName}>AVA</Text>
          <Text style={styles.headerSub}>votre avocat de poche</Text>
        </View>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>En ligne</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.urgenceBanner} onPress={() => Linking.openURL('tel:3919')}>
        <Text style={styles.urgenceText}>🚨 Urgence violences conjugales : 3919 — Appuyer pour appeler</Text>
      </TouchableOpacity>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={0}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Posez votre question..."
            placeholderTextColor={Colors.MUTED}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={send}>
            <Text style={styles.sendText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.CREAM },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.SM, padding: Spacing.MD, backgroundColor: Colors.WHITE, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  headerName: { fontSize: FontSize.LG, fontWeight: '700', color: Colors.INK },
  headerSub: { fontSize: FontSize.XS, color: Colors.MUTED },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.SUCCESS },
  onlineText: { fontSize: FontSize.XS, color: Colors.SUCCESS, fontWeight: '600' },
  urgenceBanner: { backgroundColor: 'rgba(192,57,43,0.08)', padding: Spacing.SM, borderBottomWidth: 1, borderBottomColor: 'rgba(192,57,43,0.2)' },
  urgenceText: { fontSize: FontSize.XS, color: Colors.DANGER, textAlign: 'center', fontWeight: '500' },
  list: { padding: Spacing.MD, gap: Spacing.SM },
  msgRow: { maxWidth: '80%', marginBottom: Spacing.SM },
  msgRowBot: { alignSelf: 'flex-start' },
  msgRowUser: { alignSelf: 'flex-end' },
  bubble: { borderRadius: BorderRadius.LG, padding: Spacing.MD },
  bubbleBot: { backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BORDER, borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: Colors.ROSE, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: FontSize.MD, lineHeight: 22 },
  bubbleTextBot: { color: Colors.INK },
  bubbleTextUser: { color: Colors.WHITE },
  timestamp: { fontSize: FontSize.XS, color: Colors.MUTED, marginTop: 4 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.SM, padding: Spacing.MD, backgroundColor: Colors.WHITE, borderTopWidth: 1, borderTopColor: Colors.BORDER },
  textInput: { flex: 1, backgroundColor: Colors.CREAM, borderRadius: BorderRadius.MD, paddingHorizontal: Spacing.MD, paddingVertical: Spacing.SM, fontSize: FontSize.MD, color: Colors.INK, maxHeight: 80 },
  sendBtn: { backgroundColor: Colors.ROSE, borderRadius: BorderRadius.FULL, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: Colors.WHITE, fontSize: FontSize.MD },
});
