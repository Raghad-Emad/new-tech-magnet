const levelUp = (currentLevel, currentXP, xpGained) => {
  let newCurrentXp = 0;
  //get required xp
  let required = requiredXp(currentLevel);

  if (required > currentXP + xpGained) {
    //add xp gained to current xp
    newCurrentXp = currentXP + xpGained;
    // return xp and level
    return { level: currentLevel, xp: newCurrentXp };
  }

  //level up
  let newCurrentLevel = currentLevel + 1;
  //set new current xp with remaining xp after level up
  newCurrentXp = currentXP + xpGained - required;
  return levelUp(newCurrentLevel, newCurrentXp, 0);
};

const requiredXp = (currentLevel) => {
  //generate xp needed to level up
  const required = currentLevel * 1.5 * 250;
  return required;
};

module.exports = { levelUp, requiredXp };
