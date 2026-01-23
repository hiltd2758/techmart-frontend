import React from "react";
import { useState, useEffect } from "react";

const TotalCart = ({ total }) => {
  return (
    <>
      <div className="w-full flex items-center justify-between mb-4">
        <h4>Total:</h4>
        <p>${total}</p>
      </div>
    </>
  );
};
export default TotalCart;
