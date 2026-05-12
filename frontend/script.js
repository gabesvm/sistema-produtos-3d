const API_URL = "http://localhost:3000/produtos";

const form = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");

async function carregarProdutos() {
  const resposta = await fetch(API_URL);
  const produtos = await resposta.json();

  listaProdutos.innerHTML = "";

  produtos.forEach((produto) => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${produto.categoria}</td>
            <td>R$ ${produto.preco}</td>
            <td>
                <button class="btn-editar" onclick="editarProduto(${produto.id}, '${produto.nome}', '${produto.categoria}', ${produto.preco})">
                    Editar
                </button>

                <button class="btn-excluir" onclick="excluirProduto(${produto.id})">
                    Excluir
                </button>
            </td>
        `;

    listaProdutos.appendChild(linha);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("produtoId").value;

  const produto = {
    nome: document.getElementById("nome").value,
    categoria: document.getElementById("categoria").value,
    preco: parseFloat(document.getElementById("preco").value),
  };

  if (id) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produto),
    });
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produto),
    });
  }

  form.reset();
  document.getElementById("produtoId").value = "";

  carregarProdutos();
});

async function excluirProduto(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  carregarProdutos();
}

function editarProduto(id, nome, categoria, preco) {
  document.getElementById("produtoId").value = id;
  document.getElementById("nome").value = nome;
  document.getElementById("categoria").value = categoria;
  document.getElementById("preco").value = preco;
}

carregarProdutos();
