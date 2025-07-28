import { useLoader, useThree } from "@react-three/fiber";
import { useXRHitTest } from "@react-three/xr";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function ARScene({
  image,
}: {
  image: { id: number; urlImg: string };
}) {
  const { camera } = useThree();
  const meshRef = useRef<THREE.Mesh | null>(null);
  const draggingRef = useRef<boolean>(false);
  const [placed, setPlaced] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const tempMatrix = new THREE.Matrix4();

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

        setPlaced(true);
      }
    }
  }, "viewer");

  useEffect(() => {
    let lastDistance = 0;
    let lastAngle = 0;

    function getTouchDistance(event: TouchEvent) {
      if (event.touches.length !== 2) return 0;
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function getTouchAngle(event: TouchEvent) {
      if (event.touches.length !== 2) return 0;
      const dx = event.touches[1].clientX - event.touches[0].clientX;
      const dy = event.touches[1].clientY - event.touches[0].clientY;
      return Math.atan2(dy, dx);
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const newDistance = getTouchDistance(event);
        const newAngle = getTouchAngle(event);

        if (lastDistance) {
          const delta = newDistance - lastDistance;
          setZoomScale((prev) => {
            const next = prev + delta * 0.001;
            return Math.max(0.1, Math.min(2, next));
          });
        }

        if (lastAngle && meshRef.current) {
          const deltaAngle = newAngle - lastAngle;
          meshRef.current.rotation.y += deltaAngle;
        }

        lastDistance = newDistance;
        lastAngle = newAngle;
      }
    };

    const handleTouchEnd = () => {
      lastDistance = 0;
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  // Kéo quả cầu bằng 1 ngón
  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const tapPosition = new THREE.Vector2();

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        tapPosition.set(x, y);

        raycaster.setFromCamera(tapPosition, camera);

        if (meshRef.current) {
          const intersects = raycaster.intersectObject(meshRef.current);
          if (intersects.length > 0) {
            draggingRef.current = true;
          }
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (draggingRef.current && e.touches.length === 1) {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        tapPosition.set(x, y);

        raycaster.setFromCamera(tapPosition, camera);

        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersection);

        if (intersection && meshRef.current) {
          meshRef.current.position.copy(intersection);
        }
      }
    };

    const handleTouchEnd = () => {
      draggingRef.current = false;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [camera]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(zoomScale, zoomScale, zoomScale);
    }
  }, [zoomScale]);

  return (
    <>
      <mesh ref={meshRef} visible={false}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
    </>
  );
}
