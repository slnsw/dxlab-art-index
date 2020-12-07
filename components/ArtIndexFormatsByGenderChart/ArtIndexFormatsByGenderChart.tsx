import React from 'react';
// import dynamic from 'next/dynamic';
// import * as d3 from 'd3';
// import * as d3Array from 'd3-array';

import LoaderText from '../LoaderText';
import BubbleChart from '../BubbleChart';

import css from './ArtIndexFormatsByGenderChart.module.scss';

// const BarChart = dynamic(() => import('../BarChart'));

// type Props = {
//   id?: string;
//   className?: string;
//   data: Any;
// };

const ArtIndexFormatsByGenderChart = ({ id, data = [], className }) => {
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState({});

  const [hoverIndex, setHoverIndex] = React.useState(null);

  // const processFormatsByGenderData = (input) => {
  //   const mout = Array.from(d3Array.group(input, (d) => d['mediumFormat'])).map(
  //     (e) => {
  //       const format = e[0] || 'unknown';
  //       const works = e[1].filter((f) => f.artistGender === 'male');
  //       return { format, works, count: works.length };
  //     },
  //   );
  //   const fout = Array.from(d3Array.group(input, (d) => d['mediumFormat'])).map(
  //     (e) => {
  //       const format = e[0] || 'unknown';
  //       const works = e[1].filter((f) => f.artistGender === 'female');
  //       return { format, works, count: works.length };
  //     },
  //   );
  //   const out = { males: mout, females: fout };
  //   console.log(out['males'].slice(0, 30));
  //   return out;
  // };

  React.useEffect(() => {
    // const processed = processData(data);
    setItems(data);
    setLoading(false);
    // console.log(items);
  }, [data]);

  return (
    <div
      id={id}
      className={[css.artIndexFormatsByGenderChart, className || ''].join(' ')}
      // {...restProps}
    >
      {loading && (
        <LoaderText
          style={{
            textAlign: 'center',
          }}
        />
      )}
      <div className={css.gender}>
        <h2>male</h2>
        <BubbleChart
          // hideTextUntilHover={true}
          data={
            items &&
            items['males'] &&
            items['males'].slice(0, 30).map((key, i) => {
              const isHovered = i === hoverIndex;
              return {
                name: key.format,
                value: key.count,
                isHovered,
                index: i,
              };
            })
          }
          height={400}
          // className={css.popularWordsChart}
          renderBubble={(d) => {
            return {
              append: 'g',
              transform: `translate(${d.x},${d.y})`,
              duration: 1000,
              children: [
                {
                  append: 'circle',
                  data: d.data.name,
                  r: { enter: d.r, exit: 0 },
                  fill: 'var(--colour-primary)',
                  duration: 1000,
                  // onClick: (_, circleData) =>
                  //   Router.push(`/diary-files/search?q=${circleData.data.name}`),
                  onMouseOver: () => {
                    setHoverIndex(d.data.index);
                    console.log(d.data);
                  },
                  onMouseOut: () => {
                    setHoverIndex(null);
                  },
                },
                {
                  append: 'text',
                  key: d.isHovered ? d.data.name : '',
                  fill: 'var(--colour-white)',
                  fontWeight: 600,
                  text: d.data.name,
                  opacity: { enter: 1, exit: 0 },
                  duration: 1000,
                  y: '-0.2em',
                  // class: `${css.hoverView}`,
                  // onMouseOver:
                },
                {
                  append: 'text',
                  fill: 'var(--colour-white)',
                  text: d.data.value,
                  opacity: 0.8,
                  y: '0.9em',
                },
              ],
            };
          }}
          // onBubbleClick={(_, d) => {
          //   Router.push(`/diary-files/search?q=${d.data.name}`);
          // }}
        />
      </div>
      <div className={css.gender}>
        <h2>female</h2>
        <BubbleChart
          // hideTextUntilHover={true}
          data={
            items &&
            items['females'] &&
            items['females'].slice(0, 30).map((key) => {
              return {
                name: key.format,
                value: key.count,
              };
            })
          }
          height={400}
          // className={css.popularWordsChart}
          renderBubble={(d) => {
            return {
              append: 'g',
              transform: `translate(${d.x},${d.y})`,
              duration: 1000,
              children: [
                {
                  append: 'circle',
                  data: d.data.name,
                  r: { enter: d.r, exit: 0 },
                  fill: 'var(--colour-primary)',
                  duration: 1000,
                  // onClick: (_, circleData) =>
                  //   Router.push(`/diary-files/search?q=${circleData.data.name}`),
                },
                {
                  append: 'text',
                  key: d.data.name,
                  fill: 'var(--colour-white)',
                  fontWeight: 600,
                  text: d.data.name,
                  opacity: { enter: 1, exit: 0 },
                  duration: 1000,
                  y: '-0.2em',
                  // class: `${css.hoverView}`,
                  // onMouseOver:
                },
                {
                  append: 'text',
                  fill: 'var(--colour-white)',
                  text: d.data.value,
                  opacity: 0.8,
                  y: '0.9em',
                },
              ],
            };
          }}
          // onBubbleClick={(_, d) => {
          //   Router.push(`/diary-files/search?q=${d.data.name}`);
          // }}
        />
      </div>
    </div>
  );
};

// ArtIndexApp.propTypes = {
//   className: PropTypes.string,
// };

export default ArtIndexFormatsByGenderChart;
