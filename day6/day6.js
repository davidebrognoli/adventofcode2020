fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const answers = data.toString().split('\n\n')
    puzzle1(answers)
    puzzle2(answers)
  }
})

const puzzle1 = (answers) => {
  const total = answers.reduce((acc, a) => {
    return acc + getYesResponse(a)
  }, 0)
  console.log('Puzzle 1: ', total)
}

const puzzle2 = (answers) => {
  const total = answers.reduce((acc, a) => {
    return acc + getSameYesResponse(a)
  }, 0)
  console.log('Puzzle 2: ', total)
}

const getYesResponse = (group) => {
  const response = group.split('').filter((c, i) => group.indexOf(c) === i && c !== '\n')
  return response.length
}

const getSameYesResponse = (group) => {
  const rows = group.split('\n').map(r => r.split(''))
  const firstRow  = rows[0];
  if (rows.length === 1) {
    return firstRow.length
  } else {
    return firstRow.reduce((acc, c) => {
      if (rows.every(r => r.indexOf(c) > -1)) {
        return acc + 1
      }
      return acc
    }, 0)
  }
}

