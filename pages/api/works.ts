import * as d3 from 'd3';
import * as d3Array from 'd3-array';
import { NextApiRequest, NextApiResponse } from 'next';

import {
  ArtIndexApiQuery,
  ArtIndexApiWorksResult,
  ArtIndexWorkType,
} from '../../types/art-index-types';
import createFuse from '../../lib/create-fuse';
import basePath from '../../lib/base-path';

export async function getWorksResult(
  host: string,
  query: ArtIndexApiQuery = {},
): Promise<ArtIndexApiWorksResult> {
  const { search, formats, artistIds, exhibitionIds, genders } = query;
  const offset = parseInt(query.offset, 10) || 0;
  const limit = parseInt(query.limit, 10) || 20;
  const exhibitionStartYear =
    query.exhibitionStartYear && parseInt(query.exhibitionStartYear, 10);
  const exhibitionEndYear =
    query.exhibitionEndYear && parseInt(query.exhibitionEndYear, 10);

  // TODO: Work out https or http
  const allWorks: ArtIndexWorkType[] = await d3.csv(
    `http://${host}${basePath}/data/works.csv`,
  );

  // Filter works
  let works = allWorks.filter((work) => {
    const selectedFormats = formats?.split(',');
    const selectedArtistIds = artistIds?.split(',');
    const selectedExhibitionIds = exhibitionIds?.split(',');
    const selectedGenders = genders?.split(',');

    const hasFormats = selectedFormats
      ? selectedFormats.includes(work.mediumFormat.toLowerCase())
      : true;

    const hasArtistIds = selectedArtistIds
      ? selectedArtistIds.includes(work.artistId)
      : true;

    const hasExhibitionIds = selectedExhibitionIds
      ? selectedExhibitionIds.includes(work.exhibitionId)
      : true;

    const isAfterStartYear = exhibitionStartYear
      ? parseInt(work.exhibitionYear, 10) >= exhibitionStartYear
      : true;
    const isBeforeEndYear = exhibitionEndYear
      ? parseInt(work.exhibitionYear, 10) < exhibitionEndYear
      : true;

    const artistGender = work.artistGender || 'unknown';
    const hasGenders = selectedGenders
      ? selectedGenders.includes(artistGender)
      : true;

    return (
      hasFormats &&
      hasArtistIds &&
      hasExhibitionIds &&
      isAfterStartYear &&
      isBeforeEndYear &&
      hasGenders
    );
  });

  // Run search over faceted works
  if (search) {
    const joinedWorks = works.map((w) => {
      return {
        ...w,
        searchKey: `${w.title} ${w.artistFirstName} ${w.artistLastName} ${w.exhibitionName} ${w.exhibitionPlace} ${w.mediumFormat} ${w.catalogueName}`,
      };
    });

    const fuse = createFuse<ArtIndexWorkType>(joinedWorks, {
      includeScore: false,
      threshold: 0.2,
      useExtendedSearch: true,
      distance: 1000,
      keys: ['searchKey'],
      // keys: [
      //   'title',
      //   'artistFirstName',
      //   'artistLastName',
      //   'exhibitionName',
      //   'exhibitionPlace',
      //   'mediumFormat',
      //   'catalogueName',
      // ],
    });

    const searchWorks = await fuse.search(search);
    works = searchWorks.map((result) => result.item);
  }

  return {
    worksTotal: works.length,
    works: works.slice(offset, offset + limit),
    facets: {
      artists: rollup(works, 'artistId')
        .map(([id, total]) => {
          const work = works.find((w) => w.artistId === id);

          return {
            id,
            // value: `${work.artistFirstName} ${work.artistLastName}`,
            value: {
              firstName: work.artistFirstName,
              lastName: work.artistLastName,
              thumbnailFile: work.artistThumbnailFile,
              gender: work.artistGender,
            },
            total,
          };
        })
        .sort((a, b) => b.total - a.total)
        // Ensure we don't get all artists!
        .slice(0, 100),
      exhibitions: rollup(works, 'exhibitionId')
        .map(([id, total]) => {
          const work = works.find((w) => w.exhibitionId === id);

          return { id, value: work.exhibitionName, total };
        })
        .sort((a, b) => b.total - a.total),
      formats: rollup(works, 'mediumFormat')
        .map(([value, total]) => {
          // TODO: Consider converting to underscore
          return { type: value.toLowerCase(), value, total };
        })
        .slice(0, 100),
      genders: rollup(works, 'artistGender')
        .map(([type, total]) => {
          const newType = type || 'unknown';
          return { type: newType, value: capitalise(newType), total };
        })
        .sort((a, b) => b.total - a.total),
      years: rollup(works, 'exhibitionYear')
        .map(([id, total]) => {
          return {
            id,
            value: id.toString(),
            total,
          };
        })
        .sort((a, b) => b.total - a.total),
    },
  };
}

function rollup(data: ArtIndexWorkType[], key: keyof ArtIndexWorkType) {
  return Array.from(
    d3Array.rollup(
      data,
      (v) => v.length,
      (d) => d[key],
    ),
  );
}

const capitalise = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { headers, query } = req;
  const { host } = headers;

  const result = await getWorksResult(host, query);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

export default handler;
