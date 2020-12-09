import React from 'react';

import ArtIndexImage from '../ArtIndexImage';
import Link from '../Link';

import { useArtIndex } from '../../lib/contexts/art-index-context';

import css from './ArtIndexArtistList.module.scss';

type Props = {
  className?: string;
};

const ArtIndexArtistList: React.FC<Props> = ({ className }) => {
  const { state } = useArtIndex();
  const { artists } = state;
  const count = 39;
  const remainingArtistsCount = artists.length - count;

  return (
    <div className={[css.artIndexArtistList, className || ''].join(' ')}>
      {artists
        .filter((a) => {
          return a.thumbnailFile !== '';
        })
        .slice(0, count)
        .map((artist) => {
          return (
            <div className={css.artist} key={artist.id}>
              <Link as={`/artist/${artist.id}`}>
                <a>
                  <ArtIndexImage
                    alt={`${artist.firstName} ${artist.lastName} (${artist.worksTotal} works)`}
                    title={`${artist.firstName} ${artist.lastName} (${artist.worksTotal} works)`}
                    className={css.artistImage}
                    src={`/images/artists/${artist.thumbnailFile}`}
                  />
                </a>
              </Link>
            </div>
          );
        })}

      <div className={css.remainingArtistsCount}>
        <p>
          <span>+ {remainingArtistsCount}</span>
          <br />
          more
        </p>
      </div>
    </div>
  );
};

export default ArtIndexArtistList;
