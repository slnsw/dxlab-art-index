import React from 'react';
import ArtIndexImage from '../ArtIndexImage';
import Link from '../Link';

import css from './ArtIndexHomeMasthead.module.scss';

type Props = {
  className?: string;
};

const ArtIndexHomeMasthead: React.FC<Props> = ({ className }) => {
  return (
    <div className={[css.artIndexHomeMasthead, className || ''].join(' ')}>
      <div className={[css.imageHolder, css.imageHolder1].join(' ')}>
        <div className={css.titleHolder}>
          <h1 className={[css.title].join(' ')}>Art</h1>
          <p className={css.subtitle}>Australian</p>
        </div>
        <Link as="/work/15096/">
          <a title="Sydney from North Shore by Conrad Martens">
            <ArtIndexImage
              src="/images/works/martens-north-shore-15096.jpg"
              alt="Sydney from North Shore by Conrad Martens"
              style={{ width: '100%' }}
            />
          </a>
        </Link>
      </div>

      <div className={[css.imageHolder, css.imageHolder2].join(' ')}>
        <Link as="/work/398/">
          <a title="Bush scene, Brisbane water by Conrad Martens">
            <ArtIndexImage
              src="/images/works/martens-brisbane-water-398.jpg"
              alt="Bush scene, Brisbane water by Conrad Martens"
              style={{ width: '100%' }}
            />
          </a>
        </Link>
      </div>

      <div className={[css.imageHolder, css.imageHolder3].join(' ')}>
        <div className={css.titleHolder}>
          <h1 className={[css.title].join(' ')}>Index</h1>
          <p className={css.subtitle}>1847–1900</p>
        </div>

        <Link as="/work/9256/">
          <a title="Boating season by Alfred James Daplyn">
            <ArtIndexImage
              src="/images/works/daplyn-boating-season-9256.jpg"
              alt="Boating season by Alfred James Daplyn"
              style={{ width: '100%' }}
            />
          </a>
        </Link>
      </div>

      <div className={[css.imageHolder, css.imageHolder4].join(' ')}>
        <Link as="/work/16253/">
          <a title="Tylophora grandiflora by Marian Ellis Rowan">
            <ArtIndexImage
              src="/images/works/rowan-tylophora-grandiflora-16253.jpg"
              alt="Tylophora grandiflora by Marian Ellis Rowan"
            />
          </a>
        </Link>
      </div>

      <div className={[css.imageHolder, css.imageHolder5].join(' ')}>
        <Link as="/work/7130/">
          <a title="Valley of the grose by William Charles Piguenit">
            <ArtIndexImage
              src="/images/works/piguenit-valley-of-the-grose-7130.jpg"
              alt="Valley of the grose by William Charles Piguenit"
            />
          </a>
        </Link>
      </div>

      <div className={[css.imageHolder, css.imageHolder6].join(' ')}>
        <Link as="/work/14940/">
          <a title="Portrait of the late Conrad Martens, Esq. by Maurice Appleby Felton">
            <ArtIndexImage
              // src="/images/works/gill-view-in-adelaide-16614.jpg"
              src="/images/works/felton-martens-14940.jpg"
              alt="Portrait of the late Conrad Martens, Esq. by Maurice Appleby Felton"
            />
          </a>
        </Link>
      </div>

      <div className={[css.imageHolder, css.imageHolder7].join(' ')}>
        {/* <h1 className={[css.title].join(' ')}>Exhibition</h1> */}
        <Link as="/work/673/">
          <a title="Entrance to Port Jackson by Conrad Martens">
            <ArtIndexImage
              src="/images/works/martens-entrance-to-port-jackson-673.jpg"
              alt="Entrance to Port Jackson by Conrad Martens"
            />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ArtIndexHomeMasthead;
