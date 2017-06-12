import React, { Component } from 'react';
import './Navbar.css';

class Navbar extends Component {
  render() {
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
            {/*<div id="playlistControls">
              <a id="prevSong" className="resume btn btn-default btn-sm" role="button" href="#">
                <span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
              </a>
              <a id="playPauseSong" className="firstStart btn btn-default btn-sm" role="button" href="#">
                <span className="glyphicon glyphicon-play" aria-hidden="true"></span>
              </a>
              <a id="muteSong" className="btn btn-default btn-sm" role="button" href="#">
                <span className="glyphicon glyphicon-volume-off" aria-hidden="true"></span>
              </a>
              <a id="nextSong" className="resume btn btn-default btn-sm" role="button" href="#">
                <span className="glyphicon glyphicon-forward" aria-hidden="true"></span>
              </a>
            </div>*/}
          </div> {/*  /.navbar-header */}

          {/* Navbar links and Other dropdown */}
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className="active"><a className="category" id="all" data-genre="0" onClick="">All</a></li>
              <li><a onClick="" className="category" id="pop" data-genre="14">Pop</a></li>
              <li><a onClick="" className="category" id="rock" data-genre="21">Rock</a></li>
              <li><a onClick="" className="category" id="country" data-genre="6">Country</a></li>
              <li><a onClick="" className="category" id="latino" data-genre="12">Latino</a></li>

              <li className="dropdown">
                <a onClick="" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Other <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  <li><a onClick="" className="subCategory" id="alternative" data-genre="20">Alternative</a></li>
                  <li><a onClick="" className="subCategory" id="classical" data-genre="5">classical</a></li>
                  <li><a onClick="" className="subCategory" id="jazz" data-genre="11">Jazz</a></li>
                  <li><a onClick="" className="subCategory" id="rb-soul" data-genre="15">R&amp;B/Soul</a></li>
                  <li><a onClick="" className="subCategory" id="world" data-genre="19">World</a></li>
                </ul>
              </li>
            </ul>
          </div>{/*  /.navbar-collapse */}
        </div>{/*  /.container-fluid */}
      </nav>
    )
  }
}

export default Navbar;
