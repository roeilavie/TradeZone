import React, { useState, useEffect } from "react";
import GeoChart from "./GeoChart";
import data from "../Data/GeoChart.world.geo.json";
import data2 from "../Data/sample.json";
import "../App.css";
import jsonProducts from "../Data/products.json";
import YearSlider from "./YearSlider";

function HomePage() {
  let counter = 1;
  const [property, setProperty] = useState({
    PRO: jsonProducts.Products[0]["PRO"],
    IND: jsonProducts.Products[0]["IND"],
  });
  const [select, setSelect] = useState();
  const [flow, setFlow] = useState({ type: "Export",min:"#F5DEB3" , max:"red"});
  const [year, setYear] = useState(2005);

  useEffect(() => {
    let str = (
      <div style={{ alignItems: "center" }}>
        <select
          style={{ width: "40%" }}
          value={property}
          onChange={(event) =>
            setProperty({
              PRO: event.nativeEvent.target[
                event.nativeEvent.target.selectedIndex
              ].text,
              IND: event.target.value,
            })
          }
        >
          <option value={property["IND"]}>{property["PRO"]}</option>
          {jsonProducts.Products.map((product) => (
            <option value={product["IND"]} key={counter++}>
              {product["PRO"]}
            </option>
          ))}
        </select>
      </div>
    );
    setSelect(str);
  }, [property, counter]);

  return (
    <React.Fragment>
      <h2>World Map with d3-geo</h2>
      <div style={{ width: "70%" }}>
        <select
          onChange={(event) =>
            setFlow({
              type: event.nativeEvent.target[
                event.nativeEvent.target.selectedIndex
              ].text,
              max: event.target.value,
              min:event.nativeEvent.target[event.nativeEvent.target.selectedIndex].dataset.min
            })
          }
        >
          <option data-min="#F5DEB3" value="red">Export</option>
          <option data-min="#F0E68C" value="brown">Import</option>
        </select>
      </div>
      <GeoChart
        data={data}
        data2={data2}
        property={property}
        flow={flow}
        year={year}
      />
      <YearSlider
        year={(currYear) => setYear(currYear)}
        min={1989}
        max={2021}
      />
      <h2>Select property to highlight</h2>
      {select}
    </React.Fragment>
  );
}

export default HomePage;
