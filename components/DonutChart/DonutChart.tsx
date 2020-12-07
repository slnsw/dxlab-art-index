import React from 'react';
import * as d3 from 'd3';

import useDimensions from '../../lib/hooks/use-dimensions';

import css from './DonutChart.module.scss';

type Props = {
  data: {
    name: string | number;
    value: number;
    [key: string]: string | number;
  }[];
  height?: number;
  padding?: number;
  padAngle?: number | Function;
  innerRadiusRatio?: number;
  colours?: string[];
  className?: string;
  renderLabelText?: Function;
};

// Donut chart based on this example
// https://observablehq.com/@teebusch/d3-for-the-impatient-part-ii

const DonutChart: React.FC<Props> = ({
  data = [],
  height = 200,
  padding = 50,
  padAngle = 0.02,
  innerRadiusRatio = 0.8,
  colours = ['var(--colour-pink)', 'var(--colour-hyper-green)'],
  className,
  renderLabelText = (d) => d.data.name,
}) => {
  const [svgRef, dimensions, svgNode] = useDimensions();
  const { width } = dimensions;

  const g = React.useRef<{
    attr: Function;
    selectAll: Function;
  }>();

  React.useEffect(() => {
    if (svgNode) {
      const svg = d3.select(svgNode);

      if (!g.current) {
        g.current = svg.append('g');
      }
    }
  }, [svgNode]);

  React.useEffect(() => {
    if (g.current) {
      g.current.attr('transform', `translate(${width / 2}, ${height / 2})`);
    }
  }, [width, height]);

  React.useEffect(() => {
    if (!g.current) {
      return () => {
        return null;
      };
    }

    const pie = d3
      .pie()
      .value((d) => d.value)
      // .sortValues( (a,b) => a - b ) // sort by value, looks silly with transition
      .sort(null) // keep default order
      // .startAngle(1.5 * Math.PI)
      // .endAngle(2.5 * Math.PI)
      .padAngle(padAngle); // padding

    // Ordinal scales look up objects by their string representation.
    // toString() does not return a unique identifier for an object,
    // so we have to choose a uniquely identifying member of each element.
    const scC = d3
      .scaleOrdinal(colours)
      .domain(pie(data).map((d) => d.data.name));

    // Store the displayed angles in .current.
    // Then, interpolate from .current to the new angles.
    // During the transition, .current is updated in-place by d3.interpolate.
    // https://bl.ocks.org/HarryStevens/e1acaf628b1693f1b32e5f2e1a7f73fb
    function arcTween(a) {
      const i = d3.interpolate(this.current, a);
      this.current = i(0);
      return (t) => {
        return arc(i(t));
      };
    }

    const arc = d3
      .arc()
      .innerRadius((height / 2 - padding) * innerRadiusRatio)
      .outerRadius(height / 2 - padding)
      .cornerRadius(1);

    const arcLabels = d3
      .arc()
      .innerRadius(height / 2 - padding)
      .outerRadius(height / 2)
      .cornerRadius(1);

    function labelX(d) {
      const xc = arcLabels.centroid(d)[0];

      const { width: boxWidth } = this.getBBox();
      const w = boxWidth < 60 ? 60 : boxWidth; // before rendering the element, the bounding box is 0. use 60 as default
      let offset;

      if (Math.abs(xc) > 50) {
        offset = xc > 0 ? w / 2 : -w / 2;
      } else {
        offset = 0;
      }
      const out = xc + offset < 0 ? xc + offset - 3 : xc + offset + 3;
      return out;
    }

    function redraw(newData) {
      // pie
      const donut = g.current
        .selectAll('path')
        .data(pie(newData), (d) => d.data.name);

      // update
      donut.transition().duration(500).attrTween('d', arcTween);

      // enter
      donut
        .enter()
        .append('path')
        .attr('fill', (d) => scC(d.index))
        // .attr('stroke', (d) => d3.color(scC(d.index)).darker())
        .attr('d', arc) // invoke arkGenerator on each element of the pie layout
        .each(function setCurrent(d) {
          this.current = d;
        }); // starting point for the first transition

      // labels
      const labels = g.current
        .selectAll('text')
        .data(pie(data), renderLabelText);

      // update
      labels
        .transition()
        .duration(500)
        .attr('x', labelX)
        .attr('y', (d) => arcLabels.centroid(d)[1]);

      // enter
      labels
        .enter()
        .append('text')
        .text(renderLabelText)
        .attr('pointer-events', 'none')
        .attr('alignment-baseline', 'central')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .attr('fill', 'var(--colour-grey)')
        // .attr('fill', (d) => d3.color(scC(d.index)).darker())
        .attr('text-anchor', 'middle')
        .attr('x', labelX)
        .attr('y', (d) => arcLabels.centroid(d)[1]);
    }

    redraw(data);
  }, [
    data,
    width,
    height,
    padAngle,
    padding,
    innerRadiusRatio,
    colours,
    renderLabelText,
  ]);

  return (
    <svg
      className={[css.donutChart, className || ''].join(' ')}
      width="100%"
      height={height}
      ref={svgRef}
    ></svg>
  );
};

export default DonutChart;
