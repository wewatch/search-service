import axios from "axios";

import { SupportedProvider, VideoSearchResponseItem } from "../interface";

interface NoembedResponse {
  url: string;
  title: string;
  thumbnail_url: string;
  provider_name: SupportedProvider;
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

  const normalizedUrl = normalizeUrl(url, provider);
  if (normalizedUrl === null) {
    return [];
  }

  return [
    {
      url: normalizedUrl,
      title,
      thumbnailUrl,
    },
  ];
};

const normalizeUrl = (
  url: string,
  provider: SupportedProvider,
): string | null => {
  if (provider === SupportedProvider.YouTube) {
    // https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
    const regex =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?vi?=|&vi?=))([^#&?]*).*/;
    const match = url.match(regex);
    if (match === null) {
      return null;
    }

    const videoId = match[1];
    return `https://youtube.com/watch?v=${videoId}`;
  }

  return null;
};
