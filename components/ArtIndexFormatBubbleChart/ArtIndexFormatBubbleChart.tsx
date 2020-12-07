import React from 'react';

import BubbleChart from '../BubbleChart';

import css from './ArtIndexFormatBubbleChart.module.scss';

type Props = {
  data?: {
    item: string;
    count: number;
  }[];
  height?: number;
  smallCircleLimit?: number;
  letterWidth?: number;
  onBubbleClick?: Function;
  className?: string;
};

const ArtIndexFormatBubbleChart: React.FC<Props> = ({
  data,
  className,
  height = 600,
  smallCircleLimit = 11,
  letterWidth = 4,
  onBubbleClick,
}) => {
  const [hoverIndex, setHoverIndex] = React.useState(null);
  return (
    <BubbleChart
      data={data.slice(0, 30).map((d) => {
        return {
          name: d.item || 'Unknown',
          value: d.count,
        };
      })}
      height={height}
      className={[css.artIndexFormatBubbleChart, className || ''].join(' ')}
      renderBubble={(d, i) => {
        // TODO: Consider `provider` API like React Select
        return {
          append: 'g',
          transform: `translate(${d.x},${d.y})`,
          duration: 1000,
          children: [
            {
              append: 'circle',
              data: d.data,
              r: { enter: d.r, exit: 0 },
              fill: 'var(--colour-primary)',
              duration: 1000,
              onClick: typeof onBubbleClick === 'function' && onBubbleClick,
              cursor:
                typeof onBubbleClick === 'function' ? 'pointer' : 'default',
              onMouseOver: () => {
                setHoverIndex(i);
              },
              onMouseOut: () => {
                setHoverIndex(null);
              },
            },
          ],
        };
      }}
      renderLabel={(d, i) => {
        const isHovered = i === hoverIndex;

        const labelText = d.data.name || 'Unknown';

        const displayNumber =
          d.data.value.toString().length * letterWidth < d.r;

        const shortenedLabelText =
          d.r > smallCircleLimit
            ? // ? `${labelText.slice(0, d.data.value.toString(10).length - 1)}…`
              `${labelText.slice(0, Math.floor(d.r / letterWidth) - 1)}…`
            : ' '; // have to put an actual space here, not empty string or else text never goes away
        // TODO: Consider `provider` API like React Select
        return {
          append: 'g',
          transform: `translate(${d.x},${d.y})`,
          duration: 1000,
          children: [
            {
              append: 'text',
              key: d.data.name,
              fill: 'var(--colour-white)',
              fontWeight: 600,
              text:
                isHovered || labelText.length * letterWidth < d.r
                  ? labelText
                  : shortenedLabelText,
              opacity: { enter: 1, exit: 0 },
              duration: 1000,
              y: '-0.2em',
            },
            {
              append: 'text',
              fill: 'var(--colour-white)',
              text:
                isHovered || (displayNumber && d.r > smallCircleLimit)
                  ? d.data.value
                  : ' ', // have to put an actual space here, not empty string or else text never goes away
              opacity: 0.8,
              y: '0.9em',
            },
          ],
        };
      }}
    />
  );
};

export default ArtIndexFormatBubbleChart;
