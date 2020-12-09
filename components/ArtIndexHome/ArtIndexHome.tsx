import React from 'react';
import Router from 'next/router';

import ArtIndexHomeMasthead from '../ArtIndexHomeMasthead';
import BarChart from '../BarChart';
import ArtIndexArtistList from '../ArtIndexArtistList';
import ArtIndexGenderRangeDonutChart from '../ArtIndexGenderRangeDonutChart';
import StackedBarChart from '../StackedBarChart';
import ArtIndexGenderArtistCharts from '../ArtIndexGenderArtistCharts';
import ArtIndexGenderFormatBubbleChart from '../ArtIndexGenderFormatBubbleChart';
import ArtIndexStatisticBlock from '../ArtIndexStatisticBlock';
import ArtIndexGenderPriceChart from '../ArtIndexGenderPriceChart';
import ArtIndexGenderFormatDonutCharts from '../ArtIndexGenderFormatDonutCharts';
import Link from '../Link';
import CTALink from '../CTALink';
import ArtIndexGenderLegend from '../ArtIndexGenderLegend';
import LoaderText from '../LoaderText';

import createSearchQuery from '../../lib/create-search-query';
import { useArtIndex } from '../../lib/contexts/art-index-context';
import { getGenderColour } from '../../lib/art-index-utils';
import basePath from '../../lib/base-path';

import css from './ArtIndexHome.module.scss';

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

