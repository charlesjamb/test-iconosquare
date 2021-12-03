import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import { Link as MUILink } from "@mui/material";

import { fetcher } from "/utils.js";
import NewPostDialog from "../../components/NewPostDialog";

export default function User() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();
  let { uid } = router.query;

  const { mutate } = useSWRConfig();
  const { data: user, error: userError } = useSWR(
    uid ? `/users/${uid}` : null,
    fetcher
  );
  const { data: posts, error: postsError } = useSWR(
    uid ? `/posts?userId=${uid}` : null,
    fetcher
  );

  if (userError || postsError) return <div>failed to load</div>;
  if (!user || !posts) return <div>loading...</div>;

  return (
    <>
      <Head>
        <title>{user.name}</title>
        <meta name="description" content={`Tous les posts de ${user.name}`} />
      </Head>

      <main className=" w-screen h-screen bg-pink-50 p-4 md:p-10">
        <h1 className="text-3xl font-bold mb-4 text-pink-600">
          Posts de {user.name}
        </h1>
        {posts.map((post) => (
          <Accordion key={post.id}>
            <AccordionSummary>
              <h2>{post.title}</h2>
            </AccordionSummary>
            <AccordionDetails>
              <p>{post.body}</p>
              <p>
                <Link href={`/posts/${post.id}`} passHref>
                  <MUILink>Plus de détail</MUILink>
                </Link>
              </p>
            </AccordionDetails>
          </Accordion>
        ))}
        <Button
          onClick={() => setIsFormOpen((prev) => !prev)}
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          Ajouter un post
        </Button>
        <NewPostDialog
          userId={uid}
          isOpen={isFormOpen}
          mutate={mutate}
          handleClose={() => setIsFormOpen(false)}
          handleCloseAndRefetch={(newPost) => {
            setIsFormOpen(false);
            mutate(`/posts?userId=${uid}`, [...posts, newPost], false);
          }}
        />
      </main>
    </>
  );
}
