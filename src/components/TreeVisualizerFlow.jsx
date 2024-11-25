import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

const TreeVisualizerFlow = ({ treeData }) => {
  // Define nodes and edges states
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const traverseTree = useCallback(
    (nodeID, x = 0, y = 0) => {
      const node = treeData[nodeID];
      if (!node) return;

      // Set node color
      let backgroundColor = "rgba(0, 128, 0, 0.1)";
      if (nodeID !== 1) {
        backgroundColor = nodeID % 2 === 0 ? "rgba(193, 225, 193, 1)": "rgba(255,116,108,1)";
      }

      // Add node
      setNodes((prev) => [
        ...prev,
        {
          id: `${nodeID}`,
          data: {
            label: (
              <div style={{ color: "black", textAlign: "center" }}>
                <strong>ID: {nodeID}</strong>
                <br />
                {node.stateOutcome}
              </div>
            ),
          },
          position: { x, y },
          style: { backgroundColor, color: "black", padding: "10px" },
        },
      ]);

      const childXOffset = 200;
      const childYOffset = 100;

      // Add edges and traverse children
      if (node.positiveChildID) {
        setEdges((prev) => [
          ...prev,
          {
            id: `e${nodeID}-${node.positiveChildID}`,
            source: `${nodeID}`,
            target: `${node.positiveChildID}`,
            label: "Positive",
            style: { stroke: "green", strokeWidth: 2 },
          },
        ]);
        traverseTree(node.positiveChildID, x - childXOffset, y + childYOffset);
      }

      if (node.negativeChildID) {
        setEdges((prev) => [
          ...prev,
          {
            id: `e${nodeID}-${node.negativeChildID}`,
            source: `${nodeID}`,
            target: `${node.negativeChildID}`,
            label: "Negative",
            style: { stroke: "red", strokeWidth: 2 },
          },
        ]);
        traverseTree(node.negativeChildID, x + childXOffset, y + childYOffset);
      }
    },
    [treeData]
  );

  const buildFlowData = useCallback(() => {
    setNodes([]); // Clear previous nodes
    setEdges([]); // Clear previous edges
    traverseTree(1); // Start from root node
  }, [traverseTree]);

  useEffect(() => {
    buildFlowData();
  }, [buildFlowData]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) =>
          setNodes((nds) => applyNodeChanges(changes, nds))
        }
        onEdgesChange={(changes) =>
          setEdges((eds) => applyEdgeChanges(changes, eds))
        }
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default TreeVisualizerFlow;