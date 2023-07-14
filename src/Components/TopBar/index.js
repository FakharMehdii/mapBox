import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "../../App.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZmFraGFybWVoZGkiLCJhIjoiY2xrMTU3ajBiMDNvcjNmamtuaTM1ZXQzaiJ9.6tkP4L4eJbxeTYCrzQGzWg";

export const TopBar = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(74.3587);
  const [lat, setLat] = useState(31.5204);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      })
    );
  });
  useEffect(() => {
    if (!map.current) return;
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const shema = yup.object().shape({
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
    resolver: yupResolver(shema),
  });
  const onSubmitHandler = (data) => {
    map.current &&
      map.current.flyTo({
        center: [data.longitude, data.latitude],
      });
    reset();
  };

  return (
    <>
      <div className="top-bar">
        <h1>
          <strong className="welcoming-note">Welcome To Maps!</strong>
        </h1>

        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="co-ordinate-form"
        >
          <input
            {...register("longitude")}
            className="longitude-input"
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
            className="latitude-input"
            type="text"
            placeholder="Enter Latitude"
            required
          />
          {errors.latitude && (
            <p className="errorMessage"> {errors.latitude.message}</p>
          )}
          <input type="submit" className="submit-button" />
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
};
