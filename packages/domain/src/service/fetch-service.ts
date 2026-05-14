const serverUrl = "http://pib:3000/";

export const fetchUrl = (url: string, init?: RequestInit | undefined) => {
  const fullUrl = url.startsWith("/")
    ? serverUrl + url.substring(1)
    : serverUrl + url;
  return fetch(fullUrl, init);
};
