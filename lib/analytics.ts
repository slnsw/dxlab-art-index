// import ReactGA from 'react-ga';
import TagManager from 'react-gtm-module';

export const initGA = () => {
  console.log('GTM_ID', process.env.GTM_ID);

  if (process.env.GTM_ID) {
    console.log('GTM_ID', 'Init');

    const tagManagerArgs = {
      gtmId: process.env.GTM_ID,
    };
    TagManager.initialize(tagManagerArgs);
  }
};
