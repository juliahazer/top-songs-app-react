import React, { Component } from 'react';
import SongTable from './SongTable';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import './App.css';
import Navbar from './Navbar';
import { DropdownButton, MenuItem } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      youtubeAPIUrl: '',
      countryCode: 'us',
      country: 'US',
      categoryName: 'ALL',
      genreNum: 0,
      totalCount: 5,
      songs: [],
      itunesAPIUrl: ''
    };
    this.handleNavbarChange = this.handleNavbarChange.bind(this);
    this.handleNumSongsChange = this.handleNumSongsChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
  }

  //life-cycle methods
  componentWillMount = () => {
    this.newApisCall();
  }

  //event handlers
  handleNavbarChange = (categoryName, genreNum) => {
    this.setState({categoryName, genreNum}, () => this.newApisCall());
  }

  handleNumSongsChange = e => {
    let totalCount = +(e.target.name);
    let numCountDiff = totalCount - this.state.totalCount;
    //if reducing the number of songs no api call needed
    if (numCountDiff < 0) {
      let songs = this.state.songs.slice();
      songs = songs.slice(0, songs.length + numCountDiff);
      this.setState({totalCount, songs});
    } else {
      this.setState({totalCount},
        () => this.newApisCall(numCountDiff));
    }
  }

  handleCountryChange = e => {
    let countryCode = e.target.id;
    let country = e.target.name
    this.setState({countryCode, country}, () => this.newApisCall());
  }

  //custom helper methods
  newApisCall = (numCountDiff=0) => {
    let itunesAPIUrl = this.setItunesAPIUrl(
      this.state.countryCode,
      this.state.totalCount,
      this.state.genreNum
    );
    /*itunes api call, then w/ results,
    create an object for each song,
    and store these objects in newSongsArr*/
    $.ajax({
      method: "GET",
      url: itunesAPIUrl,
      dataType: "json"
    }).then((data) => {
      let songs = data.feed.entry;
      let songsCurrHaveLength = 0;
      //limit api calls to new songs
      if (numCountDiff > 0) {
        songsCurrHaveLength = this.state.songs.length;
        songs = data.feed.entry.slice(songsCurrHaveLength);
      }
      let newSongsArr = songs.map((song, index) => {
        return this.createSongObject(song, index + songsCurrHaveLength);
      });
      let count = numCountDiff > 0 ? songsCurrHaveLength : 0;
      /*for each song, call the youtube api
      and add the results: videoId and videoUrl,
      to each song object*/
      newSongsArr.forEach(song => {
        let youtubeAPIUrl = this.setYouTubeAPIUrl(song);
        let songsState = this.state.songs.slice();
        $.ajax({
          method: "GET",
          url: youtubeAPIUrl,
          dataType: "json"
        }).then((data) => {
          count++;
          let vidId = data.items[0].id.videoId;
          song.videoId = vidId;
          song.videoUrl = `https://www.youtube.com/embed/${vidId}`
            + `?enablejsapi=1`;
          /*ensure that youtube info for all videos
          is retrieved, then display html of all results*/
          if (count === this.state.totalCount) {
            let finalSongs;
            if (numCountDiff > 0) {
              finalSongs = songsState.concat(newSongsArr);
            } else {
              finalSongs = newSongsArr;
            }
            this.setState({songs: finalSongs, itunesAPIUrl});
          }
        });
      });
    });
  }

  setItunesAPIUrl = (countryCode, totalCount, genreNum) => {
    let itunesAPIUrl = `https://itunes.apple.com/${countryCode}`
      + `/rss/topsongs/limit=${totalCount}/`;
    if (genreNum !== 0) {
      itunesAPIUrl += `genre=${genreNum}/`;
    }
    itunesAPIUrl += "json";
    return itunesAPIUrl;
  }

  setYouTubeAPIUrl = song => {
    const key = 'AIzaSyDiv_c2pu67HdptBE4Xu0AFpcTCXl72wbI';
    let artistName = song.artist;
    let songName;
    /*if song features an artist, remove featured artist
    from songName*/
    let featureIndex = song.songName.indexOf(" (feat. ");
    if (featureIndex === -1) {
      songName = song.songName;
    }
    else {
      songName = song.songName.slice(0,featureIndex);
    }
    let youtubeAPIUrl = `https://www.googleapis.com/youtube/v3/`
      + `search?part=snippet&maxResults=1&q=${songName}+`
      + `${artistName}&type=video&key=${key}`;
    return youtubeAPIUrl;
  }

  /*Create a song object with songName, position, artist,
  bioUrl, nameBio info based on itunes API results*/
  createSongObject = (song, index) => {
    let songObj = {};
    songObj.songName = song['im:name'].label;
    songObj.position = index + 1;
    songObj.artist = song['im:artist'].label;
    let artistIdUrl = song['im:artist'].attributes.href;
    let indexQues = artistIdUrl.indexOf('?uo');
    artistIdUrl = artistIdUrl.slice(0,indexQues);
    songObj.bioUrl = artistIdUrl + "#fullText";
    let regex = /artist\/(.+?)\/id/;
    let nameBio = regex.exec(artistIdUrl)[1];
    songObj.nameBio = nameBio.split('-').map(name => {
      return name[0].toUpperCase() + name.slice(1);
    }).join(' ');
    return songObj;
  }

  render() {
    let numSongsMenuItems = this.props.numSongCategories.map(el => {
      let active = "";
      if (el === this.state.totalCount) {
        active = " active";
      }
      return (
        <MenuItem
          onClick={this.handleNumSongsChange}
          key={el}
          name={el}
          className={`numSongs ${active}`}>
            {el}
        </MenuItem>
      );
    });

    let countryMenuItems = this.props.countryCategories.map(cat => {
      let active = "";
      if (cat.countryCode === this.state.countryCode) {
        active = " active";
      }
      return (
        <MenuItem
          onClick={this.handleCountryChange}
          key={cat.country}
          name={cat.country}
          id={cat.countryCode}
          className={`countries ${active}`}
        >
            {cat.country}
        </MenuItem>
      );
    });

    return (
      <div className="App">

        <Navbar key='0' clickAction={this.handleNavbarChange}/>

        <div className="container-fluid">
          <div id="headingDiv">
            <h2 className="section-heading" id="categoryHeading">
              {this.state.categoryName}
            </h2>
            <h3 className="section-subheading" id="categorySubheading">
              Top {this.state.totalCount} Songs - {this.state.country}
            </h3>

            <br />

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
          </div>

          {/* Info about the song playing */}
          <div id="songPlaying">
          </div>
        </div>

        <SongTable songs={this.state.songs}/>

      </div>
    );
  }
}

App.defaultProps =  {
  numSongCategories: [5, 10, 15, 20, 25],
  countryCategories: [
      { country: 'US', countryCode: 'us' },
      { country: 'Australia', countryCode: 'au' },
      { country: 'France', countryCode: 'fr' },
      { country: 'Germany', countryCode: 'de' },
      { country: 'Great Britain', countryCode: 'gb' },
      { country: 'Indonesia', countryCode: 'id' },
      { country: 'Italy', countryCode: 'it' },
      { country: 'Mexico', countryCode: 'mx' },
      { country: 'Vietnam', countryCode: 'vn' }
  ]
};

export default App;
