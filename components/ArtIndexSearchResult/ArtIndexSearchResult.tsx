import React from 'react';

import ArtIndexArtistThumbnail from '../ArtIndexArtistThumbnail';
import Link from '../Link';
import { ArtIndexWorkType } from '../../types/art-index-types';

import css from './ArtIndexSearchResult.module.scss';
import TextTruncate from '../TextTruncate';

type Props = {
  item: ArtIndexWorkType;
  className?: string;
};

const ArtIndexSearchResult: React.FC<Props> = ({ item, className }) => {
  return (
    <article className={[css.artIndexSearchResult, className].join(' ')}>
      <p className={css.format}>
        {item.medium ? `${item.medium} ` : ''}
        {item.format}
      </p>

      <h1>
        <Link as={`/art-index/work/${item.id}`}>
          <a>
            <TextTruncate limit={80} showButton={false}>
              {item.title}
            </TextTruncate>
          </a>
        </Link>
      </h1>

      <Link as={`/art-index/artist/${item.artistId}`}>
        <a className={css.artist}>
          <ArtIndexArtistThumbnail
            file={
              item.artistThumbnailFile || null
              // &&
              // `/art-index/images/artists/${item.artistThumbnailFile}`
            }
            size="xs"
            className={css.artistThumbnail}
          />
          {item.artistFirstName} {item.artistLastName}
        </a>
      </Link>

      <p className={css.exhibitionName}>
        {item.exhibitionName}
        {!item.exhibitionName.includes(item.exhibitionYear)
          ? `, ${item.exhibitionYear}`
          : ''}
      </p>

      {/* <p className={css.resultExhibitionName}>ID: {item.id}</p> */}
    </article>
  );
};

export default ArtIndexSearchResult;
