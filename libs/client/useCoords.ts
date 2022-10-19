import { useEffect, useState } from "react";

interface useCoordState {
  longitude: number | null;
  latitude: number | null;
}
export default function useCoords() {
  const [coords, setCoords] = useState<useCoordState>({
    latitude: null,
    longitude: null,
  });
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    // console.log(coords);
    setCoords({ latitude, longitude });
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess);
  }, []);
  return coords;
}
