import React from "react";

export default function unAuthorize() {
  return (
    <>
    <div className="w-full items-center justify-center flex p-20">
      <div className="w-200 h-20 border-white-2 rounded-lg shadow-red-300 shadow-2xl items-center flex justify-center">
      <p className="text-lg font-serif">You do not have the necessary permissions to access this resource.</p>
      </div>
    </div>
    </>
  );
}
