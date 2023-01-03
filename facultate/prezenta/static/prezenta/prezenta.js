"use strict";
const e = React.createElement;

// 		To use hooks
// ---------------------- //
// |     !important     | //
// ---------------------- //
const { useState } = React;

// Materie id
const materie_id = JSON.parse(
	document.getElementById("materie_id").textContent
);

// Check if it a profesor
const value = JSON.parse(document.getElementById("profesor").textContent);

// Get title string from the course presence
const infoGroup = document.querySelector(".info-group");
const grupa = JSON.parse(document.getElementById("grupa").textContent);

// Get the number out of the string
const string = infoGroup.innerHTML;
const grupa_int = string.match(/(\d+)/);
const groupNumber = JSON.parse(document.getElementById("grupa").textContent);

// Method of the course
var mySubString = string.split(", ");
const courseMethod = JSON.parse(document.getElementById("metoda").textContent);

// Name of the course
const course = string.split(", ");
const courseName = JSON.parse(document.getElementById("name").textContent);

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			DataisLoaded: false,
		};
	}

	// Get data from database, and render students later on based on conditions
	componentDidMount() {
		fetch("http://192.168.100.2:8001/api/prezenta/student/")
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				this.setState({
					data: data.results,
					DataisLoaded: true,
				});
			})
			.catch((error) => console.log(error));
	}

	render() {
		// Wait to load data
		const { DataisLoaded, data } = this.state;
		if (!DataisLoaded) {
			return (
				<div className="text-center">
					<h1> Please wait some time... or log-in</h1>
				</div>
			);
		} // If data is loaded
		return (
			<div className="container mt-1">
				<table className="table  table-striped">
					<TableHead />
					<TableBody rows={data} />
				</table>
			</div>
		);
	}
}

function TableHead() {
	return (
		<thead>
			<tr>
				<th className="align-middle text-center ">Nume</th>
				<th className="align-middle text-center ">Prenume</th>
				<th className="text-center align-middle ">Prezent</th>
			</tr>
		</thead>
	);
}

function TableBody(props) {
	let data = props.rows;
	if (data) {
		return (
			<tbody>
				{/* Render Students if they match the conditions */}
				{data.map((item) => {
					for (var i = 0; i < item.materii.length; i++) {
						if (
							item.materii[i].metoda_de_predare === courseMethod &&
							item.materii[i].nume_materie === courseName
						) {
							return (
								<Student
									key={item.id}
									nume={item.nume}
									prenume={item.prenume}
									student_id={item.id}
									materie={item.materii[i].id}
									profesor={item.materii[i].profesor}
									materie_open={item.materii[i].open}
								/>
							);
						}
					}
				})}
			</tbody>
		);
	}
}

//  Cum naiba adaug un counter pentru tr ?
//  R: add state

function Student(props) {
	return (
		<tr>
			<td scope="row" className="align-middle text-center ">
				{props.nume}
			</td>
			<td className="text-center align-middle ">{props.prenume}</td>
			<td className="text-center align-middle">
				<div className="">
					<UpdatePrezent
						student={props.student_id}
						materie={props.materie}
						materie_open={props.materie_open}
					/>
				</div>
			</td>
		</tr>
	);
}

class UpdatePrezent extends React.Component {
	constructor(props) {
		super(props);
		this.function = this.function.bind(this);
		this.getCookie = this.getCookie.bind(this);
		this.state = {
			isClicked: false,
			isStaff: value,
		};
	}

	// Combine the functions
	function() {
		this.setState(({ isClicked }) => ({
			isClicked: !isClicked,
		}));
		this.postPresence();
	}

	// Function to get csrf-token requested for POST method
	getCookie(name) {
		if (!document.cookie) {
			return null;
		}

		const xsrfCookies = document.cookie
			.split(";")
			.map((c) => c.trim())
			.filter((c) => c.startsWith(name + "="));

		if (xsrfCookies.length === 0) {
			return null;
		}
		return decodeURIComponent(xsrfCookies[0].split("=")[1]);
	}

	// Fetch data to database
	postPresence() {
		console.log(this.props.materie_open);
		if (this.state.isStaff === true || this.props.materie_open == true) {
			console.log("open");
			fetch("http://192.168.100.2:8001/api/prezenta/prezenta/", {
				method: "POST",
				include: "credentials",
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": this.getCookie("csrftoken"),
				},
				body: JSON.stringify({
					elev: this.props.student,
					materie: this.props.materie,
				}),
			}).catch((error) => console.log(error));
		} else if (this.props.materie_open !== true) {
			console.log("closed");
			fetch("http://192.168.100.2:8001/api/prezenta/asteptare/", {
				method: "POST",
				include: "credentials",
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": this.getCookie("csrftoken"),
				},
				body: JSON.stringify({
					student: this.props.student,
					materie: this.props.materie,
				}),
			}).catch((error) => console.log(error));
		}
	}

	render() {
		if (this.state.isClicked === false) {
			return (
				<button
					type="button"
					className="btn btn-success btn-set-prezent "
					id="btn-submit"
					onClick={this.function}
				>
					Prezent
				</button>
			);
		}
		if (!this.isStaff) {
			return (
				<div id="wrap">
					<svg
						className="checkmark fadeIn"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 52 52"
					>
						<circle
							className="checkmark-circle"
							cx="26"
							cy="26"
							r="25"
							fill="none"
						/>
						<path
							className="checkmark-check"
							fill="none"
							d="M14.1 27.2l7.1 7.2 16.7-16.8"
						/>
					</svg>
				</div>
			);
		}
		return (
			<div id="wrap">
				<svg
					className="checkmark fadeIn"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 52 52"
				>
					<circle
						className="checkmark-circle"
						cx="26"
						cy="26"
						r="25"
						fill="none"
					/>
					<path
						className="checkmark-check"
						fill="none"
						d="M14.1 27.2l7.1 7.2 16.7-16.8"
					/>
				</svg>
			</div>
		);
	}
}

const domContainer = document.querySelector("#prezenta");
ReactDOM.render(e(App), domContainer);
