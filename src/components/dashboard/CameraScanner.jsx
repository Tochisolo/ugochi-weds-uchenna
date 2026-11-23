import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { body, field } from "../../lib/styles";

// Reads QR codes from a webcam or a phone camera. Needs https (or localhost) and camera permission.
export default function CameraScanner({ onScan }) {
  const videoRef = useRef(null);
  const onScanRef = useRef(onScan); // so a new onScan never restarts the camera
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");   // what the manager picked ("" = best guess)
  const [activeId, setActiveId] = useState("");   // what is actually running
  const [error, setError] = useState("");

  useEffect(() => { onScanRef.current = onScan; }, [onScan]);

  useEffect(() => {
    let stream, timer, stopped = false;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const tick = () => {
      const v = videoRef.current;
      if (stopped || !v) return;
      if (v.readyState >= 2 && v.videoWidth) {
        const scale = Math.min(1, 640 / v.videoWidth); // smaller frames decode faster
        canvas.width = Math.round(v.videoWidth * scale);
        canvas.height = Math.round(v.videoHeight * scale);
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hit = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
        if (hit?.data) onScanRef.current(hit.data);
      }
      timer = setTimeout(tick, 150);
    };

    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) return setError("Camera access needs a secure (https) connection and a supported browser.");
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (stopped) return stream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setError("");
        setActiveId(stream.getVideoTracks()[0]?.getSettings().deviceId || "");
        setDevices((await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "videoinput"));
        tick();
      } catch (e) {
        setError(
          e.name === "NotAllowedError" ? "Camera permission was blocked. Allow camera access in the browser's address bar, then try again."
          : e.name === "NotFoundError" ? "No camera was found on this device."
          : "Couldn't start the camera. It may be in use by another app.");
      }
    })();

    return () => { stopped = true; clearTimeout(timer); stream?.getTracks().forEach((t) => t.stop()); };
  }, [deviceId]);

  return (
    <div className={`${body} space-y-3`}>
      {error ? <p role="alert" className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</p> : (
        <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl bg-black">
          <video ref={videoRef} playsInline muted className="aspect-[4/3] w-full object-cover" />
          <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-white/70" />
        </div>
      )}
      {devices.length > 1 && (
        <select className={`${field} mx-auto block max-w-md`} aria-label="Choose camera" value={deviceId || activeId}
          onChange={(e) => setDeviceId(e.target.value)}>
          {devices.map((d, n) => <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${n + 1}`}</option>)}
        </select>
      )}
      <p className="text-center text-sm text-[#4A4458]/70">Hold the pass's QR code inside the frame.</p>
    </div>
  );
}