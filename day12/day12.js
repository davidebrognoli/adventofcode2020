fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const commands = data.toString().split('\n')
    puzzle1(commands)
    puzzle2(commands)
  }
})

const parseCommand = (row) => {
  const commandRegexp = new RegExp(/([N|S|E|W|L|R|F])([0-9]+)/)
  const matches = row.match(commandRegexp)
  if (matches.length > 2) {
    return {direction: matches[1], value: parseInt(matches[2], 10)}
  } 
  return null
}

const puzzle1 = (commands) => {
  const directions = ['n', 'e', 's', 'o'] 
  const finalPosition = commands.reduce((acc, c) => {
    const command = parseCommand(c)
    if (command) {
      switch (command.direction) {
        case 'N':
          acc.north = acc.north + command.value
          break
        case 'S':
          acc.north = acc.north - command.value
          break
        case 'E':
          acc.east = acc.east + command.value
          break
        case 'W':
          acc.east = acc.east - command.value
          break
        case 'L':
          acc.direction = rotate(command.value, acc.direction, directions, true)
          break
        case 'R':
          acc.direction = rotate(command.value, acc.direction, directions, false)
          break
        case 'F':
          switch (acc.direction){
            case 'e':
              acc.east = acc.east + command.value
              break
            case 'n':
              acc.north = acc.north + command.value
              break
            case 'o':
              acc.east = acc.east - command.value
              break
            case 's':
              acc.north = acc.north - command.value
              break
          }
          break
      }
    }
    return acc
  }, {east: 0, north: 0, direction: 'e'})
  const distance = Math.abs(finalPosition.east) + Math.abs(finalPosition.north)
  console.log('Puzzle 1 ', distance);
}

const puzzle2 = (commands) => {
  const directions = ['ne', 'se', 'so', 'no'] 
  const finalPosition = commands.reduce((acc, c) => {
    const command = parseCommand(c)
    if (command) {
      switch (command.direction) {
        case 'N':
          acc.waypointY = acc.waypointY + changeY(command.value, acc.direction)
          break
        case 'S':
          acc.waypointY = acc.waypointY + changeY(command.value * -1, acc.direction)
          break
        case 'E':
          acc.waypointX = acc.waypointX + changeX(command.value, acc.direction)
          break
        case 'W':
          acc.waypointX = acc.waypointX + changeX(command.value * -1, acc.direction)
          break
        case 'L':
          acc.direction = rotate(command.value, acc.direction, directions, true)
          if ((command.value % 180) === 90){
            const temp = acc.waypointY
            acc.waypointY = acc.waypointX
            acc.waypointX = temp 
          }
          break
        case 'R':
          acc.direction = rotate(command.value, acc.direction, directions, false)
          if ((command.value % 180) === 90){
            const temp = acc.waypointY
            acc.waypointY = acc.waypointX
            acc.waypointX = temp 
          }
          break
        case 'F':
          const xMultiplied = acc.waypointX * command.value
          const yMultiplied = acc.waypointY * command.value
          if (acc.direction === 'ne' || acc.direction === 'se') {
            acc.east = acc.east + xMultiplied
          } else {
            acc.east = acc.east - xMultiplied
          }
          if (acc.direction === 'ne' || acc.direction === 'no') {
            acc.north = acc.north + yMultiplied
          } else {
            acc.north = acc.north - yMultiplied
          }
          break
      }
    }
    return acc
  }, {east: 0, north: 0, direction: 'ne', waypointX: 10, waypointY: 1})
  const distance = Math.abs(finalPosition.east) + Math.abs(finalPosition.north)
  console.log('Puzzle 2 ', distance);
}

const changeY = (value, direction) => {
  if (direction === 'ne' || direction === 'no') {
    return value
  } else {
    return value * -1
  }
}

const changeX = (value, direction) => {
  if (direction === 'ne' || direction === 'se') {
    return value
  } else {
    return value * -1
  }
}

const rotate = (value, direction, directions, left) => {
  const multiplier = left ? -1 : +1
  const step = value / 90 * multiplier
  const dir = directions.indexOf(direction)
  const newIdx = (((dir + step) % 4) + 4) % 4
  return directions[newIdx]
}