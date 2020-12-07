import React from 'react';

import css from './ArtIndexStatisticBlock.module.scss';
import Link from '../Link';

type Props = {
  count: number;
  label: string;
  url?: string;
  className?: string;
  style?: object;
};

const ArtIndexStatisticBlock: React.FC<Props> = ({
  count,
  label,
  url,
  className,
  style,
}) => {
  const countElement = url ? (
    <Link as={url}>
      <a>{count}</a>
    </Link>
  ) : (
    count
  );

  return (
    <div
      className={[css.artIndexStatisticBlock, className || ''].join(' ')}
      style={style}
    >
      <p className={css.count}>{countElement}</p>
      <p className={css.label}>{label}</p>
    </div>
  );
};

export default ArtIndexStatisticBlock;
