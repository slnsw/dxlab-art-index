import React from 'react';

const Image: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  alt,
  ...restProps
}) => {
  return <img alt={alt} {...restProps} />;
};

export default Image;
