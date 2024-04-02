const input = document.querySelector('#input')
const button = document.querySelector('button')
const container = document.querySelector('div')

let array = [];
let local; 


const arrayValue =  () => {
const userInput = input.value
array.push(userInput)
console.log(array, 'inne i array funksjonen')
arrayToLocal(array);
}

const arrayToLocal = (array) => {
    let setLocal = localStorage.setItem('savedArray', JSON.stringify(array))
    localToDisplay()
}

const localToDisplay = () => {
    let getLocal = JSON.parse(localStorage.getItem('savedArray')) || [];
    console.log(getLocal, 'inne i local funksjonen')
   getLocal.forEach()
}


button.addEventListener('click', arrayValue)



/*
const pushAndSave = () => {

}
*/