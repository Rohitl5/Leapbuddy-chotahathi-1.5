"use client";
import React, { useState } from "react";

type PDF = {
  id: number;
  pdfName: string;
  pdfUrl: string;
};

type Props = {
  pdfList: PDF[];
};

const PDFViewer = ({ pdfList }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the currently displayed PDF

  const handleNext = () => {
    if (currentIndex < pdfList.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const currentPDF = pdfList[currentIndex];

  return (
    <div className="flex flex-col h-full">
      {/* PDF Title */}
      <div className="p-4 bg-gray-200 text-center text-lg font-semibold">
        {currentPDF?.pdfName || "Untitled PDF"}
      </div>
      
      {/* PDF Viewer */}
      <div className="flex-1">
        <iframe
          src={`https://docs.google.com/gview?url=${currentPDF?.pdfUrl}&embedded=true`}
          className="w-full h-full"
          frameBorder="0"
        ></iframe>
      </div>
      
      {/* Navigation Controls */}
      <div className="p-4 bg-gray-200 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded ${
            currentIndex === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === pdfList.length - 1}
          className={`px-4 py-2 rounded ${
            currentIndex === pdfList.length - 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;
