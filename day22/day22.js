fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    puzzle1(data)
    puzzle2(data)
  }
})

const puzzle1 = (data) => {
  const players = extractPlayersCards(data)
  const [player1, player2] = players;
  while (player1.length > 0 && player2.length > 0) {
    const player1Card = player1.shift()
    const player2Card = player2.shift()
    if (player1Card > player2Card) {
      player1.push(player1Card, player2Card)
    } else {
      player2.push(player2Card, player1Card)
    }
  }
  const winningPlayer = player1.length > 0 ? player1 : player2;
  const score = calculateScore(winningPlayer)
  console.log('Puzzle 1', score)
}

const puzzle2 = (data) => {
  const players = extractPlayersCards(data)
  const [player1, player2] = players;
  const {score} = game(player1, player2)
  console.log('Puzzle 2', score)
}

const calculateScore = (winningPlayer) => {
  return winningPlayer.reverse().reduce((acc, n, idx) => {
    return acc + (n * (idx + 1)) 
  }, 0)
}

const game = (player1, player2) => {
  const player1Store = new Set()
  const player2Store = new Set()
  while (player1.length > 0 && player2.length > 0) {
    const player1game = player1.join(',')
    const player2game = player2.join(',')
    if (player1Store.has(player1game) || player2Store.has(player2game)) {
      return {score: calculateScore(player1), winner: 'player1'}
    }
    player1Store.add(player1game)
    player2Store.add(player2game)
    const player1Card = player1.shift()
    const player2Card = player2.shift()
    if (player1Card <= player1.length && player2Card <= player2.length) {
      const {winner} = game(player1.slice(0, player1Card), player2.slice(0, player2Card))
      if (winner === 'player1') {
        player1.push(player1Card, player2Card)
      } else {
        player2.push(player2Card, player1Card)
      }
    } else {
      if (player1Card > player2Card) {
        player1.push(player1Card, player2Card)
      } else {
        player2.push(player2Card, player1Card)
      }
    }
  }
  if (player1.length > 0) {
    return {score: calculateScore(player1), winner: 'player1'}
  }
  return {score: calculateScore(player2), winner: 'player2'}
}

const extractPlayersCards = (data) => {
  return data.toString().split('\n\n').map(m => {
    const cards = m.split('\n')
    cards.shift()
    return cards.map(n => parseInt(n))
  })
}