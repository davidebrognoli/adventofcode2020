fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const numbers = data.toString().split(',').map(n => parseInt(n, 10))
    puzzle1(numbers)
    puzzle2(numbers)
  }
})

const puzzle1 = (numbers) => {
  const last = playNRound(numbers, 2020)
  console.log('Puzzle 1', last)
  
}
const puzzle2 = (numbers) => {
  const last = playNRound(numbers, 30000000)
  console.log('Puzzle 2', last)
}

const playNRound = (numbers, play) => {
  let indexes = new Map(numbers.map((value, index) => [value, index + 1]));
  let bucket = NaN;
  let target = numbers[numbers.length - 1];
  for (let index = numbers.length; index < play; index++) {
      target = (indexes.has(target) ? index - indexes.get(target) : 0);
      indexes.set(bucket, index);
      bucket = target;
  }
  return bucket
}