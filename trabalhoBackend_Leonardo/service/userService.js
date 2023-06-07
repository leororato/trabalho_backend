const prisma = require("../db/prisma");
const bcrypt = require('bcrypt');

const getAllUsers = () => {
    return prisma.user.findMany();
}

const getUserByEmail = (email) => {
    return prisma.user.findFirst({
        where: { email },
    });
}

const createUser = ({ name, email, password }) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: {
            name: true,
            email: true,
            password: false,
        }
    });
}

const updateUser = (id, { name, email, password }) => {
    const hashedPassword = bcrypt.hashSync(password, 10)
    return prisma.user.update({
        where: { id },
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: {
            name: true,
            email: true,
            password: false,
        }
    });
};

const deleteUser = (id) => {
    return prisma.user.delete({
        where: { id },
    })
}

module.exports = {
    getAllUsers,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
}