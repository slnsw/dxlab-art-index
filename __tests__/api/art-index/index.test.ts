import 'isomorphic-unfetch';
import {
  ArtIndexWorkType,
  ArtIndexArtistType,
  ArtIndexExhibitionType,
} from '../../../types/art-index-types';

import { getWorksResult } from '../../../pages/api/works';
import { getWorkDetail } from '../../../pages/api/works/[id]';
import { getArtistDetail } from '../../../pages/api/artists/[id]';
import { getExhibitionDetail } from '../../../pages/api/exhibitions/[id]';

// Ensure website is running before running tests!!!!
// npm run dev
const host = 'localhost:5070';

describe('Art Index API', () => {
  describe('Work Search', () => {
    it('should return all works', async () => {
      const result = await getWorksResult(host);

      expect(result).toMatchObject({
        worksTotal: 18494,
      });
      expect(result.works.length).toEqual(20);

      expect(result.facets.artists.length).toEqual(100);
      expect(result.facets.artists[2]).toMatchObject({
        id: expect.any(String),
        value: {
          firstName: expect.any(String),
          lastName: expect.any(String),
          thumbnailFile: expect.any(String),
          gender: 'female',
        },
        total: expect.any(Number),
      });

      expect(result.facets.formats.length).toEqual(100);
      expect(result.facets.formats[0]).toMatchObject({
        type: 'oil painting',
        value: 'Oil Painting',
        total: 4869,
      });

      expect(result.facets.exhibitions.length).toEqual(96);
      expect(result.facets.exhibitions[0]).toMatchObject({
        id: '1',
        value:
          "World's Columbian Exposition, Chicago, 1893. New South Wales Courts",
        total: 1095,
      });

      expect(result.facets.years.length).toEqual(44);
      expect(result.facets.years[0]).toMatchObject({
        id: '1893',
        value: '1893',
        total: 1656,
      });
    });

    it('should return 5 works', async () => {
      const result = await getWorksResult(host, { limit: '5' });

      expect(result).toMatchObject({
        worksTotal: 18494,
      });
      expect(result.works.length).toEqual(5);
    });

    it('should return 5 works, offset by 20', async () => {
      const result = await getWorksResult(host, { offset: '20', limit: '5' });

      expect(result).toMatchObject({
        worksTotal: 18494,
      });
      expect(result.works.length).toEqual(5);
    });

    it('should return 5 works by painting format', async () => {
      const result = await getWorksResult(host, {
        formats: 'oil painting',
        limit: '5',
      });

      expect(result).toMatchObject({
        worksTotal: 4869,
      });
      expect(result.works.length).toEqual(5);
    });

    it('should return 5 works by search "seabird"', async () => {
      const result = await getWorksResult(host, {
        search: 'seabird',
        limit: '5',
      });

      expect(result).toMatchObject({
        worksTotal: expect.any(Number),
      });
      expect(result.works[0]).toMatchObject({
        title: "The Seabirds' Cry - the Music of the Sea",
      });
    });

    it('should return 5 works by search "portfolio" and format "music"', async () => {
      const result = await getWorksResult(host, {
        search: 'portfolio',
        formats: 'music',
        limit: '5',
      });

      expect(result).toMatchObject({
        worksTotal: expect.any(Number),
      });
      expect(result.facets.artists.length).toEqual(2);
      expect(result.facets.formats.length).toEqual(1);
    });

    it('should return 5 works by search "bush" and exhibitionId "1"', async () => {
      const result = await getWorksResult(host, {
        search: 'bush',
        exhibitionIds: '1',
        limit: '5',
      });

      expect(result).toMatchObject({
        worksTotal: expect.any(Number),
      });
      expect(result.facets.artists.length).toEqual(6);
      expect(result.facets.formats.length).toEqual(3);
    });

    it('should return 5 works between 1870 and 1880', async () => {
      const result = await getWorksResult(host, {
        exhibitionStartYear: '1880',
        exhibitionEndYear: '1890',
        limit: '5',
      });

      expect(result).toMatchObject({
        worksTotal: 5295,
      });
    });

    it('should return works filtered by gender', async () => {
      const femaleResult = await getWorksResult(host, {
        genders: 'female',
        limit: '5',
      });
      const maleResult = await getWorksResult(host, {
        genders: 'male',
        limit: '5',
      });
      const unknownResult = await getWorksResult(host, {
        genders: 'unknown',
        limit: '5',
      });
      const femaleMaleResult = await getWorksResult(host, {
        genders: 'female,male',
        limit: '5',
      });

      expect(femaleResult).toMatchObject({
        worksTotal: 2769,
      });
      expect(femaleResult.facets.genders[0]).toMatchObject({
        type: 'female',
        value: 'Female',
        total: 2769,
      });
      expect(maleResult).toMatchObject({
        worksTotal: 9632,
      });
      expect(unknownResult).toMatchObject({
        worksTotal: 6093,
      });
      expect(unknownResult.facets.genders[0]).toMatchObject({
        type: 'unknown',
        value: 'Unknown',
        total: 6093,
      });
      expect(femaleMaleResult).toMatchObject({
        worksTotal: 2769 + 9632,
      });
    });
  });

  describe('Work Detail', () => {
    it('should return work by id', async () => {
      const result = await getWorkDetail(host, '16229');

      expect(result).toMatchObject<ArtIndexWorkType>({
        id: '16229',
        title: '"Parcel of Lilies" {Competitive}',
      });
    });
  });

  describe('Artist Detail', () => {
    it('should return artist by id', async () => {
      const result = await getArtistDetail(host, '16');

      expect(result).toMatchObject<ArtIndexArtistType>({
        id: '16',
        firstName: 'Julius',
        lastName: 'Hogarth',
        worksTotal: '16',
        gender: 'male',
        // image: '',
        imageUrl: '',
        wikipediaUrl: '',
        notes: '',
        thumbnailFile: '',
      });
    });
  });

  describe('Exhibition Detail', () => {
    it('should return exhibition by id', async () => {
      const result = await getExhibitionDetail(host, '17');

      expect(result).toMatchObject<ArtIndexExhibitionType>({
        name:
          'Royal Art Society of New South Wales Annual Exhibition. 6th, 1885',
        id: '17',
        place: '',
        year: '1885',
        exhibitorFirstName: '',
        exhibitorLastName: '',
        worksTotal: '303',
      });
    });
  });
});
