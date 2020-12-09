import React from 'react';

import { ArtIndexWorkType } from '../../types/art-index-types';
import Link from '../Link';
import ArtIndexArtistThumbnail from '../ArtIndexArtistThumbnail';

import css from './ArtIndexWork.module.scss';

type Props = {
  work: ArtIndexWorkType;
  className?: string;
};

const ArtIndexWork: React.FC<Props> = ({ work, className }) => {
  if (!work) {
    return null;
  }

  const formatPrice = (p) => {
    if (!p) {
      return '';
    }
    const pounds = Math.floor(p);
    const allPence = Math.round((p - pounds) * 240);
    const shillings = Math.floor(allPence / 12);
    const pence = allPence - shillings * 12;
    return `£${pounds} ${shillings}s ${pence}d`;
  };

  return (
    <div className={[css.artIndexWork, className || ''].join(' ')}>
      <p className={css.mediumFormat}>
        Work / <strong>{work.mediumFormat}</strong>
      </p>
      <h1>{work.title}</h1>
      <div className={css.artistNameSection}>
        {work.artistThumbnailFile && (
          <ArtIndexArtistThumbnail
            size={'sm'}
            file={work.artistThumbnailFile}
            className={css.artistImageCircle}
          />
        )}
        <div>
          <p className={css.label}>Artist</p>
          <p className={css.artistName}>
            <Link as={`/artist/${work.artistId}`}>
              <a>
                {work.artistFirstName} {work.artistLastName}
              </a>
            </Link>
          </p>
        </div>
      </div>
      {work.imageUrl && (
        <img className={css.workImage} alt={work.title} src={work.imageUrl} />
      )}
      <p className={css.label}>Exhibition</p>
      <p>
        <Link as={`/exhibition/${work.exhibitionId}`}>
          <a>{work.exhibitionName}</a>
        </Link>
      </p>
      <p className={css.label}>Catalogue</p>
      <p>{work.source}</p>
      <p className={css.label}>Year</p>
      <p>{work.exhibitionYear}</p>
      {work.notes && !work.notes.includes('£') && (
        <>
          <p className={css.label}>Notes</p>
          <p>{work.notes && work.notes.replace(/Â/g, '')}</p>
        </>
      )}
      {work.price && (
        <>
          <p className={css.label}>Price</p>
          <p>{formatPrice(work.price)}</p>
        </>
      )}
      {work.collectionUrl && (
        <>
          <p className={css.label}>collection record</p>
          <p>
            <a
              href={work.collectionUrl}
              rel={'noopener noreferrer'}
              target={'_blank'}
            >
              {work.collectionUrl}
            </a>
          </p>
        </>
      )}
    </div>
  );
};

export default ArtIndexWork;
