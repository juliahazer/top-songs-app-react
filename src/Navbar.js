import React, { Component } from 'react';
import {
  Navbar as NavbarBS,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  newApisCall,
  GENRE_NUM_LOOKUP,
  MAIN_NAV_ORDER,
  SUB_NAV_ORDER
} from './actions';
import PlaylistControls from './PlaylistControls';
import './Navbar.css';

class Navbar extends Component {

  render() {
    let categories = MAIN_NAV_ORDER.map(genreNum => {
      let name = GENRE_NUM_LOOKUP[genreNum];
      let active = this.props.genreNum === genreNum ? "active" : "";
      return (
        <NavItem
          onClick={() => this.props.newApisCall({genreNum})}
          key={name}
          href=""
          className={active + " NavItem category"}
        >
          {name}
        </NavItem>
      );
    })

    let subcategories = SUB_NAV_ORDER.map(genreNum => {
      let name = GENRE_NUM_LOOKUP[genreNum];
      return (
        <MenuItem
          onClick={() => this.props.newApisCall({genreNum})}
          key={name}
          href=""
        >
          {name}
        </MenuItem>
      );
    })

    let activeSubcategory = SUB_NAV_ORDER.includes(this.props.genreNum);
    let dropdownClass = activeSubcategory ? " activeDropdown" : "";

    return (
      <div>
      <NavbarBS className="NavbarBS" inverse fixedTop>
        <NavbarBS.Header>
          <NavbarBS.Brand>
            <a className="navbarBrand" onClick="">Top Songs</a>
            <PlaylistControls />
          </NavbarBS.Brand>
          <NavbarBS.Toggle />
        </NavbarBS.Header>

        <NavbarBS.Collapse>
          <Nav>
            {categories}

            <NavDropdown
              title='Other'
              key='Other'
              id='dropdown-basic-other'
              className={"NavDropdown subcategory" + dropdownClass}>
              {subcategories}
            </NavDropdown>
          </Nav>
        </NavbarBS.Collapse>
      </NavbarBS>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    genreNum: state.genreNum
  }
};

const mapDispatchToProps = { newApisCall };

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
