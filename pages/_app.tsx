import React from 'react';
import { useRouter } from 'next/router';

import '../styles/custom-properties.scss';
import '../styles/base.scss';
import '../styles/fonts.scss'; // Icons
import '../styles/loader.scss';

// Pages CSS
import './_error.scss';

// Components CSS
import '../components/App/App.scss';
// import '../components/CTAButton/CTAButton.scss';
// import '../components/CollectionApp/CollectionApp.scss';
// import '../components/CollectionItem/CollectionItem.scss';
// import '../components/CollectionPart/CollectionPart.scss';
// import '../components/CollectionParts/CollectionParts.scss';
// import '../components/Comment/Comment.scss';
// import '../components/CommentForm/CommentForm.scss';
// import '../components/Comments/Comments.scss';
// import '../components/DisplayTile/DisplayTile.scss';
// import '../components/ExampleComponent/ExampleComponent.scss';
// import '../components/FeaturedTile/FeaturedTile.scss';
import '../components/Footer/Footer.scss';
import '../components/Header/Header.scss';
import '../components/LoaderText/LoaderText.scss';
// import '../components/MainTile/MainTile.scss';
// import '../components/Masthead/Masthead.scss';
import '../components/Menu/Menu.scss';
// import '../components/NoImage/NoImage.scss';
// import '../components/Popover/Popover.scss';
// import '../components/RelatedCollectionItems/RelatedCollectionItems.scss';
// import '../components/SearchModal/SearchModal.scss';
// import '../components/SectionTitle/SectionTitle.scss';
// import '../components/SimpleTile/SimpleTile.scss';
// import '../components/Table/Table.scss';
// import '../components/Tile/Tile.scss';
// import '../components/TileButtonGroup/TileButtonGroup.scss';
// import '../components/TileImage/TileImage.scss';
import '../components/WebsiteApp/WebsiteApp.scss';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  React.useEffect(() => {
    // Removes .preload-transitions class on body in _document.tsx
    // Otherwise some transitions will animate on load
    // http://joshfrankel.me/blog/prevent-css-transitions-on-page-load-with-es6/

    const node = document.querySelector('.preload-transitions');

    if (node) {
      node.classList.remove('preload-transitions');
    }
  }, []);

  return <Component router={router} {...pageProps} />;
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
