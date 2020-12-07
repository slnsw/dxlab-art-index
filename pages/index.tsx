export const getServerSideProps = async ({ req, res }) => {
  if (res) {
    res.writeHead(302, {
      // or 301
      Location: 'art-index',
    });
    res.end();
  }
};
