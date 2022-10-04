import { extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import React, { useState, useRef } from 'react';
import { shaderMaterial, useGLTF } from '@react-three/drei';
import { BackSide } from 'three';
import glsl from "babel-plugin-glsl/macro"
import "glslify"
import scene2 from '../static/sites1.glb'
import { degToRad } from 'three/src/math/MathUtils';

export const Sparticle = () => {
  const { nodes } = useGLTF(scene2);
  useFrame((state) => {
    ss.current.uTime = state.clock.getElapsedTime()
    rr.current.uTime = state.clock.getElapsedTime()

  })
  const ss = useRef()
  const rr = useRef()


  const ShaderMatEnv2 = shaderMaterial(
    // Uniform
    {
      uTime: 0,
      uColor: new THREE.Color(2.0, 5.0, 6.0),
      uTexture: new THREE.Texture(),
      random: Math.random()
    },
    // Vertex Shader
    glsl`
              precision mediump float;
           
              varying vec2 vUv;
              varying float vWave;
              varying vec3 vPosition;
              uniform float uTime;
              
              
          
              void main() {
                vUv = uv;
                vPosition=position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
              }
            `,
    // Fragment Shader
    glsl` precision mediump float;
              varying vec3 vPosition;
              uniform vec3 uColor;
              uniform float uTime;
              uniform float random;
              varying vec2 vUv;
              // Determines how many cells there are
                #define NUM_CELLS 16.0
              // Arbitrary random, can be replaced with a function of your choice
                float rand(vec2 co){
                    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
                }

                // Returns the point in a given cell
                vec2 get_cell_point(ivec2 cell) {
                    vec2 cell_base = vec2(cell) / NUM_CELLS;
                    float noise_x = rand(vec2(cell));
                    float noise_y = rand(vec2(cell.yx));
                    return cell_base + (0.5 + 1.5 * vec2(noise_x, noise_y)) / NUM_CELLS;
                }

                // Performs worley noise by checking all adjacent cells
                // and comparing the distance to their points
                float worley(vec2 coord) {
                    ivec2 cell = ivec2(coord * NUM_CELLS);
                    float dist = 1.0;
                    
                    // Search in the surrounding 5x5 cell block
                    for (int x = 0; x < 5; x++) { 
                        for (int y = 0; y < 5; y++) {
                            vec2 cell_point = get_cell_point(cell + ivec2(x-2, y-2));
                            dist = min(dist, distance(cell_point, coord));

                        }
                    }
                    
                    dist /= length(vec2(1.0 / NUM_CELLS));
                    dist = 1.0 - dist;
                    return dist;
                }

                float lines(vec2 uv,float offset){
                  return smoothstep(
                      0.,2.+offset*0.5,
                      abs(0.5*(sin(uv.x*20.)+offset*2.0))
                  );
                  
                }

              void main() {
                vec3 color1= vec3(1.0,1.,1.);
                vec3 color2= vec3(0.,0.0,1.);
                vec3 color3= vec3(0.,0.2,0.1)-1.;
                vec2 anim= vec2(vPosition.x+uTime*0.02,vPosition.x);

                vec3(0.81176,0.63529,0.25098);

                float n=worley(anim);
                vec2 baseUV= vec2(n*vPosition.y*0.4,vPosition.y);
                float pattern1=lines(baseUV,0.2);
                float pattern2=lines(baseUV,0.6);
                vec3 baseColor=mix(color1,color2,pattern1);
                vec3 sColor=mix(baseColor,color3,pattern2);
                gl_FragColor = vec4(sColor,1.0);
              
                
                
              }`)



  const ShaderMatEnv = shaderMaterial(
    // Uniform
    {
      uTime: 0,
      uColor: new THREE.Color(2.0, 5.0, 6.0),
      uTexture: new THREE.Texture()
    },
    // Vertex Shader
    glsl`
              precision mediump float;
           
              varying vec2 vUv;
              varying float vWave;
              varying vec3 vPosition;
              uniform float uTime;
              
              
          
              void main() {
                vUv = uv;
                vPosition=position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
              }
            `,
    // Fragment Shader
    glsl`   precision mediump float;
              varying vec3 vPosition;
              uniform vec3 uColor;
              uniform float uTime;
              uniform sampler2D uTexture;


              #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl);
              
              
              varying vec2 vUv;
              

              void main() {
                vec3 color4= vec3(0.8,0.8,0.8);
                vec3 color3= vec3(0.0,0.0,0.0);
                vec3 anim= vec3(vPosition.x*0.1,vPosition.y*20.,vPosition.z*0.03);
                float n=snoise3(anim+uTime*0.1);
                
                vec3 bColor= mix(color4,color3,n);
                gl_FragColor = vec4(bColor,1.0);}`)

  extend({ ShaderMatEnv, ShaderMatEnv2 })
  const deg2rad = degrees => degrees * (Math.PI / 180);



  //Pattern change counter

  const patterns = [[4, 3], [3, 3], [5, 1], [4, 5], [3, 1], [4, 1]]

  const [indexI, increment] = useState(0)


  const indexIncrement = () => {
    if (indexI > patterns.length - 2) {
      increment(0)
    }
    else {
      increment(indexI + 1)
    }
  }

  document.getElementById("themeChange").onclick = indexIncrement

  return (
    <group>
      <mesh scale={(380)} rotation={[0, degToRad(90), 0]}>
        <sphereBufferGeometry args={[1, patterns[Math.floor(indexI)][0], patterns[Math.floor(indexI)][1]]} />
        <shaderMatEnv2 ref={rr} side={BackSide} />
      </mesh>

      <mesh geometry={nodes.Plane.geometry} position={[0, 0.31 - 2, -20]} rotation={[0, deg2rad(-90), 0]}>
        <shaderMatEnv ref={ss} />
      </mesh>
    </group>
  )
}