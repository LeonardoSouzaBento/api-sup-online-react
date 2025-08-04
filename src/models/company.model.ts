export type Company = {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  emailContato: string;
  telefoneContato?: string
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  }
};