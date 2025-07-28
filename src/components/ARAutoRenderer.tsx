import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ARWrapper from "./android/ARWrapper";
import UsdzScene from "./ios/UsdzScene";

function getDeviceType(): "ios" | "android" | "desktop" {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

export default function ARAutoRenderer() {
  const { id } = useParams();
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const device = getDeviceType();

  useEffect(() => {
    if (device === "ios") {
      setIsARSupported(false);
      return;
    }

    if (navigator.xr?.isSessionSupported) {
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
  }, [device]);

  if (isARSupported === null) {
    return (
      <div style={{ padding: 20 }}>Đang kiểm tra thiết bị hỗ trợ AR...</div>
    );
  }

  return isARSupported ? (
    <ARWrapper portalId={Number(id)} />
  ) : (
    <UsdzScene portalId={Number(id)} />
  );
}
