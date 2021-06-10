import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import searchYoutube from "./handlers/youtube";
import { VideoSearchRequest, VideoSearchResponseItem } from "./interface";

export default async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  if (event.body === null) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid request body",
      }),
    };
  }

  const request = JSON.parse(event.body) as VideoSearchRequest;

  let result: VideoSearchResponseItem[] = [];
  if (request.type === "youtube") {
    result = await searchYoutube(request.query);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
