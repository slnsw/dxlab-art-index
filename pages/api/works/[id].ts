import * as d3 from 'd3';
import { NextApiRequest, NextApiResponse } from 'next';
import basePath from '../../../lib/base-path';

import {
  // ArtIndexApiQuery,
  ArtIndexWorkType,
} from '../../../types/art-index-types';

export async function getWorkDetail(
  host: string,
  id: string,
): Promise<ArtIndexWorkType> {
  // TODO: Work out https or http
  const allWorks: ArtIndexWorkType[] = await d3.csv(
    `http://${host}${basePath}/data/works.csv`,
  );

  const workLinks: any[] = await d3.csv(
    `http://${host}${basePath}/data/workLinks.csv`,
  );

  const work = allWorks.find((w) => w.id === id);
  const linkData = workLinks.find((l) => l.workId === id);
  const link = linkData && linkData.url;
  const imageUrl = linkData && linkData.imageUrl;

  return { ...work, collectionUrl: link, imageUrl };
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { headers, query } = req;
  const { host } = headers;
  const { id } = query;

  const result = await getWorkDetail(host, id);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

export default handler;
