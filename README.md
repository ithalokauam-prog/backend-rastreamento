Backend - LogPass Rastreamentos
Este é o servidor backend desenvolvido em Node.js e Express para o projeto LogPass Rastreamentos. Este servidor gere utilizadores, rastreios, e feedbacks, ligando-se a um banco de dados MySQL.

Este backend foi criado para cumprir os requisitos de criação de um servidor Node.js com rotas RESTful e endpoints CRUD.

Tecnologias Utilizadas
Node.js

Express.js - Para a gestão do servidor e das rotas.

mysql2 - Driver para a ligação ao MySQL.

bcrypt - Para encriptação de palavras-passe.

CORS - Para permitir a ligação do frontend.

dotenv - Para gestão de variáveis de ambiente.

Pré-requisitos
Para executar este projeto localmente, precisará de:

Node.js (v14 ou superior)

npm (normalmente instalado com o Node.js)

Um servidor MySQL a correr (Ex: XAMPP, MAMP, WAMP, Docker, etc.)

Instalação e Execução
Siga estes passos para configurar e iniciar o servidor localmente:

Navegar para a pasta Navegue no seu terminal para a pasta backend-rastreamento.

Instalar Dependências Execute o comando para instalar todos os pacotes necessários:

Bash

npm install
Configurar o Banco de Dados

Certifique-se de que o seu servidor MySQL está ativo.

Crie um banco de dados (ex: logpass_db) no seu gestor MySQL (phpMyAdmin, DBeaver, etc.).

Nota: Este README assume que as tabelas (usuarios, rastreamentos, etc.) já foram criadas nesse banco de dados.

Configurar Variáveis de Ambiente Crie um ficheiro chamado .env na raiz da pasta backend-rastreamento. Este ficheiro guardará as suas credenciais de banco de dados de forma segura. Adicione as seguintes variáveis:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=logpass_db
PORT=3001
(Substitua sua_senha_do_mysql e logpass_db pelos seus dados reais)

Iniciar o Servidor Para iniciar o servidor em modo de desenvolvimento (com nodemon), execute:

Bash

npm run dev
O servidor estará ativo e a "ouvir" em http://localhost:3001.

Rotas da API (Endpoints)
O servidor expõe as seguintes rotas RESTful para gestão dos dados.

👤 Utilizadores
POST /usuarios

Cria um novo utilizador (registo).

Body (JSON): { "nome": "...", "email": "...", "senha": "..." }

POST /usuarios/login

Autentica um utilizador (login).

Body (JSON): { "email": "...", "senha": "..." }

GET /usuarios

Lista todos os utilizadores.

GET /usuarios/:id

Busca um utilizador específico por ID.

PUT /usuarios/:id

Atualiza um utilizador por ID.

DELETE /usuarios/:id

Apaga um utilizador por ID.

🚚 Rastreamentos
POST /rastreamentos

Adiciona um novo registo de rastreio.

GET /rastreamentos

Lista todos os rastreios.

GET /rastreamentos/:codigo

Busca um rastreio específico pelo código.

PUT /rastreamentos/:codigo

Atualiza um rastreio (ex: status_atual).

DELETE /rastreamentos/:codigo

Apaga um rastreio.

📂 Outras Rotas
GET /historico/:codigo - Busca o histórico de eventos de um rastreio.

POST /feedbacks - Envia um novo feedback.

GET /notificacoes/usuario/:id - Lista as notificações de um utilizador específico.

Testando com Postman
(Este requisito é cumprido usando o Postman para testar os endpoints acima)

Abra o Postman.

Certifique-se de que o seu servidor Node.js (npm run dev) está a correr.

Crie novas requisições para testar as rotas.

Exemplo de Teste (Registar Utilizador):

Método: POST

URL: http://localhost:3001/usuarios

Separador (Aba): Body > raw > JSON

Corpo (JSON):

JSON

{
  "nome": "Utilizador Teste",
  "email": "teste@email.com",
  "senha": "123456"
}
Exemplo de Teste (Buscar Rastreio):

Método: GET

URL: http://localhost:3001/rastreamentos/BR123456
