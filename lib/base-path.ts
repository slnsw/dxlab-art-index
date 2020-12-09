import { basePath as oldBasePath } from '../next.config';

const basePath = !oldBasePath || oldBasePath === '/' ? '' : oldBasePath;

export default basePath;
