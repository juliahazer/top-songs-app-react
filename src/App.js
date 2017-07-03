import React, { Component } from 'react';
import SongTable from './SongTable';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Navbar from './Navbar';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  newApisCall,
  GENRE_NUM_LOOKUP,
  COUNTRY_CODE_LOOKUP
} from './actions';

class App extends Component {

  componentWillMount = () => {
    this.props.newApisCall({totalNumSongs: this.props.totalNumSongs});
  }

  render() {
    let categoryName = GENRE_NUM_LOOKUP[this.props.genreNum];
    let countryName = COUNTRY_CODE_LOOKUP[this.props.countryCode];
    let numSongsMenuItems = this.props.numSongCategories.map(totalNumSongs => {
      let active = totalNumSongs === this.props.totalNumSongs ?
        " active" : "";
      return (
        <MenuItem
          onClick={() => this.props.newApisCall({totalNumSongs})}
          key={totalNumSongs}
          className={`numSongs ${active}`}>
            {totalNumSongs}
        </MenuItem>
      );
    });

    let countryMenuItems = this.props.countryCategories.map(countryCode => {
      let country = COUNTRY_CODE_LOOKUP[countryCode];
      let active = countryCode === this.props.countryCode ?
        " active": "";
      return (
        <MenuItem
          onClick={() => this.props.newApisCall({countryCode})}
          key={country}
          name={country}
          id={countryCode}
          className={`countries ${active}`}
        >
          {country}
        </MenuItem>
      );
    });

    return (
      <div className="App">
        <Navbar key='0' />

        <div id="dropdownButtonsDiv" className="container-fluid">
          {/* # of Songs Selection Button */}
          <div className="btn-group" id="numSongsBtn">
            <DropdownButton
              title="# of Songs"
              key="numSongsDropdown"
              id="numSongsDropdown"
              className="btnName btn btn-default">
                {numSongsMenuItems}
            </DropdownButton>
          </div>

          {/* Country Selection Button */}
          <div className="btn-group" id="countriesBtn">
            <DropdownButton
              title="Country"
              key="countryDropdown"
              id="countryDropdown"
              className="btnName btn btn-default">
                {countryMenuItems}
            </DropdownButton>
          </div>

          <div id="headingDiv">
            <h2 className="section-heading" id="categoryHeading">
              {categoryName}
            </h2>
            <h3 className="section-subheading" id="categorySubheading">
              Top {this.props.totalNumSongs} Songs - {countryName}
            </h3>

            <br />

          </div>
        </div>

        <SongTable
          songs={this.props.songs}
          category={categoryName}
        />
      </div>
    );
  }
}

App.defaultProps =  {
  numSongCategories: [5, 10, 15, 20, 25],
  countryCategories: ['us', 'au', 'fr', 'de', 'gb',
    'id', 'it', 'mx', 'vn']
};

const mapStateToProps = (state, ownProps) => {
  return {
    countryCode: state.countryCode,
    genreNum: state.genreNum,
    totalNumSongs: state.totalNumSongs,
    songs: state.songs
  }
};

const mapDispatchToProps = { newApisCall };

export default connect(mapStateToProps, mapDispatchToProps)(App);
