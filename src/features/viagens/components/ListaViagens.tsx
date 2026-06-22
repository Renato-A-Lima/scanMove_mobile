import { StyleSheet, Text, View } from 'react-native';

import { cores, espacamentos, tipografia } from '@/shared/theme';

import type { Viagem } from '../types/viagem.types';
import { CartaoViagem } from './CartaoViagem';

type ListaViagensProps = {
  viagens: Viagem[];
  aoAbrirDetalhes?: (viagemId: string) => void;
  aoConcluir?: (viagemId: string) => void;
};

export function ListaViagens({
  viagens,
  aoAbrirDetalhes,
  aoConcluir,
}: ListaViagensProps) {
  if (viagens.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minhas viagens</Text>

      {viagens.map((viagem) => (
        <CartaoViagem
          key={viagem.id}
          viagem={viagem}
          aoAbrirDetalhes={aoAbrirDetalhes}
          aoConcluir={aoConcluir}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: espacamentos.md,
  },
  titulo: {
    color: cores.textoSuave,
    fontSize: tipografia.pequeno,
    fontWeight: '700',
    marginBottom: espacamentos.sm,
  },
});