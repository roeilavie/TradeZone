import { useEffect, useState } from "react";
import Network from "../../components/NetworkChart";
import { CONST_CATEGORY, CONST_YEAR } from "../../data/ConstVariables";
import { Box, TextField } from "@mui/material";
import LiveSearch from "../../components/LiveSearch";
import NumberTextField from "../../components/NumberTextField";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { api_python } from "../../service/service";

export default function index() {
  const [year, setYear] = useState(CONST_YEAR);
  const [product, setProduct] = useState(CONST_CATEGORY);
  const [networkdata, setNetworkdata] = useState({ nodes: [], edges: [] });
  const colors = tokens();
  const [nodesSize, setNodesSize] = useState({
    europe: 6,
    americans: 5,
    asia: 4,
    africa: 3,
    oceania: 2,
  });
  const [distance, setDistance] = useState(0);

  const liveSearchChange = (value, type) => {
    if (type === "category") setProduct(value);
    else setYear(value);
  };

  const numberTextFieldChange = (value, name) => {
      switch (name) {
        case "europe":
          setNodesSize((prev) => ({europe: value,
            americans: prev.americans, asia: prev.asia, africa: prev.africa, oceania: prev.oceania}));
          break;
  
        case "americans":
          setNodesSize((prev) => ({europe: prev.europe,
            americans: value, asia: prev.asia, africa: prev.africa, oceania: prev.oceania}));
          break;
  
        case "asia":
          setNodesSize((prev) => ({europe: prev.europe,
            americans: prev.americans, asia: value, africa: prev.africa, oceania: prev.oceania}));
          break;

        case "africa":
          setNodesSize((prev) => ({europe: prev.europe,
            americans: prev.americans, asia: prev.asia, africa: value, oceania: prev.oceania}));
          break;

        default: 
          setNodesSize((prev) => ({europe: prev.europe,
            americans: prev.americans, asia: prev.asia, africa: prev.africa, oceania: value}));
          break;
      }
  };

  useEffect(() => {
    if (
      product === null ||
      year === null ||
      year === undefined ||
      product === undefined
    )
      return alert("You need to fill all the fields");
    const sendData = { ind: product.Code, year: year };

    fetch(`${api_python}`, {
      method: "POST",
      body: JSON.stringify(sendData),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then(
        (result) => {
          setNetworkdata(result.data);
          console.log(result.data);
        },
        (error) => {
          console.log("err post=", error);
        }
      );
  }, [product, year]);

  return (
    <Box m="20px">
      <Header
        title="Network"
        subtitle="Detect communities with Network Chart"
      />
      <Box display="flex" justifyContent="space-evenly" alignItems="center">
        <LiveSearch type="year" handleChange={liveSearchChange} />
        <LiveSearch type="category" handleChange={liveSearchChange} />
        <Box backgroundColor={colors.primary[400]}>
          <TextField
            id="outlined-number"
            label="Distance"
            value={distance / 200}
            type="number"
            onChange={(e) => {
              if (Number(e.target.value) < 0)
                return alert("please enter positive numbers");
              setDistance(Number(e.target.value) * 200);
            }}
          />
        </Box>
        <NumberTextField name='Europe' value={nodesSize.europe} handleChange={numberTextFieldChange}/>
        <NumberTextField name='Americans' value={nodesSize.americans} handleChange={numberTextFieldChange}/>
        <NumberTextField name='Asia' value={nodesSize.asia} handleChange={numberTextFieldChange}/>
        <NumberTextField name='Africa' value={nodesSize.africa} handleChange={numberTextFieldChange}/>
        <NumberTextField name='Oceania' value={nodesSize.oceania} handleChange={numberTextFieldChange}/>
      </Box>{" "}
      <br />
      <Box
        height="75vh"
        border={`1px solid ${colors.grey[100]}`}
        borderRadius="4px"
        className="chart"
      >
        <Network data={networkdata} distance={distance} nodesSize={nodesSize}/>
      </Box>
    </Box>
  );
}
