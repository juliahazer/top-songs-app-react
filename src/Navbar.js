import React, { Component } from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import './Navbar.css';

class Navbar extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeName: 'All',
      activeGenre: 0,
      activeSubcategory: false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    e.preventDefault();
    var activeName = e.target.name;
    var activeGenre = Number(e.target.attributes.getNamedItem('data').value);
    var activeSubcategory;
    if (e.target.className === 'category'){
      activeSubcategory = false;
    } else {
      activeSubcategory = true;
    }
    this.setState({activeName, activeGenre, activeSubcategory}, function() {
      this.props.clickAction(this.state.activeName, this.state.activeGenre);
    });
  }

  render() {
    var activeSubcategory = true;
    let mapCategories = (el) => {
      var name = el.name.toLowerCase();
      var active = "";
      var classTxt;
      if (el.mainCategory){
        activeSubcategory = false;
        classTxt = 'category';
      } else {
        classTxt = 'subcategory'
      }
      if (this.state.activeGenre === el.genre){
        active="active";
      }
      if (el.mainCategory){
        return (
          <li className={active} key={name}>
            <a
              onClick={this.handleClick} 
              name={name} 
              href=""
              className={classTxt}
              data={el.genre}>
              {el.name}
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
            data={el.genre}>
            {el.name}
          </MenuItem>
        );
      }
    } 
    var activeClass = '';
    var categories = this.props.mainCategories.map(mapCategories);
    var subcategories = this.props.subCategories.map(mapCategories);
    var dropdownClass = '';
    if (this.state.activeSubcategory){
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
                className={"DropdownButton" + dropdownClass}>
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
