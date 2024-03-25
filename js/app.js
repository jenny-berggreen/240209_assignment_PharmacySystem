
// ----- GET ELEMENTS FROM THE DOM -----
const registerMedicineForm = document.querySelector('.register-medicine-form');

const nameInput = document.querySelector('.name');
const manufacturerInput = document.querySelector('.manufacturer');
const expirationDateInput = document.querySelector('.expiration-date');
const quantitySelect = document.querySelector('.quantity');

const radioButtons = document.querySelectorAll('.prescription-radio-button');
const ageSelect = document.querySelector('.age');
const refillsSelect = document.querySelector('.refills');

const registerButton = document.querySelector('.register-button');

const medicineList = document.querySelector('.medicine-list');

const viewDetailsWindow = document.querySelector('.view-details-window');
const closeDetailsWindowButton = document.querySelector('.close-button');


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

// ----- TOAST -----
const displayRegisteredToast = () => {
	const toast = document.querySelector('.toast');
	toast.classList.add('toast--registered');
	toast.textContent = 'Registered medicine!'
	toast.style.display = 'block';
	setTimeout(() => { // display toast for 5 seconds
		toast.style.display = 'none';
		toast.classList.remove('toast--registered');
	}, 5000);
	
}

const displayDeletedToast = () => {
	const toast = document.querySelector('.toast');
	toast.classList.add('toast--deleted');
	toast.textContent = 'Deleted medicine!'
	toast.style.display = 'block';
	setTimeout(() => { // display toast for 5 seconds
		toast.style.display = 'none';
		toast.classList.remove('toast--deleted');
	}, 5000);
	
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

closeDetailsWindowButton.addEventListener('click', ()=> {
	// hide details window
	viewDetailsWindow.style.display = 'none';
})

registerButton.addEventListener('click', (e)=> {
	e.preventDefault();

	// ---------------------- FORM VALIDATION ----------------------

	// remove existing required spans
    const existingRequiredSpans = document.querySelectorAll('.required-span');
    existingRequiredSpans.forEach(span => {
        span.remove();
    });

	// check if input fields are empty
	if(!nameInput.value || !manufacturerInput.value || !expirationDateInput.value) {
		// iterate through the inputs to find the ones that are empty
		const inputs = [nameInput, manufacturerInput, expirationDateInput];
		inputs.forEach(input => {
			if(!input.value) {
				const label = input.previousElementSibling; // select the label of the empty input
				const requiredSpan = document.createElement('span');
				requiredSpan.classList.add('required-span'); // add a class to identify required spans
				requiredSpan.textContent = ' Required!';
                requiredSpan.style.color = 'red';
                label.append(requiredSpan); // append the span next to the label
			}
		});
		return;
	}
	
	// ---------------------- END OF FORM VALIDATION ----------------------

	let newMedicine;

	// loop through radio buttons to find the selected one
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            if (radioButtons[i].value === 'no') {
                newMedicine = new Medicine(nameInput.value, manufacturerInput.value, expirationDateInput.value, quantitySelect.value, "No", ageSelect.value);
            } else {
                newMedicine = new PrescriptionMedicine(nameInput.value, manufacturerInput.value, expirationDateInput.value, quantitySelect.value, "Yes", refillsSelect.value);
            }
            break; // exit the loop once the selected radio button is found
        }
    }

	Medicine.addMedicine(newMedicine); // add medicine
	UI.renderMedicines(Medicine.getMedicines()); // display medicines

	// reset form
	registerMedicineForm.reset();
	refillsSelect.setAttribute('disabled', '');
	ageSelect.removeAttribute('disabled');

	displayRegisteredToast();
});

// load existing data from localStorage if it exists
const existingMedicines = localStorage.getItem('data');
const data = existingMedicines ? JSON.parse(existingMedicines) : [];

// ----- DECLARE MEDICINE CLASS -----
class Medicine {
	constructor(productName, manufacturer, expirationDate, quantity, prescription, ageLimit) {
		this.productName = productName;
		this.manufacturer = manufacturer;
		this.expirationDate = expirationDate;
		this.quantity = quantity;
		this.prescription = prescription;
		this.ageLimit = ageLimit;
		this.id = Date.now();
	}

	// retrieve medicines from local storage
	static getMedicines() {
		const existingMedicines = localStorage.getItem('data');
		return existingMedicines ? JSON.parse(existingMedicines) : [];
    }

	// add method
	static addMedicine(medicine) {
		const medicines = Medicine.getMedicines(); // retrieve existing medicines
		medicines.push(medicine);

		// put data in local storage
		localStorage.setItem('data', JSON.stringify(medicines));
	}

