import type { StatusViagem } from '../types/viagem.types';

const labelsStatusViagem: Record<StatusViagem, string> = {
  CRIADA: 'Criada',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
};

export function formatarStatusViagem(status: StatusViagem): string {
  return labelsStatusViagem[status];
}