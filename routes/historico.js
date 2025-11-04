import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Listar todo o histórico (últimos eventos primeiro)
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      h.id_evento,
      r.codigo_rastreio,
      h.status_evento,
      h.local_evento,
      h.data_evento
    FROM historico_rastreamento h
    JOIN rastreamentos r ON h.id_rastreamento = r.id_rastreamento
    ORDER BY h.data_evento DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(results);
  });
});

// Buscar histórico de um rastreamento específico
router.get("/:codigo", (req, res) => {
  const sql = `
    SELECT 
      h.status_evento,
      h.local_evento,
      h.data_evento
    FROM historico_rastreamento h
    JOIN rastreamentos r ON h.id_rastreamento = r.id_rastreamento
    WHERE r.codigo_rastreio = ?
    ORDER BY h.data_evento DESC
  `;
  db.query(sql, [req.params.codigo], (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (!results.length) return res.status(404).json({ mensagem: "Nenhum evento encontrado para esse código" });
    res.json(results);
  });
});

export default router;
