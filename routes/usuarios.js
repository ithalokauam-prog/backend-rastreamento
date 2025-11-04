import express from "express";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const router = express.Router();

//  Listar todos os usuários
router.get("/", (req, res) => {
  const sql = "SELECT id_usuario, nome, email, verificado, data_cadastro FROM usuarios";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(results);
  });
});

//  Buscar um usuário por ID
router.get("/:id", (req, res) => {
  const sql = "SELECT id_usuario, nome, email, verificado FROM usuarios WHERE id_usuario = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (!results.length) return res.status(404).json({ mensagem: "Usuário não encontrado" });
    res.json(results[0]);
  });
});

// Criar novo usuário (cadastro)
router.post("/", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "Campos obrigatórios ausentes" });
  }

  try {
    const senha_hash = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)";
    db.query(sql, [nome, email, senha_hash], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ mensagem: "E-mail já cadastrado" });
        }
        return res.status(500).json({ erro: err.message });
      }
      res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!", id: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Login
router.post("/login", (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ mensagem: "Informe e-mail e senha" });

  const sql = "SELECT * FROM usuarios WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (!results.length) return res.status(404).json({ mensagem: "Usuário não encontrado" });

    const usuario = results[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) return res.status(401).json({ mensagem: "Senha incorreta" });

    res.json({
      mensagem: "Login efetuado com sucesso!",
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  });
});

// Atualizar usuário
router.put("/:id", (req, res) => {
  const { nome, email, verificado } = req.body;
  const sql = "UPDATE usuarios SET nome = ?, email = ?, verificado = ? WHERE id_usuario = ?";
  db.query(sql, [nome, email, verificado, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (!result.affectedRows) return res.status(404).json({ mensagem: "Usuário não encontrado" });
    res.json({ mensagem: "Usuário atualizado com sucesso!" });
  });
});

// Deletar usuário
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM usuarios WHERE id_usuario = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (!result.affectedRows) return res.status(404).json({ mensagem: "Usuário não encontrado" });
    res.json({ mensagem: "Usuário excluído com sucesso!" });
  });
});

export default router;
