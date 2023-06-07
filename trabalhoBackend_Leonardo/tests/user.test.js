const { 
    getAllUsers,
    createUser, 
    getUserByEmail, 
    updateUser, 
    deleteUser 
  } = require("../service/userService");
  const prisma = require("../db/prisma.js");
  const request = require("supertest");
  const server = require("../server");
  
  jest.mock("../db/prisma.js", () => ({
    user: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }));
  
  describe("User testes", () => {
    it("retornar todos os usuários", async () => {
      prisma.user.findMany.mockResolvedValue([
        { 
          id: 1, 
          name: "User1", 
          email: "user1@gmail.com", 
          password: "teste123" 
        },
        { 
          id: 2, 
          name: "User2", 
          email: "user2@gmail.com", 
          password: "teste123" 
        },
      ]);
  
      const result = await getAllUsers();
      expect(result.length).toBe(2);
      expect(result[0].name).toBe("User1");
      expect(result[1].name).toBe("User2");
    });
  
    it("retorno do usuário por e-mail com sucesso", async () => {
      prisma.user.findFirst.mockResolvedValue({ 
          id: 1, 
          name: "User",
          email: "user@gmail.com", 
          password: "password123!" 
        });
  
      const result = await getUserByEmail("user@gmail.com");
  
      expect(result.name).toBe("User");
      expect(result.email).toBe("user@gmail.com");
    });
  
    it("novo usuário criado com sucesso", async () => {
  
      prisma.user.create.mockResolvedValue({
        name: "teste",
        email: "teste@gmail.com"
      });
  
      const response = await request(server)
        .post('/user')
        .send({
          name: "teste",
          email: "teste@gmail.com",
          password: "Password123!"
        });
  
      expect(response.body.name).toBe("teste");
      expect(response.body.email).toBe("teste@gmail.com");
      expect(response.body.password).toBeUndefined();
    });
  
    it("usuário atualizado com sucesso", async () => {
  
      prisma.user.update.mockResolvedValue({ 
        id: 1, 
        name: "User", 
        email: "user@gmail.com", 
        password: "password123!"
      });
  
      const result = await updateUser(1, { 
        name: "User", 
        email: "user@gmail.com", 
        password: "password123!"
      });
  
      expect(result.name).toBe("User");
      expect(result.email).toBe("user@gmail.com", );
    });
  
    it("usuário deletado com sucesso", async () => {
  
      prisma.user.delete.mockResolvedValue({ 
        id: 1, 
        name: "User", 
        email: "user@gmail.com", 
        password: "password123!" 
      });
  
      const result = await deleteUser(1);
  
      expect(result.name).toBe("User");
      expect(result.email).toBe("user@gmail.com");
    });
  
    it("http 401 error", async() => {
      const response = await request(server)
        .post("/login")
        .send({
          "email": "user@gmail.com",
          "password": "password123!"
        })
      expect(response.statusCode).toBe(401)
      expect(response.body.message).toBe("Não Autorizado!")
    });
  
    it("http 200 error", async () => { 
      prisma.user.findFirst.mockResolvedValue({ 
        id: 1, 
        name: "teste",
        email: "teste@gmail.com", 
        password: "$2b$10$IHbelqK6sWbASKk4.ZSCnO98/nZfouRW4cxC8gzYqPFubhJDMom96" 
      });
      process.env.SECRET="SECRET_TEST";
  
      const response = await request(server)
        .post('/login')
        .send({
          email: "teste@email.com",
          password: "Password123$"
        });
  
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty("token")
     });
  
  });
  