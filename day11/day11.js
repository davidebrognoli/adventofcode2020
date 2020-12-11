fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const seats = data.toString().split('\n').map(row => row.split(''));
    puzzle1(seats)
    puzzle2(seats)
  }
})

const puzzle1 = (seats) => {
  const lastSeats = playGame(seats, 4, getAdjacentSeats)
  console.log('Puzzle 1 ', countOccupiedSeats(lastSeats));
}

const puzzle2 = (seats) => {
  const lastSeats = playGame(seats, 5, getVisibleAdjacentSeats)
  console.log('Puzzle 2 ', countOccupiedSeats(lastSeats));
}

const playGame = (seats, occupiedLimit, getAdjacentFn) => {
  let changed = 1;
  let roundSeats = deepCopy(seats)
  let i = 0
  while(changed > 0) {
    i++
    const res = round(roundSeats, occupiedLimit, getAdjacentFn)
    changed = res.changed
    roundSeats = deepCopy(res.roundSeats)
  }
  return roundSeats
}

const getAdjacentSeats = (seats, row, column) => {
  const adjacent = [];
  for (let i = row - 1; i <= row + 1; i++){
    for (let j = column - 1; j <= column + 1; j++){
      if ((i !== row || j !== column) && seats[i] && seats[i][j]){
        adjacent.push(seats[i][j])
      }
    }
  }
  return adjacent;
}

const getVisibleAdjacentSeats = (seats, row, column) => {
  const tl = getTl(seats, row - 1, column - 1)
  const tc = getTc(seats, row - 1, column)
  const tr = getTr(seats, row - 1, column + 1)
  const l = getL(seats, row, column - 1)
  const r = getR(seats, row, column + 1)
  const bl = getBl(seats, row + 1, column - 1)
  const bc = getBc(seats, row + 1, column)
  const br = getBr(seats, row + 1, column + 1)
  return [tl, tc, tr, l, r, bl, bc, br];
}

const getTl = (seats, row, column) => {
  let cell = '.'
  while (cell === '.' && row >= 0 && column >= 0) {
    cell = seats[row][column]
    row--
    column--
  }
  return cell
}

const getTc = (seats, row, column) => {
  let cell = '.'
  while (cell === '.' &&  row >= 0) {
    cell = seats[row][column]
    row--
  }
  return cell
}

const getTr = (seats, row, column) => {
  let cell = '.'
  while (cell === '.' && row >= 0 && column < seats[0].length) {
    cell = seats[row][column]
    row--
    column++
  }
  return cell
}

const getL = (seats, row, column) => {
  let cell = '.'
  while (cell === '.' && column >= 0) {
    cell = seats[row][column]
    column--
  }
  return cell
}

const getR = (seats, row, column) => {
  let cell = '.'
  while (cell === '.' && column < seats[0].length) {
    cell = seats[row][column]
    column++
  }
  return cell
}

const getBl = (seats, row, column) => {
  let cell = '.'
  while (cell === '.' && row < seats.length && column >= 0) {
    cell = seats[row][column]
    row++
    column--
  }
  return cell
}

const getBc = (seats, row, column) => {
  let cell = '.'
  while (cell === '.' &&  row < seats.length) {
    cell = seats[row][column]
    row++
  }
  return cell
}

const getBr = (seats, row, column) => {
  let cell = '.'
  while (cell === '.' && row < seats.length && column < seats[0].length) {
    cell = seats[row][column]
    row++
    column++
  }
  return cell
}

const round = (seats, occupiedLimit, getAdjacentFn) => {
  let changed = 0;
  const roundSeats = seats.map((row, rowIndex) => {
    return row.map((cell, columnIndex) => {
      switch (cell) {
        case '.':
          return '.'
        case 'L':
          const leftAdjacent = getAdjacentFn(seats, rowIndex, columnIndex);
          if (leftAdjacent.includes('#')) {
            return 'L'
          }
          changed++
          return '#'
        case '#':
          const emptyAdjacent = getAdjacentFn(seats, rowIndex, columnIndex);
          if (emptyAdjacent.filter(a => a === '#').length < occupiedLimit){
            return '#'
          }
          changed++
          return 'L'
      }
    })
  })
  return {changed, roundSeats}
}

const deepCopy = (element) => {
  return JSON.parse(JSON.stringify(element))
}

const countOccupiedSeats = (seats) => {
  return seats.reduce((acc, r) => {
    const columnAdd = r.reduce((count, c) => {
      const add = c === '#' ? 1 : 0
      return count + add
    }, 0)
    return acc + columnAdd
  }, 0)
}

const printRound = (round) => {
  round.forEach(r => {
    const row = r.reduce((acc, c) => {
      return acc + c
    }, '')
    console.log(row)
  })
  console.log()
}