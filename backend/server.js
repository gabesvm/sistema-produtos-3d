// Importa o Express
const express = require("express");

// Importa o CORS
const cors = require("cors");

// Importa o SQLite
const sqlite3 = require("sqlite3").verbose();

// Cria a aplicação Express
const app = express();

// Define a porta
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conecta/cria o banco de dados
const db = new sqlite3.Database("../database/produtos.db", (err) => {
  if (err) {
    console.log("Erro ao conectar banco de dados:", err.message);
  } else {
    console.log("Banco de dados conectado com sucesso!");
  }
});

// Cria a tabela produtos automaticamente
db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        categoria TEXT NOT NULL,
        preco REAL NOT NULL
    )
`);

// Rota inicial
app.get("/", (req, res) => {
  res.send("API do Sistema de Produtos 3D funcionando!");
});

// LISTAR produtos
app.get("/produtos", (req, res) => {
  db.all("SELECT * FROM produtos", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        erro: err.message,
      });
    }

    res.json(rows);
  });
});

// CADASTRAR produto
app.post("/produtos", (req, res) => {
  const { nome, categoria, preco } = req.body;

  db.run(
    `
        INSERT INTO produtos (nome, categoria, preco)
        VALUES (?, ?, ?)
        `,
    [nome, categoria, preco],

    function (err) {
      if (err) {
        return res.status(500).json({
          erro: err.message,
        });
      }

      res.json({
        mensagem: "Produto cadastrado com sucesso!",
        id: this.lastID,
      });
    },
  );
});

// EDITAR produto
app.put("/produtos/:id", (req, res) => {
  const { nome, categoria, preco } = req.body;

  const { id } = req.params;

  db.run(
    `
        UPDATE produtos
        SET nome = ?, categoria = ?, preco = ?
        WHERE id = ?
        `,
    [nome, categoria, preco, id],

    function (err) {
      if (err) {
        return res.status(500).json({
          erro: err.message,
        });
      }

      res.json({
        mensagem: "Produto atualizado com sucesso!",
      });
    },
  );
});

// EXCLUIR produto
app.delete("/produtos/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    `
        DELETE FROM produtos
        WHERE id = ?
        `,
    [id],

    function (err) {
      if (err) {
        return res.status(500).json({
          erro: err.message,
        });
      }

      res.json({
        mensagem: "Produto removido com sucesso!",
      });
    },
  );
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
