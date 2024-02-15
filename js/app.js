const medicines = [];

// ----- GET ELEMENTS FROM THE DOM -----
const quantitySelect = document.querySelector('.quantity');
const ageSelect = document.querySelector('.age');
const refillsSelect = document.querySelector('.refills');

const radioButtons = document.querySelectorAll('.prescription-radio-button');

// ----- INSERT OPTIONS IN SELECTS -----
// quantity
for (let i = 0; i <= 400; i++) {
	let option = document.createElement('option');
	option.value = i;
	option.textContent = i;
	quantitySelect.append(option);
}

// age limit
for (let i = 0; i <= 100; i++) {
	let option = document.createElement('option');
	option.value = i;
	option.textContent = i;
	ageSelect.append(option);
}

// refills
for (let i = 0; i <= 10; i++) {
	let option = document.createElement('option');
	option.value = i;
	option.textContent = i;
	refillsSelect.append(option);
}

// ----- EVENT LISTENERS -----
radioButtons.forEach(button => {
	button.addEventListener('change', ()=> {
		if (button.id === 'radio-no') {
			refillsSelect.setAttribute('disabled', '');
			ageSelect.removeAttribute('disabled');
		} else {
			ageSelect.setAttribute('disabled', '');
			refillsSelect.removeAttribute('disabled');
		}
	})
});

// ----- DECLARING MEDICINE CLASS -----
class Medicine {
	constructor(productName, id, manufacturer, quantity, prescription, ageLimit) {
		this.productName = productName;
		this.id = id;
		this.manufacturer = manufacturer;
		this.quantity = quantity;
		this.prescription = prescription;
		this.ageLimit = ageLimit;
	}

	// add method
	static addMedicine(medicine) {
		medicines.push(medicine);
	}
}

// ----- DECLARING PRESCRIPTION MEDICINE CLASS -----
class PrescriptionMedicine extends Medicine {
	constructor(productName, id, manufacturer, quantity, prescription, refills) {
		super(productName, id, manufacturer, quantity, prescription)
		this.refills = refills;
	}
}