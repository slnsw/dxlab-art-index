import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const createCache = () => {
  // Create `axios-cache-adapter` instance
  const cache = setupCache({
    maxAge: 15 * 60 * 1000,
    // debug: true,
    exclude: {
      query: false,
    },
  });

  // Create `axios` instance passing the newly created `cache.adapter`
  const fetch = axios.create({
    adapter: cache.adapter,
  });

  return fetch;
};

const fetch = createCache();

export default fetch;
