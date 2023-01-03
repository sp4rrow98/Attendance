"use strict";

// Create React element
// const e = React.createElement;
// Hooks

const { useState } = React;

//  Classes / functions
//                     |
//                    \/
//                    .

const api_facultate = "http://192.168.100.2:8001/api/prezenta/facultate/";
const api_materie = "http://192.168.100.2:8001/api/prezenta/materie/";
const api_specializare = "http://192.168.100.2:8001/api/prezenta/specializare/";
const api_prezenta = "http://192.168.100.2:8001/api/prezenta/prezenta/";
const api_student = "http://192.168.100.2:8001/api/prezenta/student/";
const api_grades = "http://192.168.100.2:8001/api/prezenta/grades/";
const api = "http://192.168.100.2:8001/api/prezenta/student/?page=";
let allData = [];

class Catalog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			idSelected: null,
			facultati: [],
			specializare: [],
			isLoaded: false,
		};
	}

	componentDidMount() {
		this._isMounted = true;
		fetch(api_facultate)
			//
			.then((res1) => res1.json())
			.then((res1) => {
				if(this._isMounted){
				this.setState({
					idSelected: null,
					facultati: res1.results,
					isLoaded: true,
				})};
			})
			.catch((err) => console.log(err));
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	toggleSelected = (id) => {
		if (this.state.idSelected === id) {
			return this.setState({ ...this.state, idSelected: null });
		}
		this.setState({ ...this.state, idSelected: id });
	};

	render() {
		const { facultati, isLoaded } = this.state;
		if (!isLoaded) {
			return (
				<div className="p-2">
					<div className="sk-chase ms-auto me-auto">
						<div className="sk-chase-dot  ms-auto me-auto"></div>
						<div className="sk-chase-dot  ms-auto me-auto"></div>
						<div className="sk-chase-dot  ms-auto me-auto"></div>
						<div className="sk-chase-dot  ms-auto me-auto"></div>
						<div className="sk-chase-dot  ms-auto me-auto"></div>
						<div className="sk-chase-dot  ms-auto me-auto"></div>
					</div>
				</div>
			);
		}

		return (
			<div className="margin-catalog">
				{facultati.map((facultate) => {
					if (
						this.state.idSelected === facultate.id ||
						this.state.idSelected === null
					) {
						return (
							<div className="container" key={facultate.id}>
								<Facultate
									key={facultate}
									toggle={() => this.toggleSelected(facultate.id)}
									name={facultate.nume}
								></Facultate>
							</div>
						);
					}
					return null;
				})}
			</div>
		);
	}
}

class Facultate extends React.Component {
	_isMounted = false;
	constructor(props) {
		super(props);
		this.state = {
			specializari: [],
			visible: null,
			isDataLoaded: false,
		};
		this.toggle = this.toggle.bind(this);
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		// this.fetchPages(api, 1);
		fetch(api_specializare)
			.then((res) => res.json())
			.then((data) => {
				if (this._isMounted) {
					this.setState({
						specializari: data.results,
						isDataLoaded: true,
					});
				}
			})
			.catch((err) => console.log(err));
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	toggle() {
		this.setState((prevState) => ({
			visible: !prevState.visible,
		}));
	}

	onClick() {
		this.props.toggle();
		this.toggle();
	}

	renderClass(visible) {
		if (visible === null) return "hidden-container";
		if (visible === true) return "appear";
		if (visible === false) return "dissapear";
	}

	render() {
		const { visible, isDataLoaded, specializari } = this.state;
		{
			if (!isDataLoaded)
				return (
					<div className="p-2">
						<div className="sk-chase ms-auto me-auto">
							<div className="sk-chase-dot  ms-auto me-auto"></div>
							<div className="sk-chase-dot  ms-auto me-auto"></div>
							<div className="sk-chase-dot  ms-auto me-auto"></div>
							<div className="sk-chase-dot  ms-auto me-auto"></div>
							<div className="sk-chase-dot  ms-auto me-auto"></div>
							<div className="sk-chase-dot  ms-auto me-auto"></div>
						</div>
					</div>
				);
		}
		return (
			<div className="bordered mt-2">
				<div
					onClick={this.onClick}
					className={
						visible
							? "hoveredState d-flex justify-content-between align-items-center"
							: "header-university d-flex justify-content-between align-items-center" +
							  " d-flex justify-content-between align-items-center"
					}
				>
					<p className="no-indent mt-3 ms-1">Facultatea {this.props.name}</p>
					{!visible ? (
						<i className="fa-solid fa-angles-down me-2"></i>
					) : (
						<i className="fa-solid fa-angle-up me-2"></i>
					)}
				</div>
				<div className="">
					{specializari.map((specializare, id) => {
						if (specializare.facultate.nume == this.props.name) {
							return (
								<Specializare
									key={id}
									specializare={specializare.specializare}
									prescurtare={specializare.prescurtare}
									grupa={specializare.grupa}
									className={this.renderClass(this.state.visible)}
									facultate={this.props.name}
									id={specializare.id}
								/>
							);
						}
					})}
				</div>
			</div>
		);
	}
}

class Specializare extends React.Component {
	constructor(props) {
		super(props);
		this.renderClass = this.renderClass.bind(this);
		this.toggle = this.toggle.bind(this);
		this.mapping = this.mapping.bind(this);
		this.state = {
			visible: null,
			materii: [],
		};
	}

