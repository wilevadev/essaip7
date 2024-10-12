import { Recipe } from '../templates/create-card.js'

export function displayAllRecipes (recipes) {
  const container = document.getElementById('recipes-container')
  const recipeCountElement = document.getElementById('recipe-count')

  if (!container) {
    console.error("L'élément 'recipes-container' n'a pas été trouvé.")
    return
  }

  container.innerHTML = ''

  recipes.forEach(recipeData => {
    try {
      const recipe = new Recipe(recipeData)
      const recipeCard = recipe.createRecipeCard()
      container.appendChild(recipeCard)
    } catch (error) {
      console.warn(`Recette ignorée : ${error.message}`)
    }
  })

  if (recipeCountElement) {
    recipeCountElement.textContent = `${recipes.length} recettes`
  }
}
