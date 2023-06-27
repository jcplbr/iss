"use client";

import { coords } from "@/lib/coords";
import { useAtomValue } from "jotai";
import styles from "./card.module.css";

export default function Card() {
  const data = useAtomValue(coords);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        The{" "}
        <abbr title="International Space Station" className={styles.underline}>
          ISS
        </abbr>{" "}
        is at:
      </h1>
      <h2 className={styles.coords_wrapper}>
        <span className={styles.coords_info}>Latitude</span>
        <span className={styles.coords_numbers}>{data[0].toFixed(3)}</span>
      </h2>
      <h2 className={styles.coords_wrapper}>
        <span className={styles.coords_info}>Longitude</span>
        <span className={styles.coords_numbers}>{data[1].toFixed(3)}</span>
      </h2>
    </div>
  );
}
