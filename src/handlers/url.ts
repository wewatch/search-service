import axios from "axios";

import { SupportedProvider, VideoSearchResponseItem } from "../interface";

interface NoembedResponse {
  url: string;
  title: string;
  thumbnail_url: string;
  provider_name: string;
}

export default async (url: string): Promise<VideoSearchResponseItem[]> => {
  const { data } = await axios.get<NoembedResponse>(
    "https://noembed.com/embed",
    {
      params: {
        url,
      },
    },
  );

  if ("error" in data) {
    return [];
  }

  const { thumbnail_url: thumbnailUrl, provider_name: provider, title } = data;

  if (!(provider in SupportedProvider)) {
    return [];
  }

  return [
    {
      url,
      title,
      thumbnailUrl,
    },
  ];
};
