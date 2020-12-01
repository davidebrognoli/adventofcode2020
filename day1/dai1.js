fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const dataArray = data.toString().split("\n").map(i => parseInt(i, 10))
    puzzle1(dataArray)
    puzzle2(dataArray)
  }
})


const puzzle1 = (data) => {
  for (let i = 0; i < data.length; i++){
    for (let j = i + 1; j < data.length; j++) {
      const total = data[i] + data[j]
      if (total === 2020) {
        console.log('Puzzle 1: ', data[i] * data[j])
      }
    }
  }
}

const puzzle2 = (data) => {
  for (let i = 0; i < data.length; i++){
    for (let j = i + 1; j < data.length; j++) {
      for (let k = j + 1; k < data.length; k++) {
        const total = data[i] + data[j] + data[k]
        if (total === 2020) {
          console.log('Puzzle 2: ', data[i] * data[j] * data[k])
        }
      }
    }
  }
}