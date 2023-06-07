const {
    getAllRecipesByUser,
    createRecipe,
    updateUserRecipe,
    deleteUserRecipe
} = require("../service/recipeService");
const prisma = require("../db/prisma.js");

jest.mock("../db/prisma.js", () => ({
    recipe: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

describe("Recipe teste", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("usuario cadastrado com sucesso", async () => {
        const mockedRecipes = [
            {
                "name": "recipe1",
                "description": "recipe1 testando",
                "preparationTime": 4,
                "user": {
                    "name": "user1",
                    "email": "user1@gmail.com"
                }
            },
            {
                "name": "recipe2",
                "description": "recipe2 testando",
                "preparationTime": 1.3,
                "user": {
                    "name": "user2",
                    "email": "user2@gmail.com"
                }
            },
        ];

        prisma.recipe.findMany.mockResolvedValue(mockedRecipes);
        const userId = 222;
        const result = await getAllRecipesByUser(userId);
        expect(result).toEqual(mockedRecipes);
        expect(prisma.recipe.findMany).toHaveBeenCalledTimes(1);
        expect(prisma.recipe.findMany).toHaveBeenCalledWith({
            where: { userId },
            select: {
                name: true,
                description: true,
                preparationTime: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
    });

    it("receita criada com sucesso", async () => {
        const newRecipe = {
            name: "Recipe Bolo",
            description: "Description chocolate",
            preparationTime: 40,
        };
        const createdRecipe = { id: 1, ...newRecipe };
        prisma.recipe.create.mockResolvedValue(createdRecipe);
        const userId = 222;
        const result = await createRecipe(newRecipe, userId);

        expect(result).toEqual(createdRecipe);
        expect(prisma.recipe.create).toHaveBeenCalledTimes(1);
        expect(prisma.recipe.create).toHaveBeenCalledWith({
            data: {
                ...newRecipe,
                userId,
            }
        });
    });

    it("receita atualizada com sucesso", async () => {
        const recipeId = 1;
        const updatedRecipe = {
            id: recipeId,
            name: "Recipe Pastel",
            description: "Description Carne",
            preparationTime: 20,
        };

        prisma.recipe.update.mockResolvedValue(updatedRecipe);
        const userId = 222;
        const result = await updateUserRecipe(recipeId, updatedRecipe, userId);
        delete updatedRecipe.id;

        expect(result).toEqual(updatedRecipe);
        expect(prisma.recipe.update).toHaveBeenCalledTimes(1);
        expect(prisma.recipe.update).toHaveBeenCalledWith({
            where: { id: recipeId },
            data: updatedRecipe
        });
    });

    it("receita deletada com sucesso", async () => {
        const recipeId = 1;
        const deletedRecipe = { id: recipeId, name: "Recipe" };
        prisma.recipe.delete.mockResolvedValue(deletedRecipe);
        const userId = 222;
        const result = await deleteUserRecipe(recipeId, userId);

        expect(result).toEqual(deletedRecipe);
        expect(prisma.recipe.delete).toHaveBeenCalledTimes(1);
        expect(prisma.recipe.delete).toHaveBeenCalledWith({
            where: { id: recipeId }
        });
    });

});
