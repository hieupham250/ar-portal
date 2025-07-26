import { Canvas } from "@react-three/fiber";
import { createXRStore, XR } from "@react-three/xr";
import { Button, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ARScene from "./ARScene";

export default function ARWrapper() {
  const store = useMemo(() => createXRStore(), []);
  const { id } = useParams();
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);

  useEffect(() => {
    if (navigator.xr && navigator.xr.isSessionSupported) {
      navigator.xr
        .isSessionSupported("immersive-ar")
        .then((supported) => {
          setIsARSupported(supported);
        })
        .catch((err) => {
          console.error(err);
          setIsARSupported(false);
        });
    } else {
      setIsARSupported(false);
    }
  }, []);
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
        {isARSupported === null ? (
          <Spin size="large" tip="Đang kiểm tra hỗ trợ AR..." />
        ) : isARSupported ? (
          <Button type="primary" size="large" onClick={() => store.enterAR()}>
            Bắt đầu AR
          </Button>
        ) : null}
      </div>

      <Canvas
        style={{ width: "100vw", height: "100vh" }}
        gl={{ antialias: true, alpha: true }}
        camera={{ near: 0.01, far: 20, fov: 70 }}
      >
        {isARSupported ? (
          <XR store={store}>
            <ambientLight />
            <ARScene portalId={Number(id)} />
          </XR>
        ) : null}
      </Canvas>
    </>
  );
}
