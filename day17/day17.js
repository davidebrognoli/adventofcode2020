fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const cube =  data.toString().split('\n').map(r => r.split(''))
    puzzle1(cube)
    puzzle2(cube)
  }
})

const puzzle1 = (cube) => {
  const size = cube.length
  const cubeSize = Array(size).fill(0).map((_, i) => i)
  let active = new Set()
  for (let row in cubeSize) {
    for (let column in cubeSize) {
      if (cube[row][column] === '#'){
        active.add(`0,${row},${column}`);
      }
    }
  }
  for (let game = 1; game <= 6; game++) {
    const nextActive = new Set()
    const end = game + size + 1
    const start = end * -1
    for (let level = start; level <= end; level++) {
      for (let row = start; row <= end; row++) {
        for (let column = start; column <= end; column++) {
          const adjacentsActive = getActiveAdjacent(level, row, column, active)
          if (adjacentsActive === 3 || (adjacentsActive === 2 && active.has(`${level},${row},${column}`))) {
            nextActive.add(`${level},${row},${column}`);
          }
        }
      }
    }
    active = nextActive
  }
  console.log('Puzzle 1', active.size)
}

const puzzle2 = (cube) => {
  const size = cube.length
  const cubeSize = Array(size).fill(0).map((_, i) => i)
  let active = new Set()
  for (let row in cubeSize) {
    for (let column in cubeSize) {
      if (cube[row][column] === '#'){
        active.add(`0,0,${row},${column}`);
      }
    }
  }
  for (let game = 1; game <= 6; game++) {
    const nextActive = new Set()
    const end = game + size + 1
    const start = end * -1
    for (let world = start; world <= end; world++) {
      for (let level = start; level <= end; level++) {
        for (let row = start; row <= end; row++) {
          for (let column = start; column <= end; column++) {
            const adjacentsActive = getWorldActiveAdjacent(world, level, row, column, active)
            if (adjacentsActive === 3 || (adjacentsActive === 2 && active.has(`${world},${level},${row},${column}`))) {
              nextActive.add(`${world},${level},${row},${column}`);
            }
          }
        }
      }
    }
    active = nextActive
  }
  console.log('Puzzle 2', active.size)
}

const getActiveAdjacent = (level, row, column, active) => {
  const variance = [-1, 0, 1];
  let activeCount = 0;
  for (const x of variance) {
    for (const y of variance) {
      for (const z of variance) {
        if (x === 0 && y === 0 && z === 0) {
          continue;
        }
        if (active.has(`${level + x},${row + y},${column + z}`)) {
          activeCount++;
        }
      }
    }
  }
  return activeCount
}

const getWorldActiveAdjacent = (world, level, row, column, active) => {
  const variance = [-1, 0, 1];
  let activeCount = 0;
  for (const w of variance) {
    for (const x of variance) {
      for (const y of variance) {
        for (const z of variance) {
          if (w === 0 && x === 0 && y === 0 && z === 0) {
            continue;
          }
          if (active.has(`${world + w},${level + x},${row + y},${column + z}`)) {
            activeCount++;
          }
        }
      }
    }
  }
  return activeCount
}
