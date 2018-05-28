import React from "react";
import { Nav, NavItem } from 'reactstrap';
import { LinkContainer } from 'react-router-bootstrap';

import modules from '../modules';

const links = modules.map((module) =>
  <LinkContainer className="nav-link" key={module.path} to={module.path}>
    <NavItem>{module.name}</NavItem>
  </LinkContainer>);

export default class Navigation extends React.Component {
	// render
	render() {
		return <Nav className="bar" pills>
			<LinkContainer className="navbar-brand" to="/">
				<NavItem>JD's SET</NavItem>
      </LinkContainer>
      {links}
		</Nav>
	}
}
