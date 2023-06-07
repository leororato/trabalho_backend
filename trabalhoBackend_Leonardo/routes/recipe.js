const express = require("express");
const router = express.Router();

const { getAllRecipesByUser, createRecipe, updateUserRecipe, deleteUserRecipe, getRecipeById } = require('../service/recipeService');
const auth = require("../middleware/auth");
const { RecipeSchema } = require('../schemas/recipe');
const z = require("zod");

router.get("/recipes", auth, async (req, res) => {
    const userId = Number(req.user.id);

    try {
        const recipes = await getAllRecipesByUser(userId);
        res.json({ recipes })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }

});

router.post("/recipe", auth, async (req, res) => {
    const userId = Number(req.user.id);

    try {
        const recipeBody = RecipeSchema.parse(req.body);
        const newRecipe = await createRecipe(recipeBody, userId)
        res.json(newRecipe)
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(422).json({
                message: err.errors,
            });
        }
        res.status(500).json({ message: err });
    }

});

router.put("/recipe/:id", auth, async (req, res) => {
    const id = Number(req.params.id);
    const userId = Number(req.user.id);

    try {
        const recipe = await getRecipeById(id);
        if (!recipe) return res.status(404).json({ message: "Receita não foi encontrada!" });
        if (recipe.userId !== userId) return res.status(401).json({ message: "Não Autorizado!" });

        const recipeBody = RecipeSchema.parse(req.body);
        const updatedRecipe = await updateUserRecipe(id, recipeBody);
        res.json(updatedRecipe);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(422).json({
                message: err.errors,
            });
        }
        res.status(500).json({ message: err.message });
    }

});

router.delete("/recipe/:id", auth, async (req, res) => {
    const id = Number(req.params.id);
    const userId = Number(req.user.id);
    try {
        const recipe = await getRecipeById(id);
        if (!recipe) return res.status(404).json({ message: "Receita não foi encontrada!" });
        if (recipe.userId !== userId) return res.status(401).json({ message: "Não Autorizado!" });

        const deletedRecipe = await deleteUserRecipe(id);
        res.send(deletedRecipe)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
