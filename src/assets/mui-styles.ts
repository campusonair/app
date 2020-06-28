import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  navbar:{
    background: "#f9fbfd",
    padding: ".5rem 3rem",
    height:"10vh"
  },
  logo:{
    height:"55px"
  },
  canvas:{
    background: "#ffffff",
    border: "1px solid #edf2f9",
    boxShadow: "0 0.75rem 1.5rem rgba(18,38,63,.03)",
    borderRadius: ".5rem",
  },
  btn_primary:{
    color: "#fff",
    backgroundColor: "#3A0088",
    borderColor: " #3A0088",
    border: "1px solid transparent",
    borderRadius: ".375rem",
    transition: "color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out",
    '&:hover': {
      color: "#fff",
      backgroundColor: "#3A0088",
      borderColor: "#3A0088",
    },
    '&:focus': {
      color: "#fff",
      backgroundColor: "#3A0088",
      borderColor: "#3A0088",
      boxShadow: "none"
    },
    '&:not(:disabled):not(.disabled):active':{
      color: "#fff",
      backgroundColor: "rgba(58, 0, 136, .8)",
      borderColor: "#3A0088",
    },
    '&:not(:disabled):not(.disabled):active:focus':{
      boxShadow: "0 0 0 0.2rem rgba(58, 0, 136, .5)"
    }
  },
  card:{
    borderColor: "#edf2f9",
    boxShadow: "0 0.75rem 1.5rem rgba(18,38,63,.03)",
    backgroundColor: "#fff",
    border: "1px solid #edf2f9",
    borderRadius: ".5rem",
  }
});

//Theme1
//main-color: #3A0088

// Theme2
// main-color: #506ee4
// light-main-color: #f0f3ff;
// accent-color: #fd397a

// main-gray: #a2a5b9
// light-gray: #efeff5;
// light-gray2: #f9fbfd (body-bg-color)

// font-gray: #595d6e
// font-light-gray: #959cb6

// white: #d8e1fe;


