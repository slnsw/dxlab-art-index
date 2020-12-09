import RouteLink from 'next/link';
import basePath from '../lib/base-path';

type Props = {
  // The path that will be rendered in the browser URL bar. Used for dynamic routes
  as: string;
  // The path inside pages directory
  href?: string;
  children: React.ReactNode;
};

const Link = (props: Props) => {
  let href;

  if (props.as) {
    if (props.as.indexOf(`${basePath}/artist/`) >= 0) {
      href = `${basePath}/artist/[id]`;
    } else if (props.as.indexOf(`${basePath}/work/`) >= 0) {
      href = `${basePath}/work/[id]`;
    } else if (props.as.indexOf(`${basePath}/exhibition/`) >= 0) {
      href = `${basePath}/exhibition/[id]`;
    } else {
      href = props.as;
    }
  }

  return (
    <RouteLink {...props} href={href || props.href}>
      {props.children}
    </RouteLink>
  );
};

export default Link;
