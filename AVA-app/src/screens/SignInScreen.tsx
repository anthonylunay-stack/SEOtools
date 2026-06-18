import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Radius, FontSize } from '../theme';
import AVALogo from '../components/AVALogo';

type Props = { navigation: NativeStackNavigationProp<any> };
type Mode = 'login' | 'register';

export default function SignInScreen({ navigation }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');

  const ssoLogin = (provider: string) => {
    Alert.alert(`Connexion ${provider}`, 'Fonctionnalité disponible après configuration des clés OAuth.');
    setTimeout(() => navigation.navigate('CGU'), 800);
  };

  const handleLogin = () => {
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setError('');
    navigation.navigate('CGU');
  };

  const handleRegister = () => {
    if (!prenom || !nom || !email || !password) { setError('Veuillez remplir tous les champs obligatoires.'); return; }
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    if (password !== password2) { setError('Les mots de passe ne correspondent pas.'); return; }
    setError('');
    navigation.navigate('CGU');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.container} keyboardShouldPersistTaps="handled">
        <View style={s.hero}>
          <AVALogo size={56} />
          <Text style={s.heroTitle}>{mode === 'login' ? 'AVA' : 'Créer un compte'}</Text>
          <Text style={s.heroSub}>{mode === 'login' ? 'Connexion sécurisée' : 'Inscription gratuite'}</Text>
        </View>

        <View style={s.body}>
          <TouchableOpacity style={s.ssoBtn} onPress={() => ssoLogin('Apple')}>
            <Text style={s.ssoBtnText}>🍎  Continuer avec Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.ssoBtn} onPress={() => ssoLogin('Google')}>
            <Text style={s.ssoBtnText}>G  Continuer avec Google</Text>
          </TouchableOpacity>

          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>OU</Text>
            <View style={s.dividerLine} />
          </View>

          {mode === 'register' && (
            <>
              <Field label="Prénom" value={prenom} onChange={setPrenom} placeholder="Votre prénom" />
              <Field label="Nom" value={nom} onChange={setNom} placeholder="Votre nom" />
            </>
          )}
          <Field label="Adresse e-mail" value={email} onChange={setEmail} placeholder="vous@exemple.fr" keyboardType="email-address" />
          {mode === 'register' && (
            <Field label="Numéro de téléphone" value={tel} onChange={setTel} placeholder="+33 6 00 00 00 00" keyboardType="phone-pad" />
          )}
          <Field label="Mot de passe" value={password} onChange={setPassword} placeholder="••••••••" secure />
          {mode === 'register' && (
            <Field label="Confirmer le mot de passe" value={password2} onChange={setPassword2} placeholder="Répétez votre mot de passe" secure />
          )}

          {!!error && <Text style={s.error}>{error}</Text>}

          <TouchableOpacity style={s.btnRose} onPress={mode === 'login' ? handleLogin : handleRegister}>
            <Text style={s.btnRoseText}>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            <Text style={s.switchText}>
              {mode === 'login' ? "Pas encore de compte ? " : "Déjà un compte ? "}
              <Text style={s.switchLink}>{mode === 'login' ? "S'inscrire" : "Se connecter"}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, value, onChange, placeholder, secure, keyboardType }: any) {
  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}</Text>
      <TextInput
        style={f.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.MUTED + '88'}
        secureTextEntry={secure}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="none"
      />
    </View>
  );
}

const f = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: Colors.MUTED, fontWeight: '500', marginBottom: 6 },
  input: {
    height: 48, borderWidth: 1, borderColor: Colors.BORDER, borderRadius: Radius.MD,
    paddingHorizontal: 14, fontSize: FontSize.MD, color: Colors.INK, backgroundColor: Colors.WHITE,
  },
});

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  hero: {
    backgroundColor: Colors.ROSE_FAINT,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(184,92,114,0.12)',
    paddingTop: 60,
    paddingBottom: 28,
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: { fontFamily: 'serif', fontSize: 32, fontWeight: '400', color: Colors.INK, letterSpacing: 2 },
  heroSub: { fontSize: FontSize.SM, color: Colors.MUTED, fontWeight: '300' },
  body: { padding: Spacing.LG, gap: 4 },
  ssoBtn: {
    height: 52, borderRadius: Radius.MD, borderWidth: 1, borderColor: Colors.BORDER,
    backgroundColor: Colors.WHITE, alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  ssoBtnText: { fontSize: 15, fontWeight: '500', color: Colors.INK },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.BORDER },
  dividerText: { fontSize: 11, color: Colors.MUTED, letterSpacing: 1 },
  error: { fontSize: 12, color: Colors.DANGER, marginBottom: 8 },
  btnRose: {
    height: 52, borderRadius: Radius.MD, backgroundColor: Colors.ROSE,
    alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 12,
  },
  btnRoseText: { color: '#fff', fontSize: 15, fontWeight: '500', letterSpacing: 0.5 },
  switchText: { textAlign: 'center', fontSize: FontSize.SM, color: Colors.MUTED, marginTop: 4 },
  switchLink: { color: Colors.ROSE, fontWeight: '500' },
});