	// delete method
	static deleteMedicine(id, medicines) {
		const index = medicines.findIndex(medicine => medicine.id.toString() === id.toString());
		if(index !== -1) {
			medicines.splice(index, 1);
			// update local storage
			localStorage.setItem('data', JSON.stringify(medicines));
			UI.renderMedicines(Medicine.getMedicines());
		}
	}
}

// ----- DECLARE PRESCRIPTION MEDICINE CLASS -----
class PrescriptionMedicine extends Medicine {
	constructor(productName, manufacturer, expirationDate, quantity, prescription, refills) {
		super(productName, manufacturer, expirationDate, quantity, prescription)
		this.refills = refills;
		this.id = Date.now();
	}
}

// ----- DECLARE UI CLASS -----
class UI {
	static renderMedicines(medicines) {
		// clear the medicine list
		medicineList.textContent = '';
		
		// iterate over each medicine
		medicines.forEach((medicine) => {
			// create elements
			const liRow = document.createElement('li');
			liRow.classList.add('medicine-list__row', 'flex');

			const renderedName = document.createElement('span');
			const renderedManufacturer = document.createElement('span');
			const renderedExpirationDate = document.createElement('span');
			const renderedQuantity = document.createElement('span');
			const renderedPrescription = document.createElement('span');
			const renderedAgeLimit = document.createElement('span');
			const renderedRefills = document.createElement('span');

			const buttonsContainer = document.createElement('span');
			const viewButton = document.createElement('button');
			const deleteButton = document.createElement('button');

			buttonsContainer.classList.add('flex', 'flex-row');
			buttonsContainer.id = 'medicine-list-row__buttons-container';
			viewButton.classList.add('view-button');
			deleteButton.classList.add('delete-button');

			// insert text contents
			renderedName.textContent = medicine.productName;
			renderedManufacturer.textContent = medicine.manufacturer;
			renderedExpirationDate.textContent = medicine.expirationDate;
			renderedQuantity.textContent = medicine.quantity;
			renderedPrescription.textContent = medicine.prescription;
			viewButton.textContent = 'View details';
			deleteButton.textContent = 'Delete';

			if(medicine.prescription === 'No') {
				renderedAgeLimit.textContent = medicine.ageLimit;
				renderedRefills.textContent = '––';
			} else {
				renderedAgeLimit.textContent = '––';
				renderedRefills.textContent = medicine.refills;
			}

			// make sure that the row ID and medicine ID correlate
			liRow.dataset.id = medicine.id;

			// append elements
			medicineList.append(liRow);
			liRow.append(renderedName, renderedManufacturer, renderedExpirationDate, renderedQuantity, renderedPrescription, renderedAgeLimit, renderedRefills, buttonsContainer);
			buttonsContainer.append(viewButton, deleteButton);

			// delete button event listener
			deleteButton.addEventListener('click', (e) => {
				// get the row ID
				const rowID = e.currentTarget.parentElement.parentElement.dataset.id;

				// delete medicine
				Medicine.deleteMedicine(rowID, Medicine.getMedicines());

				// display toast
				displayDeletedToast();
			})

			// view button event listener
			viewButton.addEventListener('click', (e) => {
				// display details window
				viewDetailsWindow.style.display = 'flex';

				// get the row ID
				const rowID = e.currentTarget.parentElement.parentElement.dataset.id;

				// get the medicine details from the medicine array
				const medicines = Medicine.getMedicines();
				const selectedMedicine = medicines.find(medicine => medicine.id.toString() === rowID.toString());

				// display medicine details in the details window
				displayMedicineDetails(selectedMedicine);
			})
			
		})
	}
}

UI.renderMedicines(Medicine.getMedicines());

// function to display medicine details
const displayMedicineDetails = (medicine) => {
    const detailsWindowMedicineList = document.querySelector('.view-details-window__medicine-list');
    
    // clear previous content
    detailsWindowMedicineList.innerHTML = '';

    // array of medicine properties
    const properties = [
        { label: 'Product name: ', value: medicine.productName },
        { label: 'Manufacturer: ', value: medicine.manufacturer },
        { label: 'Expiration date: ', value: medicine.expirationDate },
        { label: 'Quantity: ', value: medicine.quantity },
        { label: 'Prescription: ', value: medicine.prescription },
        { label: 'Age limit: ', value: (medicine.prescription === 'No' ? medicine.ageLimit : '––') },
        { label: 'Refills: ', value: (medicine.prescription === 'No' ? '––' : medicine.refills) }
    ];

    // loop through array
    properties.forEach(property => {
        const listItem = document.createElement('li');
        const labelElement = document.createElement('span');
        labelElement.textContent = property.label;
        labelElement.classList.add('medicine-list-label');

        listItem.appendChild(labelElement);
        listItem.appendChild(document.createTextNode(property.value));

        detailsWindowMedicineList.appendChild(listItem);
    });
}
