// Importer la fonction displayAllRecipes depuis le fichier allRecipes.js pour afficher toutes les recettes
import { displayAllRecipes } from '../utils/all-recipes.js'

// Initialiser deux variables globales :
// allRecipes stocke toutes les recettes disponibles
let allRecipes = []
// currentFilteredRecipes stocke les recettes filtrées en fonction des critères de recherche ou des tags
let currentFilteredRecipes = []

// Fonction pour effacer le message d'erreur d'un élément HTML
function clearError (element) {
  if (element) element.textContent = '' // Si l'élément existe, vider son contenu texte
}

// Fonction pour définir et afficher un message d'erreur sur un élément HTML
function setError (element, errorMessage) {
  if (element) element.textContent = errorMessage // Si l'élément existe, définir son contenu texte avec le message d'erreur
}

// Fonction de recherche principale qui filtre les recettes en fonction d'une requête
export function recherchePrincipale (recettes, requete) {
  // Nettoyer et normaliser la requête en supprimant les espaces et en la convertissant en minuscules
  requete = requete.trim().toLowerCase()

  // Filtrer les recettes : garder celles dont le nom, la description ou un ingrédient contient la requête
  return recettes.filter(recette =>
    recette.name.toLowerCase().includes(requete) || // Vérifier si le nom de la recette contient la requête
    recette.description.toLowerCase().includes(requete) || // Vérifier si la description de la recette contient la requête
    recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(requete)) // Vérifier si un ingrédient contient la requête
  )
}

// Fonction pour filtrer les recettes en fonction des tags sélectionnés
export function filterRecipesByTags (recipes, selectedTags) {
  // Filtrer les recettes : vérifier si chaque recette contient tous les tags sélectionnés
  return recipes.filter((recipe) => {
    const { ingredients, ustensils, appliance } = recipe // Extraire les ingrédients, ustensiles, et l'appareil de chaque recette

    // Vérifier si chaque tag correspond à un ingrédient, un ustensile ou un appareil
    return selectedTags.every((tag) => {
      return (
        ingredients.some((ing) => // Vérifier les ingrédients
          ing.ingredient.toLowerCase().includes(tag)
        ) ||
        ustensils.some((ustensil) => // Vérifier les ustensiles
          ustensil.toLowerCase().includes(tag)
        ) ||
        appliance.toLowerCase().includes(tag) // Vérifier l'appareil
      )
    })
  })
}

// Fonction pour filtrer les recettes en fonction de la recherche principale et des tags
export function filterRecipes () {
  // Récupérer tous les tags sélectionnés depuis le DOM
  const selectedTags = Array.from(
    document.querySelectorAll('#tags-container .tag')
  ).map((tag) => tag.dataset.value.toLowerCase()) // Convertir les valeurs des tags en minuscules

  // Récupérer la valeur saisie dans le champ de recherche principale
  const mainSearchInput = document.getElementById('main-search').value.trim().toLowerCase()

  // Filtrer les recettes en fonction de la requête principale
  let filteredRecipes = recherchePrincipale(allRecipes, mainSearchInput)

  // Appliquer le filtrage par tags si des tags sont sélectionnés
  if (selectedTags.length > 0) {
    filteredRecipes = filterRecipesByTags(filteredRecipes, selectedTags)
  }

  // Mettre à jour la variable globale avec les recettes filtrées
  currentFilteredRecipes = filteredRecipes

  // Mettre à jour l'interface utilisateur avec les recettes filtrées
  const container = document.getElementById('recipes-container')
  const recipeCountElement = document.getElementById('recipe-count')
  container.innerHTML = '' // Vider le conteneur de recettes existantes

  if (filteredRecipes.length === 0) { // Si aucune recette ne correspond
    container.appendChild(createNoResultsMessage(mainSearchInput)) // Afficher un message d'absence de résultats
    recipeCountElement.textContent = '0 recette' // Mettre à jour le compteur de recettes à 0
    document.getElementById('main-btn').disabled = true // Désactiver le bouton de recherche principal
  } else { // Si des recettes correspondent
    displayAllRecipes(filteredRecipes) // Afficher les recettes filtrées
    recipeCountElement.textContent = `${filteredRecipes.length} recette(s)` // Mettre à jour le compteur avec le nombre de recettes trouvées
    document.getElementById('main-btn').disabled = false // Activer le bouton de recherche principal
  }

  // Mettre à jour les options des listes déroulantes en fonction des recettes filtrées
  updateDropdownOptions(filteredRecipes)
}

