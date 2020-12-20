fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const [rules, messages] =  data.toString().split('\n\n')
    puzzle1(rules, messages)
  }
})

fs.readFile('./input_2.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const [rules, messages] =  data.toString().split('\n\n')
    puzzle2(rules, messages)
  }
})

const puzzle1 = (rules, messages) => {
  const sum = elaborateRules(rules, messages)
  console.log('Puzzle 1', sum)
}

const puzzle2 = (rules, messages) => {
  const sum = elaborateRules(rules, messages, true)
  console.log('Puzzle 2', sum)
}

const elaborateRules = (rules, messages, loop = false) =>{
  const parsedRules = rules.split('\n').reduce((acc, r) => {
    const {number, value} = parseRule(r)
    acc.set(number, value)
    return acc
  }, new Map())
  const firstRule = parsedRules.get('0')
  const regex = new RegExp(`^${ruleToRegexp(firstRule, parsedRules, true)}$`, 'g')
  const sum = messages.split('\n').reduce((acc, m) => {
    return acc + Number(!!m.match(regex))
  }, 0)
  return sum
}

const parseRule = (rule) => {
  const [number, text] = rule.split(': ')
  const letterRegex = new RegExp(/"([a-z])"/)
  const matches = text.match(letterRegex)
  const value = !!matches ? matches[1] : text.trim()
  return {number, value}
}


const ruleToRegexp = (rule, rules, first, deep = 20) => {
  if (deep < 0) {
    return ''
  }
  if (rule === "a" || rule === "b") {
    return rule
  } else {
    const splitRule = rule.trim().split(' ')
    const value = splitRule.reduce((acc, item) => {
      let nextRule = item;
      if (item !== '|' && !Number.isNaN(item)) {
        nextRule = ruleToRegexp(rules.get(item), rules, false, deep - 1);
      }
      return `${acc}${nextRule}`
    }, '')
    return first ? value : `(${value})`
  }
}