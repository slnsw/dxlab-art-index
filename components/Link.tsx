import RouteLink from 'next/link';

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
    if (props.as.indexOf('/art-index/artist/') >= 0) {
      href = '/art-index/artist/[id]';
    } else if (props.as.indexOf('/art-index/work/') >= 0) {
      href = '/art-index/work/[id]';
    } else if (props.as.indexOf('/art-index/exhibition/') >= 0) {
      href = '/art-index/exhibition/[id]';
    } else if (props.as.indexOf('/blog/') >= 0) {
      href = '/blog/[slug]';
    } else if (props.as.indexOf('/collection/item/') >= 0) {
      href = '/collection/item/[item]';
    } else if (props.as.indexOf('/diary-files/entry') >= 0) {
      href = '/diary-files/entry/[id]';
    } else if (props.as.indexOf('/diary-files/related') >= 0) {
      href = '/diary-files/related/[id]';
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

// import { Link as RouteLink } from '../routes';
// // import RouteLink from 'next/link';

// const Link = (props) => {
//   let href;

//   if (props.as) {
//     if (props.as.indexOf('/blog/') >= 0) {
//       href = '/blog/[slug]';
//     } else if (props.as.indexOf('/collection/item/') >= 0) {
//       href = '/collection/item/[item]';
//     } else if (props.as.indexOf('/diary-files/entry') >= 0) {
//       href = '/diary-files/entry/[id]';
//     } else if (props.as.indexOf('/diary-files/related') >= 0) {
//       href = '/diary-files/related/[id]';
//     } else if (props.as.indexOf('/virtuoso/song') >= 0) {
//       href = '/virtuoso/song/[slug]';
//     } else {
//       href = props.as;
//     }
//   }

//   return (
//     <RouteLink {...props} href={href || props.href}>
//       {props.children}
//     </RouteLink>
//   );
// };

// export default Link;
