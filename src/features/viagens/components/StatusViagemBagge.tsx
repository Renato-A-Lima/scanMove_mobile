import { StyleSheet, Text, View } from 'react-native';

import { bordas, cores, espacamentos, tipografia } from '@/shared/theme';

import type { StatusViagem } from '../types/viagem.types';
import { formatarStatusViagem } from '../utils/formatarStatusViagem';

type StatusViagemBadgeProps = {
  status: StatusViagem;
};

const coresStatus: Record<StatusViagem, { fundo: string; texto: string }> = {
  CRIADA: { fundo: '#3A2A11', texto: '#FACC15' },
  EM_ANDAMENTO: { fundo: cores.superficieSecundaria, texto: '#CBD5E1' },
  CONCLUIDA: { fundo: '#1F4D2F', texto: '#DCFCE7' },
  CANCELADA: { fundo: '#4A1D1D', texto: '#FECACA' },
};

export function StatusViagemBadge({ status }: StatusViagemBadgeProps) {
  const paleta = coresStatus[status];

  return (
    <View style={[styles.badge, { backgroundColor: paleta.fundo }]}>
      <Text style={[styles.texto, { color: paleta.texto }]}>
        {formatarStatusViagem(status)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: bordas.xl,
    paddingHorizontal: espacamentos.md,
    paddingVertical: espacamentos.sm,
  },
  texto: {
    fontSize: tipografia.legenda,
    fontWeight: '700',
  },
});