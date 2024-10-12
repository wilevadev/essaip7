// Importer la fonction displayAllRecipes depuis le fichier allRecipes.js pour afficher toutes les recettes.
import { displayAllRecipes } from '../utils/all-recipes.js'

// Initialisation de la variable allRecipes qui stocke toutes les recettes disponibles dans l'application.
let allRecipes = []

// Initialisation de la variable currentFilteredRecipes qui stocke les recettes filtrées selon les critères de recherche ou de sélection de tags.
let currentFilteredRecipes = []

// Fonction pour effacer le message d'erreur affiché sur un élément HTML spécifique.
// Si l'élément existe, son contenu texte est effacé.
function clearError (element) {
  if (element) element.textContent = ''
}

// Fonction pour définir un message d'erreur sur un élément HTML spécifique.
// Si l'élément existe, le message d'erreur est assigné au contenu texte de l'élément.
function setError (element, errorMessage) {
  if (element) element.textContent = errorMessage
}

// Fonction de recherche principale qui filtre les recettes en fonction d'une requête donnée par l'utilisateur.
// Cette fonction est exportée pour être utilisée dans d'autres fichiers.
export function recherchePrincipale (recettes, requete) {
  // Nettoyer la requête en supprimant les espaces superflus et en convertissant tout en minuscules pour une comparaison insensible à la casse.
  requete = requete.trim().toLowerCase()

  // Initialiser un tableau vide pour stocker les résultats de la recherche.
  const results = []

  // Boucler sur chaque recette pour vérifier si elle correspond à la requête de recherche.
  for (let i = 0; i < recettes.length; i++) {
    // Récupérer la recette actuelle à partir du tableau de recettes.
    const recette = recettes[i]
    // Initialiser un flag "found" à false pour indiquer si la recette correspond à la requête.
    let found = false

    // Vérifier si le nom de la recette contient la requête.
    // Le nom est d'abord converti en minuscules pour une comparaison insensible à la casse.
    const recetteName = recette.name.toLowerCase()
    if (recetteName.length >= requete.length) {
      // Parcourir chaque sous-chaîne du nom de la recette pour vérifier si elle correspond à la requête.
      for (let k = 0; k <= recetteName.length - requete.length; k++) {
        // Si une correspondance est trouvée, le flag "found" est mis à true et on sort de la boucle.
        if (recetteName.substring(k, k + requete.length) === requete) {
          found = true
          break
        }
      }
    }

    // Si le nom ne correspond pas, vérifier si la description de la recette contient la requête.
    if (!found) {
      const recetteDescription = recette.description.toLowerCase()
      if (recetteDescription.length >= requete.length) {
        for (let k = 0; k <= recetteDescription.length - requete.length; k++) {
          if (recetteDescription.substring(k, k + requete.length) === requete) {
            found = true
            break
          }
        }
      }
    }

    // Si ni le nom ni la description ne correspondent, vérifier les ingrédients.
    if (!found) {
      for (let j = 0; j < recette.ingredients.length; j++) {
        const ingredientName = recette.ingredients[j].ingredient.toLowerCase()
        if (ingredientName.length >= requete.length) {
          for (let k = 0; k <= ingredientName.length - requete.length; k++) {
            if (ingredientName.substring(k, k + requete.length) === requete) {
              found = true
              break
            }
          }
        }
        // Si l'ingrédient correspond, sortir de la boucle des ingrédients.
        if (found) {
          break
        }
      }
    }

    // Si la recette correspond à la requête, l'ajouter aux résultats.
    if (found) {
      results.push(recette)
    }
  }

  // Retourner les résultats de la recherche sous forme de tableau de recettes correspondantes.
  return results
}

// Fonction pour filtrer les recettes en fonction des tags sélectionnés.
// Cette fonction est exportée pour être utilisée dans d'autres fichiers.
export function filterRecipesByTags (recipes, selectedTags) {
  // Filtrer les recettes : pour chaque recette, vérifier si tous les tags sélectionnés sont présents
  return recipes.filter((recipe) => {
    const { ingredients, ustensils, appliance } = recipe

    // Vérifier si chaque tag correspond à un ingrédient, un ustensile ou un appareil dans la recette.
    return selectedTags.every((tag) => {
      return (
        ingredients.some((ing) =>
          ing.ingredient.toLowerCase().includes(tag)
        ) ||
        ustensils.some((ustensil) =>
          ustensil.toLowerCase().includes(tag)
        ) ||
        appliance.toLowerCase().includes(tag)
      )
    })
  })
}

