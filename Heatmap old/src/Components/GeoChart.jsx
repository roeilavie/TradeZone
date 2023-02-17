import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, scaleLinear } from "d3";
import useResizeObserver from "./useResizeObserver";
import jsonPopulation from "../Data/Population.json";

/**
 * Component that renders a map of Germany.
 */

function GeoChart({ data, property, data2, flow, year }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);
  let unNormDict = {};
  let popDict = {};
  let dict = {};

  // calculate the sum of the product of each country
  const calculateSum = (country, jsonData) => {
    let sum = 0;
    jsonData.forEach((element) => {
      let tmpCountry = element["COU"];
      if (flow["type"] === "Import") tmpCountry = element["PAR"];
      if (tmpCountry === country) sum += element["Value"];
    });
    dict[country] = sum;
  };

  // will be called initially and on every data change
  useEffect(() => {
    let jsonData = data2.data.filter(
      (el) => el["IND"] === property["IND"] && el["TIME"] === year
    );
    data.features.forEach((feature) =>
      calculateSum(feature.properties["adm0_a3"], jsonData)
    );
    for (let k in dict) {
      unNormDict[k] = dict[k];
      
      let popPerYear = jsonPopulation.population.filter(
        (row) => row.Code === k && row.Year === year
      );
      if (popPerYear.length != 0){
        popDict[k] = popPerYear[0].Population;
        dict[k] = dict[k] / (popPerYear[0].Population / 1000000);
      }
    }
    console.log("normal",dict);
    console.log("unNormal",unNormDict);
    console.log("population",popDict);

    //data.features.map((feature) => calculateSum(feature.properties["sov_a3"]));
    const svg = select(svgRef.current);
    const minProp = Math.min(...Object.values(dict));
    const maxProp = Math.max(...Object.values(dict)) + 0.01;
    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range([flow["min"],flow["max"]]);

    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // projects geo-coordinates on a 2D plane
    const projection = geoMercator()
      .fitSize([width, height], selectedCountry || data)
      .precision(100);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = geoPath().projection(projection);

    // render each country
    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .on("click", (event, feature) => {
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .attr("class", "country")
      .transition()
      .attr("fill", (feature) => {
        if (dict[feature.properties["adm0_a3"]] == 0)
          return "#ccc"
        return colorScale(dict[feature.properties["adm0_a3"]]);
      })
      .attr("d", (feature) => pathGenerator(feature));

    // render text
    svg
      .selectAll(".label")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label")
      .text(
        (feature) =>
          feature &&
          feature.properties.name +
            ": " +
            unNormDict[feature.properties["adm0_a3"]].toLocaleString() + 
            ", Population: " + popDict[feature.properties["adm0_a3"]].toLocaleString()
      )
      .attr("x", 10)
      .attr("y", 25);
  }, [data, dimensions, property, selectedCountry, flow, year]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default GeoChart;
