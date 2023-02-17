import { useEffect, useState } from "react";
import Network from "../../components/NetworkChart";
import { CONST_CATEGORY, CONST_YEAR } from "../../data/ConstVariables";
import { Box } from "@mui/material";
import LiveSearch from "../../components/LiveSearch";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { api_python } from "../../service/service";

export default function index() {
  const [year, setYear] = useState(CONST_YEAR);
  const [product, setProduct] = useState(CONST_CATEGORY);
  const [networkdata, setNetworkdata] = useState({ nodes: [], edges: [] });
  const colors = tokens();

  const liveSearchChange = (value, type) => {
    if (type === "category") setProduct(value);
    else setYear(value);
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
      </Box>{" "}
      <br />
      <Box
        height="75vh"
        border={`1px solid ${colors.grey[100]}`}
        borderRadius="4px"
        className="chart"
      >
        <Network data={networkdata} />
      </Box>
    </Box>
  );
}
