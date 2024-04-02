const input = document.querySelector('#input')
const button = document.querySelector('button')

let array = [];
let local; 


const arrayValue =  () => {
const userInput = input.value
array.push(userInput)
console.log(array, 'inne i array funksjonen')
}

const arrayToLocal = (array) => {
    let setLocal = localStorage.setItem('savedArray', JSON.stringify(array))
    localToDisplay(setLocal)
}

const localToDisplay = (setLocal) => {
    let getLocal = JSON.parse(localStorage.getItem('savedArray')) || [];
    console.log(getLocal, 'inne i local funksjonen')

}


button.addEventListener('click', arrayValue)



/*
const pushAndSave = () => {

}
*/