// Fonction pour filtrer les recettes en fonction de la recherche principale et des tags sélectionnés.
export function filterRecipes () {
  // Récupérer les tags sélectionnés depuis le DOM et les convertir en minuscules.
  const selectedTags = Array.from(
    document.querySelectorAll('#tags-container .tag')
  ).map((tag) => tag.dataset.value.toLowerCase())

  // Récupérer la valeur saisie dans le champ de recherche principal et la nettoyer.
  const mainSearchInput = document.getElementById('main-search').value.trim().toLowerCase()
  // Filtrer les recettes en fonction de la recherche principale.
  let filteredRecipes = recherchePrincipale(allRecipes, mainSearchInput)

  // Si des tags sont sélectionnés, appliquer un filtrage supplémentaire par tags.
  if (selectedTags.length > 0) {
    filteredRecipes = filterRecipesByTags(filteredRecipes, selectedTags)
  }

  // Mettre à jour la variable globale avec les recettes filtrées.
  currentFilteredRecipes = filteredRecipes

  // Mettre à jour l'interface utilisateur : conteneur de recettes, nombre de recettes.
  const container = document.getElementById('recipes-container')
  const recipeCountElement = document.getElementById('recipe-count')
  container.innerHTML = ''

  // Si aucune recette ne correspond, afficher un message d'absence de résultats et désactiver le bouton principal.
  if (filteredRecipes.length === 0) {
    container.appendChild(createNoResultsMessage(mainSearchInput))
    recipeCountElement.textContent = '0 recette'
    document.getElementById('main-btn').disabled = true
  } else {
    // Sinon, afficher les recettes filtrées et mettre à jour le compte de recettes.
    displayAllRecipes(filteredRecipes)
    recipeCountElement.textContent = `${filteredRecipes.length} recette(s)`
    document.getElementById('main-btn').disabled = false
  }

  // Mettre à jour les options des listes déroulantes en fonction des recettes filtrées.
  updateDropdownOptions(filteredRecipes)
}

// Fonction pour créer un message d'absence de résultats lorsque aucune recette ne correspond à la recherche.
function createNoResultsMessage (query) {
  // Créer un élément paragraphe (<p>) pour afficher le message.
  const noResultsMessage = document.createElement('p')
  // Définir le contenu du message pour informer l'utilisateur qu'aucune recette ne correspond à la requête.
  noResultsMessage.textContent = `Aucune recette ne contient "${query}". Essayez des termes comme "tarte aux pommes", "poisson", etc.`
  // Retourner l'élément message pour l'ajouter au DOM.
  return noResultsMessage
}