// Fonction pour créer un message d'absence de résultats lorsqu'aucune recette ne correspond à la recherche
function createNoResultsMessage (query) {
  const noResultsMessage = document.createElement('p') // Créer un élément paragraphe (<p>) pour le message
  noResultsMessage.textContent = `Aucune recette ne contient "${query}". Essayez des termes comme "tarte aux pommes", "poisson", etc.` // Définir le texte du message
  return noResultsMessage // Retourner l'élément message
}

// Fonction pour initialiser l'utilisation des recettes (affichage initial, gestion des événements)
export function initUseCase (recipes) {
  // Stocker toutes les recettes dans les variables globales
  allRecipes = recipes
  currentFilteredRecipes = recipes

  // Récupérer les éléments du DOM pour la recherche principale, le bouton principal, et les messages d'erreur
  const mainSearchInput = document.getElementById('main-search')
  const mainBtn = document.getElementById('main-btn')
  const errorMessage = document.getElementById('error-message')

  // Fonction pour gérer la recherche lors de la saisie ou du clic sur le bouton de recherche
  const handleSearch = (query) => {
    // Récupérer les tags sélectionnés pour la recherche avancée
    const selectedTags = Array.from(
      document.querySelectorAll('#tags-container .tag')
    ).map((tag) => tag.dataset.value.toLowerCase())

    if (query.length >= 3) { // Si la requête a 3 caractères ou plus
      clearError(errorMessage) // Effacer les messages d'erreur
      filterRecipes() // Filtrer les recettes
    } else if (query.length === 0) { // Si la requête est vide
      clearError(errorMessage) // Effacer les messages d'erreur

      if (selectedTags.length > 0) { // Si des tags sont sélectionnés
        filterRecipes() // Filtrer les recettes
      } else { // Si aucun tag n'est sélectionné
        resetRecipes() // Réinitialiser l'affichage des recettes
      }
    } else { // Si la requête est trop courte
      setError(errorMessage, 'Veuillez entrer au moins 3 caractères pour lancer la recherche') // Afficher un message d'erreur
      resetRecipes() // Réinitialiser l'affichage des recettes
    }
  }

  // Fonction pour réinitialiser l'affichage des recettes et des options des listes déroulantes
  const resetRecipes = () => {
    displayAllRecipes(allRecipes) // Afficher toutes les recettes
    currentFilteredRecipes = allRecipes // Mettre à jour la variable globale
    updateDropdownOptions(currentFilteredRecipes) // Mettre à jour les options des listes déroulantes
  }

  // Ajouter des écouteurs d'événements pour la saisie dans le champ de recherche et le clic sur le bouton de recherche
  if (mainSearchInput && mainBtn) {
    mainSearchInput.addEventListener('input', () => handleSearch(mainSearchInput.value.trim().toLowerCase()))
    mainBtn.addEventListener('click', (event) => {
      event.preventDefault() // Empêcher le rechargement de la page
      handleSearch(mainSearchInput.value.trim().toLowerCase()) // Lancer la recherche
    })
  }

  // Ajouter des écouteurs d'événements pour la saisie dans les champs de recherche des options dans les dropdowns
  const optionSearchInputs = document.querySelectorAll('.option-search')
  optionSearchInputs.forEach((input) =>
    input.addEventListener('input', () => {
      filterDropdownOptions(input.closest('.dropDown'), input.value.trim().toLowerCase())
    })
  )

  // Remplir les listes déroulantes avec les recettes initiales
  populateDropdowns(recipes)
}

