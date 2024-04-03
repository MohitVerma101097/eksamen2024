const pokemonDataContainer = document.querySelector('#pokemonDataContainer');
const localStorageContainer = document.querySelector('#localStorageContainer');

const url = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0';

const fetchUrl = async () => {
    try {
        const request = await fetch(url);
        const response = await request.json();
        const pokemonData = response.results;
        await fetchPokemonDetails(pokemonData);
    } catch (error) {
        console.error(error, 'Something went wrong');
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
        <button class="save-button">Save Pokemon</button>
        <button class="edit-button">Edit Pokemon</button>
    `;
    pokemonCard.style.border = '2px solid grey';
    pokemonCard.style.padding = '10px';
    pokemonCard.style.marginBottom = '20px';
    pokemonCard.style.width = '100px';

    pokemonDataContainer.appendChild(pokemonCard);

    const saveButton = pokemonCard.querySelector('.save-button');
    const editButton = pokemonCard.querySelector('.edit-button');
    
    saveButton.addEventListener('click', () => {savePokemon(pokemonInfo);});
    editButton.addEventListener('click', () => {editPokemon(pokemonInfo, pokemonCard);});
};

const savePokemon = (pokemonInfo) => {
    let savedPokemon = JSON.parse(localStorage.getItem('savedPokemon')) || [];
    savedPokemon.push(pokemonInfo);
    if (savedPokemon.length > 6) {
        alert('You can only save up to 5 Pokemon');
        return;
    }
    localStorage.setItem('savedPokemon', JSON.stringify(savedPokemon));

    alert(`"${pokemonInfo.name}" has been saved to your Pokémon collection.`);
    displayLocalSorage(savedPokemon);
}

const displayLocalSorage = async (savedPokemon) => {
    const localStorageContainer = document.querySelector('#localStorageContainer');
    localStorageContainer.innerHTML = ''; 

    savedPokemon.forEach((pokemon, index) => { 
        const pokemonLocalStorageCard = document.createElement('div');
        pokemonLocalStorageCard.innerHTML = `
            <h4>Name: ${pokemon.name}</h4>
            <p>Type: ${pokemon.type}</p>
            <button class="delete-button">Delete from LocalStorage</button>
        `;
        localStorageContainer.appendChild(pokemonLocalStorageCard);

        const deleteButton = pokemonLocalStorageCard.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
            deletePokemon(savedPokemon, index); 
        });
    });
}

const deletePokemon = (savedPokemon, index) => {
    let updatedPokemon = JSON.parse(localStorage.getItem('savedPokemon')) || [];
    updatedPokemon = updatedPokemon.filter(pokemon => pokemon.name !== savedPokemon[index].name);
    localStorage.setItem('savedPokemon', JSON.stringify(updatedPokemon));
    displayLocalSorage(updatedPokemon);
    alert(`"${savedPokemon[index].name}" has been deleted from your Pokémon collection.`);
}

const editPokemon = (pokemonInfo, pokemonCard) => {
    const newName = prompt('Enter the new name for the Pokémon:');
    const newType = prompt('Enter the new type for the Pokémon:');
    if (newName && newType) {
        pokemonInfo.name = newName;
        pokemonInfo.type = newType;
        let savedPokemon = JSON.parse(localStorage.getItem('savedPokemon')) || [];
        savedPokemon.forEach((pokemon) => {
            if (pokemon.name === pokemonInfo.name && pokemon.type === pokemonInfo.type) {
                pokemon.name = newName;
                pokemon.type = newType;
            }
        });
        localStorage.setItem('savedPokemon', JSON.stringify(savedPokemon));
        displayLocalSorage(savedPokemon);
        alert(`"${newName}" has been updated.`);
        updatePokemonCard(pokemonCard, pokemonInfo); // Update the DOM with the edited Pokémon
    } else {
        alert('Invalid input. Please enter both name and type.');
    }
}

const updatePokemonCard = (pokemonCard, pokemonInfo) => {
    pokemonCard.querySelector('h4').textContent = `Name: ${pokemonInfo.name}`;
    pokemonCard.querySelector('img').setAttribute('src', pokemonInfo.image);
    pokemonCard.querySelector('img').setAttribute('alt', pokemonInfo.name);
    pokemonCard.querySelector('p').textContent = `Type: ${pokemonInfo.type}`;
}

fetchUrl();
