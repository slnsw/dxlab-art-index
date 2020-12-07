import * as d3 from 'd3';
import { NextApiRequest, NextApiResponse } from 'next';

import {
  // ArtIndexApiQuery,
  ArtIndexArtistType,
} from '../../../../types/art-index-types';

export async function getArtistDetail(
  host: string,
  id: string,
): Promise<ArtIndexArtistType> {
  // TODO: Work out https or http
  const allArtists: ArtIndexArtistType[] = await d3.csv(
    `http://${host}/art-index/data/artists.csv`,
  );

  const artists = allArtists.find((a) => a.id === id);

  return artists;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { headers, query } = req;
  const { host } = headers;
  const { id } = query;

  const result = await getArtistDetail(host, id);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

export default handler;
