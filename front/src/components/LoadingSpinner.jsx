import React from "react";
import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="spinner">
      <ClipLoader className="spinner" color="#36d7b7" size={40} />
    </div>
  );
};

export default LoadingSpinner;
