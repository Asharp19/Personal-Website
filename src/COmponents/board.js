import React, { useRef } from "react";
import color from '../static/board2Col1.jpg'
import normal from '../static/board1Norm1.jpg'
import roughness from '../static/board2Rough1.jpg'
import ao from '../static/board2AO1.jpg'
import metal from '../static/board1Metal1.jpg'
import { DoubleSide, TextureLoader } from "three";

import { lerp } from "three/src/math/MathUtils";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
export function Billboard(props) {
    const { camera } = useThree()
    const board1 = useRef()
    const normal1 = useLoader(TextureLoader, normal)
    const roughness1 = useLoader(TextureLoader, roughness)
    const color1 = useLoader(TextureLoader, color)
    const ao1 = useLoader(TextureLoader, ao)
    const metal1 = useLoader(TextureLoader, metal)
    useFrame(() => {
        board1.current.position.z = lerp(board1.current.position.z, camera.position.z < -12 ? 20 : 102, 0.074)
        board1.current.position.y = lerp(board1.current.position.y, camera.position.z < -12 ? 8 : 17, 0.1)
        board1.current.rotation.x = camera.position.z < -12 ? 0 : 0.05
    })

    return (
        <mesh
            ref={board1}
            position={[-16, 17, 102]}
            scale={[25, 15, -1.78]}
            rotation={[0.03, 0, 0]}
        >
            <planeBufferGeometry args={[2, 2]} />
            <meshPhysicalMaterial
                map={color1}
                roughnessMap={roughness1}
                aoMap={ao1}
                normalMap={normal1}
                metalnessMap={metal1}
                side={DoubleSide} />
        </mesh>
    );
}

