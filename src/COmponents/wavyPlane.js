import { useRef, useState } from "react";
import { degToRad, lerp } from "three/src/math/MathUtils";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import glsl from "babel-plugin-glsl/macro";
import { Html, shaderMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three"
import rsImg from "../static/Resume2.jpg"
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import projectsB from '../static/bannerProjects.png'

import "../App.css";
import emailjs from 'emailjs-com'
import { DoubleSide } from "three";



gsap.registerPlugin(ScrollTrigger)


export function WavyPlane(props) {

  const resume = useRef();
  const { camera } = useThree()
  const [clicked, click] = useState(false)
  const cboard = useRef()
  const cboardc = useRef()
  const eboardc = useRef()
  const ref = useRef();


  useFrame((state) => {
    camera.position.y = lerp(camera.position.y, clicked ? 6 : 0, 0.1)
    cboard.current.position.z = lerp(cboard.current.position.z, camera.position.z < -12 ? 20 : 100, 0.074)
    cboard.current.position.y = lerp(cboard.current.position.y, camera.position.z < -12 ? 10 : 17, 0.1)
    cboardc.current.opacity = lerp(cboardc.current.opacity, camera.position.z < 28 ? 0 : 1, 0.1)
    eboardc.current.material.opacity = lerp(eboardc.current.material.opacity, camera.position.z < -13 ? 1 : 0, 0.1)
  });


  useFrame((state) => {
    if (camera.position.z < -40) {
      ref.current.uTime = state.clock.getElapsedTime()
      resume.current.position.y = (8 + Math.sin(state.clock.getElapsedTime() * 2) / 5)
    }
  });

  let goAhead = false

  function go() {
    goAhead = true
  }

  window.addEventListener("load", go())

  useFrame((state) => {
    if (goAhead) {
      document.getElementById("mainform").style.opacity = lerp(document.getElementById("mainform").style.opacity, camera.position.z < -12 ? 1 : 0, 0.1)
    }
  });

  const bannerP = useTexture(projectsB)

  const WaveShaderMaterial = shaderMaterial(
    // Uniform
    {
      uTime: 0,
      uColor: new THREE.Color(0.0, 0.0, 0.0),
      uTexture: new THREE.Texture()
    },
    // Vertex Shader
    glsl`
      precision mediump float;
   
      varying vec2 vUv;
      varying float vWave;
  
      uniform float uTime;
  
      #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl);
  
      void main() {
        vUv = uv;
  
        vec3 pos = position;
        float noiseFreq = 0.1;
        float noiseAmp = 0.2;
        vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
        pos.z += snoise3(noisePos) * noiseAmp;
        vWave = pos.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);  
      }
    `,
    // Fragment Shader
    glsl`
      precision mediump float;
  
      uniform vec3 uColor;
      uniform float uTime;
      uniform sampler2D uTexture;
  
      varying vec2 vUv;
      varying float vWave;
  
      void main() {
        vec3 texture = texture2D(uTexture, vUv ).rgb;
        gl_FragColor = vec4(texture, 1.0); 
      }
    `
  );

  extend({ WaveShaderMaterial });

  const image1 = useLoader(THREE.TextureLoader, rsImg)

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('gmaze', process.env.REACT_APP_TEMPLATE_ID, e.target, process.env.REACT_APP_USER_ID)
      .then((result) => {
        document.getElementById("successM").style.display = 'inline';
      }, (error) => {
        alert(error.text);
      });
    e.target.reset()
  };

  return (
    <group>
      <mesh ref={resume} rotation={[0, degToRad(90), 0]} onClick={(event) => click(!clicked)} {...props}>
        <planeBufferGeometry args={[5, 7, 7, 8]} />
        <waveShaderMaterial uColor={"hotpink"} ref={ref} uTexture={image1} />
      </mesh>

      <mesh position={[-16, 17, 100]} rotation={[0, 0, 0]} ref={cboard}>
        <Html className="content" rotation-y={degToRad(180)} position={[0, 0, 0.1]} transform>
          <div id="successM">Thankyou!<br />Your message has been recieved successfully!!</div>
          <div id="mainform">
            <form onSubmit={sendEmail} >
              <h1>Get in Touch!!</h1>
              <input type="text" placeholder="Name" name="name" />
              <input type="email" placeholder="E-mail Address" name="email" required />
              <textarea placeholder="Send your message!!" name="message" required></textarea>
              <button type="submit" name="submit">Submit</button>
            </form>
          </div>
        </Html>
      </mesh>

      <mesh position={[-16, 16.8, 100]} rotation={[0.05, 0, 0]} >
        <planeBufferGeometry args={[47, 29.2]} />
        <meshBasicMaterial color={0x000000} ref={cboardc} transparent={true} side={DoubleSide} />
      </mesh>

      <mesh position={[-16, 17, 104]} rotation={[0.05, 0, 0]} >
        <boxBufferGeometry args={[54, 34, 2]} />
        <meshStandardMaterial color={0xffffff} envMapIntensity={0} />
      </mesh>

      <mesh position={[-20, 5, -20]} ref={eboardc}>
        <planeBufferGeometry args={[60, 29.2]} />
        <meshBasicMaterial color={0xffffff} map={bannerP} transparent={true} side={DoubleSide} />
      </mesh>

    </group >
  )
}