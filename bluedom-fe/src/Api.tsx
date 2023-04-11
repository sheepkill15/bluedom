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

export const sendPostRequest = (
  url: string,
  body: any,
  params?: { [id: string]: string }
) => {
  const _url = new URL(url);

  if (params) {
    _url.search = new URLSearchParams(params).toString();
  }

  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  return fetch(_url, request);
};
