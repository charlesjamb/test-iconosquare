import useSWR from "swr";
import Head from "next/head";
import { useRouter } from "next/router";

import { fetcher } from "services/utils";
import { Container, Loader, Error } from "components/utils";

function Comment({ comment }) {
  return (
    <div className="my-4">
      <h3 className="font-bold">{comment.name}</h3>
      <p>{comment.body}</p>
      <p className="italic">de {comment.email}</p>
    </div>
  );
}

export default function Post() {
  const router = useRouter();
  let { pid } = router.query;

  const { data: post, error: postError } = useSWR(
    pid ? `/posts/${pid}` : null,
    fetcher
  );
  const { data: comments, error: commentsError } = useSWR(
    pid ? `/posts/${pid}/comments` : null,
    fetcher
  );

  if (commentsError || postError) return <Error />;
  if (!comments || !post) return <Loader />;

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta
          name="description"
          content={`${post.title} et ses commentaires`}
        />
      </Head>

      <Container>
        <h1 className="text-3xl font-bold mb-4 text-pink-600">{post.title}</h1>
        <p>{post.body}</p>
        <h2 className="text-lg font-bold text-pink-600 mt-4">Commentaires</h2>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </Container>
    </>
  );
}
