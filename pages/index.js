import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Test Iconosquare</title>
        <meta name="description" content="Test technique iconosquare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container bg-white m-4">
        <h1 className="text-red-500 text-xl">Hello World</h1>
      </main>

      <footer></footer>
    </div>
  );
}
