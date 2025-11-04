import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Listar todos os feedbacks
router.get("/", (req, res) => {
  const sql = `
    SELECT f.id_feedback, u.nome AS usuario, f.mensagem, f.data_envio, f.moderado
    FROM feedbacks f
    JOIN usuarios u ON f.id_usuario = u.id_usuario
    ORDER BY f.data_envio DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(results);
  });
});

// Enviar novo feedback
router.post("/", (req, res) => {
  const { id_usuario, mensagem } = req.body;
  if (!id_usuario || !mensagem) {
    return res.status(400).json({ mensagem: "Campos obrigatórios ausentes" });
  }

  const sql = "INSERT INTO feedbacks (id_usuario, mensagem) VALUES (?, ?)";
  db.query(sql, [id_usuario, mensagem], (err, result) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(201).json({ mensagem: "Feedback enviado com sucesso!", id: result.insertId });
  });
});

// Deletar feedback (caso precise)
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM feedbacks WHERE id_feedback = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (!result.affectedRows) return res.status(404).json({ mensagem: "Feedback não encontrado" });
    res.json({ mensagem: "Feedback excluído!" });
  });
});

export default router;
