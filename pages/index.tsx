import React from 'react';
import { NextPage, NextPageContext } from 'next';
// import * as d3 from 'd3';
// import axios from 'axios';

import ArtIndexApp from '../components/ArtIndexApp';
import ArtIndexHome from '../components/ArtIndexHome';
import ArtIndexSearch from '../components/ArtIndexSearch';
import ArtIndexArtist from '../components/ArtIndexArtist';
import ArtIndexWork from '../components/ArtIndexWork';
import ArtIndexCharts from '../components/ArtIndexCharts';
import ArtIndexExplore from '../components/ArtIndexExplore';
import ArtIndexExhibition from '../components/ArtIndexExhibition';

import { ArtIndexProvider } from '../lib/contexts/art-index-context';
import {
  ArtIndexArtistType,
  ArtIndexExhibitionType,
  ArtIndexWorkType,
} from '../types/art-index-types';
import axios from '../lib/axios';
import basePath from '../lib/base-path';

const config = {
  home: { pathname: '/' as const, title: 'Home' },
  search: { pathname: '/search' as const, title: 'Search' },
  artist: { pathname: '/artist/[id]' as const, title: 'Artist' },
  work: { pathname: '/work/[id]' as const, title: 'Work' },
  exhibition: {
    pathname: '/exhibition/[id]' as const,
    title: 'Exhibition',
  },
  charts: { pathname: '/charts' as const, title: 'Charts' },
  explore: { pathname: '/explore' as const, title: 'Explore' },
};

type Pathnames = {
  home: typeof config['home']['pathname'];
  search: typeof config['search']['pathname'];
  artist: typeof config['artist']['pathname'];
  work: typeof config['work']['pathname'];
  exhibition: typeof config['exhibition']['pathname'];
  charts: typeof config['charts']['pathname'];
  explore: typeof config['explore']['pathname'];
};

type ValueOf<T> = T[keyof T];

type PathnameList = ValueOf<Pathnames>;

type Props =
  | {
      pathname: Pathnames['home'] | Pathnames['charts'] | Pathnames['explore'];
      artist?: never;
      exhibition?: never;
      work?: never;
    }
  | {
      pathname: Pathnames['search'];
      query?: {
        id?: string;
      };
      artist?: never;
      exhibition?: never;
      work?: never;
    }
  | {
      pathname: Pathnames['artist'];
      artist: ArtIndexArtistType;
      exhibition?: never;
      work?: never;
    }
  | {
      pathname: Pathnames['work'];
      artist?: never;
      exhibition?: never;
      work: ArtIndexWorkType;
    }
  | {
      pathname: Pathnames['exhibition'];
      artist?: never;
      exhibition: ArtIndexExhibitionType;
      work?: never;
    };

const ArtIndexPage: NextPage<Props> = ({
  pathname,
  artist = null,
  exhibition = null,
  work = null,
}) => {
  const pageConfig = Object.entries(config).find(
    (o) => o[1].pathname === pathname,
  );

  let title;
  let metaDescription;
  let metaImageUrl;
  let metaImageAlt;
  let metaImageWidth;
  let metaImageHeight;

  if (pathname === config.artist.pathname) {
    title = `${artist.firstName} ${artist.lastName} (Artist)`;
  } else if (pathname === config.work.pathname) {
    title = `${work.title} (Work)`;
  } else if (pathname === config.exhibition.pathname) {
    title = `${exhibition.name} (Exhibition)`;
  } else {
    title = `${pageConfig[1].title}`;
  }

  if (pathname === config.artist.pathname) {
    metaDescription = `Art Index: artist entry for ${artist.firstName} ${artist.lastName}`;
  } else if (pathname === config.work.pathname) {
    metaDescription = `Art Index: entry for '${work.title}' by ${work.artistFirstName} ${work.artistLastName}`;
  } else if (pathname === config.exhibition.pathname) {
    metaDescription = `Art Index: entry for ${exhibition.name} (Exhibition)`;
  } else {
    metaDescription = `Art Index - a DX Lab experiment`;
  }

  if (pathname === config.artist.pathname && artist.thumbnailFile) {
    metaImageUrl = `https://dxlab.sl.nsw.gov.au/art-index/images/artists/${artist.thumbnailFile}`;
    metaImageAlt = `Art Index: image of artist ${artist.firstName} ${artist.lastName}`;
    metaImageWidth = 600; // ? not true, but they are square...
    metaImageHeight = 600;
  } else if (pathname === config.work.pathname && work.imageUrl) {
    metaImageUrl = work.imageUrl;
    metaImageAlt = `Art Index: image of '${work.title}' by ${work.artistFirstName} ${work.artistLastName}`;
  } else {
    metaImageUrl =
      'https://dxlab.sl.nsw.gov.au/art-index/images/art-index-image.jpg';
    metaImageAlt = `Art Index - a DX Lab experiment`;
    metaImageWidth = 1200;
    metaImageHeight = 627;
  }
  console.log(metaImageUrl);
  return (
    <ArtIndexProvider>
      <ArtIndexApp
        title={title}
        metaDescription={metaDescription}
        metaImageUrl={metaImageUrl}
        metaImageAlt={metaImageAlt}
        metaImageWidth={metaImageWidth}
        metaImageHeight={metaImageHeight}
      >
        {pathname === config.home.pathname && <ArtIndexHome />}
        {pathname === config.search.pathname && <ArtIndexSearch />}
        {pathname === config.artist.pathname && (
          <ArtIndexArtist artist={artist} />
        )}
        {pathname === config.exhibition.pathname && (
          <ArtIndexExhibition exhibition={exhibition} />
        )}
        {pathname === config.work.pathname && <ArtIndexWork work={work} />}
        {pathname === config.charts.pathname && <ArtIndexCharts />}
        {pathname === config.explore.pathname && <ArtIndexExplore />}
      </ArtIndexApp>
    </ArtIndexProvider>
  );
};

ArtIndexPage.getInitialProps = async ({
  req,
  pathname,
  query,
}: {
  pathname: PathnameList;
} & NextPageContext): Promise<Props> => {
  const isServer = Boolean(req);
  const host = isServer ? `http://${req.headers.host}` : '';
  // TODO: Work out https or http
  const baseUrl = `${host}${basePath}`;

  if (pathname === config.work.pathname) {
    const result = await axios.get(`${baseUrl}/api/works/${query.id}`);
    const work = result.data;

    return {
      work,
      pathname,
    };
  }

  if (pathname === config.artist.pathname) {
    const result = await axios.get(`${baseUrl}/api/artists/${query.id}`);
    const artist = result.data;

    return {
      artist,
      pathname,
    };
  }

  if (pathname === config.exhibition.pathname) {
    const result = await axios.get(`${baseUrl}/api/exhibitions/${query.id}`);
    const exhibition = result.data;

    return {
      exhibition,
      pathname,
    };
  }

  return {
    pathname,
    query,
  };
};

export default ArtIndexPage;
