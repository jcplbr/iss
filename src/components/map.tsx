"use client";

import { coords } from "@/lib/coords";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import Cobe from "./Cobe";

export default function Map() {
  const setCoords = useSetAtom(coords);

  useQuery({
    queryKey: ["issData"],
    queryFn: async () => {
      const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.latitude && data.longitude) {
        setCoords([data.latitude, data.longitude]);
      }
    },
    refetchOnWindowFocus: false,
    refetchInterval: 1000,
  });

  return <Cobe />;
}
