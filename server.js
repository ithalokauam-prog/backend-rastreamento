import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import usuariosRoutes from "./routes/usuarios.js";
import rastreamentosRoutes from "./routes/rastreamentos.js";
import feedbacksRoutes from "./routes/feedbacks.js";
import historicoRoutes from "./routes/historico.js";
import notificacoesRoutes from "./routes/notificacoes.js";


dotenv.config();
const app = express();

app.use(express.json());

// Teste rápido
app.get("/", (req, res) => {
  res.send("Servidor funcionando e conectado ao banco de dados!");
});

// Rotas principais
app.use("/usuarios", usuariosRoutes);
app.use("/rastreamentos", rastreamentosRoutes);
app.use("/feedbacks", feedbacksRoutes);
app.use("/historico", historicoRoutes);
app.use("/notificacoes", notificacoesRoutes);


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
