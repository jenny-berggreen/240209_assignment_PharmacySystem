const medicines = [];
// const prescriptionMedicines = [];

// ----- GET ELEMENTS FROM THE DOM -----
const nameInput = document.querySelector('.name');
const idInput = document.querySelector('.id');
const manufacturerInput = document.querySelector('.manufacturer');
const expirationDateInput = document.querySelector('.expiration-date');
const quantitySelect = document.querySelector('.quantity');

const radioButtons = document.querySelectorAll('.prescription-radio-button');
const ageSelect = document.querySelector('.age');
const refillsSelect = document.querySelector('.refills');

const submitButton = document.querySelector('.submit-button');

const medicineList = document.querySelector('.medicine-list');


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
                newMedicine = new Medicine(nameInput.value, idInput.value, manufacturerInput.value, expirationDateInput.value, quantitySelect.value, "No", ageSelect.value);
            } else {
                newMedicine = new PrescriptionMedicine(nameInput.value, idInput.value, manufacturerInput.value, expirationDateInput.value, quantitySelect.value, "Yes", refillsSelect.value);
            }
            // break out of the loop once the selected radio button is found
            break;
        }
    }

	Medicine.addMedicine(newMedicine);
	UI.renderMedicines(medicines);

	console.log(newMedicine);
	console.log(medicines);
})

// ----- DECLARING MEDICINE CLASS -----
class Medicine {
	constructor(productName, id, manufacturer, expirationDate, quantity, prescription, ageLimit) {
		this.productName = productName;
		this.id = id;
		this.manufacturer = manufacturer;
		this.expirationDate = expirationDate;
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
	constructor(productName, id, manufacturer, expirationDate, quantity, prescription, refills) {
		super(productName, id, manufacturer, expirationDate, quantity, prescription)
		this.refills = refills;
	}
}

// ----- DECLARING UI CLASS -----
class UI {
	static renderMedicines(medicines) {
		medicineList.textContent = '';
		
		medicines.forEach((medicine) => {
			// create elements
			const liRow = document.createElement('li');

			const renderedName = document.createElement('span');
			const renderedID = document.createElement('span');
			const renderedManufacturer = document.createElement('span');
			const renderedExpirationDate = document.createElement('span');
			const renderedQuantity = document.createElement('span');
			const renderedPrescription = document.createElement('span');
			const renderedAgeLimit = document.createElement('span');
			const renderedRefills = document.createElement('span');

			const deleteButtonContainer = document.createElement('span');
			const deleteButton = document.createElement('button');

			// insert text contents
			renderedName.textContent = medicine.productName;
			renderedID.textContent = medicine.id;
			renderedManufacturer.textContent = medicine.manufacturer;
			renderedExpirationDate.textContent = medicine.expirationDate;
			renderedQuantity.textContent = medicine.quantity;
			renderedPrescription.textContent = medicine.prescription;
			deleteButton.textContent = 'Delete';

			if(medicine.prescription === 'no') {
				renderedAgeLimit.textContent = medicine.ageLimit;
				renderedRefills.textContent = 'U+2013';
			} else {
				renderedAgeLimit.textContent = 'U+2013';
				renderedRefills.textContent = medicine.refills;
			}

			liRow.classList.add('books-row');
			deleteButton.classList.add('button--red');

			liRow.dataset.id = medicine.id;

			medicineList.append(liRow);
			liRow.append(renderedName, renderedID, renderedManufacturer, renderedExpirationDate, renderedQuantity, renderedPrescription, renderedAgeLimit, renderedRefills, deleteButtonContainer);
			deleteButtonContainer.append(deleteButton);
		})
	}
}