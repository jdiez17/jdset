import React from "react";
import { Nav, NavItem } from 'reactstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class Navigation extends React.Component {
	// render
	render() {
		return <Nav className="bar" pills>
			<LinkContainer className="navbar-brand" to="/">
				<NavItem>JD's SET</NavItem>
			</LinkContainer>
			<LinkContainer className="nav-link" to="/solar-panel-efficiency">
				<NavItem>Solar Panel Efficiency</NavItem>
			</LinkContainer>
			<LinkContainer className="nav-link" to="/orbital-parameter-simulator">
				<NavItem>Orbital Parameter Simulator</NavItem>
			</LinkContainer>
		</Nav>
	}
}
