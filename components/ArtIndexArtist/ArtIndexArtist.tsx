import React from 'react';
import Router from 'next/router';
import * as d3Array from 'd3-array';

import Link from '../Link';
import Button from '../Button';
import ArtIndexFormatBubbleChart from '../ArtIndexFormatBubbleChart';
import BarChart from '../BarChart';
import ArtIndexStatisticBlock from '../ArtIndexStatisticBlock';
import ArtIndexArtistThumbnail from '../ArtIndexArtistThumbnail';
import LoaderText from '../LoaderText';

import createSearchQuery from '../../lib/create-search-query';
import axios from '../../lib/axios';
import { arrayToCounts, processWorksByYear } from '../../lib/art-index-utils';
import { ArtIndexArtistType } from '../../types/art-index-types';
import { useArtIndex } from '../../lib/contexts/art-index-context';

import css from './ArtIndexArtist.module.scss';

type Query = {
  search?: string;
  formats?: string;
  artistIds?: string;
  exhibitionIds?: string;
  offset?: string;
};

const searchQuery = createSearchQuery<Query>({
  baseUrl: '/search/',
});

type Props = {
  artist?: ArtIndexArtistType;
  className?: string;
};

type WorkExample = {
  url?: string;
  link?: string;
};

type WorkAt = {
  name?: string;
  url?: string;
};

type WikiData = {
  description?: string;
  bornDate?: string;
  diedDate?: string;
  bornPlace?: string;
  diedPlace?: string;
  occupations?: string[];
  genre?: string;
  commonsCategory?: string;
  worksIn?: WorkAt[];
  locUrl?: string;
  ausDictBiogUrl?: string;
  dictOfSydUrl?: string;
  daaoUrl?: string;
  troveUrl?: string;
  examplesOfWork?: WorkExample[];
  commonsUrl?: string;
  agsaUrl?: string;
  auckAGUrl?: string;
  euroUrl?: string;
  tepapaUrl?: string;
  ngvUrl?: string;
  anmmUrl?: string;
  bioText?: string;
  bioLink?: string;
};

