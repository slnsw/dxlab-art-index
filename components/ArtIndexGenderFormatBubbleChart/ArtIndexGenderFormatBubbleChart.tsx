import React from 'react';

import ArtIndexFormatBubbleChart from '../ArtIndexFormatBubbleChart';

import css from './ArtIndexGenderFormatBubbleChart.module.scss';

type Props = {
  data?: {
    all: {
      item: string;
      count: number;
    }[];
    female: {
      item: string;
      count: number;
    }[];
    male: {
      item: string;
      count: number;
    }[];
    unknown: {
      item: string;
      count: number;
    }[];
  };
  height?: number;
  smallCircleLimit?: number;
  letterWidth?: number;
  onBubbleClick?: Function;
  className?: string;
};

const ArtIndexGenderFormatBubbleChart: React.FC<Props> = ({
  data,
  className,
  height = 500,
  smallCircleLimit = 11,
  letterWidth = 4,
  onBubbleClick,
}) => {
  // const [genderFiltering, setGenderFiltering] = React.useState('all');
  const [chosenData, setChosenData] = React.useState([]);
  React.useEffect(() => {
    const d = data && data['all']; // genderFiltering
    setChosenData(d);
  }, [data]); // genderFiltering

  return (
    <div className={css.ArtIndexGenderFormatBubbleChart}>
      {/* <div className={css.filterButtons}>
        <p>Filter by gender</p>
        <a
          className={[
            css.filterLink,
            genderFiltering === 'female' ? css.filterSelected : '',
          ].join(' ')}
          onClick={() => setGenderFiltering('female')}
        >
          female
        </a>
        <a
          className={[
            css.filterLink,
            genderFiltering === 'male' ? css.filterSelected : '',
          ].join(' ')}
          onClick={() => setGenderFiltering('male')}
        >
          male
        </a>
        <a
          className={[
            css.filterLink,
            genderFiltering === 'unknown' ? css.filterSelected : '',
          ].join(' ')}
          onClick={() => setGenderFiltering('unknown')}
        >
          unknown
        </a>
        <a
          className={[
            css.filterLink,
            genderFiltering === 'all' ? css.filterSelected : '',
          ].join(' ')}
          onClick={() => setGenderFiltering('all')}
        >
          all
        </a>
      </div> */}
      <ArtIndexFormatBubbleChart
        data={chosenData}
        className={className}
        height={height}
        smallCircleLimit={smallCircleLimit}
        letterWidth={letterWidth}
        onBubbleClick={onBubbleClick}
      />
    </div>
    // <ArtIndexFormatBubbleChart
    //   data={data.slice(0, 30).map((d) => {
    //     return {
    //       name: d.item || 'Unknown',
    //       value: d.count,
    //     };
    //   })}
    //   height={height}
    //   className={[css.ArtIndexGenderFormatBubbleChart, className || ''].join(
    //     ' ',
    //   )}
    //   renderBubble={(d, i) => {
    //     // TODO: Consider `provider` API like React Select
    //     return {
    //       append: 'g',
    //       transform: `translate(${d.x},${d.y})`,
    //       duration: 1000,
    //       children: [
    //         {
    //           append: 'circle',
    //           data: d.data,
    //           r: { enter: d.r, exit: 0 },
    //           fill: 'var(--colour-primary)',
    //           duration: 1000,
    //           onClick: typeof onBubbleClick === 'function' && onBubbleClick,
    //           cursor:
    //             typeof onBubbleClick === 'function' ? 'pointer' : 'default',
    //           onMouseOver: () => {
    //             setHoverIndex(i);
    //           },
    //           onMouseOut: () => {
    //             setHoverIndex(null);
    //           },
    //         },
    //       ],
    //     };
    //   }}
    //   renderLabel={(d, i) => {
    //     const isHovered = i === hoverIndex;
    //     const labelText = d.data.name || 'Unknown';
    //     const displayNumber =
    //       d.data.value.toString().length * letterWidth < d.r;

    //     // TODO: Consider `provider` API like React Select
    //     return {
    //       append: 'g',
    //       transform: `translate(${d.x},${d.y})`,
    //       duration: 1000,
    //       children: [
    //         {
    //           append: 'text',
    //           key: d.data.name,
    //           fill: 'var(--colour-white)',
    //           fontWeight: 600,
    //           text:
    //             isHovered || labelText.length * letterWidth < d.r
    //               ? labelText
    //               : ' ', // have to put an actual space here, not empty string or else text never goes away
    //           opacity: { enter: 1, exit: 0 },
    //           duration: 1000,
    //           y: '-0.2em',
    //         },
    //         {
    //           append: 'text',
    //           fill: 'var(--colour-white)',
    //           text:
    //             isHovered || (displayNumber && d.r > smallCircleLimit)
    //               ? d.data.value
    //               : ' ', // have to put an actual space here, not empty string or else text never goes away
    //           opacity: 0.8,
    //           y: '0.9em',
    //         },
    //       ],
    //     };
    //   }}
    // />
  );
};

export default ArtIndexGenderFormatBubbleChart;