const ArtIndexHomePage = () => {
  const { state } = useArtIndex();
  const {
    isWorksLoading,
    isArtistsLoading,
    works,
    artists,
    artistsGenderData,
    genderYearData,
    worksByYearData,
    formatsData,
  } = state;

  const unknownGenderCount = artists.filter((a) => a.gender === '').length;

  if (isWorksLoading || isArtistsLoading) {
    return (
      <div className={css.artIndexHome}>
        <ArtIndexHomeMasthead className={css.fullBleed} />

        <LoaderText />
      </div>
    );
  }

  return (
    <div className={css.artIndexHome}>
      <ArtIndexHomeMasthead className={css.fullBleed} />

      <div className={css.stats}>
        <ArtIndexStatisticBlock
          label="Works"
          count={works.length}
          className={css.stat}
          style={{
            paddingLeft: 0,
            textAlign: 'left',
          }}
        />
        <ArtIndexStatisticBlock
          label="Artists"
          count={artists.length}
          className={css.stat}
          style={{
            paddingLeft: 0,
            textAlign: 'left',
          }}
        />
        <ArtIndexStatisticBlock
          label="Exhibitions"
          count={98}
          className={css.stat}
          style={{
            paddingLeft: 0,
            textAlign: 'left',
          }}
        />
      </div>

      <h1>About</h1>
      <p className={css.paragraph}>
        <strong>Art Index</strong>, designed and built by the{' '}
        <a href="https://dxlab.sl.nsw.gov.au">DX Lab</a>, is powered by data
        from the{' '}
        <a href="https://collection.sl.nsw.gov.au/record/9PQWVlNn">
          Australian Art Exhibition Catalogue Index, 1845—1900
        </a>
        . This index was compiled by{' '}
        <strong>State Library of New South Wales</strong> volunteers between
        1989 and 2019 and is downloadable as a{' '}
        <a href="http://digital.sl.nsw.gov.au/delivery/DeliveryManagerServlet?embedded=true&toolbar=false&dps_pid=IE16029768&_ga=2.37721056.1376123371.1606690325-519729995.1549751161">
          CSV file
        </a>{' '}
        from the Library's catalogue. Art Index is designed to make exploring
        this rich but complex data set easier and more productive.
      </p>
      <p className={css.paragraph}>
        The <strong>Art Index</strong> lists over 18,000 artworks exhibited in
        Australia by Australian-based artists between 1847 (the first documented
        art exhibition supported by a catalogue in Australia) and 1900. This
        information is compiled from published art catalogues in the Library's
        collections. There are over 2000 artists represented in the data set.
        The entries detail artwork titles, formats, exhibitions, artists, price
        and more.
      </p>
      <p className={css.paragraph}>
        All this can be experienced through <strong>data visualisation</strong>,
        a{' '}
        <Link as="/search/">
          <a>search interface</a>
        </Link>{' '}
        and connection{' '}
        <Link as="/explore/">
          <a>explorer</a>
        </Link>
        .
      </p>

      {/* ------------------------------------------------------------- */}
      {/* Works */}
      {/* ------------------------------------------------------------- */}

      <h2>Artworks by year</h2>

      <p className={css.paragraph}>
        The <strong>{works.length.toLocaleString()}</strong> artworks were
        exhibited between 1845—1900. The chart below shows a steady increase of
        artworks, revealing a peak in <strong>1893</strong>, potentially due to
        the downturn from the economic depression that followed.
      </p>

      <BarChart
        data={worksByYearData}
        rotateXAxis={true}
        xAxisTickIncrement={5}
        xAxisTickValuesNumeric={true}
        id={'works-by-year'}
        margin={{
          bottom: 40,
        }}
        className={css.worksByYearChart}
      />

      {/* ------------------------------------------------------------- */}
      {/* Artists */}
      {/* ------------------------------------------------------------- */}

      <h2>Artists</h2>

      <p className={css.paragraph}>
        There are <strong>{artists.length.toLocaleString()}</strong> artists
        represented in this data set. Click on an artist below to explore more
        information about them, including their artworks and exhibitions. For
        more well known artists, we have included data from{' '}
        <a href="https://www.wikidata.org/">Wikidata</a> and links to relevant
        external sources.
      </p>

      <ArtIndexArtistList
        className={[css.fullBleed, css.artistList].join(' ')}
      />

      {/* ------------------------------------------------------------- */}
      {/* Formats */}
      {/* ------------------------------------------------------------- */}

      <h2>Formats</h2>

      <p className={css.paragraph}>
        <Link as="/search/?formats=painting">
          <a>Paintings</a>
        </Link>{' '}
        were the most common format of the time, followed by other formats such
        as{' '}
        <Link as="/search/?formats=photograph">
          <a>photography</a>
        </Link>{' '}
        and{' '}
        <Link as="/search/?formats=sculpture">
          <a>sculpture</a>
        </Link>
        . Click on a circle below to start a search based on that format.
      </p>

      <ArtIndexGenderFormatBubbleChart
        data={formatsData}
        letterWidth={4}
        smallCircleLimit={13}
        onBubbleClick={(event, bubble) => {
          event.preventDefault();

          Router.push(
            searchQuery.stringify({
              search: '',
              formats: bubble.data.name.toLowerCase(),
            }),
          ).then(() => window.scrollTo(0, 0));
        }}
        className={css.genderFormatBubbleChart}
      />

      {/* ------------------------------------------------------------- */}
      {/* Gender */}
      {/* ------------------------------------------------------------- */}

      <div
        className={[css.sectionMasthead, css.fullBleed].join(' ')}
        style={{
          backgroundImage: `url('${basePath}/images/works/martens-port-jackson-673.jpg')`,
        }}
      >
        <div className={css.sectionMastheadOverlay}></div>
        <h2>Gender</h2>
        <p>How do female and male artists compare?</p>
        <Link as="/work/673/">
          <a
            title="Entrance to Port Jackson by Conrad Martens"
            className={css.imageCredit}
          >
            <em>Entrance to Port Jackson</em> by Conrad Martens
          </a>
        </Link>
      </div>

      <p className={css.paragraph}>
        The data in the Art Index confirms the historical gender bias in the
        arts that preferences male artists over females. The Index reveals a
        consistently lower ratio of women to men artists during the timeframe
        that the exhibitions occurred. Overall women artists make up only{' '}
        <strong>34%</strong> of the total number of artists.
      </p>

      <div>
        <ArtIndexGenderArtistCharts />
      </div>

      <div>
        <h2>All artists by gender</h2>

        <p className={css.paragraph}>
          With all artists represented, the percentage of women jumps to{' '}
          <strong>34%</strong>, suggesting that top artists are men. Explore
          this further by moving the sliders below to see how the gender split
          changes depending on rank.
        </p>

        <ArtIndexGenderRangeDonutChart
          data={artistsGenderData}
          className={css.genderRange}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Price */}
      {/* ------------------------------------------------------------- */}

      <h2>Gender balance across formats</h2>
      <p className={css.paragraph}>
        Here is a selection of formats showing the breakdown of works by gender.
        Formats such as{' '}
        <Link as="/search/?formats=china painting">
          <a>china paintings</a>
        </Link>{' '}
        and{' '}
        <Link as="/search/?formats=wax medallion">
          <a>wax medallions</a>
        </Link>{' '}
        were more popular with women, while{' '}
        <Link as="/search/?formats=architectural drawing">
          <a>architectural drawings</a>
        </Link>{' '}
        and{' '}
        <Link as="/search/?formats=photographs">
          <a>photographs</a>
        </Link>{' '}
        leaned heavily towards men.
      </p>
      <ArtIndexGenderFormatDonutCharts />

      <h2>Average price of work by gender</h2>

      <p className={css.paragraph}>
        As shown below, works by women were consistently valued less than
        men's—even after taking into account the{' '}
        <a href="https://en.wikipedia.org/wiki/Australian_banking_crisis_of_1893">
          Australian banking crisis of 1893
        </a>
        , where a visible dip in prices can be seen.
      </p>

      <ArtIndexGenderPriceChart className={css.genderPriceChart} />

      {/* ------------------------------------------------------------- */}
      {/* Gender Balance */}
      {/* ------------------------------------------------------------- */}

      <div className={css.genderBalance}>
        <h2>Artist gender balance by year</h2>

        <p className={css.paragraph}>
          Over a 53 year period, the gender balance improves slightly,
          approaching <strong>40%</strong> women artists in 1900. Have we
          progressed in this gender imbalance over the last 120 years? Current
          initiatives like{' '}
          <a
            href="https://knowmyname.nga.gov.au/about/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Know My Name
          </a>{' '}
          indicate that this is still a problem today.
        </p>

        <ArtIndexGenderLegend
          markerType="square"
          className={css.genderBalanceLegend}
        />

        <StackedBarChart
          id={'genderYearData'}
          data={genderYearData}
          rotateXAxis={true}
          margin={{
            bottom: 30,
          }}
          renderBar={(d, i) => {
            return {
              fill: getGenderColour(i === 0 ? 'male' : 'female'),
            };
          }}
        />
      </div>

      <div className={css.methodology}>
        <h2>*Gender selection methodology</h2>
        <p className={css.paragraph}>
          Due to the lack of artist information in the original Art Index
          dataset, we manually inferred the artist gender based on their{' '}
          <strong>first name</strong>. While this approach was not 100%
          accurate, it was both scalable and realistic due to the majority of
          artists having typical <strong>European</strong> names (interestingly,
          only one artist with a non-European name was found{'—'}
          <Link as="/artist/578/">
            <a>Pang Cheah Yeng Chun</a>
          </Link>
          )
        </p>
        <p className={css.paragraph}>
          Many women also had <strong>Mrs</strong> or <strong>Ms</strong> as
          their name title, which made the job even easier. Some artist names
          were ambiguous or missing, so we labelled them as{' '}
          <strong>unknown</strong> ({unknownGenderCount} out of {artists.length}{' '}
          artists).
        </p>
      </div>

      <div
        className={[css.sectionMasthead, css.fullBleed].join(' ')}
        style={{
          backgroundImage: `url('${basePath}/images/works/martens-abercrombie-caves-14969.jpg')`,
        }}
      >
        <div className={css.sectionMastheadOverlay}></div>
        <p>
          Find works, artists and exhibitions:
          <br />
          <br />
          <CTALink href="/search/">Search</CTALink>
        </p>
        <p>
          Explore the data and connections:
          <br />
          <br />
          <CTALink href="/explore/">Explore</CTALink>
        </p>
        <Link as="/work/14969/">
          <a title="Abercrombie Caves by Conrad Martens">
            <div className={css.imageCredit}>
              <em>Abercrombie Caves</em> by Conrad Martens
            </div>
          </a>
        </Link>
      </div>

      <div className={css.methodology}>
        <h2>Dedicated to Berry Symons</h2>
        <p className={css.paragraph}>
          This index was initiated by Library volunteer,{' '}
          <strong>Berry Symons</strong>, in 1989. When Berry began this project,
          entries were recorded on catalogue cards. Berry persisted with the
          index until her death in 2005. Other Library volunteers since then
          have contributed to continuing her work and transferred her cards to
          this online database. This index is dedicated to Berry, and to the
          hard work of the many volunteers whom have ensured that the index was
          completed.
        </p>
      </div>
    </div>
  );
};

export default ArtIndexHomePage;
