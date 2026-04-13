export type LoginResponse = {
  token?: string;
  user?: {
    id: number | string;
    nome?: string;
    email: string;
  };
  message?: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function loginRequest(email: string, senha: string): Promise<LoginResponse> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL não configurada.');
  }

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha }),
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    // Se a API não retornar JSON
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.erro ||
      `Erro ${response.status} ao fazer login.`;

    throw new Error(message);
  }

  return data;
}