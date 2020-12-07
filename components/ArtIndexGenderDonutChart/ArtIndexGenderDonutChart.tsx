import React from 'react';

import DonutChart from '../DonutChart';

import { getGenderColour } from '../../lib/art-index-utils';

import css from './ArtIndexGenderDonutChart.module.scss';

type Props = {
  malesTotal: number;
  femalesTotal: number;
  className?: string;
};

const GenderDonutChart = ({ malesTotal, femalesTotal, className }: Props) => {
  const bothTotal = malesTotal + femalesTotal;
  const malesPercent = `${Math.round((malesTotal / bothTotal) * 100)}%`;
  const femalesPercent = `${Math.round((femalesTotal / bothTotal) * 100)}%`;

  return (
    <div className={[css.genderDonutChart, className || ''].join(' ')}>
      <div className={css.legend}>
        <div
          className={css.legendColour}
          style={{
            width: '1rem',
            height: '1rem',
            marginRight: '0.5rem',
            backgroundColor: getGenderColour('female'),
          }}
        ></div>
        <p
          className={css.legendName}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 0,
          }}
        >
          Female{' '}
        </p>
        <p
          className={css.legendCount}
          style={{
            opacity: 0.5,
            marginLeft: '0.5rem',
            fontSize: '2rem',
          }}
        >
          {femalesPercent}
        </p>
      </div>

      {malesTotal && femalesTotal && (
        <DonutChart
          data={[
            {
              name: 'Men',
              value: malesTotal,
            },
            {
              name: 'Women',
              value: femalesTotal,
            },
          ]}
          height={100}
          padding={0}
          renderLabelText={() => null}
          colours={[
            'var(--colour-art-index-male)',
            'var(--colour-art-index-female)',
          ]}
          className={css.donutChart}
          // renderLabelText={(d) =>
          //   `${d.data.name} (${
          //     d.data.name === 'Men' ? malesPercent : femalesPercent
          //   })`
          // }
        />
      )}
      <div className={css.legend}>
        <div
          className={css.legendColour}
          style={{
            display: 'flex',
            width: '1rem',
            height: '1rem',
            marginRight: '0.5rem',
            backgroundColor: getGenderColour('male'),
          }}
        ></div>
        <p
          className={css.legendName}
          style={{
            alignItems: 'center',
            marginBottom: 0,
          }}
        >
          Male{' '}
        </p>
        <p
          className={css.legendCount}
          style={{
            marginLeft: '0.5rem',
            fontSize: '2rem',
            opacity: 0.5,
          }}
        >
          {malesPercent}
        </p>
      </div>
    </div>
  );
};

export default GenderDonutChart;
