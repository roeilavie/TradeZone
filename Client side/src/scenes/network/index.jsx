import { useEffect, useState } from "react";
import Network from "../../components/NetworkChart";
import { CONST_CATEGORY, CONST_YEAR } from "../../data/ConstVariables";
import { Box, Button } from "@mui/material";
import LiveSearch from "../../components/LiveSearch";
import NumberTextField from "../../components/NumberTextField";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import CommunityModal from "../../components/CommunityModal";
import { api_python, api_production } from "../../service/service";
import { getCountries } from "../../data/ServiceFunctions";

export default function index() {
  const [year, setYear] = useState(CONST_YEAR);
  const [product, setProduct] = useState(CONST_CATEGORY);
  const [sendData, setSendData] = useState({ countries: [], trades: [] });
  const [networkData, setNetworkData] = useState({
    data: { nodes: [], edges: [] },
    communitiesInfo: [],
    modularity: 0,
  });
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
        setNodesSize((prev) => ({
          europe: value,
          americas: prev.americas,
          asia: prev.asia,
          africa: prev.africa,
          oceania: prev.oceania,
        }));
        break;

      case "Americas":
        console.log(value, name);
        setNodesSize((prev) => ({
          europe: prev.europe,
          americas: value,
          asia: prev.asia,
          africa: prev.africa,
          oceania: prev.oceania,
        }));
        break;

      case "Asia":
        setNodesSize((prev) => ({
          europe: prev.europe,
          americas: prev.americas,
          asia: value,
          africa: prev.africa,
          oceania: prev.oceania,
        }));
        break;

      case "Africa":
        setNodesSize((prev) => ({
          europe: prev.europe,
          americas: prev.americas,
          asia: prev.asia,
          africa: value,
          oceania: prev.oceania,
        }));
        break;

      default:
        setNodesSize((prev) => ({
          europe: prev.europe,
          americas: prev.americas,
          asia: prev.asia,
          africa: prev.africa,
          oceania: value,
        }));
        break;
    }
  };

  useEffect(() => {
    getCountries()
      .then((countries) => {
        setSendData((prev) => ({ countries, trades: prev.trades }));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (
      product === null ||
      year === null ||
      year === undefined ||
      product === undefined
    )
      return alert("You need to fill all the fields");

    fetch(`${api_production}/Trades?year=${year}&ind=${product.Code}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then(
        (result) => {
          setSendData((prev) => ({
            countries: prev.countries,
            trades: result,
          }));
        },
        (error) => {
          console.log("err GET=", error);
        }
      );
  }, [product, year]);

  useEffect(() => {
    if (sendData.countries.length > 0 && sendData.trades.length > 0)
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
          },
          (error) => {
            console.log("err post=", error);
          }
        );
  }, [sendData]);

  return (
    <Box m="20px">
      <Header
        title="Network"
        subtitle="Detect communities with Network Chart"
      />
      <Box display="flex" justifyContent="space-evenly" alignItems="center">
        <LiveSearch type="year" handleChange={liveSearchChange} />
        <LiveSearch type="category" handleChange={liveSearchChange} />
        <NumberTextField
          name="Europe"
          value={nodesSize.europe}
          handleChange={numberTextFieldChange}
        />
        <NumberTextField
          name="Americas"
          value={nodesSize.americas}
          handleChange={numberTextFieldChange}
        />
        <NumberTextField
          name="Asia"
          value={nodesSize.asia}
          handleChange={numberTextFieldChange}
        />
        <NumberTextField
          name="Africa"
          value={nodesSize.africa}
          handleChange={numberTextFieldChange}
        />
        <NumberTextField
          name="Oceania"
          value={nodesSize.oceania}
          handleChange={numberTextFieldChange}
        />
      </Box>{" "}
      <br />
      <Box
        height={800}
        width={1520}
        border={`1px solid ${colors.grey[100]}`}
        borderRadius="4px"
        className="chart"
      >
        <CommunityModal
          data={networkData.communitiesInfo}
          modularity={networkData.modularity}
        />
        <Network data={networkData.data} nodesSize={nodesSize} />
      </Box>
    </Box>
  );
}
