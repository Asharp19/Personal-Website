import { useGLTF } from "@react-three/drei"
import sceneMain from '../static/sites.glb'

export function MainMesh(props) {
    const { nodes } = useGLTF(sceneMain)

    return (
        <mesh
            castShadow
            receiveShadow
            geometry={nodes.meshmain.geometry}
            position={[-53.43, 20.44, -0.09]}
            {...props}
        >
        </mesh>
    )

}