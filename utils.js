export function fetcher(url) {
  return fetch(`https://jsonplaceholder.typicode.com${url}`).then((res) => {
    return res.json();
  });
}
