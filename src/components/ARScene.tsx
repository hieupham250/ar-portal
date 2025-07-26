import { useLoader } from "@react-three/fiber";
import { useXRHitTest } from "@react-three/xr";
import { useRef, useState } from "react";
import * as THREE from "three";

const images = [
  {
    id: 1,
    urlImg:
      "https://res.cloudinary.com/dlnpapflp/image/upload/v1753495551/image1_mxjkqo.jpg",
  },
  {
    id: 2,
    urlImg:
      "https://res.cloudinary.com/dlnpapflp/image/upload/v1753495551/image2_xriosa.jpg",
  },
  {
    id: 3,
    urlImg:
      "https://res.cloudinary.com/dlnpapflp/image/upload/v1753495551/image3_gynu9g.jpg",
  },
  {
    id: 4,
    urlImg:
      "https://res.cloudinary.com/dlnpapflp/image/upload/v1753495551/image4_x23t25.jpg",
  },

  {
    id: 5,
    urlImg:
      "https://res.cloudinary.com/dlnpapflp/image/upload/v1753496661/image5_q4oeiq.jpg",
  },
];

export default function ARScene({ portalId }: { portalId: number }) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const tempMatrix = new THREE.Matrix4();
  const [placed, setPlaced] = useState<boolean>(false);

  const image = images.find((img) => img.id === portalId);
  const texture = useLoader(THREE.TextureLoader, image?.urlImg ?? "");

  useXRHitTest((hitTestResults, getHitPoseMatrix) => {
    const mesh = meshRef.current;
    const hit = hitTestResults[0];

    if (!mesh || placed) return;

    if (hit) {
      const matrix = getHitPoseMatrix(tempMatrix, hit);
      if (matrix) {
        mesh.visible = true;

        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        tempMatrix.decompose(position, quaternion, scale);

        mesh.position.copy(position);
        mesh.quaternion.copy(quaternion);
        // mesh.scale.setScalar(1);

        setPlaced(true);
      }
    }
  }, "viewer");
  return (
    <>
      <mesh ref={meshRef} scale={1} visible={false}>
        <sphereGeometry args={[100, 128, 128]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
    </>
  );
}
