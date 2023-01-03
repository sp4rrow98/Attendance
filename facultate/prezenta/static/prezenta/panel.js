// Materie
const materie = document.querySelector("#materie");
const materie_view = document.querySelector(".adauga_materie_view");
materie.addEventListener("click", toggle_materie);
// Helper
function delay(fn, ms) {
	let timer = 0;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(fn.bind(this, ...args), ms || 0);
	};
}

// names itself
function toggle_materie() {
	if (materie_view.style.display == "none") {
		materie_view.classList.remove("dissapear");
		materie_view.classList.add("appear");
		materie_view.style.display = "block";
	} else {
		materie_view.classList.remove("appear");
		materie_view.classList.add("dissapear");
		setTimeout(function () {
			materie_view.style.display = "none";
		}, 650);
	}
}

const profesor_materie = document.querySelector(".profesor_materie");
profesor_materie.addEventListener("click", toggle_profesor_view);
function toggle_profesor_view() {
	view = document.querySelector(".adauga_profesor_view");
	if (view.style.display == "none") {
		view.classList.remove("dissapear");
		view.classList.add("appear");
		view.style.display = "block";
	} else {
		view.classList.remove("appear");
		view.classList.add("dissapear");
		setTimeout(function () {
			view.style.display = "none";
		}, 650);
	}
}

materie_student = document.querySelector(".adauga_materie_student_view");
view_materie_student = document.querySelector("#materie_student");
view_materie_student.addEventListener("click", toggle_materie_student);

function toggle_materie_student() {
	if (materie_student.style.display == "none") {
		materie_student.classList.remove("dissapear");
		materie_student.classList.add("appear");
		materie_student.style.display = "block";
	} else {
		materie_student.classList.remove("appear");
		materie_student.classList.add("dissapear");
		setTimeout(function () {
			materie_student.style.display = "none";
		}, 650);
	}
}

const materie_grupa = document.querySelector("#materie_grupa");
const materie_grupa_view = document.querySelector(".adauga_materie_grupa_view");
// Materie unei grupe toggle
function toggle_materie_grupa() {
	if (materie_grupa_view.style.display == "block") {
		materie_grupa_view.classList.remove("appear");
		materie_grupa_view.classList.add("dissapear");
		setTimeout(function () {
			materie_grupa_view.style.display = "none";
		}, 650);
	} else {
		materie_grupa_view.classList.remove("dissapear");
		materie_grupa_view.style.display = "block";
		materie_grupa_view.classList.add("appear");
	}
}

// Fill the input with the student info in order to be processed
function umplere(text, input, materie, list, facultate) {
	// Clear materii
	while (materie.firstChild) {
		materie.firstChild.remove();
	}
	prescurtare = text.nodeValue;

	// Regex Specializare
	prescurtare = prescurtare.match(/\(([^)]+)\)/)[1];
	// Regex Minus Specializare
	test = text.nodeValue.replace(/ *\([^)]*\) */g, "");
	parent = materie;
	full = test.split(" ");
	nume = full.shift().toLowerCase();
	prenume = full.toString().toLowerCase();
	prenume = prenume.replace(",", " ");

	fetch("http://192.168.100.2:8001/api/prezenta/materie/")
		.then((data) => data.json())
		.then((results) => (results = results.results))
		.then((results) => {
			results.map((materie) => {
				// (student.prenume, prenume)
				if (materie.specializare.facultate.nume == facultate) {
					element = document.createElement("option");
					element.value = materie.id
					text = document.createTextNode(
						materie.nume_materie + " (" + materie.metoda_de_predare + ")" + ", " + materie.specializare.specializare_prescurtare + " anul " + materie.specializare.an
					);
					element.appendChild(text);
					parent.appendChild(element);
				}
				// if(student.nume.toLowerCase() == nume && student.prenume.toLowerCase() == prenume)
				// student.materii.map((materie) => {
				// })
			});
		});

	input.value = text.nodeValue;
	while (list.firstChild) {
		list.firstChild.remove();
	}
}

// Autofill materie_grupa fields

input1 = document.querySelector(".student");
input1.addEventListener(
	"keyup",
	delay(function (e) {
		autofill();
	}, 200)
);

function autofill() {
	options1 = document.querySelector(".student_adauga_materie");
	options2 = document.querySelector(".materie_adauga_student");
	if (input1.value) {
		while (options1.firstChild) {
			options1.firstChild.remove();
		}
		value = input1.value.toUpperCase();
		fetch("http://192.168.100.2:8001/api/prezenta/student/")
			.then((response) => response.json())
			.then((results) => {
				results = results.results;
				results.map((student) => {
					const facultate = student.specializare.facultate.nume
					full = student.nume + " " + student.prenume;
					full_inverse = student.prenume + " " + student.nume;
					full = full.toUpperCase();
					full_inverse = full_inverse.toUpperCase();
					if (full.indexOf(value) != -1 || full_inverse.indexOf(value) != -1) {
						// add to list
						var element = document.createElement("div");
						var space = document.createElement("div");
						var text = document.createTextNode(
							`${full} (${student.specializare.specializare_prescurtare})`
						);
						space.className = "col-3 space";
						element.className = "col-7" + " inactive-student";
						var div = document.createElement("div");
						div.className =
							"row justify-content-center align-items-center" +
							" autocomplete-items";
						element.appendChild(text);
						// add fill input function
						element.addEventListener("click", function () {
							umplere(text, input1, options2, options1, facultate);
						});

						div.appendChild(space);
						div.appendChild(element);
						options1.appendChild(div);

						const first = options1.firstChild;
						grand = first.lastChild;
						grand.classList.add("active-student");
						grand.classList.remove("inactive-student");
					}
				});
			});
	} else {
		while (options1.firstChild) {
			options1.firstChild.remove();
		}
	}
}

