import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

export default function YearSlider(props) {
  const classes = useStyles();
  const [currYear, setCurrYear] = useState(2005);
  const [animate, setAnimate] = useState("Animation")

  const [count, setCount] = useState(-1);
  let timer;

  const updateCount = () => {
    if (count === -1) return;
    timer =
      !timer &&
      setInterval(() => {
        setCount((prev) => prev + 1);
        setCurrYear((prev) => prev + 1);
        console.log(currYear);
      }, 1000);
      
    if (props.max == currYear){
      setAnimate("Animation");
      clearInterval(timer);
    }
  };

  const handleClick = (e) => {
    if(animate === "Stop"){
      setAnimate("Animation");
      setCount(-1);
      return;
    }
    else setAnimate("Stop")
      
    setCount(0);
    setCurrYear(props.min);
  };

  useEffect(() => {
    updateCount();

    return () => {
      clearInterval(timer);
    };
  }, [count]);

  useEffect(() => {
    props.year(currYear);
  }, [currYear]);

  const handleChange = (event, newValue) => {
    setCurrYear(newValue);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "10px",
      }}
    >
      <div className={classes.root}>
        <Typography id="discrete-slider-small-steps" gutterBottom>
          Year
        </Typography>
        <Slider
          aria-labelledby="discrete-slider-small-steps"
          value={currYear}
          step={1}
          marks
          min={props.min}
          max={props.max}
          valueLabelDisplay="on"
          onChange={handleChange}
        />
        <button onClick={handleClick}>{animate}</button>
      </div>
    </div>
  );
}
