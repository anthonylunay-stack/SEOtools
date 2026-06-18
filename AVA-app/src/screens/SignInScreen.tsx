import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AVALogo from '../components/AVALogo';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme';

export default function SignInScreen({ navigation }: any) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (mode === 'login') {
      if (!email || !password) { setError('Veuillez remplir tous les champs.'); return false; }
    } else {
      if (!prenom || !nom || !email || !password || !confirmPassword) { setError('Veuillez remplir tous les champs.'); return false; }
      if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return false; }
      if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return false; }
    }
    return true;
  };

  const handleSubmit = () => {
    setError('');
    if (!validate()) return;
    navigation.navigate('CGU');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <AVALogo size={60} />
            <Text style={styles.title}>AVA</Text>
            <Text style={styles.subtitle}>{mode === 'login' ? 'Connexion sécurisée' : 'Créer un compte'}</Text>
          </View>

          <View style={styles.ssoSection}>
            <TouchableOpacity style={styles.ssoBtn}>
              <Text style={styles.ssoBtnText}>  Se connecter avec Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ssoBtn, { borderColor: Colors.PALE }]}>
              <Text style={styles.ssoBtnText}>  Se connecter avec Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.form}>
            {mode === 'register' && (
              <>
                <TextInput style={styles.input} placeholder="Prénom" value={prenom} onChangeText={setPrenom} placeholderTextColor={Colors.MUTED} />
                <TextInput style={styles.input} placeholder="Nom" value={nom} onChangeText={setNom} placeholderTextColor={Colors.MUTED} />
              </>
            )}
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={Colors.MUTED} />
            {mode === 'register' && (
              <TextInput style={styles.input} placeholder="Téléphone" value={tel} onChangeText={setTel} keyboardType="phone-pad" placeholderTextColor={Colors.MUTED} />
            )}
            <TextInput style={styles.input} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={Colors.MUTED} />
            {mode === 'register' && (
              <TextInput style={styles.input} placeholder="Confirmer le mot de passe" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholderTextColor={Colors.MUTED} />
            )}
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit}>
            <Text style={styles.btnPrimaryText}>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            <Text style={styles.switchText}>
              {mode === 'login' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ROSE_FAINT },
  content: { flexGrow: 1, paddingHorizontal: Spacing.LG, paddingVertical: Spacing.LG },
  header: { alignItems: 'center', marginBottom: Spacing.LG, backgroundColor: Colors.WHITE, borderRadius: BorderRadius.LG, padding: Spacing.LG },
  title: { fontSize: FontSize.XXL, color: Colors.INK, letterSpacing: 3, marginTop: Spacing.SM },
  subtitle: { fontSize: FontSize.MD, color: Colors.MUTED, marginTop: Spacing.XS },
  ssoSection: { gap: Spacing.SM, marginBottom: Spacing.MD },
  ssoBtn: { borderWidth: 1.5, borderColor: Colors.INK, borderRadius: BorderRadius.MD, paddingVertical: 14, alignItems: 'center', backgroundColor: Colors.WHITE },
  ssoBtnText: { fontSize: FontSize.MD, fontWeight: '500', color: Colors.INK },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.MD, gap: Spacing.MD },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.BORDER },
  dividerText: { fontSize: FontSize.SM, color: Colors.MUTED, fontWeight: '600' },
  form: { gap: Spacing.SM, marginBottom: Spacing.MD },
  input: { backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BORDER, borderRadius: BorderRadius.MD, paddingHorizontal: Spacing.MD, paddingVertical: 14, fontSize: FontSize.MD, color: Colors.INK },
  errorText: { color: Colors.DANGER, fontSize: FontSize.SM, marginBottom: Spacing.MD, textAlign: 'center' },
  btnPrimary: { backgroundColor: Colors.ROSE, borderRadius: BorderRadius.LG, paddingVertical: 16, alignItems: 'center', marginBottom: Spacing.MD },
  btnPrimaryText: { color: Colors.WHITE, fontSize: FontSize.LG, fontWeight: '600' },
  switchText: { textAlign: 'center', color: Colors.ROSE, fontSize: FontSize.MD, textDecorationLine: 'underline' },
});
