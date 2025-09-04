import { Joi } from "celebrate";

export type User = {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  whatsapp?: string;
  telefone?: string;
  endereco?: {
    rua: string;
    numero: number;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    lat: number;
    lng: number;
  };
};

export const updateUserSchema = Joi.object().keys({
  nome: Joi.string().required(), //required é obrigatório
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
});

export const newUserSchema = Joi.object().keys({
  nome: Joi.string().required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6),
});

export const authLoginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
});

export const authRecoverySchema = Joi.object().keys({
  email: Joi.string().email().required(),
});

export const updateAddressSchema = Joi.object().keys({
  endereco: Joi.object()
    .keys({
      rua: Joi.string().required(),
      numero: Joi.number().required(),
      complemento: Joi.string().allow("").optional(),
      bairro: Joi.string().required(),
      cidade: Joi.string().required(),
      estado: Joi.string().required(),
      lat: Joi.number().allow(null).optional(), 
      lng: Joi.number().allow(null).optional(),
    })
    .required(),
});
