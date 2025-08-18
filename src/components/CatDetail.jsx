import  { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrlImg } from "../Config/Urls";
import { IoArrowBackSharp } from "react-icons/io5";
import { GoDash } from "react-icons/go";
import { FaPlus } from "react-icons/fa";

function CategoryDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = location.state || {};
  console.log("category", category);
  const [selectedImage, setSelectedImage] = useState(null);

  if (!category) {
    return <p>No category data available.</p>;
  }

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="px-5">
      <div className=" my-5">
        <button
          onClick={() => navigate(-1)}
          className=" px-2 py-2  rounded-full bg-[#DDDDDD]"
        >
          <IoArrowBackSharp className="w-6 h-6" />
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{category.type}</h1>
      <div className="grid grid-cols-3 gap-4">
        {category.images.map((image, index) => (
          <div
            key={index}
            className="relative bg-gray-100 p-4 rounded-lg cursor-pointer"
            onClick={() => handleImageClick(image)}
          >
            <img
              src={`${baseUrlImg}/${image.image}`}
              alt={`image ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />

            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 p-4 rounded-lg text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-lg font-semibold">
                Longitude: {image.longitude}
              </p>
              <p className="text-lg font-semibold">
                Latitude: {image.latitude}
              </p>
              <p className="text-lg font-semibold">
                Elevation: {image.elevation}m
              </p>
              <p className="text-lg font-semibold">
                Date:{" "}
                {new Date(image.date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-[#f5f5f5]  max-w-[800px] min-h-[450px] w-full relative"
            onClick={(e) => e.stopPropagation()} // Prevent click events from closing the modal
          >
            <button
              className="absolute z-[999] top-3 right-5 text-white p-2 "
              onClick={closeModal}
            >
              X
            </button>
            <img
              src={`${baseUrlImg}/${selectedImage}`}
              alt={"selected image"}
              className="w-full h-[450px] object-cover "
            />
            <div className=" absolute top-0 left-0  text-white z-50 w-full h-full ">
              {selectedImage && (
                <div className=" flex flex-col w-full justify-between h-full ">
                  <div className="flex flex-col  items-center justify-center">
                    <p className="text-3xl font-semibold text-center leading-8 bg-green-900 w-full py-3">
                      566467654764
                    </p>
                    <div className="flex items-center w-full text-center gap-20 justify-center py-1 text-[22px] leading-6 font-medium bg-black/50">
                      <p className="text-2xl  ">{selectedImage?.longitude}</p>

                      <p className="text-2xl flex items-center ">
                        <GoDash className="w-3 h-3" />
                        {selectedImage?.latitude}
                      </p>
                      <p className="text-2xl flex gap-1 items-center ">
                        <div className="flex items-center  justify-center flex-col">
                          <FaPlus className="w-3 h-3 mt-1" />
                          <GoDash className="w-3 h-3" />
                        </div>
                        <p className="text-2xl ">
                          {`${parseInt(selectedImage?.elevation, 10)}`}
                        </p>
                        <span className="text-[16px] font-medium left-6">
                          m
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="w-full justify-end bg-black/50">
                    <p className="text-2xl text-end w-full py-1 px-1">
                      {selectedImage?.date
                        ? new Date(selectedImage.date).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false, // Ensures AM/PM format
                          })
                        : "No date available"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryDetail;