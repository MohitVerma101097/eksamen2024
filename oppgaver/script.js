const url = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0'

const fetchUrl = async () => {
    try {
        const request = await fetch(url)
        const response = await request.json()
        console.log(response)
        return response
    } catch (error) {
        console.error(error, 'Noe gikk galt')
    }
}

fetchUrl()

const responseData = async () => {
   const pokemonData = await fetchUrl();
   const filteredData = pokemonData.map(pokemon =>  {
    return {
        name: pokemon.name,
        url: pokemon.url
    }
   }) 
    
}