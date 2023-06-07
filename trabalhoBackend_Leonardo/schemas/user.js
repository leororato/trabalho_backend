const z = require("zod");

const UserSchema = z.object({
  name: z.string({
    required_error: "O nome deve ser preenchido!",
    invalid_type_error: "O nome deve ser preenchido apenas com Letras!",
  })
    .min(3),
  email: z.string({
    required_error: "A descrição deve ser preenchida!",
    invalid_type_error: "A descrição deve ser preenchida apenas com Letras!",
  })
    .email("Este e-mail não é válido!"), 
  password: z.string({
    required_error: "A senha deve ser preenchida!",
    invalid_type_error: "A senha deve conter as requisições de strings!",
  })
    .min(8, "Deve ter pelo menos 8 caracteres")
    .regex(new RegExp('.*[A-Z].*'), "Um caractere maiúsculo")
    .regex(new RegExp('.*[a-z].*'), "Um caractere minúsculo")
    .regex(new RegExp('.*[0-9].*'), "Um número")
    .regex(new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'), "Um caractere especial"),
});

module.exports = {
  UserSchema
}