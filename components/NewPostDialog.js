import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";

function post(title, body, userId) {
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({
      title,
      body,
      userId,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => json);
}

export default function NewPostDialog({
  isOpen,
  handleClose,
  handleCloseAndRefetch,
  userId,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handlePost = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await post(title, body, userId);
      setIsLoading(false);
      handleCloseAndRefetch(res);
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  const close = () => {
    if (isLoading) return null;
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>Ajout de post</DialogTitle>
      <DialogContent>
        <TextField
          disabled={isLoading}
          autoFocus
          margin="dense"
          id="title"
          label="Titre"
          type="text"
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          disabled={isLoading}
          margin="dense"
          id="body"
          label="Contenu"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="standard"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </DialogContent>
      {error && (
        <DialogContentText>Oops something went wrong ...</DialogContentText>
      )}
      <DialogActions>
        <Button disabled={isLoading} onClick={close}>
          Annuler
        </Button>
        <LoadingButton
          color="secondary"
          onClick={handlePost}
          loading={isLoading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
