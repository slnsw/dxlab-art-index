import React from 'react';

import { getGenderColour } from '../../lib/art-index-utils';

import css from './ArtIndexGenderLegend.module.scss';

type Props = {
  markerType?: 'line' | 'square';
  className?: string;
};

const ArtIndexGenderLegend: React.FC<Props> = ({
  markerType = 'line',
  className,
}) => {
  return (
    <div className={[css.artIndexGenderLegend, className || ''].join(' ')}>
      {['female', 'male'].map((name) => {
        return (
          <div className={css.legendItem}>
            <div
              className={css.legendLine}
              style={{
                ...(markerType === 'line'
                  ? {
                      borderTop: `1px solid ${getGenderColour(name)}`,
                    }
                  : {}),
                ...(markerType === 'square'
                  ? {
                      width: '1rem',
                      height: '1rem',
                      backgroundColor: getGenderColour(name),
                    }
                  : {}),
              }}
            ></div>
            <p>{name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ArtIndexGenderLegend;
