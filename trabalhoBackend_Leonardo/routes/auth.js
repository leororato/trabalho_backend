const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { getUserByEmail } = require('../service/userService');

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) return res.status(401).json({ message: "Não Autorizado!" });

        const isEqual = bcrypt.compareSync(password, user.password);
        if (!isEqual) return res.status(401).json({ message: "Não Autorizado!" });
        const payload = {
            user: {
                id: user.id,
                login: user.login
            }
        }

        const token = jwt.sign(payload, process.env.SECRET);
        res.json({ token });
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Não Autorizado!" });
    }
})

module.exports = router;
