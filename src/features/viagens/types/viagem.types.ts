export type StatusViagem = 'CRIADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';

export type Viagem = {
  id: string;
  cliente: string;
  cidade: string;
  data: string;
  status: StatusViagem;
};