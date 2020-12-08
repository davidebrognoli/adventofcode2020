fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const rules = data.toString().split('\n').map(r => r.split(' '))
    puzzle1(rules)
    puzzle2(rules)
  }
})

const puzzle1 = (rules) => {
  const response = run(rules);
  console.log('Puzzle 1: ', response.acc)
}

const puzzle2 = (rules) => {
  let index = 0
  let nextRow = 0
  let acc = 0
  while (index < rules.length && nextRow < rules.length) {
    const row = rules[index];
    if (row[0] !== 'acc') {
      const newRules = fixRule(rules, index)
      const response = run(newRules);
      nextRow = response.nextRow
      acc = response.acc
    }
    index = index + 1
  }
  console.log('Puzzle 2: ', acc)
}

const run = (rules) => {
  const visitedRows = []
  let acc = 0
  let nextRow = 0
  while (!visitedRows.includes(nextRow) && nextRow < rules.length) {
    visitedRows.push(nextRow)
    const row = rules[nextRow]
    const sum = parseInt(row[1], 10)
    switch (row[0]) {
      case 'jmp':
        nextRow = nextRow + sum
        break
      case 'acc':
        nextRow = nextRow + 1
        acc = acc + sum
        break
      case 'nop':
        nextRow = nextRow + 1
        break
    }
  }
  return {acc, nextRow}
}

const fixRule = (rules, index) => {
  return rules.map((r, i) => {
    if (index === i) {
      const action = r[0] === 'jmp' ? 'nop' : 'jmp'
      return [action, r[1]]
    }
    return r
  })
}
