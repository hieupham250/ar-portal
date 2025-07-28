import { Canvas } from "@react-three/fiber";
import { images } from "../../data/data-img-vr360";
import { OrbitControls } from "@react-three/drei";
import ModelUsdz from "./ModelUsdz";

export default function UsdzScene({ portalId }: { portalId: number }) {
  const image = images.find((img) => img.id === portalId);

  return (
    <Canvas>
      <OrbitControls rotateSpeed={-0.5} />
      <ModelUsdz image={image!} />
      <ambientLight intensity={1} />
    </Canvas>
  );
}
