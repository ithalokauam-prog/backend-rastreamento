import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Listar todas as notificações (mais recentes primeiro)
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      n.id_notificacao,
      u.nome AS usuario,
      r.codigo_rastreio,
      n.mensagem,
      n.enviada_em,
      n.lida
    FROM notificacoes n
    JOIN usuarios u ON n.id_usuario = u.id_usuario
    JOIN rastreamentos r ON n.id_rastreamento = r.id_rastreamento
    ORDER BY n.enviada_em DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(results);
  });
});

// Buscar notificações por usuário
router.get("/usuario/:id", (req, res) => {
  const sql = `
    SELECT 
      n.id_notificacao,
      r.codigo_rastreio,
      n.mensagem,
      n.enviada_em,
      n.lida
    FROM notificacoes n
    JOIN rastreamentos r ON n.id_rastreamento = r.id_rastreamento
    WHERE n.id_usuario = ?
    ORDER BY n.enviada_em DESC
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(results);
  });
});

// Marcar uma notificação como lida
router.put("/:id", (req, res) => {
  const sql = "UPDATE notificacoes SET lida = TRUE WHERE id_notificacao = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (!result.affectedRows) return res.status(404).json({ mensagem: "Notificação não encontrada" });
    res.json({ mensagem: "Notificação marcada como lida!" });
  });
});

export default router;
