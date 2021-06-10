import axios from "axios";
import cheerio from "cheerio";
import { DataNode } from "domhandler/lib/node";

import type { VideoSearchResponseItem } from "../interface";

export default async (query: string): Promise<VideoSearchResponseItem[]> => {
  const url = `https://www.youtube.com/results?search_query=${query}`;
  const data = (await axios.get(url)).data;
  const $ = cheerio.load(data);
  const scripts = $("script");

  for (const script of scripts) {
    if (script.children.length === 0) {
      continue;
    }

    const scriptData = (script.children[0] as DataNode).data;
    if (scriptData.includes("var ytInitialData")) {
      const match = scriptData.match(/{.*}/g);
      if (match === null) {
        return [];
      }

      const jsonString = match[0];
      const data = JSON.parse(jsonString);
      const contents =
        data?.contents?.twoColumnSearchResultsRenderer?.primaryContents
          ?.sectionListRenderer?.contents ?? [];

      for (const content of contents) {
        const _contents = content?.itemSectionRenderer?.contents;
        if (_contents === undefined) {
          continue;
        }

        return _contents
          .filter((item: any) => "videoRenderer" in item)
          .map((item: any) => ({
            url: `https://www.youtube.com/watch?v=${item.videoRenderer.videoId}`,
            thumbnailUrl: `https://i.ytimg.com/vi/${item.videoRenderer.videoId}/default.jpg`,
            title: item.videoRenderer.title.runs[0].text,
          }));
      }
    }
  }

  return [];
};
