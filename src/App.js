import React, { Component } from 'react';
import SongTable from './SongTable';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import './App.css';
import Navbar from './Navbar';
import {DropdownButton, MenuItem} from 'react-bootstrap';

class App extends Component {
  constructor(props){
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
  handleNavbarChange(categoryName, genreNum){
    this.setState({categoryName, genreNum}, function(){    
      this.newApisCall();
    });
  }

  handleNumSongsChange(e){
    var totalCount = Number(e.target.name);
    this.setState({totalCount}, function(){
      this.newApisCall();
    })
  }

  handleCountryChange(e){
    var countryCode = e.target.id;
    var country = e.target.name
    this.setState({countryCode, country}, function(){
      this.newApisCall();
    })
  }

  //custom helper methods
  newApisCall = () => {
    var itunesAPIUrl = this.setItunesAPIUrl(this.state.countryCode, this.state.totalCount, this.state.genreNum);
    this.setState({itunesAPIUrl});
    /*itunes api call, then w/ results, 
    create an object for each song, 
    and store these objects in songsArr*/
    $.ajax({
      method: "GET",
      url: itunesAPIUrl,
      dataType: "json"
    }).then((data) => {
        var songsArr = data.feed.entry.map((song, index) => {
          return this.createSongObject(song, index);
        });
        var count = 0;
        /*for each song, call the youtube api
        and add the results: videoId and videoUrl,
        to each song object*/
        songsArr.forEach((song) => {
          var youtubeAPIUrl = this.setYouTubeAPIUrl(song);
          $.ajax({
            method: "GET",
            url: youtubeAPIUrl,
            dataType: "json"
          }).then((data) => {
            count++;
            var vidId = data.items[0].id.videoId;
            song.videoId = vidId;
            song.videoUrl = "https://www.youtube.com/embed/" + vidId + "?enablejsapi=1";
            /*ensure that youtube info for all videos
            is retrieved, then display html of all results*/
            if (count === this.state.totalCount){
              this.setState({
                songs: songsArr
              })
            }
          });
        })
    });
  }

  setItunesAPIUrl = (countryCode, totalCount, genreNum) => {
    var itunesAPIUrl = "https://itunes.apple.com/" + countryCode +
      "/rss/topsongs/limit=" +
      totalCount + "/";
    if (genreNum !== 0){
      itunesAPIUrl += "genre=" + genreNum + "/";
    }
    itunesAPIUrl += "json";
    return itunesAPIUrl;
  }

  setYouTubeAPIUrl = (song) =>{
    var key = 'AIzaSyDiv_c2pu67HdptBE4Xu0AFpcTCXl72wbI';
    var artistName = song.artist;
    var songName;
    /*if song features an artist, remove featured artist
    from songName*/
    var featureIndex = song.songName.indexOf(" (feat. ");
    if ( featureIndex === -1){
      songName = song.songName;
    }
    else {
      songName = song.songName.slice(0,featureIndex);
    }
    var youtubeAPIUrl =  `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${songName}+${artistName}&type=video&key=${key}`;
    return youtubeAPIUrl;
  }

  /*Create a song object with songName, position, artist,
  bioUrl, nameBio info based on itunes API results*/
  createSongObject = (song, index) => {
    var songObj = {};
    songObj.songName = song['im:name'].label;
    songObj.position = index + 1;
    songObj.artist = song['im:artist'].label;
    var artistIdUrl = song['im:artist'].attributes.href
    var indexQues = artistIdUrl.indexOf('?uo');
    artistIdUrl = artistIdUrl.slice(0,indexQues);
    songObj.bioUrl = artistIdUrl + "#fullText";
    var regex = /artist\/(.+?)\/id/;
    var nameBio = regex.exec(artistIdUrl)[1];
    songObj.nameBio = nameBio.split('-').map(function(name){
      return name[0].toUpperCase() + name.slice(1);
    }).join(' ');
    return songObj;
  }

  render() {
    var numSongsMenuItems = this.props.numSongCategories.map((el) => {
      var active = "";
      if (el === this.state.totalCount){
        active = " active";
      }
      return (
        <MenuItem 
          onClick={this.handleNumSongsChange}
          key={el}
          name={el}
          className={"numSongs" + active}>
            {el}
        </MenuItem>
      )
    });

    var countryMenuItems = this.props.countryCategories.map((el) => {
      var active = "";
      if (el.countryCode === this.state.countryCode){
        active = " active";
      }
      return (
        <MenuItem
          onClick={this.handleCountryChange}
          key={el.country}
          name={el.country}
          id={el.countryCode}
          className={"countries" + active}
        >
            {el.country}
        </MenuItem>
      )
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
      { country: 'US', countryCode: 'us'},
      { country: 'Australia', countryCode: 'au'},
      { country: 'France', countryCode: 'fr'},
      { country: 'Germany', countryCode: 'de' },
      { country: 'Great Britain', countryCode: 'gb'},
      { country: 'Indonesia', countryCode: 'id'},
      { country: 'Italy', countryCode: 'it'},
      { country: 'Mexico', countryCode: 'mx' },
      { country: 'Vietnam', countryCode: 'vn' }
  ]
}

export default App;
