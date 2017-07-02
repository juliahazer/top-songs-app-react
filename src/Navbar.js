import React, { Component } from 'react';
import {
  Navbar as NavbarBS,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from 'react-bootstrap';
import './Navbar.css';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeName: 'All',
      activeGenre: 0,
      activeSubcategory: false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (e) => {
    e.preventDefault();
    let activeName = e.target.name;
    let activeGenre = +(e.target.attributes.getNamedItem('data').value);
    let activeSubcategory = false;
    this.props.subCategories.forEach(subCategory => {
      if (subCategory.genre === activeGenre) {
        activeSubcategory = true;
      }
    })
    this.setState({activeName, activeGenre, activeSubcategory}, () => {
      this.props.clickAction(this.state.activeName, this.state.activeGenre);
    });
  }

  render() {
    let mapCategories = cat => {
      let name = cat.name.toLowerCase();
      let active = "";
      if (this.state.activeGenre === cat.genre) {
        active = "active";
      }
      if (cat.mainCategory) {
        return (
          <NavItem
            onClick={this.handleClick}
            name={name}
            key={cat.name}
            href=""
            className={active + " NavItem category"}
            data={cat.genre}>
            {cat.name}
          </NavItem>
        );
      } else {
        return (
          <MenuItem
            onClick={this.handleClick}
            key={name}
            name={name}
            href=""
            data={cat.genre}>
            {cat.name}
          </MenuItem>
        );
      }
    }

    let categories = this.props.mainCategories.map(mapCategories);
    let subcategories = this.props.subCategories.map(mapCategories);
    let dropdownClass = '';
    if (this.state.activeSubcategory) {
      dropdownClass = " activeDropdown"
    }

    return (
      <div>
      <NavbarBS className="NavbarBS" inverse fixedTop>
        <NavbarBS.Header>
          <NavbarBS.Brand>
            <a className="navbarBrand" onClick="">Top Songs</a>
          </NavbarBS.Brand>
          <NavbarBS.Toggle />
        </NavbarBS.Header>

        <NavbarBS.Collapse id="bs-example-navbar-collapse-1">
          <Nav>
            {categories}

            <NavDropdown
              title='Other'
              key='Other'
              id='dropdown-basic-other'
              className={"NavDropdown " + dropdownClass + " subcategory"}>
              {subcategories}
            </NavDropdown>
          </Nav>
        </NavbarBS.Collapse>
      </NavbarBS>
      </div>
    )
  }
}

Navbar.defaultProps =  {
  mainCategories: [
      { name: 'All', genre: 0, mainCategory: true },
      { name: 'Pop', genre: 14, mainCategory: true },
      { name: 'Rock', genre: 21, mainCategory: true },
      { name: 'Country', genre: 6, mainCategory: true },
      { name: 'Latino', genre: 12, mainCategory: true },
    ],
  subCategories: [
      { name: 'Alternative', genre: 20, mainCategory: false },
      { name: 'Classical', genre: 5, mainCategory: false },
      { name: 'Jazz', genre: 11, mainCategory: false },
      { name: 'World', genre: 19, mainCategory: false }
  ]
}

export default Navbar;