// Fonction pour mettre à jour les options des listes déroulantes en fonction des recettes filtrées
function updateDropdownOptions (recipes) {
  // Récupérer les éléments des listes déroulantes pour les ingrédients, appareils et ustensiles
  const dropdowns = {
    ingredients: document.querySelector(".dropDown[data-value='ingredients'] .ingredients"),
    appliances: document.querySelector(".dropDown[data-value='appliances'] .appliances"),
    ustensils: document.querySelector(".dropDown[data-value='ustensils'] .ustensils")
  }

  // Vérifier si toutes les listes déroulantes ont été trouvées dans le DOM
  if (!Object.values(dropdowns).every((dropdown) => dropdown)) {
    console.error('Un ou plusieurs éléments de la liste déroulante non trouvés') // Afficher une erreur dans la console si une liste est manquante
    return
  }

  // Initialiser des ensembles pour garantir que chaque option est unique
  const sets = {
    ingredientsSet: new Set(),
    appliancesSet: new Set(),
    ustensilsSet: new Set()
  }

  // Ajouter les ingrédients, appareils, et ustensiles des recettes filtrées dans les ensembles correspondants
  recipes.forEach(({ ingredients, appliance, ustensils }) => {
    ingredients.forEach((ing) => sets.ingredientsSet.add(ing.ingredient))
    sets.appliancesSet.add(appliance)
    ustensils.forEach((ust) => sets.ustensilsSet.add(ust))
  })

  // Mettre à jour le contenu de chaque liste déroulante avec les éléments des ensembles
  updateDropdown(dropdowns.ingredients, sets.ingredientsSet)
  updateDropdown(dropdowns.appliances, sets.appliancesSet)
  updateDropdown(dropdowns.ustensils, sets.ustensilsSet)

  // Configurer les options des listes déroulantes pour qu'elles soient interactives
  Object.values(dropdowns).forEach(setupDropdownOptions)
}

// Fonction pour mettre à jour le contenu d'une liste déroulante
function updateDropdown (dropdown, itemsSet) {
  dropdown.innerHTML = '' // Vider le contenu existant de la liste déroulante
  // Ajouter chaque élément de l'ensemble dans la liste déroulante
  itemsSet.forEach((item) => {
    const optionElement = createDropdownOptionElement(item)
    dropdown.appendChild(optionElement)
  })
}

// Fonction pour créer un élément d'option pour une liste déroulante
function createDropdownOptionElement (item) {
  // Créer un élément <div> pour représenter l'option dans la liste déroulante
  const optionElement = document.createElement('div')
  optionElement.classList.add('option') // Ajouter une classe CSS 'option' pour le style
  optionElement.innerText = item // Définir le texte de l'option avec l'élément fourni

  // Ajouter un événement de clic à l'option
  optionElement.addEventListener('click', (e) => {
    e.stopPropagation() // Empêcher la propagation de l'événement clic
    createTagElement(item.toLowerCase()) // Créer un tag correspondant à l'option sélectionnée
    filterRecipes() // Filtrer les recettes après la sélection
    closeDropdown(optionElement.closest('details')) // Fermer la liste déroulante
  })

  return optionElement // Retourner l'élément option créé
}

// Fonction pour fermer une liste déroulante en retirant l'attribut 'open' de l'élément <details>
function closeDropdown (detailsElement) {
  if (detailsElement) {
    detailsElement.removeAttribute('open') // Fermer la liste déroulante
  }
}

// Fonction pour configurer les options des listes déroulantes
function setupDropdownOptions (dropdown) {
  // Récupérer toutes les options de la liste déroulante
  const options = dropdown.querySelectorAll('.option')
  // Ajouter un événement de clic à chaque option pour gérer la sélection
  options.forEach((option) =>
    option.addEventListener('click', (e) => {
      e.stopPropagation() // Empêcher la propagation de l'événement clic
      createTagElement(option.innerText.toLowerCase()) // Créer un tag correspondant à l'option sélectionnée
      filterRecipes() // Filtrer les recettes après la sélection
      closeDropdown(dropdown.closest('details')) // Fermer la liste déroulante
    })
  )
}

// Fonction pour remplir les listes déroulantes avec les options correspondant aux recettes disponibles
function populateDropdowns (recipes) {
  updateDropdownOptions(recipes) // Mettre à jour les options des listes déroulantes en fonction des recettes fournies
}

