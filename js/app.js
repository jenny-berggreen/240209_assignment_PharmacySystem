// ------------------ INSERT OPTIONS IN SELECTS ------------------

// get elements from the DOM
const quantitySelect = document.querySelector('.quantity');
const ageSelect = document.querySelector('.age');
const refillsSelect = document.querySelector('.refills');

// quantity
for (let i = 0; i <= 400; i++) {
	let option = document.createElement('option');
	option.value = i;
	option.textContent = i;
	quantitySelect.append(option);
}