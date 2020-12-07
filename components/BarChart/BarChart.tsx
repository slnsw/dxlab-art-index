import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import render from 'd3-render';

import useDimensions from '../../lib/hooks/use-dimensions';

import css from './BarChart.module.scss';

/* ========

This component creates a bar chart.

Data is expected to be an array of objects, each
containing 'name' for each bar and 'value' for its height.

========= */

type Props = {
  data: {
    name: string;
    value: number;
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
  xAxisTickIncrement?: number; // if set to say N, axis shows only every Nth tick:
  // eg if n=5 it will show 1955, 1960, 1965 etc BUT it assumes the values for the
  // tick names are NUMERIC (even though they come in a strings) so this may break
  // if they are like states or days of the week etc - thus i've added the following prop
  xAxisTickValuesNumeric?: boolean; // defaults to FALSE so values of tick labels are not
  // attempted to be turned into numbers. Actual Nth ticks are shown if xAxisTickIncrement set.
  // In the case where they are numeric (eg years) set this to true and years which are multiples
  // of xAxisTickIncrement are only shown. First and last on axis are always shown.
  id?: string;
  className?: string;
};

const defaultMargin = {
  top: 10,
  left: 40,
  right: 10,
  bottom: 20,
};

const BarChart: React.FC<Props> = ({
  data = [],
  // width: propWidth,
  height = 200,
  margin: newMargin = defaultMargin,
  direction = 'vertical',
  rotateXAxis = false,
  showValues = false,
  renderBar,
  xAxisTickIncrement = 1,
  xAxisTickValuesNumeric = false,
  id = 'bar-chart',
  className,
  ...restProps
}) => {
  const [hoverIndex, setHoverIndex] = React.useState(null);
  const [svgRef, dimensions, svgNode] = useDimensions();
  const { width } = dimensions;
  const margin = {
    ...defaultMargin,
    ...newMargin,
  };

  React.useEffect(() => {
    if (svgNode && data.length > 0 && width) {
      let x;
      let y;
      let xAxis;
      let yAxis;
      const maximum = d3.max(data, (d) => d.value);
      const svg = d3.select(svgNode);

      if (direction === 'vertical') {
        x = d3
          .scaleBand()
          .domain(d3.range(data.length))
          .range([margin.left, width - margin.right])
          .padding(0.1);

        y = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.value)])
          .nice()
          .range([height - margin.bottom, margin.top]);

        xAxis = d3
          .axisBottom(x)
          .tickFormat((i) => data[i].name)
          .tickSizeOuter(0);

        yAxis = (g) =>
          g
            .attr('transform', `translate(${margin.left + 1},0)`)
            .call(d3.axisLeft(y).ticks(null, 's'))
            .call((selection) => selection.select('.domain').remove());

        render(svg, [
          {
            append: 'g',
            fill: 'var(--colour-primary)',
            children: data.map((d, i) => {
              return {
                append: 'g',
                children: [
                  {
                    append: 'rect',
                    x: x(i),
                    y: y(d.value),
                    width: x.bandwidth(),
                    height: y(0) - y(d.value),
                    onMouseOver: () => {
                      setHoverIndex(i);
                    },
                    onMouseOut: () => {
                      setHoverIndex(null);
                    },
                    ...(typeof renderBar === 'function' ? renderBar(d, i) : {}),
                  },
                ],
              };
            }),
          },
          {
            // doing values in separate loop so they are 'on top'
            append: 'g',
            children: data.map((d, i) => {
              const isHovered = i === hoverIndex;
              return {
                append: 'g',
                children: [
                  {
                    append: 'text',
                    class: 'values',
                    key: `${isHovered}`,
                    text: showValues || isHovered ? d.value : '',
                    x: x(i) + x.bandwidth() / 2,
                    y: y(d.value) - 6,
                    style: { fill: 'white', textAnchor: 'middle' },
                  },
                ],
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
        if (xAxisTickIncrement) {
          d3.selectAll(`#${id} .x-axis .tick`).attr('visibility', (t) => {
            const tickVal = xAxisTickValuesNumeric
              ? parseInt(data[t]?.name, 10)
              : t;
            return tickVal % xAxisTickIncrement === 0 ||
              t === data.length - 1 ||
              t === 0
              ? 'visible'
              : 'hidden';
          });
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
    xAxisTickIncrement,
    xAxisTickValuesNumeric,
    hoverIndex,
    renderBar,
  ]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      id={id}
      className={[css.barChart, className || ''].join(' ')}
      {...restProps}
    />
  );
};

BarChart.propTypes = {
  className: PropTypes.string,
};

export default BarChart;
