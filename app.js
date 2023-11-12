// Obtendo referências dos elementos do HTML
const charsContainer = document.querySelector('.chars-container');
const searchInput = document.querySelector('#name');
const speciesFilter = document.querySelector('#species');
const genderFilter = document.querySelector('#gender');
const statusFilter = document.querySelector('#status');
const loadMoreButton = document.querySelector('#load-more');

// URL da API
const url = "https://rickandmortyapi.com/api/character";

//Variavel que armazena os filtros
let defaultFilters = {
    name: '',
    species: '',
    gender: '',
    status: '',
    page: 1
};

// Função assíncrona para obter os personagens da API
async function getCharacters(filters) {
    const response = await fetch(`${url}?${new URLSearchParams(filters).toString()}`);
    const charactersData = await response.json();
    return charactersData;
}   

// Função para renderizar um único personagem na página
async function renderCharacter(character) {
    // Verifica se a espécie coincide com os filtros
    if (!defaultFilters.species || character.species === defaultFilters.species) {
        const charElement = document.createElement('div');
        charElement.classList.add('char');  

        // Montagem do HTML para o card do personagem
        charElement.innerHTML = `  
        <img src="${character.image}" alt="${character.name}">
            <h3 class="card-title">${character.name}</h3>      
            <div class="card-character-infos">  
                <span>${character.species}</span>
                <span>${character.gender}</span>
                <span>${character.status}</span>
        </div>
        `;

        // Adiciona um evento de clique para redirecionar para a página de detalhes, insere o ID na url
        charElement.addEventListener('click', () => {
            window.location.href = `character.html?id=${character.id}`;
        });

        // Adiciona o card do personagem ao contêiner principal
        charsContainer.appendChild(charElement);
    }
}
// Função para renderizar uma lista de personagens
async function render(characters) {
    characters.results.forEach(renderCharacter);
}

// Função para lidar com o carregamento de mais personagens
//Incrementa a página de personagens, não limpa o container de characters para manter os anteriores.
//Executa a função render para renderizar todos os personagens da página.
async function handleLoadMore() {
    defaultFilters.page += 1;
    const characters = await getCharacters(defaultFilters);
    render(characters); 
}

// Adiciona os ouvintes de eventos aos filtros e elementos interativos
function addListeners() {

    /* Todos os listeners de eventos do tipo 'change' nos filters possuem este mesmo comportamento:

        O filtro recebe o valor que o usuário escolheu dentre as <options> que ele tinha;
        Altera o valor da page para 1 para mostrar os personagens a partir dela;
        Limpa o container de personagens para ocupar com os personagens filtrados;
        Renderizam todos os personagens filtrados na tela.
    */

    speciesFilter.addEventListener('change', async (e) => {
        defaultFilters.species = e.target.value;      
        defaultFilters.page = 1;
        charsContainer.innerHTML = '';
        const characters = await getCharacters(defaultFilters);
        render(characters);
    });

    // Listener de pesquisa por nome.
    genderFilter.addEventListener('change', async (e) => {
        defaultFilters.gender = e.target.value;
        defaultFilters.page = 1;
        charsContainer.innerHTML = '';
        const characters = await getCharacters(defaultFilters);
        render(characters);
    });

    statusFilter.addEventListener('change', async (e) => {
        defaultFilters.status = e.target.value;
        defaultFilters.page = 1;
        charsContainer.innerHTML = '';
        const characters = await getCharacters(defaultFilters);
        render(characters);
    });

    //Ao clicar sobre o botão "carregar mais" invoca a função handleLoadmore
    loadMoreButton.addEventListener('click', handleLoadMore);

    searchInput.addEventListener('input', async (e) => {
        defaultFilters.name = e.target.value;
        defaultFilters.page = 1;
        charsContainer.innerHTML = '';
        const characters = await getCharacters(defaultFilters);
        render(characters);
    });
}

// Função principal que é executada ao carregar a página
async function Main() {
    try {
        const characters = await getCharacters(defaultFilters);
        render(characters);
        addListeners();
    } catch (error) {
        console.error('Erro ao buscar e renderizar personagens:', error);
    }
}

//Chamada da função Main que inicia o processo.
Main();
