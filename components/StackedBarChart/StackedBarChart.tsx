import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import render from 'd3-render';

import useDimensions from '../../lib/hooks/use-dimensions';

import css from './StackedBarChart.module.scss';

type Props = {
  data: {
    [key: string]: number;
  }[];
  height?: number;
  margin?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  direction?: 'vertical' | 'horizontal';
  rotateXAxis?: boolean;
  showValues?: boolean;
  renderBar?: Function;
  id?: string;
  className?: string;
};

const defaultMargin = {
  top: 10,
  left: 40,
  right: 10,
  bottom: 20,
};

const StackedBarChart: React.FC<Props> = ({
  data = [],
  // width: propWidth,
  height = 200,
  margin: newMargin = defaultMargin,
  direction = 'vertical',
  rotateXAxis = false,
  showValues = false,
  renderBar,
  id = 'bar-chart',
  className,
  ...restProps
}) => {
  // const [hoverIndex, setHoverIndex] = React.useState(null);
  const [svgRef, dimensions, svgNode] = useDimensions();
  const { width } = dimensions;
  const margin = {
    ...defaultMargin,
    ...newMargin,
  };

  React.useEffect(() => {
    if (svgNode && data.length > 0 && width) {
      const columns = Object.keys(data[0]).map((key) => key);

      const series = d3
        .stack()
        .keys(() => {
          return columns.slice(1);
        })
        .offset(d3.stackOffsetExpand)(data);

      const x = d3
        .scaleTime()
        .domain(
          d3.extent(data, (d) => {
            return d.year;
          }),
        )
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

      const area = d3
        .area()
        .curve(d3.curveStep)
        .x((d) => x(d.data.year))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]));

      const color = d3
        .scaleOrdinal()
        .domain(columns.slice(1))
        .range(d3.schemeCategory10);

      const xAxis = (g) =>
        g.attr('transform', `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
            .tickFormat(d3.format('d')),
        );

      const yAxis = (g) =>
        g
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(10, '%'))
          .call((s) => s.select('.domain').remove());

      const renderData = [
        {
          key: 'g',
          append: 'g',
          children: series.map((d, i) => {
            return {
              key: `${d.key}`,
              append: 'path',
              fill: color(d.key),
              opacity: { enter: 1, exit: 0 },
              d: { enter: area(d), exit: area(d) },
              duration: 1000,
              ...(typeof renderBar === 'function' ? renderBar(d, i) : {}),
            };
          }),
        },
        {
          append: 'g',
          class: 'x-axis',
          call: xAxis,
        },
        {
          append: 'g',
          call: yAxis,
        },
      ];

      render(svgNode, renderData);

      if (rotateXAxis) {
        d3.selectAll(`#${id} .x-axis text`)
          .style('text-anchor', 'end')
          .attr('dx', '-1em')
          .attr('dy', '-.5em')
          .attr('transform', 'rotate(-90)');
      }
    }
  }, [svgNode, data, width, height, margin, renderBar, rotateXAxis, id]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      id={id}
      className={[css.stackedBarChart, className || ''].join(' ')}
      {...restProps}
    />
  );
};

StackedBarChart.propTypes = {
  className: PropTypes.string,
};

export default StackedBarChart;
