import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  navbar:{
    background: "#fff",
    borderBottom: "1px solid #e3ebf6"
  },
  canvas:{
    background: "#ffffff",
    border: "1px solid #edf2f9",
    boxShadow: "0 0.75rem 1.5rem rgba(18,38,63,.03)",
    borderRadius: ".5rem",
  },
  btn_primary:{
    color: "#fff",
    backgroundColor: "#506ee4",
    borderColor: "#506ee4",
    border: "1px solid transparent",
    borderRadius: ".375rem",
    transition: "color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out",
    '&:hover': {
      color: "#fff",
      backgroundColor: "#335de7",
      borderColor: "#335de7",
    },
    '&:not(:disabled):not(.disabled):active':{
      color: "#fff",
      backgroundColor: "#2754e6",
      borderColor: "#1c4be4",
    },
    '&:focus': {
      color: "#fff",
      backgroundColor: "#335de7",
      borderColor: "#2754e6",
      boxShadow: "none"
    }
  },
  add_video: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    margin: "auto",
    width: "100px",
    height: "60px",
    zIndex: 1,
    opacity:0,
    '&:hover': {
      opacity:1
    },
  },
  remove_video: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    margin: "auto",
    width: "100px",
    height: "60px",
    zIndex: 1,
  },
  video:{
    opacity: 1,
    '&:hover': {
      opacity:1
    },
  },
  card:{
    borderColor: "#edf2f9",
    boxShadow: "0 0.75rem 1.5rem rgba(18,38,63,.03)",
    backgroundColor: "#fff",
    border: "1px solid #edf2f9",
    borderRadius: ".5rem",
  }
});

// main-color: #506ee4
// light-main-color: #f0f3ff;
// accent-color: #fd397a

// main-gray: #a2a5b9
// light-gray: #efeff5;
// light-gray2: #f9fbfd (body-bg-color)

// font-gray: #595d6e
// font-light-gray: #959cb6

// white: #d8e1fe;


