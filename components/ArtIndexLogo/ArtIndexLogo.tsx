import React from 'react';

import Link from '../Link';

import css from './ArtIndexLogo.module.scss';

type Props = {
  className?: string;
};

const ArtIndexLogo: React.FC<Props> = ({ className }) => {
  return (
    <div className={[css.artIndexLogo, className || ''].join(' ')}>
      <h1>
        <Link as="/">
          <a>Art Index</a>
        </Link>
      </h1>
    </div>
  );
};

export default ArtIndexLogo;
