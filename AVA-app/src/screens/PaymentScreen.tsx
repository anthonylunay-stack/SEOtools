import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Radius, FontSize } from '../theme';

type Props = { navigation: NativeStackNavigationProp<any> };
type Plan = 'pay' | 'code';

const VALID_CODES = ['AVA-FREE', 'AVA-TEST'];

export default function PaymentScreen({ navigation }: Props) {
  const [plan, setPlan] = useState<Plan>('pay');
  const [code, setCode] = useState('');
  const [codeStatus, setCodeStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  const checkCode = () => {
    if (VALID_CODES.includes(code.trim().toUpperCase())) {
      setCodeStatus('ok');
      setTimeout(() => navigation.replace('Main'), 800);
    } else {
      setCodeStatus('err');
    }
  };

  const pay = (method: string) => {
    Alert.alert(`Paiement ${method}`, 'Paiement en cours…', [{ text: 'OK' }]);
    setTimeout(() => navigation.replace('Main'), 1200);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Accès à AVA</Text>
        <Text style={s.sub}>Choisissez votre accès ou entrez un code de parrainage</Text>
      </View>

      <View style={s.body}>
        <TouchableOpacity style={[s.planCard, plan === 'pay' && s.planCardSel]} onPress={() => setPlan('pay')}>
          <View style={[s.radio, plan === 'pay' && s.radioSel]}>
            {plan === 'pay' && <View style={s.radioDot} />}
          </View>
          <View style={s.planInfo}>
            <Text style={s.planLabel}>Accès complet</Text>
            <Text style={s.planSub}>Abonnement mensuel · renouvellement automatique</Text>
          </View>
          <Text style={s.planAmt}>10 €<Text style={s.planAmtSub}>/mois</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.planCard, plan === 'code' && s.planCardSel]} onPress={() => setPlan('code')}>
          <View style={[s.radio, plan === 'code' && s.radioSel]}>
            {plan === 'code' && <View style={s.radioDot} />}
          </View>
          <View style={s.planInfo}>
            <Text style={s.planLabel}>Code de parrainage</Text>
            <Text style={s.planSub}>Accès gratuit avec un code valide</Text>
          </View>
          <Text style={[s.planAmt, { color: Colors.SUCCESS, fontSize: 16 }]}>Gratuit</Text>
        </TouchableOpacity>

        {plan === 'code' && (
          <View style={s.codeSection}>
            <View style={s.codeRow}>
              <TextInput
                style={s.codeInput}
                value={code}
                onChangeText={t => { setCode(t); setCodeStatus('idle'); }}
                placeholder="CODE-PARRAIN"
                placeholderTextColor={Colors.MUTED + '88'}
                autoCapitalize="characters"
                maxLength={12}
              />
              <TouchableOpacity style={s.codeBtn} onPress={checkCode}>
                <Text style={s.codeBtnText}>Valider</Text>
              </TouchableOpacity>
            </View>
            {codeStatus === 'ok' && <Text style={s.codeOk}>✓ Code valide — accès gratuit activé</Text>}
            {codeStatus === 'err' && <Text style={s.codeErr}>Code invalide ou expiré</Text>}
          </View>
        )}

        {plan === 'pay' && (
          <View style={s.paySection}>
            <Text style={s.payTitle}>PAYER AVEC</Text>
            <TouchableOpacity style={s.payMethod} onPress={() => pay('Apple Pay')}>
              <Text style={s.payMethodText}>🍎  Apple Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.payMethod} onPress={() => pay('Google Pay')}>
              <Text style={s.payMethodText}>G  Google Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.payMethod} onPress={() => pay('Carte bancaire')}>
              <Text style={s.payMethodText}>💳  Carte bancaire</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={s.legal}>
        Paiement sécurisé Stripe · Renouvellement automatique mensuel{'\n'}
        Résiliable à tout moment · Conformité RGPD
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  header: { paddingTop: 56, paddingHorizontal: Spacing.LG, paddingBottom: Spacing.MD },
  title: { fontFamily: 'serif', fontSize: 28, fontWeight: '400', color: Colors.INK },
  sub: { fontSize: FontSize.SM, color: Colors.MUTED, marginTop: 4, lineHeight: 20 },
  body: { flex: 1, padding: Spacing.LG, gap: 12 },
  planCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: Colors.ROSE_FAINT, borderWidth: 1.5, borderColor: 'rgba(184,92,114,0.2)',
    borderRadius: Radius.LG, padding: 20,
  },
  planCardSel: { borderColor: Colors.ROSE, backgroundColor: Colors.ROSE_L },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.BORDER, alignItems: 'center', justifyContent: 'center' },
  radioSel: { borderColor: Colors.ROSE },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.ROSE },
  planInfo: { flex: 1 },
  planLabel: { fontSize: 15, fontWeight: '500', color: Colors.INK },
  planSub: { fontSize: 12, color: Colors.MUTED, marginTop: 2 },
  planAmt: { fontFamily: 'serif', fontSize: 24, fontWeight: '400', color: Colors.ROSE },
  planAmtSub: { fontSize: 11, fontWeight: '400', color: Colors.MUTED },
  codeSection: { gap: 8 },
  codeRow: { flexDirection: 'row', gap: 8 },
  codeInput: {
    flex: 1, height: 48, borderWidth: 1, borderColor: Colors.BORDER, borderRadius: Radius.MD,
    paddingHorizontal: 14, fontSize: FontSize.MD, color: Colors.INK, backgroundColor: Colors.WHITE,
    letterSpacing: 2,
  },
  codeBtn: { height: 48, paddingHorizontal: 18, backgroundColor: Colors.PALE, borderRadius: Radius.MD, alignItems: 'center', justifyContent: 'center' },
  codeBtnText: { fontSize: 14, fontWeight: '500', color: Colors.INK },
  codeOk: { fontSize: FontSize.SM, color: Colors.SUCCESS, paddingHorizontal: 4 },
  codeErr: { fontSize: FontSize.SM, color: Colors.DANGER, paddingHorizontal: 4 },
  paySection: { gap: 8, marginTop: 4 },
  payTitle: { fontSize: 10, letterSpacing: 1.5, color: Colors.MUTED, opacity: 0.7 },
  payMethod: {
    height: 52, borderRadius: Radius.MD, borderWidth: 1, borderColor: Colors.BORDER,
    backgroundColor: Colors.WHITE, alignItems: 'center', justifyContent: 'center',
  },
  payMethodText: { fontSize: 15, fontWeight: '500', color: Colors.INK },
  legal: { fontSize: 11, color: Colors.MUTED, textAlign: 'center', lineHeight: 18, padding: Spacing.LG },
});
