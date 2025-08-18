import React, { useState } from 'react';
import { baseUrlImg } from '../Config/Urls';
import { GoDash } from 'react-icons/go';
import { FaPlus, FaDownload, FaEye } from 'react-icons/fa';

function SurveyDetailsItems({ data }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageDetails, setSelectedImageDetails] = useState(null);

  const handleImageClick = (image, longitude, latitude, elevation, date) => {
    if (!image) {
      alert("No image available to view.");
      return;
    }
    setSelectedImage(image === selectedImage ? null : image);
    setSelectedImageDetails(image === selectedImage ? null : { longitude, latitude, elevation, date });
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setSelectedImageDetails(null);
  };

  const handleDownloadImage = (imageUrl) => {
    if (!imageUrl) {
      alert("No image available to download.");
      return;
    }

    const link = document.createElement('a');
    link.href = `${baseUrlImg}/${imageUrl}`;
    link.download = imageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const images = data ? data.flatMap(category => category.images) : [];

  return (
    <div className="p-6 flex flex-col gap-10">
      {images.length > 0 ? (
        <div className="flex flex-wrap gap-6 py-2">
          {images.map((item, index) => (
            <div
              key={index}
              className={`bg-white w-[311px] h-[172px] relative rounded-lg text-white cursor-pointer transition-transform transform ${
                selectedImage === item.image ? 'scale-105 border-4 border-blue-500' : 'scale-100'
              }`}
            >
              <img
                src={item.image ? `${baseUrlImg}/${item.image}` : 'path/to/placeholder-image.png'}
                alt="image"
                className="w-full h-full rounded-md object-cover"
              />
              <div className="w-full h-full rounded-lg absolute top-0 left-0">
                <div className="flex flex-col w-full justify-between h-full">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center w-full text-center gap-10 justify-center py-1 text-[16px] leading-6 font-medium bg-black/50">
                      <p className="text-[16px]">{item?.longitude}</p>
                      <p className="text-[14px] flex items-center">
                        <GoDash className="w-3 h-3" />
                        {item?.latitude}
                      </p>
                      <p className="text-xl flex gap-1 items-center">
                        <div className="flex items-center justify-center flex-col">
                          <FaPlus className="w-3 h-3 mt-1" />
                          <GoDash className="w-3 h-3" />
                        </div>
                        <p className="text-[14px]">
                          {`${parseInt(item?.elevation, 10)}`}
                        </p>
                        <span className="text-[14px] font-medium left-6">m</span>
                      </p>
                    </div>
                  </div>
                  <div className="w-full justify-end bg-black/50">
                    <p className="text-[14px] text-end w-full py-1 px-1">
                      {item?.date
                        ? new Date(item.date).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                          })
                        : 'No date available'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
  <button
    className={`p-1 bg-gray-800 rounded-full hover:bg-gray-700 transition-all ${
      !item.image ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    onClick={(e) => {
      e.stopPropagation();
      if (item.image) {
        handleDownloadImage(item.image);
      }
    }}
    title={item.image ? "Download Image" : "No image available"}
    disabled={!item.image}
  >
    <FaDownload className="w-5 h-5 text-red-400" />
  </button>
  <button
    className={`p-1 bg-gray-800 rounded-full hover:bg-gray-700 transition-all ${
      !item.image ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    onClick={(e) => {
      e.stopPropagation();
      if (item.image) {
        handleImageClick(item.image, item.longitude, item.latitude, item.elevation, item.date);
      }
    }}
    title={item.image ? "View Image" : "No image available"}
    disabled={!item.image}
  >
    <FaEye className="w-5 h-5 text-green-400" />
  </button>
</div>

            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No data found</p>
      )}

      {/* Full-screen modal for displaying the selected image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={`${baseUrlImg}/${selectedImage}`}
              alt="Selected"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            {selectedImageDetails && (
              <div className="absolute bottom-4 left-4 bg-black/70 text-white p-4 rounded-lg">
                <p><strong>Longitude:</strong> {selectedImageDetails.longitude}</p>
                <p><strong>Latitude:</strong> {selectedImageDetails.latitude}</p>
                <p><strong>Elevation:</strong> {selectedImageDetails.elevation} m</p>
                <p><strong>Date:</strong> {new Date(selectedImageDetails.date).toLocaleString()}</p>
              </div>
            )}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SurveyDetailsItems;