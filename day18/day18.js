fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const rows =  data.toString().split('\n')
    puzzle1(rows)
    puzzle2(rows)
  }
})

const puzzle1 = (rows) => {
  const sum = rows.reduce((acc, r) => {
    const rowValue = calculateRow(r, executeRow)
    return acc + rowValue
  }, 0)
  console.log('Puzzle 1', sum)
}

const puzzle2 = (rows) => {
  const sum = rows.reduce((acc, r) => {
    const rowValue = calculateRow(r, executeRow2)
    return acc + rowValue
  }, 0)
  console.log('Puzzle 2', sum)
}

const calculateRow = (row, fn) => {
  let parsedRow = row.split('').filter(c => c !== ' ');
  const flatArray = removeBracket(parsedRow);
  return fn(flatArray)
}

const removeBracket = (chars) => {
  let openBrackets = 0;
  let flatArray = []
  let temp = []
  chars.forEach(c => {
    if (typeof c === 'object') {
      const res = removeBracket(c)
      deep = deep || res.deep
      flatArray.push(res.flatArray)
    } else {
      switch (c){
        case '(':
          openBrackets++;
          if (openBrackets > 1) {
            temp.push(c)
          } else {
            temp = []
          }
          break;
        case ')':
          openBrackets--
          if (openBrackets === 0) {
            flatArray.push(removeBracket(temp))
          } else {
            temp.push(c)
          }
          break;
        default: 
          if (openBrackets === 0) {
            flatArray.push(c)
          } else {
            temp.push(c)
          }
      }
    }
  })
  return flatArray
}

const executeRow = (row) => {
  const operation = row.reduce((acc, v) => {
    if (typeof v === 'object') {
      const sum = executeRow(v)
      acc.value = executeOperation(acc.value, sum, acc.operation)
    } else {
      switch(v) {
        case '+':
          acc.operation = '+'
          break
        case '*':
          acc.operation = '*'
          break
        default:
          acc.value = executeOperation(acc.value, v, acc.operation)
      }
    }
    return acc;
  }, {value: 0, operation: '+'})
  return operation.value
}

const executeRow2 = (row) => {
  let temp = 0
  const multiply = []
  row.forEach(el => {
    if (typeof el === 'object') {
      temp = temp + (executeRow2(el))
    } else {
      switch(el) {
        case '+':
          break
        case '*':
          multiply.push(temp)
          temp = 0
          break
        default:
          temp = temp + parseInt(el, 10)
      }
    }
  })
  multiply.push(temp)
  return multiply.reduce((acc, m) => {
    return acc * m
  }, 1)
}



const executeOperation = (a, b, operation) => {
  const first = parseInt(a, 10)
  const second = parseInt(b, 10)
  if (operation === '+') {
    return first + second
  } else {
    return first * second
  }
}