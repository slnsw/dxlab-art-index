import React from 'react';
import scrollama from 'scrollama';

import ArtIndexGenderDonutChart from '../ArtIndexGenderDonutChart';
import BarChart from '../BarChart';
import Link from '../Link';

import { getGenderColour } from '../../lib/art-index-utils';
import { useArtIndex } from '../../lib/contexts/art-index-context';

import css from './ArtIndexGenderArtistCharts.module.scss';

type Props = {
  className?: string;
};

const ArtIndexGenderArtistCharts: React.FC<Props> = ({ className }) => {
  const { state } = useArtIndex();
  const { artistsGenderData } = state;

  const [topArtistsTotal, setTopArtistsTotal] = React.useState(10);
  const slicedArtistsData = artistsGenderData.slice(0, topArtistsTotal);
  const malesTotal = slicedArtistsData.filter((d) => d.gender === 'male')
    .length;
  const femalesTotal = slicedArtistsData.filter((d) => d.gender === 'female')
    .length;

  React.useEffect(() => {
    const scroller = scrollama();

    scroller
      .setup({
        step: '.step',
        offset: 0.9,
      })
      .onStepEnter(handleStepEnter);
  }, []);

  const handleStepEnter = (response) => {
    const totals = [10, 50];

    setTopArtistsTotal(totals[response.index]);
  };

  return (
    <>
      <div className={css.genderCharts}>
        <h2 className={css.title}>Top {topArtistsTotal} artists by gender</h2>

        <ArtIndexGenderDonutChart
          malesTotal={malesTotal}
          femalesTotal={femalesTotal}
        />

        <BarChart
          data={slicedArtistsData}
          height={250}
          rotateXAxis={true}
          renderBar={(d) => {
            return {
              fill: getGenderColour(d.gender),
            };
          }}
          margin={{
            bottom: 100,
          }}
        />
      </div>

      <div
        className="step"
        style={{
          height: 400,
        }}
      >
        <p className={css.paragraph}>
          The artists above are ranked by how many artworks they exhibited, with{' '}
          <Link as="/artist/2734/">
            <a>Marian Ellis Rowan</a>
          </Link>
          , a well-known Australian artist and botanical illustrator listed as
          the only woman in the <strong>top 10</strong>.
        </p>
      </div>

      <div
        className="step"
        style={{
          marginBottom: '10rem',
        }}
      >
        <p className={css.paragraph}>
          Broadening the list to the <strong>top 50</strong> sees the percentage
          of women increase slightly. The majority of these artists are still
          male (37 out of 50).
        </p>
      </div>
    </>
  );
};

export default ArtIndexGenderArtistCharts;
