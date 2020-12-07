import React from 'react';
import dynamic from 'next/dynamic';

import LoaderText from '../LoaderText';
import BubbleChart from '../BubbleChart';

import css from './ArtIndexCharts.module.scss';

const BarChart = dynamic(() => import('../BarChart'));

type Props = {
  id?: string;
  className?: string;
};

const ArtIndexApp: React.FC<Props> = ({
  id = 'art-index-app',
  className,
  ...restProps
}) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({
    yearData: [],
    formOfWork: [],
    exhibitionName: [],
    creator: [],
    creator2: [],
  });

  React.useEffect(() => {
    fetch('/art-index/data/works-old.json')
      .then((r) => r.json())
      .then((d) => {
        setData(processData(d));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div
      id={id}
      className={[css.artIndexApp, className || ''].join(' ')}
      {...restProps}
    >
      <h1>Australian Art Exhibiton Catalogue Index 1845-1900</h1>
      {loading && (
        <LoaderText
          style={{
            textAlign: 'center',
          }}
        />
      )}

      <p>Artist names (first 150 sorted by name)</p>
      <BarChart
        data={data.creator.slice(0, 150).map((d) => {
          return {
            name: d.item,
            value: d.count,
          };
        })}
        height={1500}
        direction={'horizontal'}
        showValues={true}
        // rotateXAxis={true}
        margin={{ top: 20, left: 200, right: 10, bottom: 80 }}
      />

      <p>Artist names (firt 150 sorted by num of entries)</p>
      <BarChart
        data={data.creator2.slice(0, 150).map((d) => {
          return {
            name: d.item,
            value: d.count,
          };
        })}
        height={1500}
        direction={'horizontal'}
        showValues={true}
        // rotateXAxis={true}
        margin={{ top: 20, left: 200, right: 10, bottom: 80 }}
      />

      <p>Exhibtion names</p>
      <BarChart
        data={data.exhibitionName.map((d) => {
          return {
            name: d.item,
            value: d.count,
          };
        })}
        height={1500}
        direction={'horizontal'}
        showValues={true}
        // rotateXAxis={true}
        margin={{ top: 20, left: 400, right: 10, bottom: 80 }}
      />

      <p>Works exhibited by year</p>
      <BarChart
        data={data.yearData.map((d) => {
          return {
            name: d.item,
            value: d.count,
          };
        })}
        height={300}
        direction={'vertical'}
        showValues={true}
        rotateXAxis={true}
        margin={{ top: 20, left: 40, right: 10, bottom: 80 }}
      />

      <p>Forms of work</p>

      <BubbleChart
        data={data.formOfWork.slice(0, 30).map((d) => {
          return {
            name: d.item,
            value: d.count,
          };
        })}
        height={800}
        // className={css.popularWordsChart}
        renderBubble={(d) => {
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

      <BarChart
        data={data.formOfWork.map((d) => {
          return {
            name: d.item,
            value: d.count,
          };
        })}
        height={3000}
        direction={'horizontal'}
        showValues={true}
        // rotateXAxis={true}
        margin={{ top: 20, left: 150, right: 10, bottom: 80 }}
      />
    </div>
  );
};

const arrayToCounts = (a) => {
  if (!a) return null;
  const counts = Object.create(null);
  a.forEach((e) => {
    counts[e] = counts[e] ? counts[e] + 1 : 1;
  });
  const out = [];
  Object.keys(counts).forEach((count) => {
    out.push({ item: count, count: counts[count] });
  });
  return out;
};

const processData = (d) => {
  // year Data
  const years = d.map((e) => {
    return e.ExhibitionYear;
  });
  const yearData = arrayToCounts(years);

  // works data
  const works = d.map((e) => {
    let form;
    if (!e.FormOfWork) {
      if (
        e.Medium.toLowerCase() === 'oil' ||
        e.Medium.toLowerCase() === 'watercolour'
      ) {
        form = 'painting';
      } else if (e.Medium.toLowerCase() === 'crayon') {
        form = 'drawing';
      } else {
        form = '';
      }
    } else {
      form = e.FormOfWork;
    }
    return `${e.Medium}${e.Medium ? ' ' : ''}${form}`.toLowerCase();
  });
  const formOfWork = arrayToCounts(works);
  // exhib name data
  const exhibNames = d.map((e) => {
    return e.ExhibitionName;
  });
  const exhibitionName = arrayToCounts(exhibNames).sort((a, b) => {
    const s = b.item < a.item ? 1 : 0;
    return b.item > a.item ? -1 : s;
  });

  const creators = d.map((e) => {
    return `${e.CreatorSurname}${e.CreatorForname ? ', ' : ''}${
      e.CreatorForname
    }`.toLowerCase();
  });
  const creator = arrayToCounts(creators)
    .filter((c) => {
      return c.item.length > 0;
    })
    .sort((a, b) => {
      const s = b.item < a.item ? 1 : 0;
      return b.item > a.item ? -1 : s;
    });

  const creators2 = d.map((e) => {
    return `${e.CreatorSurname}${e.CreatorForname ? ', ' : ''}${
      e.CreatorForname
    }`.toLowerCase();
  });
  const creator2 = arrayToCounts(creators2)
    .filter((c) => {
      return c.item.length > 0;
    })
    .sort((a, b) => {
      return b.count - a.count;
    });

  return { yearData, formOfWork, exhibitionName, creator, creator2 };

  // console.log(creator.length);
  // setData();
};

export default ArtIndexApp;
