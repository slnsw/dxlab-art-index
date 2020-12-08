import { useRouter } from 'next/router';
import React from 'react';
import Head from 'next/head';

import App from '../App';
import Link from '../Link';
import DXLabLogo from '../DXLabLogo';
import ArtIndexLogo from '../ArtIndexLogo';
import SLNSWLogo from '../SLNSWLogo';
import MenuIconButton from '../MenuIconButton';
import HeaderNavV2 from '../HeaderNavV2';
import Progress from '../Progress';
import Footer from '../Footer';

import { initGA } from '../../lib/analytics';

import css from './ArtIndexApp.module.scss';

type Props = {
  title?: string;
  className?: string;
  children: React.ReactNode;
  metaDescription?: string;
  metaImageUrl?: string;
  metaImageAlt?: string;
  metaImageWidth?: number;
  metaImageHeight?: number;
};

const ArtIndexApp: React.FC<Props> = ({
  title,
  className,
  children,
  metaDescription,
  metaImageUrl,
  metaImageAlt,
  metaImageWidth,
  metaImageHeight,
}) => {
  const { pathname } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
  }, []);

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Literata:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Progress />

      <App
        title={`${title ? `${title} - ` : ''}Art Index`}
        className={[css.artIndexApp, className || ''].join(' ')}
        metaDescription={metaDescription}
        metaImageUrl={metaImageUrl}
        metaImageAlt={metaImageAlt}
        metaImageWidth={metaImageWidth}
        metaImageHeight={metaImageHeight}
      >
        <header className={css.header}>
          <div className={css.headerLogos}>
            <DXLabLogo className={css.dxLogo} />
            <div className={css.logoDivider}></div>
            <ArtIndexLogo />
          </div>

          <HeaderNavV2
            isOpen={isMenuOpen}
            className={css.headerNav}
            insideClassName={css.insideHeaderNav}
          >
            <ul className={css.menu}>
              {[
                { name: 'Home', slug: '' },
                { name: 'Search', slug: 'search' },
                { name: 'Explore', slug: 'explore' },
              ].map((item) => {
                const itemPathname = `/art-index${
                  item.slug ? `/${item.slug}` : ''
                }`;
                const isActive = pathname === itemPathname;

                return (
                  <li
                    className={[isActive ? css.menuItemActive : ''].join(' ')}
                    key={item.slug}
                  >
                    <Link as={`/art-index/${item.slug}`}>
                      <a
                        onClick={() => {
                          setIsMenuOpen(false);
                        }}
                      >
                        {item.name}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </HeaderNavV2>

          <SLNSWLogo className={css.slLogo} />

          <MenuIconButton
            isOpen={isMenuOpen}
            className={[
              css.menuButton,
              isMenuOpen ? css.menuButtonOpen : '',
            ].join(' ')}
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          />
        </header>

        <main>{children}</main>

        <Footer />
      </App>
    </>
  );
};

export default ArtIndexApp;
