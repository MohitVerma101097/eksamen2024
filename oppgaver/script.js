const input = document.querySelector('#input')
const button = document.querySelector('button')

let array = []


const grabValue =  () => {
const userInput = input.value
array.push(userInput)
console.log(array)
}


button.addEventListener('click', grabValue)

/*
const pushAndSave = () => {

}
*/