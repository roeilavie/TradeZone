import { useEffect, useState } from "react";
import Network from "../../components/NetworkChart";
import { CONST_CATEGORY, CONST_YEAR } from "../../data/ConstVariables";
import { Box, Button } from "@mui/material";
import LiveSearch from "../../components/LiveSearch";
import NumberTextField from "../../components/NumberTextField";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import CommunityModal from "../../components/CommunityModal";
import { api_python } from "../../service/service";

export default function index() {
  const [year, setYear] = useState(CONST_YEAR);
  const [product, setProduct] = useState(CONST_CATEGORY);
  const [networkData, setNetworkData] = useState({ data : {nodes: [], edges: []}, communitiesInfo:[], modularity:0 });
  const colors = tokens();
  const [nodesSize, setNodesSize] = useState({
    europe: 14,
    americas: 11,
    asia: 8,
    africa: 5,
    oceania: 2,
  });

  const liveSearchChange = (value, type) => {
    if (type === "category") setProduct(value);
    else setYear(value);
  };

  const numberTextFieldChange = (value, name) => {
    
      switch (name) {
        case "Europe":
          setNodesSize((prev) => ({europe: value,
            americas: prev.americas, asia: prev.asia, africa: prev.africa, oceania: prev.oceania}));
          break;
  
        case "Americas":
          console.log(value,name)
          setNodesSize((prev) => ({europe: prev.europe,
            americas: value, asia: prev.asia, africa: prev.africa, oceania: prev.oceania}));
          break;
  
        case "Asia":
          setNodesSize((prev) => ({europe: prev.europe,
            americas: prev.americas, asia: value, africa: prev.africa, oceania: prev.oceania}));
          break;

        case "Africa":
          setNodesSize((prev) => ({europe: prev.europe,
            americas: prev.americas, asia: prev.asia, africa: value, oceania: prev.oceania}));
          break;

        default: 
          setNodesSize((prev) => ({europe: prev.europe,
            americas: prev.americas, asia: prev.asia, africa: prev.africa, oceania: value}));
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
          setNetworkData(result);
          console.log(result);
        },
        (error) => {
          console.log("err post=", error);
        }
      );
  }, [product, year]);

  const openModalStats = () => {

  }

  return (
    <Box m="20px">
      <Header
        title="Network"
        subtitle="Detect communities with Network Chart"
      />
      <Box display="flex" justifyContent="space-evenly" alignItems="center">
        <LiveSearch type="year" handleChange={liveSearchChange} />
        <LiveSearch type="category" handleChange={liveSearchChange} />
        <NumberTextField name='Europe' value={nodesSize.europe} handleChange={numberTextFieldChange}/>
        <NumberTextField name='Americas' value={nodesSize.americas} handleChange={numberTextFieldChange}/>
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
        <CommunityModal data={networkData.communitiesInfo} modularity={networkData.modularity}/>
        <Network data={networkData.data} nodesSize={nodesSize}/>
      </Box>
    </Box>
  );
}
