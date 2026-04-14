import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Logo from '../../components/Logo';
import type { FormErrors } from '../../entities/forms';
import type { Trip } from '../../entities/trip';
import type { Screen, TripStatus } from '../../entities/types';

const initialTrips: Trip[] = [
  {
    id: '1',
    company: 'Empresa ABC Ltda',
    city: 'São Paulo, SP',
    date: '07/04/2026',
    status: 'EM_ANDAMENTO',
  },
  {
    id: '2',
    company: 'Mercado XYZ',
    city: 'Campinas, SP',
    date: '05/04/2026',
    status: 'CONCLUIDA',
  },
  {
    id: '3',
    company: 'Cliente Delta',
    city: 'Jundiaí, SP',
    date: '02/04/2026',
    status: 'PENDENTE',
  },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('register');
  const [loggedUser, setLoggedUser] = useState('João Silva');
  const [trips, setTrips] = useState<Trip[]>(initialTrips);

  const handleRegisterSuccess = (name: string) => {
    setLoggedUser(name);
    setScreen('home');
  };

  const handleConcludeTrip = (tripId: string) => {
    setTrips((current) =>
      current.map((trip) =>
        trip.id === tripId ? { ...trip, status: 'CONCLUIDA' } : trip
      )
    );
    Alert.alert('Viagem concluída', 'O status da viagem foi atualizado com sucesso.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#071126" />

      {screen === 'register' ? (
        <RegisterScreen onSubmitSuccess={handleRegisterSuccess} />
      ) : (
        <HomeScreen
          userName={loggedUser}
          trips={trips}
          onConcludeTrip={handleConcludeTrip}
        />
      )}
    </SafeAreaView>
  );
}

type RegisterScreenProps = {
  onSubmitSuccess: (name: string) => void;
};

function RegisterScreen({ onSubmitSuccess }: RegisterScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = 'Informe o nome completo.';
    }

    if (!email.trim()) {
      nextErrors.email = 'Informe o e-mail.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = 'Informe um e-mail válido.';
    }

    if (!password.trim()) {
      nextErrors.password = 'Informe a senha.';
    } else if (!/^\d{6}$/.test(password)) {
      nextErrors.password = 'A senha deve conter 6 dígitos numéricos.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      console.log('API URL:', apiUrl);
      console.log('URL CADASTRO:', `${apiUrl}/auth/register`);

      if (!apiUrl) {
        Alert.alert(
          'Configuração inválida',
          'A variável EXPO_PUBLIC_API_URL não foi definida.'
        );
        return;
      }

      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: fullName.trim(),
          email: email.trim().toLowerCase(),
          senha: password,
        }),
      });

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
            : data?.message || 'Erro ao criar a conta.';

        Alert.alert('Erro no cadastro', message);
        return;
      }

      const token = data?.access_token || data?.token;

      if (!token) {
        Alert.alert(
          'Erro no cadastro',
          'A API não retornou o token JWT.'
        );
        return;
      }

      await SecureStore.setItemAsync('token', token);

      if (data?.user) {
        await SecureStore.setItemAsync('user', JSON.stringify(data.user));
      }

      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      router.replace('../telas/home');
    } catch (error: any) {
      console.log('Erro cadastro:', error);
      Alert.alert(
        'Erro de conexão',
        'Não foi possível conectar à API. Verifique se ela está rodando e se o IP está correto.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.registerContainer}>
      <Logo />
      <View style={styles.registerCard}>
        <Text style={styles.registerTitle}>Criar conta</Text>
        <Text style={styles.registerSubtitle}>
          Preencha seus dados para continuar
        </Text>

        <InputField
          label="Nome completo"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Digite seu nome"
          error={errors.fullName}
        />

        <InputField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <InputField
          label="Senha (6 dígitos numéricos)"
          value={password}
          onChangeText={(value) =>
            setPassword(value.replace(/\D/g, '').slice(0, 6))
          }
          placeholder="******"
          keyboardType="number-pad"
          secureTextEntry
          error={errors.password}
        />

        <Pressable
          style={styles.primaryButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Text>
        </Pressable>

        <Text style={styles.loginText}>
          Já tem conta?{' '}
          <Pressable onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Entrar</Text>
          </Pressable>
        </Text>
      </View>
    </View>
  );
}

type HomeScreenProps = {
  userName: string;
  trips: Trip[];
  onConcludeTrip: (tripId: string) => void;
};

function HomeScreen({ userName, trips, onConcludeTrip }: HomeScreenProps) {
  const orderedTrips = useMemo(() => {
    const weight: Record<TripStatus, number> = {
      EM_ANDAMENTO: 0,
      PENDENTE: 1,
      CONCLUIDA: 2,
    };

    return [...trips].sort((a, b) => weight[a.status] - weight[b.status]);
  }, [trips]);

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join('');

  return (
    <View style={styles.homeContainer}>
      <View style={styles.homeHeader}>
        <View>
          <Text style={styles.greeting}>Bom dia,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || 'JS'}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.homeContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.newTripButton}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.newTripButtonText}>Nova Viagem</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Minhas viagens</Text>

        {orderedTrips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onConclude={() => onConcludeTrip(trip.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.bottomTab}>
        <TabItem icon="home" label="Home" active />
        <TabItem icon="car-sport" label="Viagens" />
        <TabItem icon="briefcase" label="Equip." />
      </View>
    </View>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
};

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  error,
}: InputFieldProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6E7A96"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        style={[styles.input, error ? styles.inputErrorBorder : null]}
      />

      {error ? <Text style={styles.inputError}>{error}</Text> : null}
    </View>
  );
}

