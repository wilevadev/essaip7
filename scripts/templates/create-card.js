export class Recipe {
  constructor (recipe) {
    console.log(recipe) // Point-virgule ajouté
    this._id = recipe.id
    this._image = `../assets/images/LesPetitsPlats/${recipe.image}`
    this._name = recipe.name
    this._appliance = recipe.appliance
    this._description = recipe.description
    this._ingredients = recipe.ingredients
    this._servings = recipe.servings
    this._time = recipe.time
    this._ustensils = recipe.ustensils
  }

  createRecipeCard () {
    const card = document.createElement('div')
    card.classList.add('card')

    const cardHeader = document.createElement('div')
    cardHeader.classList.add('card-header')

    const recipeImage = document.createElement('img')
    recipeImage.id = 'recipe-image'
    recipeImage.src = this._image
    recipeImage.alt = this._name

    const recipeTime = document.createElement('span')
    recipeTime.id = 'recipe-time'
    recipeTime.textContent = `${this._time}min`

    cardHeader.appendChild(recipeImage)
    cardHeader.appendChild(recipeTime)

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    const recipeName = document.createElement('h2')
    recipeName.id = 'recipe-name'
    recipeName.textContent = this._name

    const recipeLabel = document.createElement('h3')
    recipeLabel.textContent = 'RECETTE'

    const recipeDescription = document.createElement('p')
    recipeDescription.id = 'recipe-description'
    recipeDescription.textContent = this._description

    const ingredientsTitle = document.createElement('h3')
    ingredientsTitle.textContent = 'INGRÉDIENTS'

    const ingredientsList = document.createElement('ul')
    ingredientsList.id = 'recipe-ingredients'

    for (let i = 0; i < this._ingredients.length; i++) {
      const ingredient = this._ingredients[i]
      const listItem = document.createElement('li')
      const ingredientName = document.createElement('span')
      const quantityAndUnit = document.createElement('span')

      ingredientName.textContent = ingredient.ingredient || 'Ingrédient'
      ingredientName.classList.add('ingredient-name')

      quantityAndUnit.textContent = `${ingredient.quantity ? ingredient.quantity : ''} ${ingredient.unit ? ingredient.unit : ''}`
      quantityAndUnit.classList.add('quantity-unit')

      listItem.appendChild(ingredientName)
      listItem.appendChild(quantityAndUnit)
      ingredientsList.appendChild(listItem)
    }

    cardBody.appendChild(recipeName)
    cardBody.appendChild(recipeLabel)
    cardBody.appendChild(recipeDescription)
    cardBody.appendChild(ingredientsTitle)
    cardBody.appendChild(ingredientsList)

    card.appendChild(cardHeader)
    card.appendChild(cardBody)

    return card
  }
}
