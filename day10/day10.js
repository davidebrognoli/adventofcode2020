fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const numbers = data.toString().split('\n').map(n => parseInt(n, 10)).sort((a, b) => a - b);
    puzzle1(numbers)
    puzzle2(numbers)
  }
})

const puzzle1 = (numbers) => {
  let index = 0
  let validDistance = true
  let distance1 = 1
  let distance3 = 1
  while(validDistance && (index + 1) < numbers.length) {
    const prev = numbers[index]
    const next = numbers[index + 1]
    switch(next - prev) {
      case 1:
        distance1++
        break
      case 3:
        distance3++
        break
      default:
        validDistance = false
    }
    index++
  }
  console.log('Puzzle 1: ', distance1 * distance3)
}

const puzzle2 = (numbers) => {
  const lastNumber = numbers[numbers.length - 1]
  const variants = numbers.reduce(
    (acc, number) => {
      const obj = {}
      const value = (acc[number - 1] || 0) + (acc[number - 2] || 0) + (acc[number - 3] || 0)
      obj[number] = value
      return {...acc, ...obj}
    },{ 0: 1 }
  )
  console.log('Puzzle 2', variants[lastNumber])
}