type TripCardProps = {
  trip: Trip;
  onConclude: () => void;
};

function TripCard({ trip, onConclude }: TripCardProps) {
  const statusLabel =
    trip.status === 'EM_ANDAMENTO'
      ? 'Em andamento'
      : trip.status === 'CONCLUIDA'
      ? 'Concluída'
      : 'Pendente';

  return (
    <Pressable style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <Text style={styles.tripCompany}>{trip.company}</Text>
        <View
          style={[
            styles.statusBadge,
            trip.status === 'EM_ANDAMENTO' && styles.statusInProgress,
            trip.status === 'CONCLUIDA' && styles.statusDone,
            trip.status === 'PENDENTE' && styles.statusPending,
          ]}
        >
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <Text style={styles.tripCity}>{trip.city}</Text>

      <View style={styles.tripFooter}>
        <Text style={styles.tripDate}>{trip.date}</Text>

        {trip.status === 'EM_ANDAMENTO' ? (
          <Pressable onPress={onConclude}>
            <Text style={styles.concludeText}>Concluir →</Text>
          </Pressable>
        ) : (
          <Pressable>
            <Text style={styles.detailsText}>Ver detalhes</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

type TabItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
};

function TabItem({ icon, label, active = false }: TabItemProps) {
  return (
    <Pressable style={styles.tabItem}>
      <Ionicons
        name={icon}
        size={20}
        color={active ? '#F97316' : '#D7D9E0'}
      />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#071126',
  },

  registerContainer: {
    flex: 1,
    backgroundColor: '#071126',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  registerCard: {
    backgroundColor: '#08152E',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  registerTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 8,
  },
  registerSubtitle: {
    color: '#97A3BE',
    fontSize: 13,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    color: '#B9C3DA',
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0D1D3A',
    borderWidth: 1,
    borderColor: '#182B4F',
    color: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 14,
  },
  inputErrorBorder: {
    borderColor: '#EF4444',
  },
  inputError: {
    color: '#FCA5A5',
    fontSize: 12,
    marginTop: 6,
  },
  primaryButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#5E7297',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  loginText: {
    textAlign: 'center',
    color: '#8A97B5',
    marginTop: 18,
    fontSize: 13,
  },
  loginLink: {
    color: '#4A83FF',
    fontWeight: '700',
  },

  homeContainer: {
    flex: 1,
    backgroundColor: '#071126',
  },
  homeHeader: {
    backgroundColor: '#4A83FF',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#DCE7FF',
    fontSize: 13,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  homeContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },
  newTripButton: {
    backgroundColor: '#5E8FFF',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 22,
  },
  newTripButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#8F9AB4',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  tripCard: {
    backgroundColor: '#101827',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1C2638',
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  tripCompany: {
    color: '#F6F7FA',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  tripCity: {
    color: '#8D98B0',
    fontSize: 14,
    marginTop: 8,
  },
  tripFooter: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripDate: {
    color: '#A9B3C8',
    fontSize: 13,
  },
  concludeText: {
    color: '#3B82F6',
    fontSize: 13,
    fontWeight: '700',
  },
  detailsText: {
    color: '#7C8AA8',
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  statusInProgress: {
    backgroundColor: '#2A2F39',
  },
  statusDone: {
    backgroundColor: '#1F4D2F',
  },
  statusPending: {
    backgroundColor: '#5B3A0E',
  },
  statusText: {
    color: '#E5E7EB',
    fontSize: 11,
    fontWeight: '700',
  },

  bottomTab: {
    height: 72,
    backgroundColor: '#0B0F17',
    borderTopWidth: 1,
    borderTopColor: '#1A2233',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    color: '#D7D9E0',
    fontSize: 11,
  },
  tabLabelActive: {
    color: '#F97316',
    fontWeight: '700',
  },
});