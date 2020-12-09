import React from 'react';
import Router, { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';

import BarChart from '../BarChart';
import ArtIndexFormatBubbleChart from '../ArtIndexFormatBubbleChart';
import SearchTextInputV2 from '../SearchTextInput/SearchTextInputV2';
import ArtIndexSearchResult from '../ArtIndexSearchResult';
import LoaderText from '../LoaderText';
import SearchSelectedFacets from '../SearchSelectedFacets';
import ArtIndexCTAButton from '../ArtIndexCTAButton';
import ArtIndexArtistThumbnail from '../ArtIndexArtistThumbnail';
import Paginate from '../Paginate';
import Sidebar from '../Sidebar';
import Link from '../Link';
import TextButton from '../TextButton';
import Icon from '../Icon';

import createSearchQuery from '../../lib/create-search-query';
import { useAsyncReference } from '../../lib/hooks/use-async-reference';
import axios from '../../lib/axios';
import basePath from '../../lib/base-path';

import { ArtIndexApiWorksResult } from '../../types/art-index-types';

import css from './ArtIndexSearch.module.scss';

type Query = {
  search?: string;
  formats?: string;
  artistIds?: string;
  genders?: string;
  exhibitionIds?: string;
  offset?: string;
};

const searchQuery = createSearchQuery<Query>({
  baseUrl: `/search/`,
});

const searchApiQuery = createSearchQuery<Query>({
  baseUrl: `${basePath}/api/works`,
});

const ArtIndexSearchPage = () => {
  const router = useRouter();
  const query = router.query as Query;
  const queryRef = useAsyncReference<Query>(query, true);
  const { search } = query;
  const offset = parseInt(query.offset, 10);

  const [value, setValue] = React.useState('');
  const [
    resultsData,
    setResultsData,
  ] = React.useState<ArtIndexApiWorksResult>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  // Selected Facets
  const selectedFormats = React.useMemo(() => {
    return query.formats?.split(',') || [];
  }, [query.formats]);

  const selectedArtistIds = React.useMemo(() => {
    return query.artistIds?.split(',') || [];
  }, [query.artistIds]);

  const selectedGenders = React.useMemo(() => {
    return query.genders?.split(',') || [];
  }, [query.genders]);

  const selectedExhibitionIds = React.useMemo(() => {
    return query.exhibitionIds?.split(',') || [];
  }, [query.exhibitionIds]);

  // Results
  const results = resultsData?.works || [];

  // Facets
  const formatData =
    resultsData?.facets.formats.map((f) => ({
      item: f.value,
      count: f.total,
    })) || [];
  const artistFacets =
    resultsData?.facets.artists.map((a) => ({
      id: a.id,
      name: `${a.value.firstName} ${a.value.lastName}`,
      thumbnailFile: a.value.thumbnailFile,
      gender: a.value.gender,
      value: a.total,
    })) || [];
  const genderFacets =
    resultsData?.facets.genders.map((g) => ({
      id: g.type,
      name: g.value,
      value: g.total,
    })) || [];
  const exhibitionData =
    resultsData?.facets.exhibitions.map((e) => ({
      id: e.id,
      name: e.value,
      value: e.total,
    })) || [];
  const unpaddedYearData =
    resultsData?.facets.years
      .map((e) => ({
        name: e.id,
        value: e.total,
      }))
      .sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10)) || [];
  // now pad it out and add any years that have no data - we want all years shown.
  const yearData = [];
  const minYear = unpaddedYearData[0]?.name;
  const maxYear = unpaddedYearData[unpaddedYearData.length - 1]?.name;
  for (let y = minYear; y <= maxYear; y++) {
    const temp = unpaddedYearData.filter((i) => i.name === y.toString());
    const val = temp[0]?.value || 0;
    yearData.push({
      name: y.toString(),
      value: val,
    });
  }

  // Selected Facets
  const selectedFacets = [
    ...selectedFormats.map((format) => ({
      name: format,
      value: format,
      url: searchQuery.stringifyAction(query, {
        type: 'remove',
        key: 'formats',
        value: format,
      }),
    })),
    ...selectedArtistIds
      .filter((artistId) => {
        const artist = artistFacets.find((a) => a.id === artistId);

        return Boolean(artist);
      })
      .map((artistId) => {
        const artist = artistFacets.find((a) => a.id === artistId);

        return {
          name: artist.name,
          value: artistId,
          url: searchQuery.stringifyAction(query, {
            type: 'remove',
            key: 'artistIds',
            value: artistId,
          }),
        };
      }),
    ...selectedGenders.map((gender) => ({
      name: gender === 'unknown' ? 'Unknown gender' : gender,
      value: gender,
      url: searchQuery.stringifyAction(query, {
        type: 'remove',
        key: 'genders',
        value: gender,
      }),
    })),
    ...selectedExhibitionIds
      .filter((exhibitionId) => {
        const exhibition = exhibitionData.find((a) => a.id === exhibitionId);

        return Boolean(exhibition);
      })
      .map((exhibitionId) => {
        const exhibition = exhibitionData.find((a) => a.id === exhibitionId);

        return {
          name: exhibition.name,
          value: exhibitionId,
          url: searchQuery.stringifyAction(query, {
            type: 'remove',
            key: 'exhibitionIds',
            value: exhibitionId,
          }),
        };
      }),
  ];

  // Pagination
  const countPerPage = 20;
  const pageCount = resultsData
    ? Math.ceil(resultsData.worksTotal / countPerPage)
    : null;
  const initialPage = Math.floor(offset / countPerPage);

  React.useEffect(() => {
    const url = searchApiQuery.stringify({
      search,
      formats: selectedFormats?.join(','),
      artistIds: selectedArtistIds?.join(','),
      genders: selectedGenders?.join(','),
      exhibitionIds: selectedExhibitionIds?.join(','),
      offset: offset === 0 ? null : offset.toString(),
    });

    setIsLoading(true);

    axios
      .get(url)
      .then((result: AxiosResponse<ArtIndexApiWorksResult>) => {
        const { data } = result;

        setIsLoading(false);
        setResultsData(data);
      })
      .catch((error) => {
        console.log(error);
      });
    // }
  }, [
    search,
    query,
    offset,
    selectedFormats,
    selectedArtistIds,
    selectedGenders,
    selectedExhibitionIds,
  ]);

  const handleSearchInputChange = (newValue) => {
    setValue(newValue);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    Router.push(
      searchQuery.stringify({
        search: value,
        formats: selectedFormats?.join(','),
        artistIds: selectedArtistIds?.join(','),
        genders: selectedGenders?.join(','),
        exhibitionIds: selectedExhibitionIds?.join(','),
      }),
    );
  };

  return (
    <div className={css.artIndexSearch}>
      <div className={css.content}>
        <form onSubmit={handleFormSubmit} className={css.searchBox}>
          <SearchTextInputV2
            className={css.searchInput}
            placeholder="Start searching..."
            defaultValue={search}
            onChange={handleSearchInputChange}
          />

          <ArtIndexCTAButton
            onClick={handleFormSubmit}
            className={css.searchButton}
          >
            Search
          </ArtIndexCTAButton>
        </form>

        {selectedFacets.length > 0 ? (
          <SearchSelectedFacets
            className={css.selectedFacets}
            facets={selectedFacets}
          />
        ) : null}

        {resultsData && (
          <div className={css.searchInfo}>
            <ArtIndexCTAButton
              className={css.facetsButton}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Icon name="options" colour="white" />
                <span
                  style={{
                    marginLeft: 'var(--spacing-xs)',
                    pointerEvents: 'none',
                  }}
                >
                  Facets
                </span>
              </div>
            </ArtIndexCTAButton>
            <p>
              <strong>{resultsData.worksTotal.toLocaleString()}</strong> results
            </p>
          </div>
        )}

        <div className={css.results}>
          {isLoading && <LoaderText className={css.loader} />}

          <div
            className={[
              css.resultsList,
              isLoading ? css.resultsListLoading : '',
            ].join(' ')}
          >
            {results?.map((item) => {
              return <ArtIndexSearchResult item={item} key={item.id} />;
            })}
          </div>
        </div>

        {pageCount > 0 ? (
          <Paginate
            className={css.paginate}
            pageCount={pageCount}
            initialPage={initialPage}
            hrefBuilder={(pageNo) => {
              const index = pageNo - 1;
              const newOffset =
                index !== 0 ? (index * countPerPage).toString() : null;

              return searchQuery.stringify({
                ...query,
                offset: newOffset,
              });
            }}
            onPageChange={({ selected }) => {
              if (selected >= 0 && selected !== Infinity) {
                const newOffset =
                  selected !== 0 ? (selected * countPerPage).toString() : null;
                const url = searchQuery.stringify({
                  ...query,
                  offset: newOffset,
                });

                Router.push(url).then(() => {
                  window.scrollTo(0, 0);
                });
              }
            }}
          />
        ) : null}

        <Sidebar
          isOpen={isOpen}
          className={css.facetSidebar}
          onCloseClick={() => {
            setIsOpen(false);
          }}
        >
          <aside className={css.facets}>
            {formatData.length > 0 && (
              <>
                <h2>Formats</h2>

                <ArtIndexFormatBubbleChart
                  data={formatData}
                  letterWidth={4}
                  smallCircleLimit={12}
                  height={300}
                  onBubbleClick={(_, bubble) => {
                    Router.push(
                      searchQuery.stringify({
                        ...queryRef.current,
                        formats: bubble.data.name.toLowerCase(),
                      }),
                    );
                  }}
                />
              </>
            )}

            {artistFacets.length > 0 && (
              <>
                <h2>Artists</h2>

                <SearchFacet
                  facetValues={
                    artistFacets &&
                    artistFacets.map((facet) => {
                      return {
                        name: facet.name,
                        value: facet.value,
                        url: searchQuery.stringify({
                          ...query,
                          artistIds: facet.id,
                        }),
                        imageUrl: facet.thumbnailFile || null,
                      };
                    })
                  }
                  showImage={true}
                />
              </>
            )}

            {genderFacets.length > 0 && (
              <>
                <h2>Genders</h2>

                <SearchFacet
                  facetValues={
                    genderFacets &&
                    genderFacets.map((facet) => {
                      return {
                        name: facet.name,
                        value: facet.value,
                        url: searchQuery.stringify({
                          ...query,
                          genders: facet.id,
                        }),
                      };
                    })
                  }
                  showGender={true}
                />
              </>
            )}

            {yearData.length > 0 && (
              <>
                <h2>Years</h2>

                <BarChart
                  data={yearData || []}
                  className={css.artistsChart}
                  rotateXAxis={true}
                  xAxisTickIncrement={10}
                  xAxisTickValuesNumeric={true}
                  margin={{ top: 20, right: 3, bottom: 70, left: 30 }}
                />
              </>
            )}

            {exhibitionData.length > 0 && (
              <>
                <h2>Exhibitions</h2>

                <SearchFacet
                  facetValues={
                    exhibitionData &&
                    exhibitionData.map((exhibition) => {
                      return {
                        name: exhibition.name,
                        value: exhibition.value,
                        url: searchQuery.stringify({
                          ...query,
                          exhibitionIds: exhibition.id,
                        }),
                      };
                    })
                  }
                />
              </>
            )}
          </aside>
        </Sidebar>
      </div>
    </div>
  );
};