	componentDidMount() {
		this._isMounted = true;
		fetch(api_materie)
			.then((res) => res.json())
			.then((data) => {
				if (this._isMounted) {
					this.setState({
						materii: data.results,
					});
				}
			})
			.catch((err) => console.log(err));
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	renderClass(visible) {
		if (this.props.className == "dissapear") {
			return "dissapear";
		}
		if (visible === null) return "d-none hidden-container";
		if (visible === true) return "appear";
		if (visible === false) return "dissapear";
	}

	toggle() {
		this.setState((prevState) => ({
			visible: !prevState.visible,
		}));
	}

	mapping() {
		return this.state.materii.map((materie) => {
			if (this.props.id == materie.specializare.id)
				return (
					<div
						key={materie.id}
						className={this.renderClass(this.state.visible)}
					>
						<Materie
							grupa={materie.grupa}
							materie={materie.nume_materie}
							metoda_de_predare={materie.metoda_de_predare}
							className={this.renderClass(this.state.visible)}
							facultate={this.props.facultate}
							durata={materie.durata_predare}
							materie_id={materie.id}
						/>
					</div>
				);
		});
	}

	render() {
		return (
			<div className={this.props.className}>
				<div className={this.props.className} onClick={this.toggle}>
					<div
						className={`header-university specializare-distancing d-flex justify-content-between align-items-center ${
							this.state.visible ? "hoveredState" : " "
						}`}
					>
						<p className="no-indent ms-2">
							{this.props.specializare} (grupa {this.props.grupa})
						</p>
						{!this.state.visible ? (
							<i className={"fa-solid fa-angle-down mb-3 me-2"}></i>
						) : (
							<i className={"fa-solid fa-angles-up mb-3 me-2"}></i>
						)}
					</div>
				</div>
				{this.mapping()}
			</div>
		);
	}
}

class Materie extends React.Component {
	constructor(props) {
		super(props);
		this.setVisible = this.setVisible.bind(this);
		this.renderClass = this.renderClass.bind(this);
		this.state = {
			visible: null,
		};
	}

	componentDidMount() {
		this._isMounted = true;
		if(this._isMounted === null) {
			this.setState((prev) => {prev.visible == null})
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	setVisible() {
		this.setState((prevState) => ({
			visible: !prevState.visible,
		}));
	}


	renderClass(state) {
		if (state === null) return "hidden-container";
		if (state === false) return "dissapear";
		if (state === true) return "appear";
	}

	content() {
		return (
			<div
				className={
					this.props.className +
					" specializare-distancing d-flex justify-content-between align-items-center"
				}
				onClick={this.setVisible}
			></div>
		);
	}

	render() {
		return (
			<div className="container-prezenta">
				<a href={`prezenta/${this.props.materie_id}`} className="nodecorator">
					<div
						className={
							this.props.className +
							" specializare-distancing d-flex justify-content-between align-items-center " +
							(this.state.visible ? " hoveredState " : "  ")
						}
						onClick={this.setVisible}
					>
						<p className="no-indent ms-2">
							({this.props.metoda_de_predare}) {this.props.materie}
						</p>
						<i className="fa-solid fa-arrow-right me-2 mb-3"></i>
					</div>
				</a>
			</div>
		);
	}
}

const domContainer = document.querySelector("#facultati");
ReactDOM.render(<Catalog />, domContainer);
