import React from 'react';
import Head from 'next/head';

// const HomePage = () => {
//   return null;
// };

export default function HomePage() {
  return (
    <Head>
      <title>-</title>
      <meta httpEquiv="refresh" content={`0;url=/art-index`} />
    </Head>
  );
}

// export const getServerSideProps = async ({ req, res }) => {
//   if (res) {
//     res.writeHead(302, {
//       // or 301
//       Location: 'art-index',
//     });
//     res.end();
//   }
// };

// export default HomePage;
