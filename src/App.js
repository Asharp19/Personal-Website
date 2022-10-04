import { Canvas, useFrame, useThree } from '@react-three/fiber'
import './App.css';
import { Environment, useProgress } from '@react-three/drei'
import gsap from 'gsap';
import env from './static/gradient-1.hdr'
import { Model } from './COmponents/scene';
import { Sparticle } from './COmponents/particles';
import { Intro } from './COmponents/TextIntro'
import { degToRad, lerp } from 'three/src/math/MathUtils';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useTransition, a } from '@react-spring/web';
import { Box } from './COmponents/globe';
import gifload from './static/loading-gif.mp4'

const CameraTurner = () => {
  const { camera } = useThree()
  const [turned, turn] = useState(false)
  let flip = 90

  const turner = () => {
    turn(!turned)
  }
  document.getElementById("rotateit").onclick = turner


  if (turned) {
    flip = -90
  }

  let rotate = false
  useFrame(() => {
    if (camera.position.z < -10 && camera.position.z > -40) {
      rotate = true
    }
    else {
      rotate = false
    }
    camera.rotation.y = lerp(camera.rotation.y, rotate ? degToRad(flip) : 0, 0.1)
    document.getElementById("rotateit").style.opacity = rotate ? 0.8 : 0
  })



  return null
}


const CameraController = () => {
  const { camera } = useThree();
  const minZ = 30
  camera.position.set(0, 0, minZ)
  const cursor = {}
  cursor.x = 0
  cursor.y = 0
  const onMoScroll = (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5
    cursor.y = event.clientY / window.innerHeight - 0.5
  }
  window.addEventListener("mousemove", onMoScroll)


  //const controls = new PerspectiveCamera(100, screenSizeW / screenSizeH);
  useFrame((state, delta) => {
    camera.position.x += (cursor.x - camera.position.x) * 0.05
    camera.position.y += (-cursor.y - camera.position.y) * 0.05
    camera.rotation.x = lerp(camera.rotation.x, camera.rotation.y < degToRad(10) && camera.rotation.y > degToRad(-10) ? degToRad(7) : 0, 0.1)
  })

  useEffect(() => {
    gsap.fromTo(camera.position, { z: 30 }, {
      scrollTrigger: {
        scrub: 2
      },
      z: -57
    })
  }, [camera.position])
  camera.updateProjectionMatrix()
  return null;
};

//const screenSizeW = window.innerWidth
//const screenSizeH = window.innerHeight

function Loader1() {
  const { loaded, active } = useProgress()
  let active1 = active

  const transition = useTransition(active1, {
    from: { opacity: 1 },
    leave: { opacity: 0 }
  })
  return transition(
    ({ opacity }, active1) =>
      active1 && (
        <a.div id="loading" >
          <div className="loading-bar-container">
            <a.div className="loading-bar" style={{ width: Math.round(loaded / 21 * 500) }}>
              <video src={gifload} id='loadergif' autoPlay loop muted /><a.span className="loading-data">{Math.round(loaded / 21 * 100)}%</a.span>
            </a.div>
          </div>
        </a.div>
      ),
  )
}

const PLight = () => {
  const pointL = useRef()
  const { camera } = useThree()
  //useHelper(pL2, PointLightHelper, 1, "hotpink");


  const cursor = {}
  cursor.x = 0
  cursor.y = 0
  const onMoScroll = (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5
    cursor.y = event.clientY / window.innerHeight - 0.5
  }
  window.addEventListener("mousemove", onMoScroll)

  useFrame((state) => {
    pointL.current.position.x = lerp(pointL.current.position.x, camera.position.z < -12 ? -10 : -90, 0.05)
    pointL.current.position.y = lerp(pointL.current.position.y, camera.position.z < -12 ? 20 : 25, 0.1)

    if (camera.position.z < -12 && camera.position.z > -40) {
      pointL.current.position.x += (-cursor.x) * 1
      pointL.current.position.y += (cursor.y) * 2
    }
  })


  return (
    <pointLight ref={pointL} intensity={100} position={[-90, 0, -40]} />
  )
}

export default function App() {
  const deg2rad = degrees => degrees * (Math.PI / 180);

  return (
    <div id='ll' >
      <Canvas gl={{ antialias: true, physicallyCorrectLights: true, devicePixelRatio: 2 }} camera={{ fov: 75 }}>
        <CameraController />
        <CameraTurner />
        <directionalLight position={[-5, 5, 0]} intensity={8} />
        <PLight />
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <Environment files={env} />
          <Sparticle />
          <Box />
          <Intro position={[0.1, 3, 20]} />
          <Model rotation={[0, deg2rad(-90), 0]} position={[0, -2, -10]} />
        </Suspense>
      </Canvas>
      <Loader1 />
    </div>
  )
}
