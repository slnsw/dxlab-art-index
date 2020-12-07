import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import render from 'd3-render';

import useDimensions from '../../lib/hooks/use-dimensions';

import css from './BubbleChart.module.scss';

type Props = {
  data: {
    name: string;
    value: number;
  }[];
  height?: number;
  // width?: number;
  bubblePadding?: number;
  className?: string;
  renderBubble?: Function;
  renderLabel?: Function;
  onBubbleClick?: Function;
  showValues?: boolean;
};

const BubbleChart: React.FC<Props> = ({
  data = [],
  height = 200,
  // width = 200,
  bubblePadding = 3,
  className,
  renderBubble,
  renderLabel,
  onBubbleClick,
  showValues = true,
  ...restProps
}) => {
  const [hoverIndex, setHoverIndex] = React.useState(null);
  const [svgRef, dimensions, svgNode] = useDimensions();
  const { width } = dimensions;

  React.useEffect(() => {
    // console.log(onBubbleClick);

    if (svgNode && data.length > 0 && width) {
      const root = pack(data, { width, height, padding: bubblePadding });

      const circleData = root.leaves().map((d, i) => {
        if (typeof renderBubble === 'function') {
          return renderBubble(d, i);
        }

        return {
          append: 'g',
          transform: `translate(${d.x},${d.y})`,
          children: [
            {
              append: 'circle',
              data: d.data,
              r: d.r,
              fill: 'var(--colour-primary)',
              onClick: onBubbleClick,
              onMouseOver: () => {
                setHoverIndex(i);
              },
              onMouseOut: () => {
                setHoverIndex(null);
              },
            },
          ],
        };
      });

      const textData = root.leaves().map((d, i) => {
        const isHovered = i === hoverIndex;
        if (typeof renderLabel === 'function') {
          return renderLabel(d, i);
        }

        return {
          append: 'g',
          transform: `translate(${d.x},${d.y})`,
          children: [
            {
              append: 'text',
              key: `${isHovered}`,
              fill: 'var(--colour-white)',
              text: showValues || isHovered ? d.data.name : '',
              y: (_, index, node) => `${index - node.length / 2 + 0.8}em`,
            },
          ],
        };
      });

      const renderData = [...circleData, ...textData];
      render(svgNode, renderData);
    }
  }, [
    svgNode,
    data,
    width,
    height,
    bubblePadding,
    renderBubble,
    renderLabel,
    onBubbleClick,
    showValues,
    hoverIndex,
  ]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className={[css.bubbleChart, className || ''].join(' ')}
      {...restProps}
    />
  );
};

function pack(data, { width, height, padding }) {
  return d3
    .pack()
    .size([width - 2, height - 2])
    .padding(padding)(d3.hierarchy({ children: data }).sum((d) => d.value));
}

BubbleChart.propTypes = {
  className: PropTypes.string,
};

export default BubbleChart;
