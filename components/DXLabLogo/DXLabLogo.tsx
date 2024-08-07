import React from 'react';
import PropTypes from 'prop-types';

import Link from '../Link';

import basePath from '../../lib/base-path';

import css from './DXLabLogo.module.scss';

const DXLabLogo = ({
  href = '/',
  prefetch,
  isExternalUrl = false,
  className,
}) => {
  return (
    <div className={[css.dxLabLogo, className || ''].join(' ')}>
      {href.indexOf('http') === 0 || isExternalUrl ? (
        <a href={href}>
          <img src={`${basePath}/images/logo-dxlab.png`} alt="DX Lab Logo." />
        </a>
      ) : (
        <Link href={href} prefetch={prefetch}>
          <a>
            <img src={`${basePath}/images/logo-dxlab.png`} alt="DX Lab Logo." />
          </a>
        </Link>
      )}
    </div>
  );
};

DXLabLogo.propTypes = {
  href: PropTypes.string,
  prefetch: PropTypes.bool,
  isExternalUrl: PropTypes.bool,
  className: PropTypes.string,
};

export default DXLabLogo;
