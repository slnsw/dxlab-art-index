import React from 'react';
import * as d3Array from 'd3-array';

import Link from '../Link';
import ArtIndexFormatBubbleChart from '../ArtIndexFormatBubbleChart';
import BarChart from '../BarChart';
import ArtIndexStatisticBlock from '../ArtIndexStatisticBlock';

import { arrayToCounts } from '../../lib/art-index-utils';
import { ArtIndexExhibitionType } from '../../types/art-index-types';

import { useArtIndex } from '../../lib/contexts/art-index-context';

import css from './ArtIndexExhibition.module.scss';
import ArtIndexArtistThumbnail from '../ArtIndexArtistThumbnail';

type Props = {
  exhibition: ArtIndexExhibitionType;
  className?: string;
};

const ArtIndexExhibition: React.FC<Props> = ({ exhibition, className }) => {
  const { state } = useArtIndex();
  // TODO: Remove artists and use works to get artist thumbnail
  const { works, artists } = state;
  const exhibitionWorks = works.filter(
    (work) => work.exhibitionId === exhibition.id,
  );
  const worksByArtist = Array.from(
    d3Array.group(exhibitionWorks, (d) => d.artistId),
  )
    .map((d) => {
      const name =
        d[1][0].artistFirstName && d[1][0].artistLastName
          ? `${d[1][0].artistFirstName} ${d[1][0].artistLastName}`
          : 'Unknown artist';
      const value = d[1].length;

      return {
        name,
        value,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 25);

  const formatData = arrayToCounts(exhibitionWorks.map((d) => d.mediumFormat));

  const exhibitionArtists = Array.from(
    d3Array.group(exhibitionWorks, (d) => d.artistId),
  ).sort((a, b) => {
    let s;
    if (a[1][0].artistLastName === b[1][0].artistLastName) {
      s = 0;
    } else {
      s = a[1][0].artistLastName < b[1][0].artistLastName ? -1 : 1;
    }
    return s;
  });

  return (
    <div className={[css.artIndexExhibition, className || ''].join(' ')}>
      <header>
        <p className={css.type}>Exhibition</p>
        <h1>{exhibition.name}</h1>
      </header>

      <div className={css.content}>
        {exhibition.place ? (
          <div className={css.location}>
            <h2>Location</h2>
            <p>{exhibition.place}</p>
          </div>
        ) : null}

        <div className={css.stats}>
          <ArtIndexStatisticBlock
            count={exhibition.worksTotal}
            label="Works"
            url={`/art-index/search/?exhibitionIds=${exhibition.id}`}
          />
          <ArtIndexStatisticBlock
            count={exhibitionArtists.length}
            label="Artists"
          />
        </div>

        <div className={css.formats}>
          <h2>Formats</h2>
          <ArtIndexFormatBubbleChart
            data={formatData}
            height={300}
            letterWidth={3}
          />
        </div>

        <div className={css.worksByArtists}>
          <h2>Work count by Artist</h2>
          <BarChart
            data={worksByArtist}
            rotateXAxis={true}
            xAxisTickIncrement={1}
            id={'works-by-artist'}
            height={300}
            margin={{
              bottom: 140,
              top: 40,
            }}
          />
        </div>
      </div>

      <h2>Artists</h2>

      {exhibitionArtists.map((artistData) => {
        const id = artistData[0];
        const artistWorks = artistData[1];
        const artistName =
          artistWorks[0].artistFirstName || artistWorks[0].artistLastName
            ? `${artistWorks[0].artistFirstName} ${artistWorks[0].artistLastName}`
            : 'Artist unknown';
        const artistThumbnailUrl = artists.find((a) => a.id === id)
          ?.thumbnailFile;

        return (
          <React.Fragment key={artistName}>
            <h3 className={css.artist}>
              {artistName === 'Artist unknown' ? (
                artistName
              ) : (
                <Link as={`/art-index/artist/${id}`}>
                  <a className={css.artistLink}>
                    <ArtIndexArtistThumbnail
                      file={artistThumbnailUrl}
                      size="xs"
                      className={css.artistThumbnail}
                    />{' '}
                    {artistName}
                  </a>
                </Link>
              )}
            </h3>

            <ul className={css.artistWorks}>
              {artistWorks.map((artistWork) => {
                return (
                  <li key={artistWork.id}>
                    <Link as={`/art-index/work/${artistWork.id}`}>
                      <a className={css.artistWork}>{artistWork.title}</a>
                    </Link>
                    {artistWork.mediumFormat && (
                      <span
                        className={css.format}
                      >{`(${artistWork.mediumFormat})`}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ArtIndexExhibition;
