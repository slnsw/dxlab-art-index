import React from 'react';
import PropTypes from 'prop-types';

import basePath from '../../lib/base-path';

import css from './SLNSWLogo.module.scss';

const SLNSWLogo = ({ className, onClick }) => {
  return (
    <div className={[css.slnswLogo, className || ''].join(' ')}>
      <a
        href="http://sl.nsw.gov.au"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        <img
          src={`${basePath}/images/logo-slnsw-white.png`}
          alt="State Library Logo."
        />
      </a>
    </div>
  );
};

SLNSWLogo.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default SLNSWLogo;