// Fonction pour créer un élément de tag pour la recherche avancée
function createTagElement (value) {
  // Récupérer le conteneur de tags dans le DOM
  const tagsContainer = document.getElementById('tags-container')
  // Vérifier si un tag avec cette valeur existe déjà. Si non, le créer
  if (!tagsContainer.querySelector(`.tag[data-value="${value}"]`)) {
    // Créer un élément <div> pour représenter le tag
    const tagElement = document.createElement('div')
    tagElement.classList.add('tag') // Ajouter une classe CSS 'tag' pour le style
    tagElement.dataset.value = value // Définir l'attribut data-value du tag avec la valeur fournie
    tagElement.innerText = value // Définir le texte du tag avec la valeur

    // Créer un bouton de suppression pour le tag
    const removeButton = createRemoveButtonElement()
    // Ajouter un événement de clic pour supprimer le tag lorsqu'il est cliqué
    removeButton.addEventListener('click', () => {
      tagElement.remove() // Supprimer le tag de l'interface
      filterRecipes() // Filtrer les recettes après la suppression du tag
    })

    // Ajouter le bouton de suppression au tag
    tagElement.appendChild(removeButton)
    // Ajouter le tag complet (texte + bouton de suppression) au conteneur de tags
    tagsContainer.appendChild(tagElement)
    // Filtrer les recettes après avoir ajouté le tag
    filterRecipes()
  }
}

// Fonction pour créer un bouton de suppression de tag
function createRemoveButtonElement () {
  // Créer un élément <span> pour représenter le bouton de suppression
  const removeButton = document.createElement('span')
  removeButton.classList.add('remove-tag') // Ajouter une classe CSS 'remove-tag' pour le style
  // Définir le contenu HTML du bouton avec une icône de croix
  removeButton.innerHTML = '<img src="assets/icons/croixtags.svg" alt="Remove tag" width="16" height="16">'
  removeButton.style.cursor = 'pointer' // Changer le curseur pour indiquer que c'est cliquable
  return removeButton // Retourner l'élément bouton créé
}

// Fonction pour filtrer les options des listes déroulantes en fonction de la recherche saisie
function filterDropdownOptions (dropdown, query) {
  // Récupérer toutes les options de la liste déroulante
  const options = dropdown.querySelectorAll('.option')
  // Pour chaque option, vérifier si elle correspond à la requête. Sinon, la masquer
  options.forEach((option) => {
    option.style.display = option.innerText.toLowerCase().includes(query) ? '' : 'none'
  })
}
// Explication détaillée des sections principales :
// Importation et Initialisation :

// Importation : La fonction displayAllRecipes est importée pour être utilisée dans l'affichage des recettes.
// Initialisation : allRecipes stocke toutes les recettes disponibles, tandis que currentFilteredRecipes stocke les recettes filtrées en fonction des critères de recherche ou de sélection de tags.
// Fonctions d'erreur et de recherche :

// clearError et setError : Ces fonctions gèrent l'affichage des messages d'erreur.
// recherchePrincipale : Cette fonction filtre les recettes en fonction d'une requête de recherche, vérifiant le nom, la description, et les ingrédients.
// Filtrage des recettes :

// filterRecipesByTags : Cette fonction filtre les recettes en fonction des tags sélectionnés.
// filterRecipes : Elle combine le filtrage par recherche principale et par tags, puis met à jour l'affichage des recettes.
// Initialisation de l'interface :

// initUseCase : Cette fonction initialise l'affichage des recettes, configure les écouteurs d'événements pour la recherche et les dropdowns, et remplit les listes déroulantes avec les options disponibles.
// Mise à jour des Dropdowns :

// updateDropdownOptions et updateDropdown : Ces fonctions mettent à jour les options disponibles dans les listes déroulantes en fonction des recettes filtrées.
// createDropdownOptionElement : Crée des éléments d'option pour les dropdowns.
// Gestion des tags :

// createTagElement et createRemoveButtonElement : Ces fonctions gèrent la création et la suppression des tags pour la recherche avancée.
// Filtrage des Dropdowns :

// filterDropdownOptions : Cette fonction masque ou affiche les options des dropdowns en fonction de la recherche saisie par l'utilisateur.
