import React from 'react';

import LineChart from '../LineChart';
import ArtIndexGenderLegend from '../ArtIndexGenderLegend';

import { getGenderColour } from '../../lib/art-index-utils';
import { useArtIndex } from '../../lib/contexts/art-index-context';

import css from './ArtIndexGenderPriceChart.module.scss';

type Props = {
  className?: string;
};

const ArtIndexGenderPriceChart: React.FC<Props> = ({ className }) => {
  const { state } = useArtIndex();
  const { priceData } = state;
  const priceDataUpdated = [
    // just repeating the last data points to encourge
    // the graph to display the 1900 year in the x-axis.
    ...priceData,
    { name: '1901', value: 6.83, type: 'female' },
    { name: '1901', value: 16.4, type: 'male' },
  ];

  return (
    <div className={[css.artIndexGenderPriceChart, className || ''].join(' ')}>
      <ArtIndexGenderLegend />

      <LineChart
        height={350}
        data={
          priceDataUpdated.length > 0 && [
            priceDataUpdated
              .filter((d) => d.type === 'male')
              .map((d) => {
                return {
                  date: new Date(parseInt(d.name, 10), 0, 0),
                  value: d.value,
                };
              }),
            priceDataUpdated
              .filter((d) => d.type === 'female')
              .map((d) => {
                return {
                  date: new Date(parseInt(d.name, 10), 0, 0),
                  value: d.value,
                };
              }),
          ]
        }
        rotateXAxis={true}
        margin={{
          top: 20,
          bottom: 50,
        }}
        renderLine={(d, i) => {
          return {
            stroke:
              i === 0 ? getGenderColour('male') : getGenderColour('female'),
          };
        }}
      />
    </div>
  );
};

export default ArtIndexGenderPriceChart;
