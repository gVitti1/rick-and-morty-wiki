document.addEventListener('DOMContentLoaded', async () => {

  // Elementos HTML
  const charactersContainer = document.getElementById('episode-characters-container');
  const episodeTitle = document.getElementById('episode-title');

  // URL da API
  const apiUrl = "https://rickandmortyapi.com/api";

  // ID do episódio da URL
  const urlParams = new URLSearchParams(window.location.search);
  const episodeId = urlParams.get('id');

  // Obtém e exibe os personagens do episódio
  async function getEpisodeCharacters(episodeId) {
    const response = await fetch(`${apiUrl}/episode/${episodeId}`);
    const episode = await response.json();
    episodeTitle.textContent = episode.name;

    // Array de links dos personagens
    const characterLinks = [];

    // Loop for: Cria links para cada personagem
    for (const characterUrl of episode.characters) {
      const characterResponse = await fetch(characterUrl);
      const characterData = await characterResponse.json();

      const characterLink = document.createElement('a');
      characterLink.classList.add('charLink');  
      characterLink.title = `Detalhes: ${characterData.name}`;
      characterLink.href = `../Pages/character.html?id=${characterData.id}`;
      characterLink.textContent = characterData.name;
      characterLink.target = '_blank';
      characterLinks.push(characterLink);
    }

    // Loop forEach: Adiciona os links ao container com separadores
    characterLinks.forEach((characterLink, index) => {
      charactersContainer.appendChild(characterLink);
      if (index < characterLinks.length - 1) {
        charactersContainer.appendChild(document.createTextNode(' | '));
      }
    });
  }

  // Inicialização
  async function init() {
    await getEpisodeCharacters(episodeId);
  }

  // Invoca a inicialização
  init();

});
