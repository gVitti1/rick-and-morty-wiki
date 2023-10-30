document.addEventListener('DOMContentLoaded', () => {
  // Obter elementos da página
  const characterImage = document.getElementById('character-image');
  const characterName = document.getElementById('character-name');
  const characterSpecies = document.getElementById('character-species');
  const characterGender = document.getElementById('character-gender');
  const characterLocation = document.getElementById('character-location');
  const characterStatus = document.getElementById('character-status');
  const characterEpisodes = document.getElementById('character-episodes');
  const leftButton = document.getElementById('left-button');
  const rightButton = document.getElementById('right-button');

  //URL da API
  const url = "https://rickandmortyapi.com/api";
  //Busca pelo Id do personagem que foi inserido na Url pela função renderCharacter e o armazena
  const urlParams = new URLSearchParams(window.location.search);
  let characterId = urlParams.get('id');

  // Função para obter os detalhes de um personagem específico
  async function getCharacterDetails(characterId) {
    try {
      //Acessa o endpoint específico do personagem do ID capturado na URL, tendo assim acesso aos seus dados.
      const response = await fetch(`${url}/character/${characterId}`);
      const character = await response.json();

      //Insere os dados específicos do personagem nos elementos HTML.
      characterImage.src = character.image;
      characterName.textContent = character.name;
      characterSpecies.textContent = `Espécie: ${character.species}`;
      characterGender.textContent = `Gênero: ${character.gender}`;
      characterStatus.textContent = `Status: ${character.status}`;
      characterLocation.textContent = `Location: ${character.location.name}`;

      //Declaração de um Array que será preenchido com os episódios em que o personagem aparece
      const episodeTitles = [];

      //Estrutura for que acessa cada Url de episódio retornado no json do personagem e aplica o método fetch
      //Assim, tendo acesso aos dados específicos do episódio
      for (const episodeUrl of character.episode) {
        const episodeResponse = await fetch(episodeUrl);
        const episodeData = await episodeResponse.json();
        episodeTitles.push(episodeData.name);
      }

      characterEpisodes.innerText = episodeTitles.join('  |  ');
    } catch (error) {
      console.error('Erro ao buscar detalhes do personagem:', error);
    }
  }

  // Função para obter o ID máximo do personagem
  async function getMaxCharacterId() {
    const response = await fetch(`${url}/character`);
    const data = await response.json();

    let maxCharacterId = data.info.count;
    return maxCharacterId;
  }
  
  let currentCharacterId = parseInt(characterId);

  // Função para adicionar os listeners de click dos botões
  async function buttonListeners(maxCharacterId) {
    rightButton.addEventListener('click', async () => {
      currentCharacterId++;
      if (currentCharacterId <= maxCharacterId) {
        characterId = currentCharacterId.toString();
        await getCharacterDetails(characterId);
      }
    });

    leftButton.addEventListener('click', async () => {
      currentCharacterId--;
      if (currentCharacterId >= 1) {
        characterId = currentCharacterId.toString();
        await getCharacterDetails(characterId);
      }
    });
  }

  // Função de inicialização
  async function init() {
    try {
      const maxCharacterId = await getMaxCharacterId();
      await getCharacterDetails(characterId);
      buttonListeners(maxCharacterId);
    } catch (error) {
      console.error('Erro na inicialização da página de detalhes do personagem:', error);
    }
  }
  
  //Invocação da função de inicialização
  init();
});
