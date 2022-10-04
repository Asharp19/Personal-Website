
import { useGLTF } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import scene2 from '../static/sites1.glb'
import * as THREE from 'three'
import bakedT from '../static/main9.jpg';
import dload from "../static/dload3.jpg"
import { MainMesh } from "./mainmesh";
import { WavyPlane } from "./wavyPlane";
import { degToRad, lerp } from "three/src/math/MathUtils";
import "../App.css"
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Billboard } from "./board";

gsap.registerPlugin(ScrollTrigger)


const vh = (coef) => window.innerHeight * (coef / 100);

export function Model(props) {
    //download resume
    const downloadFile = (e) => {
        const link = document.createElement("a")

        link.href = 'https://drive.google.com/uc?export=download&id=1BBexGEgaoflDEXyRLYLVnYVwIG3HRaKi'

        document.body.appendChild(link)

        link.click()

        document.body.removeChild(link);
    }


    //model
    const { nodes } = useGLTF(scene2);
    const sceneBake = useLoader(THREE.TextureLoader, bakedT)

    sceneBake.flipY = false
    sceneBake.encoding = THREE.sRGBEncoding;
    const basicMat = useMemo(() => new THREE.MeshBasicMaterial({ map: sceneBake }), []);
    const basicMat1 = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), [])
    const basicMat2 = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), [])
    const dload1 = useLoader(THREE.TextureLoader, dload)


    const { camera } = useThree()
    const download = useRef()
    const ring = useRef()
    const dlogo = useRef()
    const dOpa = useRef()

    const [hovered, hover] = useState(false)

    useEffect(() => {
        gsap.to(basicMat2.color, {
            scrollTrigger: {
                start: vh(230) + " 40%",
                end: vh(260) + " 40%",
                scrub: 2
            },
            r: 0,
            g: 0,
            b: 0
        })
    }, [basicMat2.color])

    useFrame(() => {
        ring.current.rotation.y += camera.position.z / 10000;
        ring.current.rotation.z = camera.position.z / 100;
        dOpa.current.opacity = lerp(dOpa.current.opacity, camera.position.z < -45 ? 1 : 0, 0.05)
    })

    useFrame(() => {
        if (camera.position.z < -40) {
            dlogo.current.position.y = 1.25
        }
        else {
            dlogo.current.position.y = -10
        }
        download.current.material.wireframe = hovered ? true : false
    })



    return (
        <group {...props} dispose={null}>

            <WavyPlane position={[-54, 6.62, 0]} />

            <MainMesh material={basicMat} />

            <Billboard />

            <mesh
                geometry={nodes.Torus001.geometry}
                material={basicMat}
                ref={ring}
                position={[-10.72 - 60, 75, -9.23 - 120]}
                rotation={[0.39, 0, 0]}
                scale={[8 * 3, 1 * 3, 8 * 3]}
            />


            <mesh
                geometry={nodes.Cube003.geometry}
                material={basicMat2}
                position={[-53.18, 0.93, 0.08]}
                ref={download}
                onPointerOver={(event) => hover(true)}
                onPointerOut={(event) => hover(false)} />

            <mesh rotation={[0, degToRad(90), 0]} position={[-52, 0, 0.08]} ref={dlogo} onClick={downloadFile}>
                <planeBufferGeometry args={[4.5, 1.6]} />
                <meshBasicMaterial ref={dOpa} map={dload1} opacity={0} transparent={true} />
            </mesh>



            <mesh
                geometry={nodes.Cube004.geometry}
                material={basicMat1}
                position={[-6, -0.04, 0]}
                scale={[1, 1.26, 1.69]}
            />

            <mesh
                geometry={nodes.Cube005.geometry}
                material={basicMat}
                position={[-6, 0.06, 0]}
            />
        </group >
    );
}

useGLTF.preload(scene2);
