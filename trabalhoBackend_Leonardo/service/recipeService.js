const prisma = require("../db/prisma");

const getAllRecipesByUser = (userId) => {
    return prisma.recipe.findMany({
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
}

const getRecipeById = (id) => {
    return prisma.recipe.findFirst({
        where: { id }
    });
};

const createRecipe = ({ name, description, preparationTime }, userId) => {
    return prisma.recipe.create({
        data: {
            name,
            description,
            preparationTime,
            userId,
        }
    });
}

const updateUserRecipe = async (recipeId, { name, description, preparationTime }) => {
    const id = Number(recipeId);
    return prisma.recipe.update({
        where: {
            id
        },
        data: {
            name,
            description,
            preparationTime
        }
    });
}

const deleteUserRecipe = async (recipeId, userId) => {
    const id = Number(recipeId);
    return prisma.recipe.delete({
        where: { id }
    });
}

module.exports = {
    getAllRecipesByUser,
    getRecipeById,
    createRecipe,
    updateUserRecipe,
    deleteUserRecipe,
}