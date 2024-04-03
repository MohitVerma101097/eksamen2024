const pokemonDataContainer = document.querySelector('#pokemonDataContainer')
const url = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0'

const fetchUrl = async () => {
    try {
        const request = await fetch(url)
        const response = await request.json()
        responseData(response)
        return response
    } catch (error) {
        console.error(error, 'Noe gikk galt')
    }
}


const responseData = async (response) => {
   const pokemonData = response.results; 
   showPokemonData(pokemonData)
}


const showPokemonData = async (pokemonData) => {
pokemonData.forEach((pokemon, index) => {
    const pokemonCard = document.createElement("div");
    pokemonCard.innerHTML = `<h4>Name: ${pokemon.name} </h4>
                                <h4>test</h4>`
})
}

fetchUrl()