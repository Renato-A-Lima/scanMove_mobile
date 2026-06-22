import { Pressable, StyleSheet, Text, View } from 'react-native';

import { bordas, cores, espacamentos, tipografia } from '@/shared/theme';

import type { Viagem } from '../types/viagem.types';
import { StatusViagemBadge } from './StatusViagemBagge';

type CartaoViagemProps = {
  viagem: Viagem;
  aoAbrirDetalhes?: (viagemId: string) => void;
  aoConcluir?: (viagemId: string) => void;
};

export function CartaoViagem({
  viagem,
  aoAbrirDetalhes,
  aoConcluir,
}: CartaoViagemProps) {
  const viagemEmAndamento = viagem.status === 'EM_ANDAMENTO';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir detalhes da viagem para ${viagem.cliente}`}
      style={styles.cartao}
      onPress={() => aoAbrirDetalhes?.(viagem.id)}
    >
      <View style={styles.cabecalho}>
        <Text style={styles.cliente} numberOfLines={2}>
          {viagem.cliente}
        </Text>
        <StatusViagemBadge status={viagem.status} />
      </View>

      <Text style={styles.cidade}>{viagem.cidade}</Text>

      <View style={styles.separador} />

      <View style={styles.rodape}>
        <Text style={styles.data}>{viagem.data}</Text>

        {viagemEmAndamento ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Concluir viagem para ${viagem.cliente}`}
            hitSlop={8}
            onPress={() => aoConcluir?.(viagem.id)}
          >
            <Text style={styles.concluir}>Concluir ?</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderRadius: bordas.xl,
    borderWidth: 1,
    marginBottom: espacamentos.md,
    padding: espacamentos.md,
  },
  cabecalho: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: espacamentos.md,
    justifyContent: 'space-between',
  },
  cliente: {
    color: cores.textoPrincipal,
    flex: 1,
    fontSize: tipografia.subtitulo,
    fontWeight: '700',
    lineHeight: 24,
  },
  cidade: {
    color: cores.textoSecundario,
    fontSize: tipografia.pequeno,
    marginTop: espacamentos.sm,
  },
  separador: {
    backgroundColor: cores.borda,
    height: 1,
    marginTop: espacamentos.md,
  },
  rodape: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: espacamentos.sm,
  },
  data: {
    color: '#8EA4C0',
    fontSize: tipografia.pequeno,
  },
  concluir: {
    color: cores.primaria,
    fontSize: tipografia.pequeno,
    fontWeight: '700',
  },
});