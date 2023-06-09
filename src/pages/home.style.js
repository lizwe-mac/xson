import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  input: {
    display: "none",
  },
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));
