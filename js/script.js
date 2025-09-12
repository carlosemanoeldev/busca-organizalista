// Pegando os elementos de filtro e ordenação do HTML
const filtroBusca = document.getElementById("filtroBusca"); // Campo de busca por nome/email
const filtroIdade = document.getElementById("filtroIdade"); // Campo para filtrar por idade mínima
const ordernarPor = document.getElementById("ordernarPor"); // Select para escolher critério de ordenação

// Função assíncrona para carregar os usuários a partir do arquivo JSON
async function carregarUsuarios() {
	try {
		// Fazendo requisição para buscar o arquivo de usuários
		const resposta = await fetch("/dados/users.json"); // Busca o arquivo JSON no servidor
		
		// Verifica se a resposta foi bem-sucedida
		if (!resposta.ok) { 
			throw new Error(
				`Não foi possível carregar os dados (${resposta.statusText})` // Caso contrário, gera erro
			);
		}

		// Converte o JSON em objeto JavaScript
		const usuarios = await resposta.json(); 
		
		// Verifica se os dados recebidos são realmente um array
		if (!Array.isArray(usuarios)) {
			throw new Error(`Dados inválidos, esperado um array de usuários.`); // Se não for array, erro
		}

		// Exibe os usuários na tabela já de começo
		exibirUsuarios(usuarios);

		// Evento de ordenação: toda vez que mudar o select ele ordena de novo a lista
		ordernarPor.addEventListener("change", () => {
			ordenarUsuarios(usuarios, ordernarPor.value);
		});

		// Evento de filtro por busca: No momento em que a pessoa estiver digitando, ele ja vai filtrando os usuários
		filtroBusca.addEventListener("input", () => {
			filtrarUsuarios(usuarios);
		});

		// Evento de filtro por idade: No momento em que a pessoa estiver digitando, ele ja vai filtrando os usuários
		filtroIdade.addEventListener("input", () => {
			filtrarUsuarios(usuarios);
		});
	} catch (erro) {
		// Captura e mostra no console qualquer erro que ocorrer
		console.error(erro);
	}
}

// Função para exibir os usuários na tabela HTML
function exibirUsuarios(lista) {
	const tbody = document.querySelector("#tabelaUsuarios tbody"); // Pega o corpo da tabela
	tbody.innerHTML = ""; // Limpa a tabela antes de preencher

	// Percorre a lista de usuários e cria uma linha para cada um
	lista.forEach((user) => {
		const tr = document.createElement("tr"); // Cria uma linha da tabela
		tr.innerHTML = ` 
      <td>${user.id}</td>      <!-- Exibe ID -->
      <td>${user.nome}</td>    <!-- Exibe Nome -->
      <td>${user.idade}</td>   <!-- Exibe Idade -->
      <td>${user.email}</td>   <!-- Exibe Email -->
    `;

		tbody.appendChild(tr); // Adiciona a linha dentro do corpo da tabela
	});
}

// Função para filtrar usuários com base nos campos de busca e idade
function filtrarUsuarios(usuarios) {
	const buscaFiltro = filtroBusca.value.toLowerCase(); // Valor digitado na busca (em minúsculas)
	const idadeFiltro = parseInt(filtroIdade.value) || 0; // Valor digitado para idade mínima (ou 0 se vazio)

	// Filtra os usuários de acordo com os critérios
	const filtrados = usuarios.filter(
		(user) =>
			(user.nome.toLowerCase().includes(buscaFiltro) || // Nome contém o texto buscado
				user.email.toLowerCase().includes(buscaFiltro)) && // OU email contém o texto buscado
			user.idade >= idadeFiltro // E a idade é maior ou igual ao filtro
	);

	exibirUsuarios(filtrados); // Exibe apenas os usuários filtrados
}

// Função para ordenar os usuários conforme o critério selecionado
function ordenarUsuarios(usuarios, criterio) {
	usuarios.sort((a, b) => {
		if (criterio === "nome") {
			return a.nome.localeCompare(b.nome); // Organiza em ordem alfabetica pelo nome
		}

		if (criterio === "idade") {
			return a.idade - b.idade; // Organiza por idade em ordem crescente
		}

		return a.id - b.id; // Organização padrão por ID em ordem crescente
	});

	filtrarUsuarios(usuarios); // Depois de ordenar, aplica o filtro atual
}

// Chama a função inicial para carregar os usuários ao abrir a página
carregarUsuarios();
