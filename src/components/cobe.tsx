"use client";

import { coords } from "@/lib/coords";
import createGlobe from "cobe";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

export default function Cobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const locationToAngles = (lat: number, long: number) => {
    return [
      Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
      (lat * Math.PI) / 180,
    ];
  };

  const focusRef = useRef([0, 0]);
  const markerRef = useRef<[number, number]>([0, 0]);

  const data = useAtomValue(coords);

  if (data) {
    focusRef.current = locationToAngles(data[0], data[1]);
    markerRef.current = [data[0], data[1]];
  }

  useEffect(() => {
    let width = 0;
    let currentPhi = 0;
    let currentTheta = 0;
    const doublePi = Math.PI * 2;
    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth);

    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [251 / 255, 200 / 255, 21 / 255],
      glowColor: [0.2, 0.2, 0.2],
      markers: [{ location: markerRef.current, size: 0.1 }],
      onRender: (state) => {
        state.markers = [{ location: markerRef.current, size: 0.1 }];

        state.phi = currentPhi;
        state.theta = currentTheta;
        const [focusPhi, focusTheta] = focusRef.current;
        const distPositive = (focusPhi - currentPhi + doublePi) % doublePi;
        const distNegative = (currentPhi - focusPhi + doublePi) % doublePi;

        // Control the speed
        if (distPositive < distNegative) {
          currentPhi += distPositive * 0.08;
        } else {
          currentPhi -= distNegative * 0.08;
        }

        currentTheta = currentTheta * 0.92 + focusTheta * 0.08;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => {
      if (!canvasRef.current) return;
      return (canvasRef.current.style.opacity = "1");
    });
    return () => globe.destroy();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        aspectRatio: 1,
        margin: "auto",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
