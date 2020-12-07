import * as d3Array from 'd3-array';

export const arrayToCounts = (a) => {
  if (!a) return null;
  const counts = Object.create(null);
  a.forEach((e) => {
    counts[e] = counts[e] ? counts[e] + 1 : 1;
  });
  const out = [];
  Object.keys(counts).forEach((count) => {
    out.push({ item: count, count: counts[count] });
  });
  return out;
};

export function getGenderColour(gender) {
  if (gender === 'male') {
    return 'var(--colour-art-index-male)';
  }

  if (gender === 'female') {
    return 'var(--colour-art-index-female)';
  }

  return 'gray';
}

export const processPriceData = (input) => {
  const m = Array.from(d3Array.group(input, (d) => d['exhibitionYear']))
    .map((e) => {
      const year = e[0];
      const withPrice = e[1].filter((p) => p.price > 0);
      const withPriceMale = withPrice.filter((p) => p.artistGender === 'male');
      // const withPriceFemale = withPrice.filter(
      //   (p) => p.artistGender === 'female',
      // );
      // const avPrice = getAveragePrice(withPrice) || 0;
      const avPriceMale = getAveragePrice(withPriceMale) || 0;
      // const avPriceFemale = getAveragePrice(withPriceFemale) || 0;

      return { name: year, value: avPriceMale, type: 'male' };
    })
    .sort((a, b) => {
      const s = b.name < a.name ? 1 : 0;
      return b.name > a.name ? -1 : s;
    });
  const f = Array.from(d3Array.group(input, (d) => d['exhibitionYear']))
    .map((e) => {
      const year = e[0];
      const withPrice = e[1].filter((p) => p.price > 0);
      // const withPriceMale = withPrice.filter(
      //   (p) => p.artistGender === 'male',
      // );
      const withPriceFemale = withPrice.filter(
        (p) => p.artistGender === 'female',
      );
      // const avPrice = getAveragePrice(withPrice) || 0;
      // const avPriceMale = getAveragePrice(withPriceMale) || 0;
      const avPriceFemale = getAveragePrice(withPriceFemale) || 0;

      return { name: year, value: avPriceFemale, type: 'female' };
    })
    .sort((a, b) => {
      const s = b.name < a.name ? 1 : 0;
      return b.name > a.name ? -1 : s;
    });
  const t = [...f, ...m];
  // console.log(t);
  return t;
};

const getAveragePrice = (arr) => {
  if (!arr || arr.length === 0) {
    return null;
  }
  const av =
    arr.reduce((total, next) => total + parseFloat(next.price), 0) / arr.length;
  return Math.floor(av * 100) / 100;
};

export const processFormatsByGenderData = (input) => {
  const mout = Array.from(d3Array.group(input, (d) => d['mediumFormat'])).map(
    (e) => {
      const format = e[0] || 'unknown';
      const works = e[1].filter((f) => f.artistGender === 'male');
      return { format, works, count: works.length };
    },
  );
  const fout = Array.from(d3Array.group(input, (d) => d['mediumFormat'])).map(
    (e) => {
      const format = e[0] || 'unknown';
      const works = e[1].filter((f) => f.artistGender === 'female');
      return { format, works, count: works.length };
    },
  );
  const out = { males: mout, females: fout };
  return out;
};

export const processFormatsByGenderToComparisonData = (input) => {
  if (!input) {
    return [];
  }
  const males = input.males || [];
  const females = input.females || [];

  // // sort males
  // males.sort((a, b) => {
  //   const s = b.count > a.count ? 1 : 0;
  //   return b.count < a.count ? -1 : s;
  // });
  // // arrange subset of data how we need
  // const outm = males
  //   ? males.slice(0, 40).map((d) => {
  //       return { name: d.format, value: d.count, type: 'male' };
  //     })
  //   : [];
  // // map female data to the subset of formats
  // const outf =
  //   females && outm
  //     ? outm.map((d) => {
  //         const foundf = females.filter((g) => {
  //           return g.format === d.name;
  //         });

  //         return {
  //           name: foundf[0].format,
  //           value: foundf[0].count,
  //           type: 'female',
  //         };
  //       })
  //     : [];

  // sort females
  females.sort((a, b) => {
    const s = b.count > a.count ? 1 : 0;
    return b.count < a.count ? -1 : s;
  });
  // arrange subset of data how we need
  const outf = females
    ? females.slice(0, 40).map((d) => {
        return { name: d.format, value: d.count, type: 'female' };
      })
    : [];
  // map male data to the subset of formats
  const outm =
    males && outf
      ? outf.map((d) => {
          const foundm = males.filter((g) => {
            return g.format === d.name;
          });

          return {
            name: foundm[0].format,
            value: foundm[0].count,
            type: 'male',
          };
        })
      : [];

  return [...outm, ...outf];
};

export const processWorksByYear = (input) => {
  const data = Array.from(d3Array.group(input, (d) => d.exhibitionYear))
    .sort((a, b) => a[0] - b[0])
    .map((d) => {
      const year = d[0];
      const allWorks = d[1];

      return {
        name: year,
        value: allWorks.length,
        malesTotal: allWorks.filter((work) => work.artistGender === 'male')
          .length,
        femalesTotal: allWorks.filter((work) => work.artistGender === 'female')
          .length,
      };
    });
  const minYear = data[0]?.name;
  const maxYear = data[data.length - 1]?.name;
  const out = [];
  for (let y = minYear; y <= maxYear; y++) {
    const temp = data.filter((i) => i.name === y.toString());
    const val = temp[0]?.value || 0;
    const mval = temp[0]?.malesTotal || 0;
    const fval = temp[0]?.femalesTotal || 0;
    out.push({
      name: y.toString(),
      value: val,
      malesTotal: mval,
      femalesTotal: fval,
    });
  }
  return out;
};

// export const processMapData = (input) => {
//   const m = Array.from(d3Array.group(input, (d) => d['exhibitionPlace']))
//     .map((val) => {
//       let out = null;
//       let lat;
//       let long;
//       if (val[0]) {
//         const item = val[0];
//         const itemData = geoData.filter((a) => a.address === item);
//         if (itemData && itemData[0]) {
//           [lat, long] = itemData[0].loc;
//           out = {
//             lat,
//             long,
//             count: val[1].length,
//             item,
//           };
//         }
//       }
//       return out;
//     })
//     .filter((i) => i)
//     .sort((a, b) => {
//       const s = b.count < a.count ? 1 : 0;
//       return b.count > a.count ? -1 : s;
//     });
//   return m;
// };
