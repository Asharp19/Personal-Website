import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './App.css'
import twitterL from './static/twitterL.png'
import githubL from './static/githubL.png'
import linkedinL from './static/linkedinL.png'
import audio from './static/hazyD6.mp3'
import muteL from "./static/mute2.png"
import unmuteL from "./static/Unmute1.png"
import theme from './static/themeset.png'
import rotateimg from './static/rotateScene1.png'



const mute = () => {
  document.getElementById("player").muted = !document.getElementById("player").muted
  if (document.getElementById("player").muted) {
    document.getElementById("mute").setAttribute("src", muteL)
  }
  else {
    document.getElementById("mute").setAttribute("src", unmuteL)
  }
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <audio id="player" src={audio} autoPlay loop></audio>
    <div id="media">
      <a href='https://discourse.threejs.org' target="_blank"><img src={twitterL} id="twitter" /></a>
      <a href='https://discourse.threejs.org' target="_blank"><img src={githubL} id="twitter" /></a>
      <a href='https://discourse.threejs.org' target="_blank"><img src={linkedinL} id="twitter" /></a>
    </div>
    <div id='audio-control' onClick={mute}><img src={unmuteL} id="mute" /></div>
    <div id='themeChange'><img src={theme} id="fitcontain" /></div>
    <div id="rotateit" ><img src={rotateimg} id='fitcontain' /></div>
    <div id='noise'></div>
    <div id='blank'></div>
    <div id='blank'></div>
    <div id='blank'></div>
    <div id='blank'></div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

