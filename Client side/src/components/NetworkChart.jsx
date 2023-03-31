import { useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";

export default function Network(props) {
  const nodesColors = [
    "gray",
    "yellow",
    "red",
    "green",
    "blue",
    "pink",
    "orange",
    "brown",
  ];
  const nodes = props.data.nodes;
  const links = props.data.edges;
  const sizes = {
    Europe: props.nodesSize.europe,
    Americas: props.nodesSize.americas,
    Asia: props.nodesSize.asia,
    Africa: props.nodesSize.africa,
    Oceania: props.nodesSize.oceania,
  };
  const forceRef = useRef(null);

  useEffect(() => {
    forceRef.current.d3Force("charge").strength(-400);
  });

  return (
    <div>
      <ForceGraph2D
        height={800}
        width={1520}
        ref={forceRef}
        graphData={{ nodes, links }}
        nodeColor={(node) => nodesColors[node.group]}
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
    </div>
  );
}
