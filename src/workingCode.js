import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZmFraGFybWVoZGkiLCJhIjoiY2xrMTU3ajBiMDNvcjNmamtuaTM1ZXQzaiJ9.6tkP4L4eJbxeTYCrzQGzWg";

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(69.3451);
  const [lat, setLat] = useState(30.3753);
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const schema = yup.object().shape({
    longitude: yup
      .number()
      .required()
      .max(180, "Longitude cannot be greater than 180")
      .min(-180, "longitude cannot be less than -180"),
    latitude: yup
      .number()
      .required()
      .max(90, "latitude cannot be greater than 90")
      .min(-90, "latitude cannot be less than -90"),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (data) => {
    console.log("hello", data, data.latitude, data.longitude);
    setLat(data.latitude);
    setLng(data.longitude);
    console.log("hello", lat, lng);

    map.current.flyTo({ center: [data.longitude, data.latitude] });
    reset();
  };

  return (
    <>
      <div className="top-bar">
        <h1 className="welcoming-note">
          <strong>Welcome To Maps!</strong>
        </h1>

        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="co-ordinate-form"
        >
          <input
            {...register("longitude")}
            type="text"
            placeholder="Enter Longitude"
            autoFocus
            required
          />
          {errors.longitude && (
            <p className="errorMessage"> {errors.longitude.message}</p>
          )}
          <input
            {...register("latitude")}
            type="text"
            placeholder="Enter Latitude"
            autoFocus
            required
          />
          {errors.latitude && (
            <p className="errorMessage"> {errors.latitude.message}</p>
          )}
          <input type="submit" />
        </form>
      </div>
      <div>
        <span className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </span>
        <div ref={mapContainer} className="map-container" />
      </div>
    </>
  );
}
