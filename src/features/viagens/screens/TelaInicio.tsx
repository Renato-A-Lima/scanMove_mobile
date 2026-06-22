import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { bordas, cores, espacamentos, tipografia } from '@/shared/theme';

import { ListaViagens } from '../components/ListaViagens';
import type { StatusViagem, Viagem } from '../types/viagem.types';

type ItemAba = {
  icone: keyof typeof Ionicons.glyphMap;
  label: string;
  ativo?: boolean;
};

const usuarioMockado = {
  nome: 'Brenga Raven',
};

const viagensMockadas: Viagem[] = [];

const pesoStatus: Record<StatusViagem, number> = {
  EM_ANDAMENTO: 0,
  CRIADA: 1,
  CONCLUIDA: 2,
  CANCELADA: 3,
};

export function TelaInicio() {
  const viagensOrdenadas = useMemo(
    () =>
      [...viagensMockadas].sort(
        (viagemAtual, proximaViagem) =>
          pesoStatus[viagemAtual.status] - pesoStatus[proximaViagem.status],
      ),
    [],
  );

  // Retira as Inicias do nome do usuário para colocar no icone
  const iniciais = usuarioMockado.nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parteNome) => parteNome[0]?.toUpperCase())
    .join('');

  function navegarParaNovaViagem() {
    return undefined;
  }

  function abrirDetalhesViagem(viagemId: string) {
    void viagemId;
  }

  function concluirViagem(viagemId: string) {
    void viagemId;
  }

  return (
    <View style={styles.tela}>
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.saudacao}>Bem vindo,</Text>
          <Text style={styles.nomeUsuario}>{usuarioMockado.nome}</Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{iniciais || 'JS'}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.conteudo}
        contentContainerStyle={styles.conteudoInterno}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Criar nova viagem"
          style={styles.botaoNovaViagem}
          onPress={navegarParaNovaViagem}
        >
          <Ionicons name="add" size={28} color={cores.textoPrincipal} />
          <Text style={styles.botaoNovaViagemTexto}>Nova Viagem</Text>
        </Pressable>

        <ListaViagens
          viagens={viagensOrdenadas}
          aoAbrirDetalhes={abrirDetalhesViagem}
          aoConcluir={concluirViagem}
        />
      </ScrollView>

      <View style={styles.abas}>
        <ItemAbaInferior icone="home" label="Home" ativo />
        <ItemAbaInferior icone="car-sport" label="Viagens" />
        <ItemAbaInferior icone="cube" label="Equip." />
      </View>
    </View>
  );
}

// Função de connfiguração da TabBar
function ItemAbaInferior({ icone, label, ativo = false }: ItemAba) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.itemAba}
    >
      <Ionicons name={icone} size={22} color={ativo ? '#F97316' : '#D1D5DB'} />
      <Text style={[styles.itemAbaTexto, ativo && styles.itemAbaTextoAtivo]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tela: {
    backgroundColor: cores.fundo,
    flex: 1,
  },
  cabecalho: {
    alignItems: 'center',
    backgroundColor: cores.primaria,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: espacamentos.lg,
    paddingHorizontal: 20,
    paddingTop: espacamentos.xl,
  },
  saudacao: {
    color: cores.azulTexto,
    fontSize: tipografia.pequeno,
    fontWeight: '500',
  },
  nomeUsuario: {
    color: cores.textoInvertido,
    fontSize: tipografia.titulo,
    fontWeight: '800',
    marginTop: 2,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  avatarTexto: {
    color: cores.textoInvertido,
    fontSize: tipografia.legenda,
    fontWeight: '800',
  },
  conteudo: {
    flex: 1,
  },
  conteudoInterno: {
    paddingBottom: espacamentos.lg,
    paddingHorizontal: espacamentos.md,
    paddingTop: espacamentos.md,
  },
  botaoNovaViagem: {
    alignItems: 'center',
    backgroundColor: cores.azulClaro,
    borderRadius: bordas.lg,
    flexDirection: 'row',
    gap: espacamentos.md,
    height: 56,
    justifyContent: 'center',
  },
  botaoNovaViagemTexto: {
    color: cores.textoInvertido,
    fontSize: tipografia.corpo,
    fontWeight: '800',
  },
  abas: {
    alignItems: 'center',
    backgroundColor: cores.abaFundo,
    borderTopColor: cores.borda,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-around',
    paddingBottom: espacamentos.sm,
  },
  itemAba: {
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 64,
  },
  itemAbaTexto: {
    color: '#D1D5DB',
    fontSize: tipografia.legenda,
  },
  itemAbaTextoAtivo: {
    color: '#F3B36F',
    fontWeight: '700',
  },
});