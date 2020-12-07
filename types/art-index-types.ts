export type ArtIndexGender = 'male' | 'female' | '';

export type ArtIndexArtistType = {
  id: string;
  firstName?: string;
  lastName?: string;
  worksTotal: number;
  gender?: ArtIndexGender;
  // image?: string;
  imageUrl?: string;
  wikipediaUrl?: string;
  notes?: string;
  thumbnailFile?: string;
  wikiDataId?: string;
};

export type ArtIndexExhibitionType = {
  id: string;
  name: string;
  place?: string;
  year: string;
  exhibitorFirstName?: string;
  exhibitorLastName?: string;
  worksTotal: number;
};

export type ArtIndexWorkType = {
  id: string;
  title?: string;
  format?: string;
  medium?: string;
  notes?: string;
  source?: string;
  catalogueId?: string;
  catalogueCallNumber?: string;
  catalogueName?: string;
  artistId?: string;
  artistFirstName?: string;
  artistLastName?: string;
  artistGender?: ArtIndexGender;
  artistThumbnailFile?: string;
  exhibitionId?: string;
  exhibitionName?: string;
  exhibitionPlace?: string;
  exhibitionYear?: string;
  originalExhibitionYear?: string;
  mediumFormat?: string;
  price?: string;
  collectionUrl?: string;
  imageUrl?: string;
};

// ----------------------------------------------------------------------------
// API Types
// ----------------------------------------------------------------------------

export interface ArtIndexApiQuery {
  search?: string;
  offset?: string;
  limit?: string;
  formats?: string;
  artistIds?: string;
  exhibitionIds?: string;
  exhibitionStartYear?: string;
  exhibitionEndYear?: string;
  genders?: string;
}

export interface ArtIndexApiIdFacet {
  id: string;
  value: string;
  total: number;
}

export interface ArtIndexApiTypeFacet {
  type: string;
  value: string;
  total: number;
}

export interface ArtIndexApiArtistFacet
  extends Omit<ArtIndexApiIdFacet, 'value'> {
  // value: Pick<
  //   ArtIndexArtistType,
  //   'firstName' | 'lastName' | 'thumbnailFile' | 'gender'
  // >;
  value: {
    firstName: string;
    lastName: string;
    thumbnailFile: string;
    gender: ArtIndexGender;
  };
}

export interface ArtIndexApiWorksResult {
  worksTotal: number;
  works: ArtIndexWorkType[];
  facets: {
    artists: ArtIndexApiArtistFacet[];
    exhibitions: ArtIndexApiIdFacet[];
    formats: ArtIndexApiTypeFacet[];
    genders: ArtIndexApiTypeFacet[];
    years: ArtIndexApiIdFacet[];
  };
}
