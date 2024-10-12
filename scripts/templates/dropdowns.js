// dropdowns.js
const dropDowns = document.querySelectorAll('.dropDown')
const masques = document.querySelectorAll("[id^='masque']")

function addDropdownEventListeners (dropDown) {
  const input = dropDown.querySelector('.recherche')
  if (input) {
    const errorContainer = document.createElement('div')
    errorContainer.className = 'error-message'
    input.parentNode.insertBefore(errorContainer, input.nextSibling)

    input.addEventListener('input', debounce((e) => {
      dropDown.dataset.searchValue = e.target.value
      filterDropdownOptions(dropDown, e.target.value, errorContainer)
    }, 300))

    dropDown.addEventListener('toggle', () => {
      if (dropDown.open) {
        input.value = dropDown.dataset.searchValue || ''
        filterDropdownOptions(dropDown, input.value, errorContainer)
      }
    })
  }
}

dropDowns.forEach(addDropdownEventListeners)

masques.forEach((masque, index) => {
  masque.addEventListener('click', (e) => {
    e.stopPropagation()
    dropDowns[index].open = false
  })
})

document.querySelectorAll('.dropDown > .options > *').forEach(option => {
  option.addEventListener('click', (e) => {
    e.stopPropagation()
    const parentDropDown = e.target.closest('.dropDown')
    parentDropDown.open = true
  })
})

document.querySelectorAll('.option-search').forEach(optionSearchInput => {
  optionSearchInput.addEventListener('click', (e) => {
    e.stopPropagation()
  })
})

function filterDropdownOptions (dropdown, query, errorContainer) {
  const options = dropdown.querySelectorAll('.option')
  let found = false

  options.forEach(option => {
    const text = option.innerText.toLowerCase()
    if (text.includes(query.toLowerCase())) {
      option.style.display = ''
      found = true
    } else {
      option.style.display = 'none'
    }
  })

  errorContainer.textContent = found ? '' : `Aucun mot-clé ne correspond à "${query}".`
}

function debounce (func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}
