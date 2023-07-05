export const getRandomN = (min, max, iterator) => {
  const numArr = []

  while(numArr.length < iterator) {
    const num = Math.floor(Math.random() * (max - min)) + min
    if(numArr.indexOf(num) === -1){
      numArr.push(num)
    }
  }

  return numArr
}

export const roll2d10 = () => {
  return Math.random()
}

export const addNumbersN = (...numbers) => {
  return numbers.reduce((p, n) => p + n, 0)
}

export const getStarDate = () => {

}

export const findMultiplier = (ratio, type) => {
  switch(ratio){
    // if forceRatio = 3: -90% forces, special: -100% favored, -20% other, reg: -50% all
    case 3:
      return type === "forces" ? .9 : {"fav": 1, "spec": .2, "reg": .5}
    // if forceRatio = 2: -50% forces, special: -30% favored, -10% other, reg: -5% all
    case 2:
      return type === "forces" ? .5 : {"fav": .3, "spec": .1, "reg": .05}
    // if forceRatio = 1: -25% forces, special: -5% favored, -1% other, reg: % other
    case 1:
      return type === "forces" ? .25 : {"fav": .05, "spec": .01, "reg": 0}
    // if forceRatio = 0: -5% forces, special: 0% favored, 0% other, reg: 0% other
    case 0:
      return type === "forces" ? .05 : {"fav": 0, "spec": 0, "reg": 0}
    // if forceRatio = 3: -90% forces,
    default:
      return 0
  }
}

export const getRatio = async (attackerId, defenderId) => {
  return Math.floor(attackerId/defenderId)
}
