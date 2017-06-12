import React, { Component } from 'react';
import SongTable from './SongTable';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import './App.css';
import Navbar from './Navbar';
// import {Bootstrap, Jumbotron, Button, Navbar} from 'react-bootstrap';
// import 'bootstrap/dist/js/bootstrap';

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
  }

  //life-cycle methods
  componentWillMount = () => {
    this.newApisCall();
  }

  //event handlers
  handleNavbarChange(categoryName, genreNum){
    this.setState({categoryName, genreNum});
    this.newApisCall();
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
              <button type="button" className="btnName btn btn-default"># of Songs</button>
              <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span className="caret"></span>
                <span className="sr-only">Toggle Dropdown</span>
              </button>
              <ul className="dropdown-menu">
                <li className="active"><a className="numSongs" onClick="">5</a></li>
                <li><a className="numSongs" onClick="">10</a></li>
                <li><a className="numSongs" onClick="">15</a></li>
                <li><a className="numSongs" onClick="">20</a></li>
                <li><a className="numSongs" onClick="">25</a></li>
              </ul>
            </div>

            {/* Country Selection Button */}
            <div className="btn-group" id="countriesBtn">
              <button type="button" className="btnName btn btn-default">Country</button>
              <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span className="caret"></span>
                <span className="sr-only">Toggle Dropdown</span>
              </button>
              <ul className="dropdown-menu">
                <li className="active"><a data-country="us" className="countries" onClick="">US</a></li>
                <li><a data-country="au" className="countries" onClick="">Australia</a></li>
                <li><a data-country="fr" className="countries" onClick="">France</a></li>
                <li><a data-country="de" className="countries" onClick="">Germany</a></li>
                <li><a data-country="gb" className="countries" onClick="">Great Britain</a></li>
                <li><a data-country="id" className="countries" onClick="">Indonesia</a></li>
                <li><a data-country="it" className="countries" onClick="">Italy</a></li>
                <li><a data-country="lb" className="countries" onClick="">Lebanon</a></li>
                <li><a data-country="mx" className="countries" onClick="">Mexico</a></li>
                <li><a data-country="vn" className="countries" onClick="">Vietnam</a></li>
              </ul>
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

export default App;
