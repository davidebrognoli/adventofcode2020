fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const rows = data.toString().split('\n')
    const startTime = rows[0]
    const buses = rows[1]
    puzzle1(startTime, buses)
    puzzle2(buses)
  }
})

const puzzle1 = (startTime, buses) => {
  const availableBuses = buses.split(',').filter(b => b !== 'x')
  const busesNext = availableBuses.map(b => {
    return getNextBusTime(b, startTime)
  })
  busesNext.sort(sortResults)
  const firstBus = busesNext[0]
  console.log('Puzzle 1 ', firstBus.diff * firstBus.busNumber)
}

const puzzle2 = (buses) => {
  const availableBuses = buses.split(',').reduce((acc, b, i) => {
    if (b !== 'x') {
      acc.push({busNumber: parseInt(b, 10), offset: i})
    }
    return acc
  }, [])
  const N = availableBuses.reduce((acc, b) => {
    return acc * b.busNumber
  }, 1)
  const sum = availableBuses.reduce((acc, bus) => {
    const { busNumber, offset } = bus
    const a = absMod(busNumber - offset, busNumber);
    const nU = N / busNumber;
    const inverse = getInverse(nU, busNumber);
    return acc + BigInt(BigInt(a) * BigInt(nU) * BigInt(inverse));
  }, 0n);
  const time = sum % BigInt(N)
  console.log('Puzzle 2 ', time)
}

const getNextBusTime = (bus, time) => {
  let nextTime = 0
  const busNumber = parseInt(bus, 10)
  while (nextTime < time) {
    nextTime = nextTime + busNumber
  }
  const diff = nextTime - time
  return {busNumber, nextTime, diff}
}

const sortResults = (a, b) => {
  if (a.diff < b.diff) {
    return -1
  } 
  if (a.diff > b.diff) {
    return 1
  }
  return 0
}

const absMod = (a, b) => ((a % b) + b) % b;

const getInverse = (a, mod) => {
  const b = a % mod;
  for (let i = 1; i < mod; i++) {
    if ((b * i) % mod === 1) {
      return i;
    }
  }
  return 1;
};