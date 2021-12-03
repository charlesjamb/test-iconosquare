import CircularProgress from "@mui/material/CircularProgress";

export function Container({ classes, children }) {
  return (
    <main
      className={`min-w-screen min-h-screen bg-pink-50 p-4 md:p-10 ${classes}`}
    >
      {children}
    </main>
  );
}

export function Loader() {
  return (
    <Container classes="text-center">
      <CircularProgress
        sx={{
          width: 50,
          margin: "4rem auto",
        }}
      />
    </Container>
  );
}

export function Error() {
  return (
    <Container>
      <p className="text-xl text-red-700 text-center">
        {"Une erreur s'est produite ..."}
      </p>
    </Container>
  );
}
