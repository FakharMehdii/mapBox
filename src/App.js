import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { TopBar } from "./Components/TopBar";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZmFraGFybWVoZGkiLCJhIjoiY2xrMTU3ajBiMDNvcjNmamtuaTM1ZXQzaiJ9.6tkP4L4eJbxeTYCrzQGzWg";

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(69.3451);
  const [lat, setLat] = useState(30.3753);
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  });
  useEffect(() => {
    if (!map.current) return;
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <>
      <TopBar lng={lng} lat={lat} map={map.current} />
      <div>
        <span className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </span>
        <div ref={mapContainer} className="map-container" />
      </div>
    </>
  );
}
