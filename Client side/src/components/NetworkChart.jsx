import ForceGraph2D from "react-force-graph-2d";

export default function VisNetwork(props) {
  const nodes = props.data.nodes;
  const links = props.data.edges;

  return (
    <ForceGraph2D
      width={1595}
      height={725}
      graphData={{ nodes, links }}
      nodeAutoColorBy="group"
      nodeLabel="name"
      linkDirectionalArrowLength={0}
      linkDirectionalArrowRdelPos={1}
    />
  );
}
