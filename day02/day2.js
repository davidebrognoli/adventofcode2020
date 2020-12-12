fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const rows = data.toString().split("\n")
    const firstPuzzleValidPwds = rows.reduce((acc, r) => {
      return acc + validateRowCount(r)
    }, 0);
    console.log('Puzzle 1: ', firstPuzzleValidPwds)
    const secondPuzzleValidPwds = rows.reduce((acc, r) => {
      return acc + validateRowPosition(r)
    }, 0);
    console.log('Puzzle 2: ', secondPuzzleValidPwds)
  }
})

const validateRowCount = (row) => {
  const regex = /(\d+)-(\d+) (\w): (\w+)/
  const matches = row.match(regex)
  if (matches.length === 5) {
    const occurences = matches[4].split(matches[3]).length - 1
    if (occurences >= matches[1] && occurences <= matches[2]){
      return 1;
    }
  }
  return 0
}

const validateRowPosition = (row) => {
  const regex = /(\d+)-(\d+) (\w): (\w+)/
  const matches = row.match(regex)
  if (matches.length === 5) {
    const firstMatch = matches[4][matches[1] - 1];
    const secondMatch = matches[4][matches[2] - 1];
    if (firstMatch !== secondMatch && (firstMatch === matches[3] || secondMatch === matches[3])){
      return 1;
    }
  }
  return 0
}