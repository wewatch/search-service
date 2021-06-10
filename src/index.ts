import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import searchYoutube from "./handlers/youtube";
import { VideoSearchRequest, VideoSearchResponseItem } from "./interface";

export default async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const apiKey = event.headers?.["X-API-KEY"];
  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Invalid API key",
      }),
    };
  }

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
