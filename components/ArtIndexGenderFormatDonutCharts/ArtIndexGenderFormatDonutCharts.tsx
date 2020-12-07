import React from 'react';

import { useArtIndex } from '../../lib/contexts/art-index-context';
import DonutChart from '../DonutChart';
import ArtIndexGenderLegend from '../ArtIndexGenderLegend';

// import { getGenderColour } from '../../lib/art-index-utils';

import css from './ArtIndexGenderFormatDonutCharts.module.scss';

type Props = {
  className?: string;
};

const ArtIndexGenderFormatDonutCharts = ({ className }: Props) => {
  const { state } = useArtIndex();
  const { formatByGenderData } = state;
  const { males, females } = formatByGenderData;
  const formats = [
    'China painting',
    'Wax Medallion',
    'Miniature',
    'Wood Carving',
    'Crayon Drawing',
    'Pencil Drawing',
    'Medallion',
    'Oil Painting',
    'Watercolour Painting',
    'Drawing',
    // "Unknown",
    // 'Ink Drawing',
    'Book',
    'Jewellery',
    'Printing',
    'Sculpture',
    'Architectural Drawing',
    'Photograph',
  ];
  const donutData = formats.map((f) => {
    const fdata =
      females &&
      females.filter((d) => {
        return d.format === f;
      });
    const mdata =
      males &&
      males.filter((d) => {
        return d.format === f;
      });
    const total = mdata && fdata && mdata[0].count + fdata[0].count;
    const malePercentage = total && Math.floor((mdata[0].count / total) * 100);
    const femalePercentage = total && 100 - malePercentage;
    return {
      format: f,
      data: [
        {
          name: 'Men',
          value: total && malePercentage,
        },
        {
          name: 'Women',
          value: total && femalePercentage,
        },
      ],
    };
  });

  return (
    <div className={className}>
      <ArtIndexGenderLegend markerType="square" />
      <div
        className={[css.ArtIndexGenderFormatDonutCharts, className || ''].join(
          ' ',
        )}
      >
        {donutData.map((donut) => {
          return (
            <div className={css.formatDonut} key={donut.format}>
              {
                <DonutChart
                  data={donut.data}
                  height={120}
                  padding={26}
                  padAngle={0.05}
                  innerRadiusRatio={0.7}
                  colours={[
                    'var(--colour-art-index-male)',
                    'var(--colour-art-index-female)',
                  ]}
                  renderLabelText={(d) => d.data.value && `${d.data.value}%`}
                />
              }
              <p className={css.donutLabel}>{donut.format}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArtIndexGenderFormatDonutCharts;
