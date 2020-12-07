import React from 'react';
import { Range, getTrackBackground } from 'react-range';

import ArtIndexGenderDonutChart from '../ArtIndexGenderDonutChart';
import Icon from '../Icon';

import { getGenderColour } from '../../lib/art-index-utils';

import css from './ArtIndexGenderRangeDonutChart.module.scss';

type Props = {
  data: any;
  className?: string;
};

const ArtIndexGenderRangeDonutChart = ({ data = [], className }: Props) => {
  const STEP = 1;
  const MIN = 0;
  const MAX = data.length;

  const [values, setValues] = React.useState([MIN, MAX]);
  const rangeData = data.slice(values[0], values[1] + 1);

  React.useEffect(() => {
    setValues([0, data.length]);
  }, [data]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div
      className={[className || ''].join(' ')}
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ArtIndexGenderDonutChart
        malesTotal={rangeData.filter((d) => d.gender === 'male').length}
        // femalesTotal={0}
        femalesTotal={rangeData.filter((d) => d.gender === 'female').length}
        className={css.fullGenderDonutChart}
      />

      <div className={css.rangeHolder}>
        <Range
          values={values}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={(newValues) => setValues(newValues)}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                position: 'relative',
                height: 100,
                display: 'flex',
                width: '100%',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  display: 'flex',
                  width: '100%',
                  height: 100,
                }}
              >
                {data.map((d, i) => {
                  return (
                    <div
                      style={{
                        flex: 1,
                        height: 100,
                        backgroundColor: getGenderColour(d.gender),
                      }}
                      key={`${d.gender}${i}`}
                    ></div>
                  );
                })}
              </div>

              <div
                ref={props.ref}
                style={{
                  position: 'absolute',
                  height: 100,
                  width: '100%',
                  background: getTrackBackground({
                    values,
                    colors: [
                      'rgba(0,0,0,0.7)',
                      'rgba(0,0,0,0)',
                      'rgba(0,0,0,0.7)',
                    ],
                    min: MIN,
                    max: MAX,
                  }),
                  alignSelf: 'center',
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ index, props, isDragged }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: 50,
                width: 50,
                borderRadius: 25,
                backgroundColor: 'var(--colour-white)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // boxShadow: '0px 2px 6px #AAA',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -70,
                  // width: '5rem',
                  color: 'var(--colour-white)',
                  // fontWeight: 'bold',
                  fontSize: 'var(--font-size-xs)',
                  fontFamily: 'var(--font-primary)',
                  padding: '4px',
                  textAlign: 'center',
                  backgroundColor: 'var(--colour-grey-darkest)',
                }}
              >
                Rank
                <br />
                <strong
                  style={{
                    fontSize: 'var(--font-size-lg)',
                  }}
                >
                  {values[index] + 1}
                </strong>
              </div>
              <Icon
                name="chevron-back-dark"
                size="sm"
                colour={isDragged ? 'highlight' : 'grey'}
                className={css.thumbIcon}
              />
              <Icon
                name="chevron-forward-dark"
                size="sm"
                colour="grey"
                className={[css.thumbIcon, css.forwardThumbIcon].join(' ')}
              />
              {/* <div
                style={{
                  height: '16px',
                  width: '2px',
                  backgroundColor: isDragged
                    ? '#548BF4'
                    : 'var(--colour-black)',
                }}
              /> */}
            </div>
          )}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 'var(--spacing-xxxs)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <p>Exhibited more works</p>
          <p>Exhibited less works</p>
        </div>
      </div>
    </div>
  );
};

export default ArtIndexGenderRangeDonutChart;
