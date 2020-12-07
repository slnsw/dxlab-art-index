import Fuse from 'fuse.js';

/**
 * Fuse JS search wrapper to enable async/await searches
 */
const createFuse = <T>(data: T[], options: Fuse.IFuseOptions<T>) => {
  const fuse = new Fuse<T>(data, options);

  return {
    ...fuse,
    search: (value: string): Promise<Fuse.FuseResult<T>[]> => {
      return new Promise((resolve) => {
        const results = fuse.search(value);

        resolve(results);
      });
    },
  };
};

export default createFuse;
