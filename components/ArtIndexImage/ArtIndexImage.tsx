import React from 'react';

import Image from '../Image';
import basePath from '../../lib/base-path';

const ArtIndexImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  ...restProps
}) => {
  return <Image src={`${basePath}${src}`} {...restProps} />;
};

export default ArtIndexImage;
