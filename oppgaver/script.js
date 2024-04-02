const url = 'https://pokeapi.co/api/v2/'

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