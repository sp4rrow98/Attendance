"use strict";

const { useState } = React;

// API
const api_asteptare = "http://192.168.100.2:8001/api/prezenta/asteptare/";
const api_prezenta = "http://192.168.100.2:8001/api/prezenta/prezenta/";

// Materie id view
const materie_id = JSON.parse(
	document.querySelector("#materie_id").textContent
);

// Components/Functions

// Main class component
class App extends React.Component {
	constructor(props) {
		super(props);
		this.allow = this.allow.bind(this);
		this.state = {
			asteptari: [],
			isLoaded: false,
			open: null,
		};
	}

	// Get data and update state
	componentDidMount() {
		// Fix fetching
		this._isMounted = true;
		fetch(api_asteptare)
			.then((data) => data.json())
			.then((results) => {
				if (this._isMounted) {
					this.setState({
						asteptari: results.results,
						isLoaded: true,
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	// Fix error
	componentWillUnmount() {
		this._isMounted = false;
	}

	allow() {
		this.setState((prevstate) => ({
			open: !prevstate.open,
		}));
	}

	// View
	render() {
		if (this.state.isLoaded && this.state.open == null) {
			return (
				<div className="row d-flex justify-content-center">
					<button
						className="btn  btn-primary  btn-lg btn-block text-center mt-2"
						onClick={this.allow}
					>
						Cereri
					</button>
				</div>
			);
		} else if (this.state.open == false) {
			return (
				<div className="row d-flex justify-content-center">
					<button
						className="btn  btn-secondary  btn-lg btn-block text-center mt-2"
						onClick={this.allow}
					>
						Cereri
					</button>
				</div>
			);
		} else {
			return (
				<div className="row d-flex justify-content-center">
					<button
						className="btn  btn-danger  btn-lg btn-block text-center mt-2"
						onClick={this.allow}
					>
						Cereri
					</button>
					<Table asteptari={this.state.asteptari} />
				</div>
			);
		}
	}
}

class Table extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			asteptari: [],
		};
	}

	componentDidMount() {
		// Fix fetching
		this._isMounted = true;
		if (this._isMounted) {
			this.setState({
				isLoaded: true,
				asteptari: this.props.asteptari,
			});
		}
	}

	// Fix error
	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		if (this.state.isLoaded) {
			return <Title asteptari={this.state.asteptari} />;
		}
		return null;
	}
}

function Title(props) {
	return (
		<table className="table table-striped">
			<thead>
				<tr>
					<th className="align-middle text-center">Nume</th>
					<th className="align-middle text-center">Preume</th>
					<th className="text-center align-middle">Accept</th>
				</tr>
			</thead>
			<tbody>
				<Item asteptari={props.asteptari} />
			</tbody>
		</table>
	);
}

class Item extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			asteptari: this.props.asteptari,
		};
	}

	render() {
		const asteptari = this.state.asteptari;
		return asteptari.map((asteptare) => {
			if (asteptare.materie.id === materie_id) {
				return <Row key={asteptare.id} asteptare={asteptare} />;
			}
			return null;
		});
	}
}

class Row extends React.Component {
	constructor(props) {
		super(props);
		this.accept = this.accept.bind(this);
		this.toggle = this.toggle.bind(this);
		this.delete = this.delete.bind(this)
		this.state = {
			asteptare: this.props.asteptare,
			visible: true,
		};
	}

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

	// Toggle
	toggle() {
		this.setState({ visible: !this.state.visible });
	}

	// accept the attendance
	accept() {
		// Update state
		this.toggle();

		// Post attendace
		fetch(api_prezenta, {
			method: "POST",
			include: "credentials",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": this.getCookie("csrftoken"),
			},
			body: JSON.stringify({
				elev: this.state.asteptare.student.id,
				materie: this.state.asteptare.materie.id,
			}),
		}).catch((error) => console.log(error));

		// Delete request for attendace
		fetch(api_asteptare + this.state.asteptare.id, {
			method: "DELETE",
			include: "credentials",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": this.getCookie("csrftoken"),
			}
		})
		this.delete()
	}

	delete() {
		// Remove
		this.toggle();
		// Delete request for attendace
		fetch(api_asteptare + this.state.asteptare.id, {
			method: "DELETE",
			include: "credentials",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": this.getCookie("csrftoken"),
			}
		})
	}

	render() {
		console.log(this.state.visible);
		if (this.state.visible == true) {
			return (
				<tr>
					<td className="align-middle text-center">
						{this.state.asteptare.student.nume}
					</td>
					<td className="align-middle text-center">
						{this.state.asteptare.student.prenume}
					</td>
					<td className="text-center align-middle">
						<i
							className="fa-regular fa-circle-check fa-xl"
							onClick={this.accept}
						></i>
						<i className="fa-solid fa-ban ms-2 fa-xl" onClick={this.delete}></i>
					</td>
				</tr>
			);
		}
		return null;
	}
}

class Asteptare extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
}

// DOM Container
const domContainer = document.querySelector("#lista_asteptare");
ReactDOM.render(<App />, domContainer);
