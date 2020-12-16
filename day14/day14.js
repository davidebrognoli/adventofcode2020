fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const rows = data.toString().split('\n')
    puzzle1(rows)
    puzzle2(rows)
  }
})

const puzzle1 = (rows) => {
  let mask = null
  const memory = []
  rows.forEach(row => {
    const parsedRow = parseRow(row)
    if (parsedRow.type === 'mask') {
      mask = parsedRow.value
    } else {
      const value = calculateRowValue(parsedRow.value, mask)
      memory[parsedRow.address] = value
    }
  })
  const sum = memory.filter(m => m).reduce((acc, m) => {
    return acc + m
  }, 0)
  console.log('Puzzle 1', sum)
}

const puzzle2 = (rows) => {
  const masks = []
  rows.forEach(row => {
    const parsedRow = parseRow(row)
    if (parsedRow.type === 'mask') {
      const mask = parsedRow.value
      masks.push({mask, rows: []})
    } else {
      masks[masks.length - 1].rows.push(parsedRow);
    }
  })
  const memory = {};
  masks.forEach(m => {
    const { mask, rows } = m
    rows.forEach(r => {
      values = calculateRowValueVariant(r.address, mask)
      values.forEach(v => {
        memory[v] = parseInt(r.value, 10)
      })
    })
  })
  const sum = Object.keys(memory).reduce((acc, m, index) => {
    return acc + memory[m]
  }, 0)
  console.log('Puzzle 2', sum)
}

const parseRow = (row) => {
  const rowArray = row.split(' = ')
  const value = rowArray[1]
  if (rowArray[0] === 'mask') {
    return {type: 'mask', value }
  }
  const memRegex = new RegExp(/mem\[([0-9]+)]/)
  const memoryMatch = rowArray[0].match(memRegex)
  return {type: 'mem', value, address: memoryMatch[1]}
}

const calculateRowValue = (value, mask) => {
  const binValue = dec2bin(value)
  const paddedValue = binValue.padStart(36, '0')
  const maskedValue = mask.split('').reduce((acc, m, i) => {
    if (m !== 'X'){
      const chars = acc.split('');
      chars[i] = m;
      return chars.join('')
    }
    return acc
  }, paddedValue)
  return parseInt(maskedValue, 2)
}

const calculateRowValueVariant = (value, mask) => {
  const binValue = dec2bin(value)
  const paddedValue = binValue.padStart(36, '0')
  const maskedValue = mask.split('').reduce((acc, m, i) => {
    if (m !== '0'){
      const chars = acc.split('');
      chars[i] = m;
      return chars.join('')
    }
    return acc
  }, paddedValue)
  return generateVariant(maskedValue).map(v => parseInt(v, 2))
}

const dec2bin = (dec) => {
  return (dec >>> 0).toString(2);
}

const generateVariant = (maskedValue) => {
  const chars = maskedValue.split('');
  const count = chars.filter(x => x === 'X').length
  const variants = []
  for (let i = 0; i < Math.pow(2, count); i++) {
    variants.push(i.toString(2).padStart(count, "0"));
  }

  return variants.map((v, j) => {
    let index = 0;
    let address = '';
    chars.forEach(char => {
        if (char === 'X') {
            address += variants[j][index];
            index++;
        } else {
            address += char;
        }
    })
    return address;
  })
}
