const z = require("zod");

const RecipeSchema = z.object({
  name: z.string({
    required_error: "O nome deve ser preenchido!",
    invalid_type_error: "O nome deve ser preenchido apenas com Letras!",
  }),
  description: z.string({
    required_error: "A descrição deve ser preenchida!",
    invalid_type_error: "A descrição deve ser preenchida apenas com Letras!",
  }), 
  preparationTime: z.number({
    required_error: "O tempo de preparação deve ser preenchido!",
  }).min(0),
});

module.exports = {
  RecipeSchema
}