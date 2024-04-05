const pokemonDataContainer = document.querySelector('#pokemonDataContainer');
const localStorageContainer = document.querySelector('#localStorageContainer');
const pokemonTypeDropdown = document.querySelector('#pokemonType');
const create = document.querySelector('#create');

const url = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0';

let allPokemonData = [];

const fetchUrl = async () => {
    try {
        const request = await fetch(url);
        const response = await request.json();
        allPokemonData = response.results;
        await fetchPokemonDetails(allPokemonData);
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
                types: types.map(type => type.type.name)
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
        <p>Type: ${pokemonInfo.types[0]}</p>
        <button class="save-button">Save Pokemon</button>
        <button class="edit-button">Edit Pokemon</button>
        <button class="delete-button">Delete Pokemon</button>
    `;
    pokemonCard.classList.add('pokemon-card'); 
    pokemonCard.style.border = '2px solid grey';
    pokemonCard.style.padding = '10px';
    pokemonCard.style.marginBottom = '20px';
    pokemonCard.style.width = '100px';
    pokemonCard.style.backgroundColor = getTypeColor(pokemonInfo.types[0]); 
    pokemonDataContainer.appendChild(pokemonCard);

    const saveButton = pokemonCard.querySelector('.save-button');
    const editButton = pokemonCard.querySelector('.edit-button');
    const deleteButton = pokemonCard.querySelector('.delete-button');
    
    saveButton.addEventListener('click', () => {savePokemon(pokemonInfo);});
    editButton.addEventListener('click', () => {editPokemon(pokemonInfo, pokemonCard);});
    deleteButton.addEventListener('click', () => {deletePokemonFromDisplay(pokemonInfo, pokemonCard);});
};

const deletePokemonFromDisplay = (pokemonInfo, pokemonCard) => {
    pokemonCard.remove(); 
};

const getTypeColor = (type) => {
    const typeColors = {
        normal: 'Brown',
        fire: 'Red',
        water: 'Blue',
        electric: 'Yellow',
        grass: 'Green',
        ice: 'Light Blue',
        fighting: 'Reddish Brown',
        poison: 'Purple',
        ground: 'Brown',
        flying: 'Light Blue',
        psychic: 'Pink',
        bug: 'Green',
        rock: 'Gray',
        ghost: 'Purple',
        dragon: 'Dark Red',
        dark: 'Black',
        steel: 'Gray',
        fairy: 'Pink'
    };
    return typeColors[type]; 
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
            <p>Type: ${pokemon.types.join(', ')}</p>
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
        pokemonInfo.types = [newType]; 
        let savedPokemon = JSON.parse(localStorage.getItem('savedPokemon')) || [];
        savedPokemon.forEach((pokemon) => {
            if (pokemon.name === pokemonInfo.name) {
                pokemon.name = newName;
                pokemon.types = [newType];
            }
        });
        localStorage.setItem('savedPokemon', JSON.stringify(savedPokemon));
        displayLocalSorage(savedPokemon);
        alert(`"${newName}" has been updated.`);
        updatePokemonCard(pokemonCard, pokemonInfo); 
    } else {
        alert('Invalid input. Please enter both name and type.');
    }
}

const updatePokemonCard = (pokemonCard, pokemonInfo) => {
    pokemonCard.querySelector('h4').textContent = `Name: ${pokemonInfo.name}`;
    pokemonCard.querySelector('img').setAttribute('src', pokemonInfo.image);
    pokemonCard.querySelector('img').setAttribute('alt', pokemonInfo.name);
    pokemonCard.querySelector('p').textContent = `Type: ${pokemonInfo.types.join(', ')}`;
}

pokemonTypeDropdown.addEventListener('change', (event) => {
    const selectedType = event.target.value.toLowerCase();
    const pokemonCards = document.querySelectorAll('.pokemon-card');

    pokemonCards.forEach(card => {
        const types = card.querySelector('p').textContent.toLowerCase();
        if (selectedType === 'all' || types.includes(selectedType)) {
            card.style.display = 'block'; 
        } else {
            card.style.display = 'none';
        }
    });
});

const createPokemon = () => {
    const newName = prompt('Enter the name for the new Pokémon:');
    const newType = prompt('Enter the type for the new Pokémon:');
    if (newName && newType) {
        const newPokemon = {
            name: newName,
            types: [newType.toLowerCase()] 
        };        
        allPokemonData.push(newPokemon); 
        displayPokemon(newPokemon); 
    } else {
        alert('Invalid input. Please enter both name and type.');
    }
}

create.addEventListener('click', createPokemon);

fetchUrl();
