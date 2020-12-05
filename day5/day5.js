fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const tickets = data.toString().split('\n')
    puzzle1(tickets)
    puzzle2(tickets)
  }
})

const puzzle1 = (tickets) => {
  const value = tickets.reduce((acc, ticket) => {
    const id = getRowId(ticket)
    return id > acc ? id : acc
  }, 0)
  console.log('Puzzle 1: ', value)
}

const puzzle2 = (tickets) => {
  const takenTickets = tickets.map(ticket => {
    return getRowId(ticket)
  }).sort((a, b) => { return a - b })
  const myTicket = takenTickets.find((value, i) => {
    const nextTicket = takenTickets[i + 1]
    return nextTicket && nextTicket - value === 2
  })
  console.log('Puzzle 2: ', myTicket + 1)
}

const getRowId = (ticket) => {
  const rowCode = ticket.substr(0, 7)
  const columnCode = ticket.substr(7, 3)
  const row = rowCode.split('').reduce((acc, r, i) => {
    const exponent = 5 - i;
    const pow = Math.pow(2, exponent)
    if (r === 'F') {
      return acc - pow
    } 
    return acc + pow
  }, 63.5)
  const column = columnCode.split('').reduce((acc, c, i) => {
    const exponent = 1 - i;
    const pow = Math.pow(2, exponent)
    if (c === 'L') {
      return acc - pow
    } 
    return acc + pow
  }, 3.5)
  return row * 8 + column;
}