"use client";

import { coords } from "@/lib/coords";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import Cobe from "./Cobe";

export const runtime = "edge";

export default function Map() {
  const setCoords = useSetAtom(coords);

  useQuery({
    queryKey: ["issData"],
    queryFn: async () => {
      const res = await fetch("/api/issData");
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
