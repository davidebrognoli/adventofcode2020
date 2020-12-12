fs = require('fs')
fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('An Error as occured: ', err)
  } else {
    const rows = data.toString().split('\n')
    const passports = extractPassports(rows)
    puzzle1(passports)
    puzzle2(passports)
  }
})

const puzzle1 = (passports) => {
  const validPassports = passports.reduce((acc, p) => {
    return acc + (isValid(p) ? 1 : 0);
  }, 0)
  console.log('Puzzle 1: ', validPassports)
}

const puzzle2 = (passports) => {
  const validPassports = passports.reduce((acc, p) => {
    const valid = isValid(p) 
      && validByr(p.byr) 
      && validIyr(p.iyr) 
      && validEyr(p.eyr) 
      && validHgt(p.hgt) 
      && validHcl(p.hcl) 
      && validEcl(p.ecl) 
      && validPid(p.pid) 
    return acc + (valid ? 1 : 0);
  }, 0)
  console.log('Puzzle 2: ', validPassports)
}

const extractPassports = (rows) => {
  const tempPassports = rows.reduce((acc, r) => {
    if (r) {
      return {passports: [...acc.passports], current: `${acc.current}${r} `};
    } 
    return {passports: [...acc.passports, acc.current.trim()], current: ''}
  }, {passports: [], current: ''})
  const passports = [...tempPassports.passports, tempPassports.current].map(p => convertStringIntoPassport(p))
  return passports
}

const convertStringIntoPassport = (passport) => {
  return passport.split(' ').reduce((acc, i) => {
    const pair = i.split(':')
    const obj = {}
    obj[pair[0]] = pair[1]
    return {...acc, ...obj}
  }, {});
}

const isValid = (passport) => {
  const requiredKeys = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
  return requiredKeys.every(k => Object.keys(passport).includes(k))
}

const validByr = (byr) => {
  return byr >= 1920 & byr <= 2002
}
const validIyr = (iyr) => {
  return iyr >= 2010 & iyr <= 2020 
}
const validEyr = (eyr) => {
  return eyr >= 2020 & eyr <= 2030 
}
const validHgt= (hgt) => {
  let number = 0
  if (hgt.length === 5) {
    number = hgt.split('cm')[0]
    return number >= 150 && number <=193
  } else {
    number = hgt.split('in')[0]
    return number >= 59 && number <= 76
  }
}
const validHcl = (hcl) => {
  const regex = new RegExp(/^#[0-9a-f]{6}$/)
  return regex.test(hcl)
}

const validEcl = (ecl) => {
  const validValues = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']
  return validValues.includes(ecl)
}

const validPid = (pid) => {
  const regex = new RegExp(/^[0-9]{9}$/)
  return regex.test(pid)
}