const ArtIndexArtist: React.FC<Props> = ({ artist, className }) => {
  const { state } = useArtIndex();
  const { works } = state;
  const artistWorks = works.filter((work) => work.artistId === artist.id);
  const worksByYear = processWorksByYear(artistWorks);
  const [wikiData, setWikiData] = React.useState<WikiData>();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    getWikiData(artist?.wikiDataId).then((data) => {
      setWikiData(data);
      setIsLoading(false);
    });
  }, [artist]);

  if (!artist) {
    return null;
  }

  const formatData = arrayToCounts(
    works.filter((d) => d.artistId === artist.id).map((d) => d.mediumFormat),
  );

  const years = d3Array
    .groups(
      artistWorks,
      (d) => d.exhibitionYear,
      (d) => d.exhibitionId,
    )
    .sort((a, b) => {
      return a[0] - b[0];
    });

  const exhibitions = d3Array
    .groups(artistWorks, (d) => d.exhibitionId)
    .map((exhibition) => {
      return {
        id: exhibition[0],
        title: exhibition[1][0].exhibitionName,
      };
    });

  return (
    <article className={[css.artIndexArtist, className || ''].join(' ')}>
      <header className={css.header}>
        {artist.thumbnailFile && (
          <ArtIndexArtistThumbnail
            file={artist.thumbnailFile}
            className={css.artistImageCircle}
          />
        )}

        <div>
          <p className={css.type}>Artist</p>
          <h1>
            {artist.firstName} {artist.lastName}
          </h1>
        </div>
      </header>

      <div
        className={[
          css.content,
          artist?.wikiDataId ? css.contentHasWiki : '',
        ].join(' ')}
      >
        <div className={css.stats}>
          <ArtIndexStatisticBlock
            count={artistWorks.length}
            label="Works"
            url={`/search/?artistIds=${artist.id}`}
          />
          <ArtIndexStatisticBlock
            count={exhibitions.length}
            label="Exhibitions"
          />
        </div>

        <div className={css.gender}>
          <h2>Gender</h2>
          <p>
            <div
              className={css.genderIndicator}
              style={{
                ...(artist.gender
                  ? {
                      backgroundColor: `var(--colour-art-index-${artist.gender})`,
                    }
                  : {}),
              }}
            ></div>{' '}
            <Link as={`/search/?genders=${artist.gender || 'unknown'}`}>
              <a>{artist.gender || 'Unknown'}</a>
            </Link>
          </p>
        </div>

        {artist?.wikiDataId && (
          <div className={css.bio}>
            {isLoading ? (
              <LoaderText className={css.loader} />
            ) : (
              <>
                <h2>Biography</h2>
                {wikiData?.bioText && (
                  <>
                    <div
                      dangerouslySetInnerHTML={{ __html: wikiData.bioText }}
                    />
                    <p className={css.sourceText}>
                      Source:{' '}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={wikiData.bioLink}
                      >
                        Wikipedia
                      </a>
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        )}

        <div className={css.formats}>
          <h2>Formats</h2>
          <ArtIndexFormatBubbleChart
            data={formatData}
            height={300}
            onBubbleClick={(event, bubble) => {
              event.preventDefault();

              Router.push(
                searchQuery.stringify({
                  search: '',
                  formats: bubble.data.name.toLowerCase(),
                }),
              );
            }}
          />
        </div>

        <div className={css.worksByYear}>
          <h2>Work count by year</h2>
          <BarChart
            data={worksByYear}
            rotateXAxis={true}
            xAxisTickIncrement={5}
            id={'works-by-year'}
            margin={{
              bottom: 40,
              top: 40,
            }}
          />
        </div>

        <div className={css.exhibitions}>
          <h2>Exhibitions</h2>

          <div className={css.timeline}>
            {years.map((yearData) => {
              const year = yearData[0];
              const yearExhibitions = yearData[1];

              return (
                <div className={css.timelineYear} key={year}>
                  <p className={css.timelineYearLabel}>{year}</p>
                  <div className={css.timelineDecoration}>
                    <div className={css.timelineBullet}></div>
                    <div className={css.timelineLine}></div>
                  </div>

                  <div>
                    {yearExhibitions.map((yearExhibition) => {
                      const exhibitionId = yearExhibition[0];
                      const exhibition = exhibitions.find(
                        (e) => e.id === exhibitionId,
                      );
                      const exhibitionWorks = yearExhibition[1];

                      return (
                        <div
                          className={css.timelineExhibition}
                          key={exhibitionId}
                        >
                          <h3>
                            <Link as={`/exhibition/${exhibitionId}`}>
                              <a>{exhibition.title}</a>
                            </Link>
                          </h3>

                          <TimelineWorks works={exhibitionWorks} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {artist?.wikiDataId && (
        <div className={css.wikidata}>
          {isLoading ? (
            <LoaderText className={css.loader} />
          ) : (
            <>
              <h2>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://wikidata.org/wiki/${artist?.wikiDataId}`}
                >
                  External data
                </a>
              </h2>

              <p className={css.sourceText}>
                Source:{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://wikidata.org/wiki/${artist?.wikiDataId}`}
                >
                  Wikidata
                </a>
              </p>

              {wikiData?.description && (
                <>
                  <h3>Description</h3>
                  {wikiData.description}
                  <br />
                </>
              )}
              {(wikiData?.occupations || wikiData?.genre) && (
                <p className={css.occupation}>
                  {wikiData.occupations.join(', ')}
                  {wikiData.occupations && wikiData.genre ? ' - ' : ''}
                  {wikiData.genre}
                  <br />
                </p>
              )}
              {(wikiData?.bornPlace || wikiData?.bornDate) && (
                <>
                  Born: {wikiData.bornPlace}
                  {wikiData.bornPlace && wikiData.bornDate ? ', ' : ''}
                  {wikiData.bornDate}
                  <br />
                </>
              )}
              {(wikiData?.diedPlace || wikiData?.diedDate) && (
                <>
                  Died: {wikiData.diedPlace}
                  {wikiData.diedPlace && wikiData.diedDate ? ', ' : ''}
                  {wikiData.diedDate}
                  <br />
                </>
              )}

              {wikiData?.worksIn && (
                <>
                  <h3>Works held at:</h3>
                  <ul>
                    {wikiData.worksIn.map((institution) => {
                      return (
                        <li key={institution.name}>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={institution.url}
                          >
                            {institution.name}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
              {(wikiData?.locUrl ||
                wikiData?.ausDictBiogUrl ||
                wikiData?.dictOfSydUrl ||
                wikiData?.daaoUrl ||
                wikiData?.troveUrl ||
                wikiData.agsaUrl ||
                wikiData.auckAGUrl ||
                wikiData.euroUrl ||
                wikiData.tepapaUrl ||
                wikiData.ngvUrl ||
                wikiData.anmmUrl) && (
                <>
                  <h3>External links</h3>
                  <ul>
                    {wikiData.locUrl && (
                      <li key={wikiData.locUrl}>
                        View Library of Congress{' '}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={wikiData.locUrl}
                        >
                          entry
                        </a>
                      </li>
                    )}
                    {wikiData.ausDictBiogUrl && (
                      <li key={wikiData.ausDictBiogUrl}>
                        View Australian Dictionary of Biography{' '}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={wikiData.ausDictBiogUrl}
                        >
                          entry
                        </a>
                      </li>
                    )}
                    {wikiData.dictOfSydUrl && (
                      <li key={wikiData.dictOfSydUrl}>
                        View Dictionary of Sydney{' '}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={wikiData.dictOfSydUrl}
                        >
                          entry
                        </a>
                      </li>
                    )}
                    {wikiData.daaoUrl && (
                      <li key={wikiData.daaoUrl}>
                        View{' '}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={wikiData.daaoUrl}
                        >
                          biography
                        </a>{' '}
                        at Design &amp; Art Australia Online
                      </li>
                    )}
                    {wikiData.troveUrl && (
                      <li key={wikiData.troveUrl}>
                        View Trove{' '}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={wikiData.troveUrl}
                        >
                          entry
                        </a>
                      </li>
                    )}
                    {wikiData.agsaUrl && (
                      <li key={wikiData.agsaUrl}>
                        View Art Gallery of South Australia{' '}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={wikiData.agsaUrl}
                        >
                          entry
                        </a>
                      </li>
                    )}
                    {wikiData.auckAGUrl && (
                      <li key={wikiData.auckAGUrl}>
                        View Auckland Art Gallery{' '}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={wikiData.auckAGUrl}
                        >
                          entry
                        </a>
                      </li>
                    )}
                    {wikiData.euroUrl && (
                      <li key={wikiData.euroUrl}>
                        View Europeana{' '}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={wikiData.euroUrl}
                        >
                          entry
                        </a>
                      </li>
                    )}
                    {wikiData.tepapaUrl && (
                      <li key={wikiData.tepapaUrl}>
                        View Te Papa{' '}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={wikiData.tepapaUrl}
                        >
                          entry
                        </a>
                      </li>
                    )}
                    {wikiData.ngvUrl && (
                      <li key={wikiData.ngvUrl}>
                        View National Gallery of Victoria{' '}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={wikiData.ngvUrl}
                        >
                          entry
                        </a>
                      </li>
                    )}
                    {wikiData.anmmUrl && (
                      <li key={wikiData.anmmUrl}>
                        View Australian National Maritime Museum{' '}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={wikiData.anmmUrl}
                        >
                          entry
                        </a>
                      </li>
                    )}
                  </ul>
                </>
              )}
              {wikiData?.examplesOfWork && (
                <>
                  <h3
                    style={{
                      marginBottom: 'var(--spacing-xxxs)',
                    }}
                  >
                    Examples of works{' '}
                  </h3>

                  <p className={css.sourceText}>
                    Source:{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={wikiData.commonsUrl}
                    >
                      Wikimedia
                    </a>
                  </p>

                  <div className={css.wikiImages}>
                    {wikiData.examplesOfWork.map((work) => {
                      return (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={work.link}
                          className={css.wikiImage}
                        >
                          <img src={work.url} alt={work.link} />
                        </a>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      <style>
        {/* Hide empty wikidata paragraph tags */}
        {`
        .mw-empty-elt {
          display: none;
        }
        `}
      </style>
    </article>
  );
};

const TimelineWorks = ({ works = [], limit = 5 }) => {
  const [newLimit, setNewLimit] = React.useState(limit);
  const worksTotal = works.length;
  const showButton = worksTotal > newLimit;

  return (
    <div className={css.timelineWorks}>
      {works.slice(0, newLimit).map((work) => {
        return (
          <h4 key={work.id}>
            <Link as={`/work/${work.id}`}>
              <a>{work.title}</a>
            </Link>
            <span className={css.timelineWorkFormat}>
              {work.mediumFormat ? `(${work.mediumFormat})` : ''}
            </span>
          </h4>
        );
      })}

      {showButton && (
        <Button
          className={css.timelineShowMoreButton}
          onClick={() => {
            setNewLimit(newLimit + 10);
          }}
        >
          Show more
        </Button>
      )}
    </div>
  );
};

const getBioText = async (link) => {
  if (!link) {
    return null;
  }

  const result = await axios.get(link);
  const rawOut = result.data;
  const pageData = rawOut?.query?.pages;
  const firstKey = pageData && Object.keys(pageData)[0];
  const out = pageData && pageData[firstKey]?.extract;
  return out;
};

const getWikiDataQValue = async (qVal) => {
  if (!qVal) {
    return null;
  }
  let url = 'https://www.wikidata.org/w/api.php?action=wbgetentities';
  url += `&ids=${qVal}&format=json&languages=en&origin=*`;

  const result = await axios.get(url);
  const rawOut = result.data;
  const out = rawOut?.entities[qVal]?.labels?.en?.value;
  return out;
};

const getUrlFromFilename = async (filename) => {
  if (!filename) {
    return null;
  }

  let url =
    'https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=imageinfo';
  url += `&iilimit=50&titles=${filename}&format=json&iiprop=url&iiurlwidth=320`;

  const result = await axios.get(url);
  const rawOut = result.data;
  const urlData = rawOut && rawOut?.query?.pages;
  const firstKey = Object.keys(urlData)[0];
  const imageUrlData = urlData && urlData[firstKey];
  const imageUrl =
    imageUrlData &&
    imageUrlData?.imageinfo &&
    imageUrlData?.imageinfo[0].thumburl;
  const descriptionUrl =
    imageUrlData &&
    imageUrlData?.imageinfo &&
    imageUrlData?.imageinfo[0].descriptionurl;
  const out = { url: imageUrl, link: descriptionUrl };
  return out;
};

const getWorkExamples = async (commonsCatalogue) => {
  if (!commonsCatalogue) {
    return null;
  }
  let url =
    'https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&origin=*';
  url += `&cmtype=file&cmtitle=Category:${commonsCatalogue}&format=json&cmlimit=500`;

  const result = await axios.get(url);
  const rawOut = result.data;
  const members = rawOut?.query?.categorymembers;

  const workExamples =
    members &&
    (await Promise.all(
      members.map(async (m) => {
        const { title } = m;
        const value = title && (await getUrlFromFilename(title));
        return value;
      }),
    ));
  return workExamples;
};

const getUrlForInstitution = async (id) => {
  if (!id) {
    return null;
  }
  let url = 'https://www.wikidata.org/w/api.php?action=wbgetentities';
  url += `&ids=${id}&format=json&languages=en&origin=*`;

  const result = await axios.get(url);
  const rawOut = result.data;
  const out = rawOut.entities[id];
  const claims = out?.claims;
  const urlString = claims?.P856 && claims?.P856[0]?.mainsnak?.datavalue?.value;

  return urlString;
};

const getWikiData = async (id): Promise<WikiData> => {
  if (!id) {
    return null;
  }
  let url = 'https://www.wikidata.org/w/api.php?action=wbgetentities';
  url += `&ids=${id}&format=json&languages=en&origin=*`;
  // do initial wikidata lookup for the Q value (identifier) for the artist
  const result = await axios.get(url);
  const rawOut = result.data;
  const out = rawOut.entities[id];
  // extract desciption
  const description = out?.descriptions?.en?.value;
  // 'claims' are where a bunch of links to other stuff live
  const claims = out?.claims;
  // such as date of birth/death
  const dobData =
    claims?.P569 && claims?.P569[0]?.mainsnak?.datavalue?.value?.time;
  const bornDate = dobData && dobData.slice(1, 5); // just get the year for now
  const dodData =
    claims?.P570 && claims?.P570[0]?.mainsnak?.datavalue?.value?.time;
  const diedDate = dodData && dodData.slice(1, 5);
  // location of birth/death (note there are yet another Q vlaue which in turn need to be looked up)
  const pobId = claims?.P19 && claims?.P19[0]?.mainsnak?.datavalue?.value?.id;
  const bornPlace = pobId && (await getWikiDataQValue(pobId));
  const podId = claims?.P20 && claims?.P20[0]?.mainsnak?.datavalue?.value?.id;
  const diedPlace = podId && (await getWikiDataQValue(podId));

  // get the list of occupations (eg: painter, sculptor, writer)
  const occupations =
    claims?.P106 &&
    (await Promise.all(
      claims?.P106.map(async (i) => {
        const oid = i?.mainsnak?.datavalue?.value?.id;
        const occ = oid && (await getWikiDataQValue(oid));
        return occ;
      }),
    ));
  // genre of art they worked in
  const genreId =
    claims?.P136 && claims?.P136[0]?.mainsnak?.datavalue?.value?.id;
  const genre = genreId && (await getWikiDataQValue(genreId));
  // commons category can be used to pull in images of the artist's work
  const commonsCategory =
    claims?.P373 && claims?.P373[0]?.mainsnak?.datavalue?.value;
  // create the URL now, pull in works later
  const commonsUrl =
    commonsCategory &&
    `https://commons.wikimedia.org/wiki/Category:${commonsCategory}`;
  // get the list of institutions (and their websites) that the artist has
  // works held in (again these are identifiers and need looking up)
  const worksIn =
    claims?.P6379 &&
    (await Promise.all(
      claims?.P6379.map(async (i) => {
        const wid = i?.mainsnak?.datavalue?.value?.id;
        const value = wid && (await getWikiDataQValue(wid));
        const instUrl = wid && (await getUrlForInstitution(wid));
        return { name: value, url: instUrl };
      }),
    ));
  // now pull in IDs from other authoritative sources about the artist
  // and construct the links, starting with Lib of Congress
  const locId = claims?.P244 && claims?.P244[0]?.mainsnak?.datavalue?.value;
  const locUrl = locId && `https://id.loc.gov/authorities/${locId}`;
  // Australian Disctionary of Biography
  const ausDictBiogId =
    claims?.P1907 && claims?.P1907[0]?.mainsnak?.datavalue?.value;
  const ausDictBiogUrl =
    ausDictBiogId && `http://adb.anu.edu.au/biography/${ausDictBiogId}`;
  // Dictionary of Sydney
  const dictOfSydId =
    claims?.P3794 && claims?.P3794[0]?.mainsnak?.datavalue?.value;
  const dictOfSydUrl =
    dictOfSydId && `https://dictionaryofsydney.org/${dictOfSydId}`;
  // The DAAO
  const daaoId = claims?.P1707 && claims?.P1707[0]?.mainsnak?.datavalue?.value;
  const daaoUrl = daaoId && `https://www.daao.org.au/bio/${daaoId}`;
  // Trove
  const troveId = claims?.P1315 && claims?.P1315[0]?.mainsnak?.datavalue?.value;
  const troveUrl = troveId && `https://trove.nla.gov.au/people/${troveId}`;
  // Art Gallery of South Australia
  const agsaId = claims?.P6804 && claims?.P6804[0]?.mainsnak?.datavalue?.value;
  const agsaUrl =
    agsaId &&
    `https://www.agsa.sa.gov.au/collection-publications/collection/creators/_/${agsaId}`;
  // Auckland Art Gallery
  const auckAGId =
    claims?.P3372 && claims?.P3372[0]?.mainsnak?.datavalue?.value;
  const auckAGUrl =
    auckAGId &&
    `http://www.aucklandartgallery.com/explore-art-and-ideas/artist/${auckAGId}`;
  // Europeana
  const euroId = claims?.P7704 && claims?.P7704[0]?.mainsnak?.datavalue?.value;
  const euroUrl = euroId && `https://data.europeana.eu/${euroId}`;
  // Te Papa museum
  const tepapaId =
    claims?.P3544 && claims?.P3544[0]?.mainsnak?.datavalue?.value;
  const tepapaUrl =
    tepapaId && `https://collections.tepapa.govt.nz/agent/${tepapaId}`;
  // Nat Gallery Victoria
  const ngvId = claims?.P2041 && claims?.P2041[0]?.mainsnak?.datavalue?.value;
  const ngvUrl =
    ngvId && `https://www.ngv.vic.gov.au/explore/collection/artist/${ngvId}`;
  // Aus Nat Maritime Museum
  const anmmId = claims?.P7769 && claims?.P7769[0]?.mainsnak?.datavalue?.value;
  const anmmUrl = anmmId && `http://collections.anmm.gov.au/people/${anmmId}`;
  // Now construct the examples of work data from the commons category
  const examplesOfWork =
    commonsCategory && (await getWorkExamples(commonsCategory));
  // look for wikipedia link in sitelinks section, from which a bio can be extracted
  const sitelinks = out?.sitelinks;
  const wikiTitle = sitelinks && sitelinks?.enwiki?.title;
  const wikiBioLink =
    wikiTitle &&
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=2&titles=${wikiTitle}&format=json&origin=*`; // &explaintext=true
  const bioText = wikiBioLink && (await getBioText(wikiBioLink));
  const bioLink = wikiTitle && `https://en.wikipedia.org/wiki/${wikiTitle}`;
  // build data object to return
  const data = {
    description,
    bornDate,
    diedDate,
    bornPlace,
    diedPlace,
    occupations,
    genre,
    commonsCategory,
    worksIn,
    locUrl,
    ausDictBiogUrl,
    dictOfSydUrl,
    daaoUrl,
    troveUrl,
    examplesOfWork,
    commonsUrl,
    agsaUrl,
    auckAGUrl,
    euroUrl,
    tepapaUrl,
    ngvUrl,
    anmmUrl,
    bioText,
    bioLink,
  };

  return data;
};

export default ArtIndexArtist;
