import { filterRecipes } from '../algoritms/algorithme-n.js'

export function createTagElement (value) {
  const tagsContainer = document.getElementById('tags-container')

  if (!tagsContainer) {
    console.error("Le conteneur des tags n'a pas été trouvé dans le DOM.")
    return
  }

  if (!tagsContainer.querySelector(`.tag[data-value="${value}"]`)) {
    const tagElement = document.createElement('div')
    tagElement.classList.add('tag')
    tagElement.dataset.value = value
    tagElement.innerText = value

    const removeButton = document.createElement('span')
    removeButton.classList.add('remove-tag')
    removeButton.innerHTML = '<img src="assets/icons/croixtags.svg" alt="Remove tag" width="16" height="16">'
    removeButton.style.cursor = 'pointer'

    removeButton.addEventListener('click', () => {
      tagElement.remove()
      filterRecipes()
    })

    tagElement.appendChild(removeButton)
    tagsContainer.appendChild(tagElement)
  }
}

// Explication détaillée des sections principales :
// Importation de filterRecipes :

// La fonction filterRecipes est importée pour être utilisée lorsque des tags sont ajoutés ou supprimés. Cela permet de mettre à jour dynamiquement la liste des recettes affichées.
// Vérification et création du conteneur de tags :

// Le code vérifie d'abord si le conteneur des tags (#tags-container) est présent dans le DOM.
// Si le conteneur est absent, une erreur est affichée, et la fonction s'arrête.
// Éviter les doublons de tags :

// Avant de créer un nouveau tag, le code vérifie s'il n'existe pas déjà un tag avec la même valeur. Si c'est le cas, aucun nouveau tag n'est créé.
// Création du tag :

// Un nouvel élément div est créé pour représenter le tag.
// Un span est utilisé pour afficher le texte du tag, et un img est utilisé pour le bouton de suppression.
// Des classes CSS sont ajoutées pour le style.
// Gestionnaire d'événement de suppression :

// Un événement click est attaché au bouton de suppression. Lorsque l'utilisateur clique sur ce bouton, le tag est supprimé du DOM, et les recettes sont filtrées à nouveau pour refléter ce changement.
// Ajout du tag à l'interface :

// Enfin, le tag complet est ajouté au conteneur de tags visible par l'utilisateur.
