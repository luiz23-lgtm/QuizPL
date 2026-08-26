import axios from 'axios';

const ERROR_MESSAGES: Record<string, string> = {
  'Invalid credentials': 'E-mail ou senha inválidos',
  'Email already exists': 'Este e-mail já está cadastrado',
  'Failed to login': 'Falha ao entrar. Tente novamente.',
  'Failed to register': 'Falha ao criar conta. Tente novamente.',
  'Email e senha são obrigatórios': 'E-mail e senha são obrigatórios',
  'Nome, e-mail e senha são obrigatórios': 'Preencha todos os campos',
  'Senha deve ter no mínimo 6 caracteres': 'Senha deve ter no mínimo 6 caracteres',
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Inicie o backend: na pasta backend, execute npm run dev.';
    }

    const data = error.response.data;
    if (
      data &&
      typeof data === 'object' &&
      'error' in data &&
      typeof (data as { error: string }).error === 'string'
    ) {
      const msg = (data as { error: string }).error;
      return ERROR_MESSAGES[msg] || msg;
    }
  }

  return fallback;
}
