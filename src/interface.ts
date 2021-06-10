export interface VideoSearchRequest {
  query: string;
  type: "youtube";
}

export interface VideoSearchResponseItem {
  url: string;
  title: string;
  thumbnailUrl: string;
}
