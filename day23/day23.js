const puzzle1 = data => {
  const games = 100
  const input = data.split('').map(n => parseInt(n, 10))
  const cups = input.reduce((acc, i, index) => {
    const nextIdx = (index + 1) % input.length
    const next = input[nextIdx]
    acc.set(i, next)
    return acc
  }, new Map())
  let current = input[0]
  
  for(let game = 1; game <= games; game++){
    current = playGame(current, cups)
  }
  let item = cups.keys().next().value
  const cupsOrdered = []
  for (let i = 0; i < cups.size; i++) {
    cupsOrdered.push(item)
    item = cups.get(item)
  }
  const position1 = cupsOrdered.indexOf(1)
  const res = [...cupsOrdered.slice(position1 + 1), ...cupsOrdered.slice(0, position1)].join('')
  console.log('Puzzle 1', res)
}


const puzzle2 = data => {
  const games = 10000000
  const baseInput = data.split('').map(n => parseInt(n, 10))
  const arrayLength = 1000000 - baseInput.length
  const sequence = Array(arrayLength).fill(0).map((c,i) => i + 10)
  const input = [...baseInput, ...sequence]
  const cups = input.reduce((acc, i, index) => {
    const nextIdx = (index + 1) % input.length
    const next = input[nextIdx]
    acc.set(i, next)
    return acc
  }, new Map())
  let current = input[0]
  
  for(let game = 1; game <= games; game++){
    current = playGame(current, cups)
  }
  const next1 = cups.get(1)
  const next2 = cups.get(next1)
  console.log('Puzzle 2', next1 * next2)
}

const playGame = (current, cups) => {
  const removeA = cups.get(current)
  const removeB = cups.get(removeA)
  const removeC = cups.get(removeB)
  const next = cups.get(removeC)
  cups.set(current, next)

  const removedItems = [removeA, removeB, removeC]
  do{
    current = current === 1 ? cups.size : current - 1
  } while(removedItems.includes(current))
  const oldNext = cups.get(current)
  cups.set(current, removeA)
  cups.set(removeC, oldNext)
  return next
}

const data = '614752839'
puzzle1(data)
puzzle2(data)