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
   console.log(pokemonData)
}


fetchUrl()