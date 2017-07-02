import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
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
    let activeSubcategory = e.target.className === 'category' ? false :
      true;
    this.setState({activeName, activeGenre, activeSubcategory}, () => {
      this.props.clickAction(this.state.activeName, this.state.activeGenre);
    });
  }

  render() {
    let mapCategories = cat => {
      let name = cat.name.toLowerCase();
      let active = "";
      let classTxt = cat.mainCategory ?
        'category' :
        'subcategory';
      if (this.state.activeGenre === cat.genre) {
        active = "active";
      }
      if (cat.mainCategory) {
        return (
          <li className={active} key={name}>
            <a
              onClick={this.handleClick}
              name={name}
              href=""
              className={classTxt}
              data={cat.genre}>
              {cat.name}
            </a>
          </li>
        );
      } else {
        return (
          <MenuItem
            onClick={this.handleClick}
            key={name}
            name={name}
            href=""
            className={classTxt}
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
      <nav className="navbar navbar-custom navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          {/* Nav Bar: toggle for mobile, Brand, Playlist controls */}
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <div id="brandTitle">
              <a className="navbar-brand" onClick="">Top Songs</a>
            </div>
          </div> {/*  /.navbar-header */}

          {/* Navbar links and Other dropdown */}
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              {categories}

              <DropdownButton
                title='Other'
                key='Other'
                id='dropdown-basic-other'
                className={`DropdownButton ${dropdownClass}`}>
                {subcategories}
              </DropdownButton>
            </ul>
          </div>{/*  /.navbar-collapse */}
        </div>{/*  /.container-fluid */}
      </nav>
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
