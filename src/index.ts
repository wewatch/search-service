import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import isUrl from "is-url";

import searchURL from "./handlers/url";
import searchYoutube from "./handlers/youtube";
import {
  SupportedProvider,
  VideoSearchRequest,
  VideoSearchResponseItem,
} from "./interface";

export default async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const apiKey = event.headers?.["X-API-KEY"];
  if (apiKey !== process.env.API_KEY) {
    return generateMessageResponse(401, "Invalid API key");
  }

  if (event.body === null) {
    return generateMessageResponse(400, "Invalid request body");
  }

  const request = JSON.parse(event.body) as VideoSearchRequest;
  if (!(request.type in SupportedProvider)) {
    return generateMessageResponse(400, "Unsupported provider");
  }

  let result: VideoSearchResponseItem[] = [];
  if (isUrl(request.query)) {
    result = await searchURL(request.query);
    if (result.length === 0) {
      return generateMessageResponse(400, "Unsupported provider");
    }
  } else if (request.type === SupportedProvider.YouTube) {
    result = await searchYoutube(request.query);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

const generateMessageResponse = (
  statusCode: number,
  message: string,
): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify({ message }),
});
