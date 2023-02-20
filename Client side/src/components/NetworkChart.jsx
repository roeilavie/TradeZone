import { useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";

export default function VisNetwork(props) {
  const nodes = props.data.nodes;
  const links = props.data.edges;
  const sizes = {
    Europe: props.nodesSize.europe,
    Americans: props.nodesSize.americans,
    Asia: props.nodesSize.asia,
    Africa: props.nodesSize.africa,
    Oceania: props.nodesSize.oceania,
  };

  const forceRef = useRef(null);
  useEffect(() => {
    forceRef.current.d3Force("charge").strength(-1*props.distance - 400);
    console.log(props);
  });

  return (
    <ForceGraph2D
      ref={forceRef}
      graphData={{ nodes, links }}
      nodeAutoColorBy="group"
      nodeLabel={(node) => node.name + ", " + node.continent}
      linkLabel={(link) =>
        "From : " +
        link.source.name +
        "<br />To : " +
        link.target.name +
        "<br />Value : " +
        link.value.toFixed(2) +
        "M$"
      }
      linkDirectionalArrowLength={0}
      linkDirectionalArrowRdelPos={1}
      nodeVal={(node) =>
        node.continent !== undefined ? sizes[node.continent] : 0
      }
      enableNodeDrag={false}
      />
  );
}
