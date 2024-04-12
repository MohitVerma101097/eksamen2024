// Getting references to HTML elements
const pokemonDataContainer = document.querySelector('#pokemonDataContainer');
const localStorageContainer = document.querySelector('#localStorageContainer');
const pokemonTypeDropdown = document.querySelector('#pokemonType');
const createButton = document.querySelector('#create');
const playButton = document.querySelector('#playBtn');

// URL for fetching Pokémon data
const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0';
// Default image for Pokémon
const defaultImage = 'https://cdn.pixabay.com/photo/2016/07/23/13/18/pokemon-1536849_1280.png';

// Array to store Pokémon data
let allPokemonData = [];

// Function to fetch Pokémon data from the API
const fetchApiData = async () => {
    try {
        // Fetching data from the API
        const request = await fetch(apiUrl);
        const response = await request.json();
        allPokemonData = response.results;
        // Fetching details for each Pokémon
        await fetchPokemonDetails(allPokemonData);
    } catch (error) {
        console.error(error, 'Oops! Something went wrong while fetching Pokémon data.');
    }
};

// Function to fetch details for each Pokémon
const fetchPokemonDetails = async (pokemonData) => {
    try {
        // Looping through each Pokémon
        for (let i = 0; i < pokemonData.length; i++) {
            const pokemon = pokemonData[i];
            // Fetching details for the current Pokémon
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonDetails = await pokemonResponse.json();
            // Extracting necessary details
            const { name, sprites, types, stats } = pokemonDetails;
            const pokemonInfo = {
                name: name,
                image: sprites.front_default,
                types: types.map(type => type.type.name),
                stats: stats.map(stat => ({ name: stat.stat.name, value: stat.base_stat }))
            };
            // Displaying the Pokémon card
            displayPokemonCard(pokemonInfo);
        }
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
    }
};


// Function to display a Pokémon card
// Function to display a Pokémon card
const displayPokemonCard = (pokemonInfo) => {
    // Extracting the HP stat value
    const hpStat = pokemonInfo.stats.find(stat => stat.name === 'hp');

    // Creating HTML elements for the Pokémon card
    const pokemonCard = document.createElement('div');
    pokemonCard.innerHTML = `
        <h4>Name: ${pokemonInfo.name}</h4>
        <img src="${pokemonInfo.image}" alt="${pokemonInfo.name}" style="max-width: 100px; max-height: 100px;">
        <p>Type: ${pokemonInfo.types[0]}</p>
        <p>HP: ${hpStat.value}</p>
        <button class="save-button">Save Pokémon</button>
        <button class="edit-button">Edit Pokémon</button>
        <button class="delete-button">Delete Pokémon</button>
    `;
    // Styling the Pokémon card
    pokemonCard.classList.add('pokemon-card'); 
    pokemonCard.style.border = '2px solid grey';
    pokemonCard.style.padding = '10px';
    pokemonCard.style.marginBottom = '20px';
    pokemonCard.style.width = '150px'; // Increased width to accommodate stats
    pokemonCard.style.backgroundColor = getPokemonTypeColor(pokemonInfo.types[0]); 
    // Adding the Pokémon card to the container
    pokemonDataContainer.appendChild(pokemonCard);

    // Adding event listeners to buttons
    const saveButton = pokemonCard.querySelector('.save-button');
    const editButton = pokemonCard.querySelector('.edit-button');
    const deleteButton = pokemonCard.querySelector('.delete-button');
    
    saveButton.addEventListener('click', () => {savePokemonData(pokemonInfo);});
    editButton.addEventListener('click', () => {editPokemonData(pokemonInfo, pokemonCard);});
    deleteButton.addEventListener('click', () => {deletePokemonCard(pokemonInfo, pokemonCard);});

    // Add event listener to the image for decrementing stats
    const pokemonImage = pokemonCard.querySelector('img');
    pokemonImage.addEventListener('click', () => { decrementStats(pokemonInfo, pokemonCard); });
};



// Function to delete a Pokémon card from display
const deletePokemonCard = (pokemonInfo, pokemonCard) => {
    pokemonCard.remove();
    allPokemonData = allPokemonData.filter(pokemon => pokemon.name !== pokemonInfo.name);
};