// Facultate toggle
const facultate = document.querySelector("#facultate");
const facultate_view = document.querySelector(".adauga_facultate_view");
facultate.addEventListener("click", toggle_facultate);

function toggle_facultate() {
	if (facultate_view.style.display == "none") {
		facultate_view.classList.remove("dissapear");
		facultate_view.classList.add("appear");
		facultate_view.style.display = "block";
	} else {
		facultate_view.classList.remove("appear");
		facultate_view.classList.add("dissapear");
		setTimeout(function () {
			facultate_view.style.display = "none";
		}, 650);
	}
}

// Specializare toggle
const specializare = document.querySelector("#specializare");
const specializare_view = document.querySelector(".adauga_specializare_view");
specializare.addEventListener("click", toggle_specializare);

function toggle_specializare() {
	if (specializare_view.style.display == "none") {
		specializare_view.classList.remove("dissapear");
		specializare_view.classList.add("appear");
		specializare_view.style.display = "block";
	} else {
		specializare_view.classList.remove("appear");
		specializare_view.classList.add("dissapear");
		setTimeout(function () {
			specializare_view.style.display = "none";
		}, 650);
	}
}

// Note toggle
const note = document.querySelector("#note");
const note_view = document.querySelector(".adauga_note_view");
note.addEventListener("click", toggle_note);

function toggle_note() {
	if (note_view.style.display == "none") {
		note_view.classList.remove("dissapear");
		note_view.classList.add("appear");
		note_view.style.display = "block";
	} else {
		note_view.classList.remove("appear");
		note_view.classList.add("dissapear");
		setTimeout(function () {
			note_view.style.display = "none";
		}, 650);
	}
}

// Search function
// Add error check to see if the element is already in the list

// Fill the input with the student info in order to be processed
function umple(text, input, materie, list) {
	// Regex Minus Specializare
	test = text.nodeValue.replace(/ *\([^)]*\) */g, "");
	parent = materie;

	full = test.split(" ");
	nume = full.shift().toLowerCase();
	prenume = full.toString().toLowerCase();

	console.log(full, nume, prenume);

	fetch("http://192.168.100.2:8001/api/prezenta/student/")
		.then((data) => data.json())
		.then((results) => {
			results = results.results;
			results.forEach((student) => {
				if (student.nume.toLowerCase() == nume) {
					materii = student.materii;
					materii.map((materie) => {
						element = document.createElement("option");
						element.setAttribute("value", materie.id);
						fill = document.createTextNode(
							`${materie.nume_materie} (${materie.metoda_de_predare})`
						);
						element.appendChild(fill);
						parent.appendChild(element);
					});
				}
			});
		});

	input.value = text.nodeValue;
	while (list.firstChild) {
		list.firstChild.remove();
	}
}

let input = document.querySelector("#student-input");
input.addEventListener(
	"keyup",
	delay(function (e) {
		search();
	}, 200)
);

// Search recommend
function search() {
	let parent = document.getElementById("student-list");
	let input = document.querySelector("#student-input");
	let filter = input.value.toUpperCase();
	let materie = document.querySelector("#materie-options");

	// Delete previous list
	while (parent.firstChild) {
		parent.firstChild.remove();
	}

	while (materie.firstChild) {
		materie.firstChild.remove();
	}
	// If input filter is empty
	if (!filter) {
		while (parent.firstChild) {
			parent.firstChild.remove();
		}
		while (materie.firstChild) {
			materie.firstChild.remove();
		}
	} else {
		// Get students data and display it
		fetch("http://192.168.100.2:8001/api/prezenta/student/")
			.then((response) => response.json())
			.then((students) => {
				result = students.results;
				result.forEach((student) => {
					// save student info
					var nume = student.nume.toUpperCase();
					var prenume = student.prenume.toUpperCase();
					var full = nume + " " + prenume;
					var full_inreverse = prenume + " " + nume;

					// if input is not empty
					if (
						full.indexOf(filter) > -1 ||
						full_inreverse.indexOf(filter) > -1
					) {
						// add to list
						var element = document.createElement("div");
						var space = document.createElement("div");
						var text = document.createTextNode(
							`${full} (${student.specializare.specializare_prescurtare})`
						);
						space.className = "col-3 space";
						element.className = "col-7" + " inactive-student";
						var div = document.createElement("div");
						div.className =
							"row justify-content-center align-items-center" +
							" autocomplete-items";
						element.appendChild(text);
						// add fill input function
						element.addEventListener(
							"click",
							delay(function (e) {
								umple(text, input, materie, parent);
							}, 200)
						);

						div.appendChild(space);
						div.appendChild(element);
						parent.appendChild(div);

						// highlight the first child student
						// let's hope students don't really have a first child at the supposed age.
						const first = parent.firstChild;
						grand = first.lastChild;
						grand.classList.add("active-student");
						grand.classList.remove("inactive-student");
					}
				});
			});
	}
}
