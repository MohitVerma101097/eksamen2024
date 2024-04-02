const input = document.querySelector('#input')
const button = document.querySelector('button')

let array = [];
let local; 


const ArrayValue =  () => {
const userInput = input.value
array.push(userInput)
console.log(array)
}

const arrayToLocal = () => {
    let local = localStorage.setItem('savedArray', JSON.stringify(array))
    localToDisplay(local)
}

const localToDisplay = (local) => {
    
}


button.addEventListener('click', grabValue)



/*
const pushAndSave = () => {

}
*/