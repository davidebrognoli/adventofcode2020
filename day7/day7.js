fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const rules = data.toString().split('\n').map(r => parseRule(r))
    puzzle1(rules)
    puzzle2(rules)
  }
})

const puzzle1 = (rules) => {
  let validRules = extractValidRules(rules, ['shiny gold'])
  let containers = [...validRules]
  while (validRules.length > 0){
    const colors = [...validRules]
    validRules = extractValidRules(rules, colors)
    containers = [...containers, ...validRules]
  }
  const uniqContainers = containers.filter((c, i) => containers.indexOf(c) === i);
  console.log('Puzzle 1: ', uniqContainers.length)
}

const puzzle2 = (rules) => {
  const shinyGoldRule = rules.find(r => r.container === 'shiny gold')
  const total = getContent(rules, shinyGoldRule.content, 1)
  console.log('Puzzle 2: ', total)
}

const parseRule = (rule) => {
  const containerRegex = new RegExp(/([a-z ]+) bags contain (.+)/);
  const contentRegex = new RegExp(/([1-9]+)([a-z ]+) bag.*/);
  const matches = rule.match(containerRegex)
  const container = matches[1]
  let content = []
  if (matches[2] !== 'no other bags.') {
    content = matches[2].split(',').map(m => {
      const contentMatches = m.match(contentRegex);
      return {quantity: contentMatches[1], color: contentMatches[2].trim()} 
    })
  }
  return {container, content}
}

const extractValidRules = (rules, colors) => {
  return rules.reduce((acc, rule) => {
    const found = rule.content.find(r => colors.includes(r.color))
    if (found) {
      return [...acc, rule.container.trim()]
    }
    return acc
  }, [])
}

const getContent = (rules, content, multiplier) => {
  return content.reduce((acc, c) => {
    const newContent = rules.find(r => r.container === c.color)
    if (newContent && newContent.content.length > 0) {
      const quantity = multiplier * c.quantity
      const contentValue = getContent(rules, newContent.content, quantity)
      const sum = quantity + contentValue
      return acc + sum;
    } else {
      return acc + (multiplier * c.quantity);
    }
  }, 0);
}