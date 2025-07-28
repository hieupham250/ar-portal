import { Html } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { Button } from "antd";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";

export default function ModelUsdz({
  image,
}: {
  image: { id: number; urlImg: string };
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const exporter: any = useMemo(() => new USDZExporter(), []);
  const texture = useLoader(THREE.TextureLoader, image?.urlImg ?? "");

  const geometry = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 128, 128);
    g.scale(-1, 1, 1); // Đảo hướng normal
    return g;
  }, []);

  const handleExport = async () => {
    if (!meshRef.current) return;

    try {
      const arraybuffer = await exporter.parse(meshRef.current);
      const blob = new Blob([arraybuffer], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "model.usdz";
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting USDZ:", error);
    }
  };

  return (
    <>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      <Html>
        <Button onClick={handleExport}>Export USDZ</Button>
      </Html>
    </>
  );
}
