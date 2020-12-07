import React from 'react';

import css from './ArtIndexArtistThumbnail.module.scss';

type Props = {
  file?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
};

const ArtIndexArtistThumbnail: React.FC<Props> = ({
  file,
  alt,
  size = 'md',
  className,
}) => {
  return (
    <span
      className={[
        css.artIndexArtistThumbnail,
        size === 'sm' ? css.sizeSm : '',
        size === 'xs' ? css.sizeXs : '',
        className || '',
      ].join(' ')}
    >
      {file && (
        <img
          alt={alt}
          className={css.image}
          src={`/art-index/images/artists/${file}`}
        />
      )}
    </span>
  );
};

export default ArtIndexArtistThumbnail;
