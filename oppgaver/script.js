const pokemonDataContainer = document.querySelector('#pokemonDataContainer');
const url = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0';

const fetchUrl = async () => {
    try {
        const request = await fetch(url);
        const response = await request.json();
        const pokemonData = response.results;
        await fetchPokemonDetails(pokemonData);
        console.log(responseData); // Logging the fetched data
    } catch (error) {
        console.error(error, 'Noe gikk galt');
    }
};

const fetchPokemonDetails = async (pokemonData) => {
    try {
        for (let i = 0; i < pokemonData.length; i++) {
            const pokemon = pokemonData[i];
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonDetails = await pokemonResponse.json();
            const { name, sprites, types } = pokemonDetails;
            const pokemonInfo = {
                name: name,
                image: sprites.front_default,
                type: types[0].type.name
            };
            displayPokemon(pokemonInfo);
        }
    } catch (error) {
        console.error('Error fetching Pokemon details:', error);
    }
};

const displayPokemon = (pokemonInfo) => {
    const pokemonCard = document.createElement('div');
    pokemonCard.innerHTML = `
        <h4>Name: ${pokemonInfo.name}</h4>
        <img src="${pokemonInfo.image}" alt="${pokemonInfo.name}">
        <p>Type: ${pokemonInfo.type}</p>
    `;
    pokemonDataContainer.appendChild(pokemonCard);
};

fetchUrl();
