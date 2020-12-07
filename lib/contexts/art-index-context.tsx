import * as React from 'react';
import * as d3 from 'd3';
import * as d3Array from 'd3-array';

import {
  arrayToCounts,
  processFormatsByGenderData,
  processFormatsByGenderToComparisonData,
  processPriceData,
  processWorksByYear,
} from '../art-index-utils';
import {
  ArtIndexArtistType,
  ArtIndexWorkType,
} from '../../types/art-index-types';

type ArtIndexActions =
  | {
      type: 'FETCH_WORKS';
      payload: ArtIndexWorkType[];
    }
  | {
      type: 'FETCH_ARTISTS';
      payload: ArtIndexArtistType[];
    };

type ArtIndexState = {
  isWorksLoading: boolean;
  isArtistsLoading: boolean;
  works: ArtIndexWorkType[];
  artists: ArtIndexArtistType[];
  priceData: any[];
  artistsGenderData: any[];
  formatByGenderData: any[];
  formatByGenderComparisonData: any[];
  genderYearData: any[];
  worksByYearData: any[];
  formatsData: any[];
};

const ArtIndexContext = React.createContext<
  [ArtIndexState, React.Dispatch<ArtIndexActions>] | []
>([]);

const defaultState = {
  isWorksLoading: true,
  isArtistsLoading: true,
  works: [],
  artists: [],
  // Data for charts
  priceData: [],
  artistsGenderData: [],
  formatByGenderData: [],
  formatByGenderComparisonData: [],
  genderYearData: [],
  worksByYearData: [],
  formatsData: { all: [], female: [], male: [], unknown: [] },
};

function reducer(state, action: ArtIndexActions) {
  switch (action.type) {
    case 'FETCH_WORKS': {
      const works = action.payload;
      const formatByGenderData = processFormatsByGenderData(works);

      return {
        ...state,
        isWorksLoading: false,
        works,
        priceData: processPriceData(works),
        formatByGenderData,
        formatByGenderComparisonData: processFormatsByGenderToComparisonData(
          formatByGenderData,
        ),
        genderYearData: Array.from(
          d3Array.group(works, (d) => d.exhibitionYear),
        )
          .sort((a, b) => a[0] - b[0])
          .map((d) => {
            const year = d[0];
            const allWorks = d[1];

            return {
              year,
              malesTotal: allWorks.filter(
                (work) => work.artistGender === 'male',
              ).length,
              femalesTotal: allWorks.filter(
                (work) => work.artistGender === 'female',
              ).length,
            };
          }),
        worksByYearData: processWorksByYear(works),
        formatsData: {
          all: arrayToCounts(works.map((work) => work.mediumFormat)),
          male: arrayToCounts(
            works
              .filter((work) => work.artistGender === 'male')
              .map((work) => work.mediumFormat),
          ),
          female: arrayToCounts(
            works
              .filter((work) => work.artistGender === 'female')
              .map((work) => work.mediumFormat),
          ),
          unknown: arrayToCounts(
            works
              .filter((work) => work.artistGender === '')
              .map((work) => work.mediumFormat),
          ),
        },
      };
    }

    case 'FETCH_ARTISTS': {
      const artists = action.payload;

      return {
        ...state,
        isArtistsLoading: false,
        artists,
        artistsGenderData: artists
          .map((d) => {
            return {
              name: `${d.firstName} ${d.lastName}`,
              value: parseInt(d.worksTotal, 10),
              gender: d.gender,
            };
          })
          .filter((d) => d.gender === 'male' || d.gender === 'female'),
      };
    }

    default: {
      throw new Error(`Unsupported action type: ${action.type}`);
    }
  }
}

function useArtIndex() {
  const context = React.useContext(ArtIndexContext);

  if (context.length === 0) {
    throw new Error('useArtIndex must be used within ArtIndexProvider');
  }

  const [state, dispatch] = context;

  // --------------------------------------------------------------------------
  // Data Fetching
  // --------------------------------------------------------------------------
  React.useEffect(() => {
    d3.csv('/art-index/data/artists.csv').then((artists) => {
      dispatch({
        type: 'FETCH_ARTISTS',
        payload: artists,
      });
    });

    d3.csv('/art-index/data/works.csv').then((works) => {
      dispatch({
        type: 'FETCH_WORKS',
        payload: works,
      });
    });
  }, [dispatch]);

  return {
    state,
    dispatch,
  };
}

function ArtIndexProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, defaultState);
  const value = React.useMemo(() => [state, dispatch], [state]);

  return <ArtIndexContext.Provider value={value} {...props} />;
}

export { useArtIndex, ArtIndexProvider };
