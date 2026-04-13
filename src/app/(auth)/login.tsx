import colors from '@/constants/colors';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  if (!email.trim() || !senha.trim()) {
    Alert.alert('Atenção', 'Preencha e-mail e senha.');
    return;
  }

  try {
    setLoading(true);

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      console.log('API URL:', apiUrl);
      console.log('URL LOGIN:', `${apiUrl}/auth/login`);

    if (!apiUrl) {
      Alert.alert(
        'Configuração inválida',
        'A variável EXPO_PUBLIC_API_URL não foi definida.'
      );
      return;
    }

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        senha,
      }),
    });

    // Evita erro se a API devolver resposta sem JSON valido
    let data: any = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const message =
        data?.message && Array.isArray(data.message)
          ? data.message.join('\n')
          : data?.message || 'Credenciais inválidas.';

      Alert.alert('Erro no login', message);
      return;
    }

    // Suporta diferentes formatos de resposta
    const token = data?.access_token || data?.token;

    if (!token) {
      Alert.alert(
        'Erro no login',
        'A API não retornou o token JWT.'
      );
      return;
    }

    // Opcional: salvar dados do usuário se a API retornar
    // Ex.: data.user
    await SecureStore.setItemAsync('token', token);

    // Se quiser salvar user também:
    if (data?.user) {
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));
    }

    router.replace('../telas/home');
  } catch (error: any) {
    console.log('Erro login:', error);
    Alert.alert(
      'Erro de conexão',
      'Não foi possível conectar à API. Verifique se ela está rodando e se o IP está correto.'
    );
  } finally {
    setLoading(false);
  }
};



//Apenas de exemplo para teste de telas
const mudaTela = () =>  {
  console.log('Pressionado...')
  router.replace('../telas/home');
} 
const mudaTelaCriarUsuario = () =>  {
  console.log('Pressionado...')
  router.replace('/cadastro');
} 



  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <View style={styles.areaLogo}>
        <Image
          source={require('@/assets/logo.png')}
          style={styles.logo}
        />
      </View>

      <Text style={styles.appSubtitle}>Gestão de viagens de campo</Text>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>

            {/* Campo Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.icon}>📧</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu e-mail"
                placeholderTextColor={colors.grayLight}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
              />
            </View>

            {/* Campo Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.icon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                placeholderTextColor={colors.grayLight}
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setMostrarSenha((v) => !v)}>
                <Text style={styles.showHide}>
                  {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Esqueci senha */}
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            {/* Botão Login */}
            <TouchableOpacity
                style={[styles.loginButton, loading && { opacity: 0.7 }]}
                // onPress={handleLogin}
                onPress={ mudaTela }   // Retirar - é para teste
                disabled={loading}
            >
                <Text style={styles.loginButtonText}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </Text>
            </TouchableOpacity>

            {/* Criar conta */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Não tem conta? </Text>
              <TouchableOpacity onPress={mudaTelaCriarUsuario}>       
                <Text style={styles.footerLink}>Criar agora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: colors.zinc,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.grayDark,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 14,
    color: colors.grayMedium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLighter,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    minHeight: 54,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.black,
    fontSize: 15,
  },
  showHide: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: '600',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotText: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: colors.grayDark,
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: colors.grayMedium,
    fontSize: 14,
  },
  footerLink: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: '700',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  appSubtitle: {
    fontSize: 20,
    color: '#f6f6f6ff',
    marginBottom: 28,
    textAlign: 'center',
  },
  areaLogo:{
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 70,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  }
});