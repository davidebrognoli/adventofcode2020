fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const rows = data.toString().split("\n")
    puzzle1(rows)
    puzzle2(rows)
  }
})

const puzzle1 = (rows) => {
  console.log('Puzzle 1: ', countTrees(rows, 3, 1))
}

const puzzle2 = (rows) => {
  const test = [
    {right: 1, down: 1},
    {right: 3, down: 1},
    {right: 5, down: 1},
    {right: 7, down: 1},
    {right: 1, down: 2}
  ]
  const result = test.reduce((acc, t) =>{
    const trees = countTrees(rows, t.right, t.down)
    return acc * trees
  }, 1);
  console.log('Puzzle 2: ', result)
}

const nextPosition = (position, right, down) => {
  const x = position[0] + right;
  const y = position[1] + down;
  return [x, y];
}

const countTrees = (rows, right, down) => {
  const module = rows[0].length;
  let position = [0, 0];
  return Array(rows.length - 1).fill(1).reduce((acc) => {
    position = nextPosition(position, right, down)
    const row = rows[position[1]]
    const index = position[0] % module
    return acc + (row && row[index] === '#' ? 1 : 0);
  }, 0)
}