// Fonction pour initialiser l'application avec les recettes fournies et configurer les gestionnaires d'événements.
export function initUseCase (recipes) {
  // Stocker toutes les recettes dans la variable globale allRecipes.
  allRecipes = recipes
  // Initialiser currentFilteredRecipes avec toutes les recettes pour le premier affichage.
  currentFilteredRecipes = recipes

  // Récupérer les éléments du DOM pour la recherche principale et le bouton principal.
  const mainSearchInput = document.getElementById('main-search')
  const mainBtn = document.getElementById('main-btn')
  const errorMessage = document.getElementById('error-message')

  // Fonction pour gérer la recherche lorsqu'une requête est saisie.
  const handleSearch = (query) => {
    if (query.length >= 3) {
      // Si la requête est suffisamment longue, effacer les messages d'erreur et filtrer les recettes.
      clearError(errorMessage)
      filterRecipes()
    } else if (query.length === 0) {
      // Si la requête est vide, effacer les erreurs et réinitialiser les recettes si aucun tag n'est sélectionné.
      clearError(errorMessage)
      const selectedTags = Array.from(
        document.querySelectorAll('#tags-container .tag')
      ).map((tag) => tag.dataset.value.toLowerCase())

      if (selectedTags.length > 0) {
        filterRecipes()
      } else {
        resetRecipes()
      }
    } else {
      // Si la requête est trop courte, afficher un message d'erreur et réinitialiser les recettes.
      setError(errorMessage, 'Veuillez entrer au moins 3 caractères pour lancer la recherche')
      resetRecipes()
    }
  }

  // Fonction pour réinitialiser l'affichage des recettes et des options des listes déroulantes.
  const resetRecipes = () => {
    // Afficher toutes les recettes à nouveau.
    displayAllRecipes(allRecipes)
    // Mettre à jour la variable globale avec toutes les recettes.
    currentFilteredRecipes = allRecipes
    // Mettre à jour les options des listes déroulantes.
    updateDropdownOptions(currentFilteredRecipes)
  }

  // Ajouter des gestionnaires d'événements pour la recherche principale.
  if (mainSearchInput && mainBtn) {
    // Lancer la recherche à chaque saisie dans le champ de recherche.
    mainSearchInput.addEventListener('input', () => handleSearch(mainSearchInput.value.trim().toLowerCase()))
    // Lancer la recherche lorsque l'utilisateur clique sur le bouton de recherche.
    mainBtn.addEventListener('click', (event) => {
      event.preventDefault()
      handleSearch(mainSearchInput.value.trim().toLowerCase())
    })
  }

  // Ajouter des gestionnaires d'événements pour les champs de recherche des listes déroulantes.
  const optionSearchInputs = document.querySelectorAll('.option-search')
  optionSearchInputs.forEach((input) =>
    input.addEventListener('input', () => {
      filterDropdownOptions(input.closest('.dropDown'), input.value.trim().toLowerCase())
    })
  )

  // Remplir les listes déroulantes avec les recettes fournies.
  populateDropdowns(recipes)
}

// Fonction pour mettre à jour les options des listes déroulantes en fonction des recettes filtrées.
function updateDropdownOptions (recipes) {
  // Récupérer les éléments des listes déroulantes pour les ingrédients, appareils et ustensiles.
  const dropdowns = {
    ingredients: document.querySelector(".dropDown[data-value='ingredients'] .ingredients"),
    appliances: document.querySelector(".dropDown[data-value='appliances'] .appliances"),
    ustensils: document.querySelector(".dropDown[data-value='ustensils'] .ustensils")
  }

  // Vérifier si toutes les listes déroulantes ont été trouvées dans le DOM, sinon afficher une erreur.
  if (!Object.values(dropdowns).every((dropdown) => dropdown)) {
    console.error('Un ou plusieurs éléments de la liste déroulante non trouvés')
    return
  }

  // Initialiser des ensembles pour garantir que chaque option est unique.
  const sets = {
    ingredientsSet: new Set(),
    appliancesSet: new Set(),
    ustensilsSet: new Set()
  }

  // Pour chaque recette, ajouter les ingrédients, l'appareil et les ustensiles dans les ensembles correspondants.
  recipes.forEach(({ ingredients, appliance, ustensils }) => {
    ingredients.forEach((ing) => sets.ingredientsSet.add(ing.ingredient))
    sets.appliancesSet.add(appliance)
    ustensils.forEach((ust) => sets.ustensilsSet.add(ust))
  })

  // Mettre à jour le contenu de chaque liste déroulante avec les ensembles d'options.
  updateDropdown(dropdowns.ingredients, sets.ingredientsSet)
  updateDropdown(dropdowns.appliances, sets.appliancesSet)
  updateDropdown(dropdowns.ustensils, sets.ustensilsSet)

  // Configurer les options des listes déroulantes pour qu'elles soient interactives.
  Object.values(dropdowns).forEach(setupDropdownOptions)
}

// Fonction pour mettre à jour le contenu d'une liste déroulante avec un ensemble d'éléments.
function updateDropdown (dropdown, itemsSet) {
  // Vider la liste déroulante de tout contenu existant.
  dropdown.innerHTML = ''
  // Pour chaque élément de l'ensemble, créer un élément d'option et l'ajouter à la liste déroulante.
  itemsSet.forEach((item) => {
    const optionElement = createDropdownOptionElement(item)
    dropdown.appendChild(optionElement)
  })
}

