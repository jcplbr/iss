"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { coords } from "@/lib/coords";
import { useAtomValue } from "jotai";
import styles from "./cobe.module.css";

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
    let height = 0;
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
      theta: 0,
      dark: 1,
      diffuse: 3,
      mapSamples: 32000,
      mapBrightness: 1,
      baseColor: [1, 1, 1],
      markerColor: [251 / 255, 200 / 255, 21 / 255],
      // markerColor: [94 / 255, 92 / 255, 230 / 255],
      glowColor: [0.2, 0.2, 0.2],
      markers: [{ location: markerRef.current, size: 0.08 }],
      scale: 1,
      offset: [width * 0.25, height * 0.25],
      onRender: (state) => {
        state.markers = [{ location: markerRef.current, size: 0.08 }];

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
        state.height = height * 2;
      },
    });

    setTimeout(() => {
      if (!canvasRef.current) return;
      return (canvasRef.current.style.opacity = "1");
    });
    return () => globe.destroy();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.cobe_wrapper}>
        <canvas
          ref={canvasRef}
          className={styles.cobe_content}
          style={{
            contain: "layout paint size",
          }}
        />
      </div>
    </div>
  );
}
