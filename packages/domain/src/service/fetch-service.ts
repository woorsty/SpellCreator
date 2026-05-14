export const serverUrl =
  "http://[2a00:6020:4e9f:f600:b03:b040:d180:bee8]:3000/";

export const fetchUrl = (url: string, init?: RequestInit | undefined) => {
  const fullUrl = url.startsWith("/")
    ? serverUrl + url.substring(1)
    : serverUrl + url;
  return fetch(fullUrl, init);
};