// Function to get color based on Pokémon type
const getPokemonTypeColor = (type) => {
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

// Function to save Pokémon data to local storage
const savePokemonData = (pokemonInfo) => {
    let savedPokemonData = JSON.parse(localStorage.getItem('savedPokemonData')) || [];
    savedPokemonData.push(pokemonInfo);
    if (savedPokemonData.length > 6) {
        alert('You can only save up to 5 Pokémon.');
        return;
    }
    localStorage.setItem('savedPokemonData', JSON.stringify(savedPokemonData));

    alert(`"${pokemonInfo.name}" has been saved to your Pokémon collection.`);
    displaySavedPokemonData(savedPokemonData);
};

// Function to display saved Pokémon data from local storage
const displaySavedPokemonData = async (savedPokemonData) => {
    const localStorageContainer = document.querySelector('#localStorageContainer');
    localStorageContainer.innerHTML = ''; 

    savedPokemonData.forEach((pokemon, index) => { 
        const pokemonLocalStorageCard = document.createElement('div');
        pokemonLocalStorageCard.innerHTML = `
            <h4>Name: ${pokemon.name}</h4>
            <p>Type: ${pokemon.types.join(', ')}</p>
            <button class="delete-button">Delete from Local Storage</button>
        `;
        localStorageContainer.appendChild(pokemonLocalStorageCard);

        const deleteButton = pokemonLocalStorageCard.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
            deleteSavedPokemonData(savedPokemonData, index); 
        });
    });
};

// Function to delete saved Pokémon data from local storage
const deleteSavedPokemonData = (savedPokemonData, index) => {
    let updatedPokemonData = JSON.parse(localStorage.getItem('savedPokemonData')) || [];
    updatedPokemonData = updatedPokemonData.filter(pokemon => pokemon.name !== savedPokemonData[index].name);
    localStorage.setItem('savedPokemonData', JSON.stringify(updatedPokemonData));
    displaySavedPokemonData(updatedPokemonData);
    alert(`"${savedPokemonData[index].name}" has been deleted from your Pokémon collection.`);
};

// Function to edit Pokémon data
const editPokemonData = (pokemonInfo, pokemonCard) => {
    const newName = prompt('Enter the new name for the Pokémon:');
    const newType = prompt('Enter the new type for the Pokémon:');
    if (newName && newType) {
        pokemonInfo.name = newName;
        pokemonInfo.types = [newType]; 
        let savedPokemonData = JSON.parse(localStorage.getItem('savedPokemonData')) || [];
        savedPokemonData.forEach((pokemon) => {
            if (pokemon.name === pokemonInfo.name) {
                pokemon.name = newName;
                pokemon.types = [newType];
            }
        });
        localStorage.setItem('savedPokemonData', JSON.stringify(savedPokemonData));
        displaySavedPokemonData(savedPokemonData);
        alert(`"${newName}" has been updated.`);
        updatePokemonCardData(pokemonCard, pokemonInfo); 
    } else {
        alert('Invalid input. Please enter both name and type.');
    }
};

// Function to update Pokémon card after editing
const updatePokemonCardData = (pokemonCard, pokemonInfo) => {
    pokemonCard.querySelector('h4').textContent = `Name: ${pokemonInfo.name}`;
    pokemonCard.querySelector('img').setAttribute('src', pokemonInfo.image);
    pokemonCard.querySelector('img').setAttribute('alt', pokemonInfo.name);
    pokemonCard.querySelector('p').textContent = `Type: ${pokemonInfo.types.join(', ')}`;
};

// Event listener for Pokémon type dropdown
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

// Function to create a new Pokémon
const createNewPokemon = () => {
    const newName = prompt('Enter the name for the new Pokémon:');
    const newType = prompt('Enter the type for the new Pokémon:');
    if (newName && newType) {
        const newPokemon = {
            name: newName,
            image: defaultImage,
            types: [newType.toLowerCase()] 
        };        
        allPokemonData.push(newPokemon); 
        displayPokemonCard(newPokemon); 
    } else {
        alert('Invalid input. Please enter both name and type.');
    }
};

// Event listener for creating a new Pokémon
createButton.addEventListener('click', createNewPokemon);

// Fetching Pokémon data when the page loads
fetchApiData();
