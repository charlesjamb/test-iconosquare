import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";

export function Container({ classes, children }) {
  return (
    <main className="min-w-screen min-h-screen bg-pink-50">
      <AppBar position="static">
        <Toolbar>
          <Link href="/" passHref>
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <HomeIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
      <div className={`p-4 md:p-10 ${classes}`}>{children}</div>
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
