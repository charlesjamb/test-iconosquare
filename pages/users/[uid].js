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
import AddIcon from "@mui/icons-material/Add";

import { fetcher } from "../../services/utils";
import NewPostDialog from "../../components/NewPostDialog";
import { Container, Loader, Error } from "../../components/utils";

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

  if (userError || postsError) return <Error />;
  if (!user || !posts) return <Loader />;

  return (
    <>
      <Head>
        <title>{user.name}</title>
        <meta name="description" content={`Tous les posts de ${user.name}`} />
      </Head>

      <Container>
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
          startIcon={<AddIcon />}
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
      </Container>
    </>
  );
}
