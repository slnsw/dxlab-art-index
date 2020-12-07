import * as d3 from 'd3';
import { NextApiRequest, NextApiResponse } from 'next';

import {
  // ArtIndexApiQuery,
  ArtIndexExhibitionType,
} from '../../../../types/art-index-types';

export async function getExhibitionDetail(
  host: string,
  id: string,
): Promise<ArtIndexExhibitionType> {
  // TODO: Work out https or http
  const allExhibitions: ArtIndexExhibitionType[] = await d3.csv(
    `http://${host}/art-index/data/exhibitions.csv`,
  );

  const exhibition = allExhibitions.find((e) => e.id === id);

  return exhibition;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { headers, query } = req;
  const { host } = headers;
  const { id } = query;

  const result = await getExhibitionDetail(host, id);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

export default handler;
