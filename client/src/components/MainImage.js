// src/components/MainImage.js
import React from 'react';
import mainImage from 'client/github.jpg'; // Assuming you created an `assets` folder in `src`

const MainImage = () => {
  return (
    <div>
      <img src={mainImage} alt="Main Image" style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  );
};

export default MainImage;