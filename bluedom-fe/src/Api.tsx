export const API_BASEURL = 'https://localhost:7148/api';

export const sendGetRequest = (
  url: string,
  params?: { [id: string]: string }
) => {
  const _url = new URL(url);

  if (params) {
    _url.search = new URLSearchParams(params).toString();
  }

  return fetch(_url);
};
