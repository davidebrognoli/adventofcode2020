fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const foods =  data.toString().split('\n')
    puzzle1(foods)
    puzzle2(foods)
  }
})

const puzzle1 = (foods) => {
  const foodList = foods.map(f => parseFood(f))
  const allergenMap = getAllergenMap(foodList)
  const allergens = getAllergenList(allergenMap)
  const safeFood = getSafeFood(foodList, allergens)
  console.log('Puzzle 1', safeFood.length)
}

const puzzle2 = (foods) => {
  const foodList = foods.map(f => parseFood(f))
  const allergenMap = getAllergenMap(foodList)
  const allergenDict = getAllergenDict(allergenMap)
  const res = allergenDict.sort((a, b) => a.allergen.localeCompare(b.allergen)).map(i => i.ingredient).join(',')
  console.log('Puzzle 2', res)
}

const parseFood = (food) => {
  const [ingredientsStr, allergensStr] = food.split('(contains ')
  const ingredients = ingredientsStr.trim().split(' ')
  const allergens = allergensStr.replace(')', '').trim().split(' ').map(a => a.replace(',', ''))
  return {allergens, ingredients}
}

const getAllergenMap = (foodList) => {
  return foodList.reduce((acc, f) => {
    const { allergens, ingredients } = f;
    allergens.forEach(a => {
      if (!acc.has(a)) {
        acc.set(a, ingredients)
      } else {
        const prev = acc.get(a)
        const intersection = ingredients.filter(i => prev.includes(i))
        acc.set(a, intersection)
      }
    })
    return acc
  }, new Map())
}

const getAllergenList = (allergenMap) => {
  const allergens = new Set()
  allergenMap.forEach(am => {
    am.forEach(a => {
      allergens.add(a)
    })
  })
  return allergens
}

const getSafeFood = (foodList, allergens) => {
  return foodList.reduce((acc, f) => {
    const safe = f.ingredients.reduce((a, i) => {
      if (!allergens.has(i)) {
        a.push(i)
      }
      return a
    }, [])
    return [...acc, ...safe]
  }, [])
}

const getAllergenDict = (allergenMap) => {
  const dict = []
  const size = allergenMap.size
  while (dict.length < size) {
    allergenMap.forEach((value, key) => {
      if (value.length === 1) {
        dict.push({ingredient: value[0], allergen: key})
        allergenMap.delete(key)
      } else {
        const reduced = value.reduce((acc, v) => {
          if (!dict.find(m => m.ingredient === v)) {
            acc.push(v)
          }
          return acc;
        }, [])
        allergenMap.set(key, reduced)        
      }
    })
  }
  return dict
}