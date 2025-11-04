import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Listar todos os rastreamentos
router.get("/", (req, res) => {
  const sql = `
    SELECT r.*, u.nome AS usuario, t.nome AS transportadora, c.nome_categoria AS categoria
    FROM rastreamentos r
    JOIN usuarios u ON r.id_usuario = u.id_usuario
    JOIN transportadoras t ON r.id_transportadora = t.id_transportadora
    LEFT JOIN categorias c ON r.id_categoria = c.id_categoria
    ORDER BY r.data_atualizacao DESC;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(results);
  });
});

// Buscar rastreamento por código
router.get("/:codigo", (req, res) => {
  const sql = "SELECT * FROM rastreamentos WHERE codigo_rastreio = ?";
  db.query(sql, [req.params.codigo], (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (!results.length) return res.status(404).json({ mensagem: "Rastreio não encontrado" });
    res.json(results[0]);
  });
});

// Criar novo rastreamento
router.post("/", (req, res) => {
  const {
    id_usuario,
    id_transportadora,
    id_categoria,
    codigo_rastreio,
    descricao,
    status_atual,
    localizacao_atual,
    data_envio,
    previsao_entrega
  } = req.body;

  const sql = `
    INSERT INTO rastreamentos (
      id_usuario, id_transportadora, id_categoria, codigo_rastreio,
      descricao, status_atual, localizacao_atual, data_envio, previsao_entrega
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    id_usuario,
    id_transportadora,
    id_categoria,
    codigo_rastreio,
    descricao,
    status_atual,
    localizacao_atual,
    data_envio,
    previsao_entrega
  ], (err, result) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(201).json({ mensagem: "Rastreio cadastrado com sucesso!", id: result.insertId });
  });
});

// Atualizar rastreamento
router.put("/:codigo", (req, res) => {
  const { status_atual, localizacao_atual, previsao_entrega } = req.body;
  const sql = `
    UPDATE rastreamentos
    SET status_atual = ?, localizacao_atual = ?, previsao_entrega = ?, data_atualizacao = NOW()
    WHERE codigo_rastreio = ?
  `;
  db.query(sql, [status_atual, localizacao_atual, previsao_entrega, req.params.codigo], (err, result) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (!result.affectedRows) return res.status(404).json({ mensagem: "Rastreio não encontrado" });
    res.json({ mensagem: "Rastreio atualizado com sucesso!" });
  });
});

// Excluir rastreamento
router.delete("/:codigo", (req, res) => {
  const sql = "DELETE FROM rastreamentos WHERE codigo_rastreio = ?";
  db.query(sql, [req.params.codigo], (err, result) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (!result.affectedRows) return res.status(404).json({ mensagem: "Rastreio não encontrado" });
    res.json({ mensagem: "Rastreio removido com sucesso!" });
  });
});

export default router;
