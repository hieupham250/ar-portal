import { Canvas } from "@react-three/fiber";
import { createXRStore, XR } from "@react-three/xr";
import { Button } from "antd";
import { useMemo } from "react";
import ARScene from "./ARScene";
import { images } from "../../data/data-img-vr360";

export default function ARWrapper({ portalId }: { portalId: number }) {
  const store = useMemo(() => createXRStore(), []);
  const image = images.find((img) => img.id === portalId);

  return (
    <>
      <div
        style={{
          position: "absolute",
          zIndex: 9999,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Button type="primary" size="large" onClick={() => store.enterAR()}>
          Bắt đầu AR
        </Button>
      </div>

      <Canvas
        style={{ width: "100vw", height: "100vh" }}
        gl={{ antialias: true, alpha: true }}
      >
        <XR store={store}>
          <ambientLight />
          <ARScene image={image!} />
        </XR>
      </Canvas>
    </>
  );
}