type SearchFacetProps = {
  facetValues?: {
    name: string;
    url: string;
    value: number;
    imageUrl?: string;
  }[];
  limit?: number;
  showImage?: boolean;
  showGender?: boolean;
};

const SearchFacet = ({
  facetValues = [],
  limit = 5,
  showImage = false,
  showGender = false,
}: SearchFacetProps) => {
  const [newLimit, setNewLimit] = React.useState(limit);
  const showButton = newLimit < facetValues.length;

  return (
    <div className={css.artistFacets}>
      {facetValues.slice(0, newLimit).map((facetValue) => {
        return (
          <p key={facetValue.url}>
            <Link as={facetValue.url}>
              <a>
                {showImage && (
                  <ArtIndexArtistThumbnail
                    file={facetValue.imageUrl}
                    size="xs"
                    className={css.artistFacetThumbnail}
                  />
                )}

                {showGender && (
                  <div
                    className={css.artistFacetGender}
                    style={{
                      ...(facetValue.name !== 'Unknown'
                        ? {
                            backgroundColor: `var(--colour-art-index-${facetValue.name.toLocaleLowerCase()})`,
                          }
                        : {}),
                    }}
                  ></div>
                )}

                {facetValue.name}
              </a>
            </Link>

            <span className={css.artistFacetValue}>{facetValue.value}</span>
          </p>
        );
      })}

      {showButton && (
        <TextButton
          onClick={() => {
            setNewLimit(newLimit + 10);
          }}
        >
          Show more
        </TextButton>
      )}
    </div>
  );
};

// function isEmpty(obj) {
//   return Object.keys(obj).length === 0 && obj.constructor === Object;
// }

export default ArtIndexSearchPage;
