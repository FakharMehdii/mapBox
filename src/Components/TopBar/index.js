import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "../../App.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

export const TopBar = ({ map }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
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
    map &&
      map.flyTo({
        center: [data.longitude, data.latitude],
      });
    reset();
  };

  return (
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
  );
};
