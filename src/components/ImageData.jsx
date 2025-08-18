import React, { useEffect, useState } from 'react';

// Example data structure (mocked for illustration)
const surveyData = {
  createdAt: "2024-07-26T21:50:01.942Z",
  date: "2024-07-03T00:00:00.000Z",
  description: "My House is Very Beautiful !!!!!",
  location: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
  name: "M.Abubakar",
  phone: 3056307881,
  status: "pending",
  survey: [
    {
      type: "Elevation",
      images: [
        {
          time: { from: "00:00", to: "00:00" },
          latitude: 31.4037108,
          longitude: -81.1234567, // Mocked data
          _id: "66a41acb547add01ce6929b0"
        },
        {
            time: { from: "00:00", to: "00:00" },
            latitude: 31.4037108,
            longitude: -81.1234567, // Mocked data
            _id: "66a41acb547add01ce6929b0"
          },
          {
            time: { from: "00:00", to: "00:00" },
            latitude: 31.4037108,
            longitude: -81.1234567, // Mocked data
            _id: "66a41acb547add01ce6929b0"
          },
        // More images...
      ]
    },
    // More survey items...
  ],
  title: "House",
  __v: 1,
  _id: "66a41a09547add01ce692977"
};

function ImageData() {
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    // Extracting latitude and longitude from survey data
    const images = surveyData.survey.flatMap(surveyItem => surveyItem.images);
    const coordinates = images.map(image => ({
      id: image._id,
      latitude: image.latitude,
      longitude: image.longitude
    }));
    setImageData(coordinates);
  }, []);

  return (
    <div>
      <h1>Survey Images Coordinates</h1>
      <ul>
        {imageData.map(image => (
          <li key={image.id}>
            <p>Image ID: {image.id}</p>
            <p>Latitude: {image.latitude}</p>
            <p>Longitude: {image.longitude}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ImageData;
