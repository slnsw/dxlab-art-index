import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import render from 'd3-render';

import useDimensions from '../../lib/hooks/use-dimensions';

import css from './LineChart.module.scss';

type Props = {
  data: {
    date: Date;
    value: number;
  }[][];
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
  renderLine?: Function;
  id?: string;
  className?: string;
};

const defaultMargin = {
  top: 10,
  left: 40,
  right: 10,
  bottom: 20,
};

const LineChart: React.FC<Props> = ({
  data = [],
  height = 200,
  margin: newMargin = defaultMargin,
  direction = 'vertical',
  rotateXAxis = false,
  showValues = false,
  renderLine,
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

  // console.log(data);

  React.useEffect(() => {
    if (svgNode && data.length > 0 && width) {
      let x;
      let y;
      let xAxis;
      let yAxis;
      let line;
      const maximum = d3.max(data, (series) => d3.max(series, (d) => d.value));
      const svg = d3.select(svgNode);

      if (direction === 'vertical') {
        // x = d3
        //   .scaleBand()
        //   .domain(d3.range(data.length))
        //   .range([margin.left, width - margin.right])
        //   .padding(0.1);

        x = d3
          .scaleUtc()
          // .domain(d3.extent(data, (d) => d.date))
          .domain([
            d3.min(data, (series) => d3.min(series, (d) => d.date)),
            d3.max(data, (series) => d3.max(series, (d) => d.date)),
          ])
          .range([margin.left, width - margin.right]);

        y = d3
          .scaleLinear()
          .domain([0, maximum])
          .nice()
          .range([height - margin.bottom, margin.top]);

        line = d3
          .line()
          .defined((d) => !Number.isNaN(d.date))
          .x((d) => {
            return x(d.date);
          })
          .y((d) => {
            return y(d.value);
          });

        xAxis = d3
          .axisBottom(x)
          .ticks(10)
          .tickFormat((d) => {
            return d.getFullYear();
          })
          .tickSizeOuter(0);

        yAxis = (g) =>
          g
            .attr('transform', `translate(${margin.left + 1},0)`)
            .call(d3.axisLeft(y).ticks(null, 's'))
            .call((selection) => selection.select('.domain').remove());

        render(svg, [
          {
            append: 'g',
            children: data.map((series, i) => {
              return {
                append: 'path',
                fill: 'none',
                stroke: 'var(--colour-primary)',
                strokeWidth: 1.5,
                duration: 1000,
                d: line(series),
                ...(typeof renderLine === 'function'
                  ? renderLine(series, i)
                  : {}),
              };
            }),
          },
          {
            append: 'g',
            class: 'x-axis',
            // key: width,
            key: Date.now(),
            transform: `translate(0, ${height - margin.bottom})`,
            call: xAxis,
          },
          {
            append: 'g',
            call: yAxis,
          },
        ]);

        if (rotateXAxis) {
          d3.selectAll(`#${id} .x-axis text`)
            .style('text-anchor', 'end')
            .attr('dx', '-1em')
            .attr('dy', '-.5em')
            .attr('transform', 'rotate(-90)');
        }
      } else {
        y = d3
          .scaleOrdinal()
          .domain(data.map((d) => d.name))
          .range(
            data.map(
              (_, i) =>
                ((height - margin.top - margin.bottom) / data.length) * i +
                margin.top,
            ),
          );

        x = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.value)])
          .range([margin.left, width - margin.right]);

        xAxis = d3.axisBottom(x);

        yAxis = (g) =>
          g
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, 's'));

        render(svg, [
          {
            append: 'g',
            fill: 'var(--colour-primary)',
            children: data.map((d, i) => {
              return {
                append: 'rect',
                x: margin.left + 1,
                y:
                  ((height - margin.top - margin.bottom) / data.length) * i +
                  margin.top / 2,
                width:
                  (d.value / maximum) * (width - margin.left - margin.right),
                height: (height - margin.top - margin.bottom) / data.length - 1,
              };
            }),
          },
          {
            append: 'g',
            key: width,
            transform: `translate(0, ${height - margin.bottom})`,
            call: xAxis,
          },
          {
            append: 'g',
            call: yAxis,
          },
        ]);
      }
    }
  }, [
    svgNode,
    data,
    width,
    height,
    margin,
    id,
    showValues,
    direction,
    rotateXAxis,
    // hoverIndex,
    renderLine,
  ]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      id={id}
      className={[css.lineChart, className || ''].join(' ')}
      {...restProps}
    />
  );
};

LineChart.propTypes = {
  className: PropTypes.string,
};

export default LineChart;
