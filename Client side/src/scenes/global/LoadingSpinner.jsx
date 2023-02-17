import React from "react";

export default function LoadingSpinner({ isDashboard }) {
  return (
    <>
      {isDashboard ? (
        <div className="spinner-container-dashboard">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="spinner-container">
          <div className="loading-spinner"></div>
        </div>
      )}
    </>
  );
}
