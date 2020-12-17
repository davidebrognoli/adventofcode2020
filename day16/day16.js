fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const [rules, myTicket, nearbyTickets] =  data.toString().split('\n\n')
    puzzle1(rules, nearbyTickets)
    puzzle2(rules, myTicket, nearbyTickets)
  }
})

const puzzle1 = (rules, nearbyTickets) => {
  const parsedRules = parseRules(rules)
  const validNumbers = getValidNumbers(parsedRules)
  const tickets = getTickets(nearbyTickets)
  const ticketsNumbers = tickets.reduce((sum, t) => {
    const ticketSum = t.reduce((acc, number) => {
      const add = validNumbers.has(number) ? 0 : number
      return acc + add
    }, 0)
    return sum + ticketSum
  }, 0)
  console.log('Puzzle 1', ticketsNumbers)
}

const puzzle2 = (rules, myTicket, nearbyTickets) => {
  const parsedRules = parseRules(rules)
  const validNumbers = getValidNumbers(parsedRules)
  const tickets = getTickets(nearbyTickets)
  const ticket = getTickets(myTicket)
  const validTickets = [...ticket, ...tickets].filter(t => {
    return t.every(n => validNumbers.has(n))
  })
  const impossibleIndexes = parsedRules.map(r => {
    return validTickets.reduce((invalid, t) => {
      const invalidPosition =  t.reduce((acc, n, index) => {
        if ((r[0] > n || r[1] < n) && (r[2] > n || r[3] < n)) {
          acc.add(index)
        }
        return acc
      }, new Set())
      return [...invalid, ...invalidPosition]
    }, []).sort((a, b) => a - b)
  })
  let possibleIndexes = impossibleIndexes.map((i, index) => {
    const possible = Array(ticket[0].length).fill(0).map((_, idx) => idx).filter(vi => !i.includes(vi))
    return {index, possible}
  })
  let found = true;
  const foundIndex = []
  while(found) {
    const oneLength = possibleIndexes.filter(p => p.possible.length === 1)
    if (!oneLength.length > 0) {
      found = false;
    } else {
      foundIndex.push(...oneLength)
      const foundElements = oneLength.reduce((acc, o) => {
        return [...acc, ...o.possible]
      }, [])
      const longestIndex = possibleIndexes.filter(l => l.possible.length !== 1)
      possibleIndexes = longestIndex.map(l => {
        return {
          index: l.index,
          possible: l.possible.filter(p => !foundElements.includes(p))
        }
      })
    }
  }
  const departure = foundIndex.reduce((acc, f) => {
    if (f.index < 6){
      return [...acc, ...f.possible]
    }
    return acc
  }, [])
  const multiply = departure.reduce((mul, d) => {
    return mul * ticket[0][d]
  }, 1)
  console.log('Puzzle 2', multiply)
}

const getValidNumbers = (rules) => {
  const validNumbers = rules.reduce((acc, r) => {
    for(let i = r[0]; i <= r[1]; i++) {
      acc.add(i)
    }
    for(let j = r[2]; j <= r[3]; j++) {
      acc.add(j)
    }
    return acc
  }, new Set())
  return validNumbers;
}

const getTickets = (nearbyTickets) => {
  const tickets = nearbyTickets.split('\n')
  tickets.shift()
  return tickets.map(t => t.split(',').map(n => parseInt(n, 10)))
}

const parseRules = (rules) => {
  const regex = new RegExp(/[a-z\s]+:\s([0-9]+)-([0-9]+) or ([0-9]+)-([0-9]+)/)
  return rules.split('\n').map(r => {
    const matches = r.match(regex)
    return matches.slice(1, 5).map(n => parseInt(n, 10))
  })
}