// Fonction pour créer un élément d'option pour une liste déroulante.
function createDropdownOptionElement (item) {
  // Créer un élément <div> pour représenter l'option.
  const optionElement = document.createElement('div')
  optionElement.classList.add('option') // Ajouter la classe 'option' pour le style.
  optionElement.innerText = item // Définir le texte de l'option avec l'élément donné.

  // Ajouter un gestionnaire d'événements pour la sélection de l'option.
  optionElement.addEventListener('click', (e) => {
    e.stopPropagation() // Empêcher la propagation de l'événement click.
    createTagElement(item.toLowerCase()) // Créer un tag correspondant à l'option sélectionnée.
    filterRecipes() // Filtrer les recettes en fonction des tags.
    closeDropdown(optionElement.closest('details')) // Fermer la liste déroulante.
  })

  // Retourner l'élément d'option créé.
  return optionElement
}

// Fonction pour fermer une liste déroulante en retirant l'attribut 'open' de l'élément <details>.
function closeDropdown (detailsElement) {
  if (detailsElement) {
    detailsElement.removeAttribute('open')
  }
}

// Fonction pour configurer les options des listes déroulantes en ajoutant des gestionnaires d'événements.
function setupDropdownOptions (dropdown) {
  // Récupérer toutes les options de la liste déroulante.
  const options = dropdown.querySelectorAll('.option')
  // Pour chaque option, ajouter un gestionnaire d'événements pour la rendre interactive.
  options.forEach((option) =>
    option.addEventListener('click', (e) => {
      e.stopPropagation() // Empêcher la propagation de l'événement click.
      createTagElement(option.innerText.toLowerCase()) // Créer un tag correspondant à l'option sélectionnée.
      filterRecipes() // Filtrer les recettes en fonction des tags.
      closeDropdown(dropdown.closest('details')) // Fermer la liste déroulante.
    })
  )
}

// Fonction pour remplir les listes déroulantes avec les recettes disponibles.
function populateDropdowns (recipes) {
  updateDropdownOptions(recipes)
}

// Fonction pour créer un élément de tag pour la recherche avancée.
function createTagElement (value) {
  // Récupérer le conteneur de tags dans le DOM.
  const tagsContainer = document.getElementById('tags-container')
  // Vérifier si un tag avec cette valeur existe déjà. Si non, le créer.
  if (!tagsContainer.querySelector(`.tag[data-value="${value}"]`)) {
    // Créer un élément <div> pour représenter le tag.
    const tagElement = document.createElement('div')
    tagElement.classList.add('tag') // Ajouter la classe 'tag' pour le style.
    tagElement.dataset.value = value // Définir l'attribut data-value pour stocker la valeur du tag.
    tagElement.innerText = value // Définir le texte du tag.

    // Créer un bouton pour permettre la suppression du tag.
    const removeButton = createRemoveButtonElement()
    // Ajouter un gestionnaire d'événements pour supprimer le tag et mettre à jour les recettes filtrées.
    removeButton.addEventListener('click', () => {
      tagElement.remove() // Supprimer le tag du DOM.
      filterRecipes() // Filtrer les recettes à nouveau.
    })

    // Ajouter le bouton de suppression au tag.
    tagElement.appendChild(removeButton)
    // Ajouter le tag au conteneur de tags.
    tagsContainer.appendChild(tagElement)
    // Filtrer les recettes après avoir ajouté le tag.
    filterRecipes()
  }
}

// Fonction pour créer un bouton de suppression de tag.
function createRemoveButtonElement () {
  // Créer un élément <span> pour représenter le bouton de suppression.
  const removeButton = document.createElement('span')
  removeButton.classList.add('remove-tag') // Ajouter la classe 'remove-tag' pour le style.
  // Définir le contenu HTML du bouton avec une icône de croix.
  removeButton.innerHTML = '<img src="assets/icons/croixtags.svg" alt="Remove tag" width="16" height="16">'
  removeButton.style.cursor = 'pointer' // Changer le curseur pour indiquer que c'est cliquable.
  return removeButton // Retourner l'élément bouton créé.
}

// Fonction pour filtrer les options des listes déroulantes en fonction de la recherche saisie.
function filterDropdownOptions (dropdown, query) {
  // Récupérer toutes les options de la liste déroulante.
  const options = dropdown.querySelectorAll('.option')
  // Pour chaque option, vérifier si elle correspond à la requête. Sinon, la masquer.
  options.forEach((option) => {
    option.style.display = option.innerText.toLowerCase().includes(query) ? '' : 'none'
  })
}
