fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const numbers = data.toString().split('\n').map(n => parseInt(n, 10))
    const number = puzzle1(numbers)
    puzzle2(numbers, number)
  }
})

const puzzle1 = (numbers) => {
  let index = 25
  let found = true
  let number = 0
  while (index < numbers.length && found === true) {
    number = numbers[index]
    const start = index - 25
    const end = index - 1
    const beforeNumbers = numbers.slice(index - 25, index)
    found = searchSum(beforeNumbers, number)
    index++
  }
  console.log('Puzzle 1: ', number)
  return number;
}

const puzzle2 = (numbers, number) => {
  let index = 0
  let found = false
  let set = []
  while (index < numbers.length && !found) {
    const response = getSet(index, numbers, number)
    if (response.found) {
      found = response.found
      set = response.set
    }
    index++
  }
  const min = Math.min(...set)
  const max = Math.max(...set)
  console.log('Puzzle 2: ', min + max)
}

const searchSum = (numbers, sum) => {
  return numbers.some(n => {
    const diff = sum - n
    return diff !== n && numbers.includes(diff)
  })
}

const getSet = (index, numbers, number) => {
  let sum = numbers[index]
  let set = [sum]
  while (sum < number) {
    index++
    nextNumber = numbers[index]
    set.push(nextNumber)
    sum = sum + nextNumber
  }
  if (sum === number && set.length > 1) {
    return {found: true, set}
  }
  return {found: false, set: []}
}
