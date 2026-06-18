import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme';

const VALID_CODES = ['AVA-FREE', 'AVA-TEST'];

export default function PaymentScreen({ navigation }: any) {
  const [plan, setPlan] = useState<'pay' | 'code'>('pay');
  const [code, setCode] = useState('');
  const [codeStatus, setCodeStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [payMethod, setPayMethod] = useState<string | null>(null);

  const validateCode = () => {
    if (VALID_CODES.includes(code.trim().toUpperCase())) {
      setCodeStatus('valid');
      setTimeout(() => navigation.replace('MainTabs'), 800);
    } else {
      setCodeStatus('invalid');
    }
  };

  const handlePayment = (method: string) => {
    setPayMethod(method);
    Alert.alert('Paiement en cours...', `Traitement via ${method}`, [
      { text: 'OK', onPress: () => setTimeout(() => navigation.replace('MainTabs'), 1200) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Accès à AVA</Text>
        <Text style={styles.headerSub}>Choisissez votre mode d'accès</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={[styles.planCard, plan === 'pay' && styles.planCardActive]} onPress={() => setPlan('pay')}>
          <View style={[styles.radio, plan === 'pay' && styles.radioActive]}>
            {plan === 'pay' && <View style={styles.radioDot} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.planTitle}>Accès complet</Text>
            <Text style={styles.planPrice}>10 € / mois</Text>
            <Text style={styles.planDesc}>Assistant juridique IA disponible 24h/24</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.planCard, plan === 'code' && styles.planCardActive]} onPress={() => setPlan('code')}>
          <View style={[styles.radio, plan === 'code' && styles.radioActive]}>
            {plan === 'code' && <View style={styles.radioDot} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.planTitle}>Code de parrainage</Text>
            <Text style={styles.planPrice}>Gratuit</Text>
            <Text style={styles.planDesc}>Accès offert via un code parrainage</Text>
          </View>
        </TouchableOpacity>

        {plan === 'code' && (
          <View style={styles.codeSection}>
            <Text style={styles.sectionLabel}>Votre code de parrainage</Text>
            <View style={styles.codeRow}>
              <TextInput
                style={[styles.codeInput, codeStatus === 'invalid' && styles.codeInputError, codeStatus === 'valid' && styles.codeInputValid]}
                placeholder="ex: AVA-FREE"
                value={code}
                onChangeText={(t) => { setCode(t); setCodeStatus('idle'); }}
                autoCapitalize="characters"
                placeholderTextColor={Colors.MUTED}
              />
              <TouchableOpacity style={styles.codeBtn} onPress={validateCode}>
                <Text style={styles.codeBtnText}>Valider</Text>
              </TouchableOpacity>
            </View>
            {codeStatus === 'invalid' && <Text style={styles.codeError}>Code invalide. Vérifiez et réessayez.</Text>}
            {codeStatus === 'valid' && <Text style={styles.codeValid}>Code valide ! Accès activé.</Text>}
          </View>
        )}

        {plan === 'pay' && (
          <View style={styles.paySection}>
            <Text style={styles.sectionLabel}>Méthode de paiement</Text>
            <TouchableOpacity style={styles.payBtn} onPress={() => handlePayment('Apple Pay')}>
              <Text style={styles.payBtnText}> Apple Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.payBtn} onPress={() => handlePayment('Google Pay')}>
              <Text style={styles.payBtnText}>G Google Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.payBtn, { backgroundColor: Colors.ROSE }]} onPress={() => handlePayment('Carte bancaire')}>
              <Text style={[styles.payBtnText, { color: Colors.WHITE }]}>💳 Carte bancaire</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.legal}>
          Paiement sécurisé par Stripe. Vos données bancaires ne sont jamais stockées sur nos serveurs. Conformément au RGPD, vous pouvez résilier à tout moment.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.CREAM },
  header: { backgroundColor: Colors.WHITE, padding: Spacing.LG, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  headerTitle: { fontSize: FontSize.XL, fontWeight: '700', color: Colors.INK },
  headerSub: { fontSize: FontSize.SM, color: Colors.MUTED, marginTop: 2 },
  content: { flex: 1, padding: Spacing.MD, gap: Spacing.MD },
  planCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.MD, backgroundColor: Colors.WHITE, borderRadius: BorderRadius.LG, padding: Spacing.MD, borderWidth: 2, borderColor: Colors.BORDER },
  planCardActive: { borderColor: Colors.ROSE, backgroundColor: Colors.ROSE_FAINT },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.BORDER, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: Colors.ROSE },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.ROSE },
  planTitle: { fontSize: FontSize.MD, fontWeight: '700', color: Colors.INK },
  planPrice: { fontSize: FontSize.LG, fontWeight: '800', color: Colors.ROSE, marginVertical: 2 },
  planDesc: { fontSize: FontSize.SM, color: Colors.MUTED },
  codeSection: { gap: Spacing.SM },
  sectionLabel: { fontSize: FontSize.MD, fontWeight: '600', color: Colors.INK },
  codeRow: { flexDirection: 'row', gap: Spacing.SM },
  codeInput: { flex: 1, backgroundColor: Colors.WHITE, borderWidth: 1.5, borderColor: Colors.BORDER, borderRadius: BorderRadius.MD, paddingHorizontal: Spacing.MD, paddingVertical: 12, fontSize: FontSize.MD, color: Colors.INK },
  codeInputError: { borderColor: Colors.DANGER },
  codeInputValid: { borderColor: Colors.SUCCESS },
  codeBtn: { backgroundColor: Colors.ROSE, borderRadius: BorderRadius.MD, paddingHorizontal: Spacing.LG, justifyContent: 'center' },
  codeBtnText: { color: Colors.WHITE, fontWeight: '600' },
  codeError: { color: Colors.DANGER, fontSize: FontSize.SM },
  codeValid: { color: Colors.SUCCESS, fontSize: FontSize.SM, fontWeight: '600' },
  paySection: { gap: Spacing.SM },
  payBtn: { backgroundColor: Colors.WHITE, borderWidth: 1.5, borderColor: Colors.BORDER, borderRadius: BorderRadius.MD, paddingVertical: 14, alignItems: 'center' },
  payBtnText: { fontSize: FontSize.MD, fontWeight: '500', color: Colors.INK },
  legal: { fontSize: FontSize.XS, color: Colors.MUTED, lineHeight: 18, textAlign: 'center', paddingTop: Spacing.SM },
});
