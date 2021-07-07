export enum SupportedProvider {
  YouTube = "YouTube",
}

export interface VideoSearchRequest {
  query: string;
  provider: SupportedProvider;
}
export interface VideoSearchResponseItem {
  url: string;
  title: string;
  thumbnailUrl: string;
}
