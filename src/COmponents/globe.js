import normal1 from '../static/sphere2Norm1.jpg'
import color1 from '../static/sphere2Col1.jpg'
import color2 from '../static/sphere2Col1b.jpg'
import ao1 from '../static/sphere2AO1.jpg'
import rough1 from '../static/sphere2Rough1.jpg'
import aboutM from '../static/about2.jpg'
import { useTexture } from '@react-three/drei'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import React, { useState, useRef, useEffect } from 'react';
import "../App.css"
import { degToRad, lerp } from 'three/src/math/MathUtils';
import { DoubleSide, TextureLoader } from 'three';

export function Box(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const normals = useTexture(normal1)
    const col1 = useTexture(color1)
    const col2 = useTexture(color2)
    const AO1 = useTexture(ao1)
    const roughness1 = useTexture(rough1)
    const about1 = useLoader(TextureLoader, aboutM)
    const ref = useRef()
    const ref2 = useRef()
    const { camera } = useThree()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame

    useFrame((state) => {
        ref.current.rotation.y += 0.001;

    })
    useFrame((state, delta) => {
        if (clicked) {
            document.body.style.overflow = "hidden"
            ref.current.position.z = camera.position.z - 1.2
            ref.current.position.x = 0
            ref.current.position.y = 1.5
        }
        else {
            document.body.style.overflow = "auto"
            ref.current.position.z = -80.72
            ref.current.position.x = 129.25
            ref.current.position.y = 75
        }

        ref2.current.position.z = camera.position.z - 1.44
        ref2.current.position.y = lerp(ref2.current.position.y, clicked ? camera.position.y : 20, 0.1)

    })


    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto'
    }, [hovered])



    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <group>
            <mesh
                {...props}
                position={[-10.72 - 60, 75, -9.25 - 120]}
                rotation={[0.2, 0, 0]}
                ref={ref}
                scale={clicked ? 1 : 22}
                onClick={
                    (event) => {
                        if (camera.rotation.y > degToRad(-10)) {
                            event.stopPropagation()
                            click(!clicked)
                        }
                    }}
                onPointerOver={(event) => hover(true)}
                onPointerOut={(event) => hover(false)}>
                <sphereGeometry args={[0.5, 64, 32]} />
                <meshPhysicalMaterial
                    map={hovered ? col2 : col1}
                    normalMap={normals}
                    roughnessMap={roughness1}
                    aoMap={AO1}
                    side={DoubleSide}
                    envMapIntensity={0.3} />
            </mesh>
            <mesh position={[0, 0, 0]} rotation={[0.1, 0, 0]} ref={ref2} onClick={(e) => { e.stopPropagation() }}>
                <planeBufferGeometry args={[6, 3]} />
                <meshBasicMaterial color={0xffffff} transparent={true} map={about1} />
            </mesh>
        </group>
    )
}