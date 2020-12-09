const oldBasePath = process.env.BASE_PATH;

const basePath = !oldBasePath || oldBasePath === '/' ? '' : oldBasePath;

export default basePath;
