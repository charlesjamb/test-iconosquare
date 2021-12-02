import Head from "next/head";
import useSWR from "swr";

import { fetcher } from "../utils.js";

export default function Home() {
  const { data, error } = useSWR(
    "https://jsonplaceholder.typicode.com/users",
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div>
      <Head>
        <title>Test Iconosquare</title>
        <meta name="description" content="Test technique iconosquare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container bg-white m-4">
        <h1 className="text-red-500 text-xl">Hello World</h1>
        <p>{data[0].name}</p>
      </main>

      <footer></footer>
    </div>
  );
}
