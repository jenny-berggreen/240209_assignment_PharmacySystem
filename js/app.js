const medicines = [];
const prescriptionMedicines = [];

// ----- GET ELEMENTS FROM THE DOM -----
const nameInput = document.querySelector('.name');
const idInput = document.querySelector('.id');
const manufacturerInput = document.querySelector('.manufacturer');
const quantitySelect = document.querySelector('.quantity');

const radioButtons = document.querySelectorAll('.prescription-radio-button');
const ageSelect = document.querySelector('.age');
const refillsSelect = document.querySelector('.refills');

const submitButton = document.querySelector('.submit-button');


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
		if (button.value === 'no') {
			refillsSelect.setAttribute('disabled', '');
			ageSelect.removeAttribute('disabled');
		} else {
			ageSelect.setAttribute('disabled', '');
			refillsSelect.removeAttribute('disabled');
		}
	})
});

submitButton.addEventListener('click', (e)=> {
	e.preventDefault();

	let newMedicine;

	// loop through radio buttons to find the selected one
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            if (radioButtons[i].value === 'no') {
                newMedicine = new Medicine(nameInput.value, idInput.value, manufacturerInput.value, quantitySelect.value, radioButtons[i].value, ageSelect.value);
            } else {
                newMedicine = new PrescriptionMedicine(nameInput.value, idInput.value, manufacturerInput.value, quantitySelect.value, radioButtons[i].value, refillsSelect.value);
            }
            // break out of the loop once the selected radio button is found
            break;
        }
    }

	Medicine.addMedicine(newMedicine);
	console.log(newMedicine);
	console.log(medicines);
	console.log(prescriptionMedicines);
})

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
		if (medicine.prescription === 'no') {
			medicines.push(medicine);
		} else {
			prescriptionMedicines.push(medicine);
		}
	}
}

// ----- DECLARING PRESCRIPTION MEDICINE CLASS -----
class PrescriptionMedicine extends Medicine {
	constructor(productName, id, manufacturer, quantity, prescription, refills) {
		super(productName, id, manufacturer, quantity, prescription)
		this.refills = refills;
	}
}