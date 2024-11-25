import React, { useState, useEffect } from "react";
import TreeVisualizerFlow from "./components/TreeVisualizerFlow"; // New component for React Flow
import { createRoot, expandNode, getTree, resetTree } from "./services/apiService";

const App = () => {
  const [outcomeID, setOutcomeID] = useState(""); // Used for expansion
  const [additionalContext, setAdditionalContext] = useState(""); // Optional context
  const [treeData, setTreeData] = useState({}); // Stores the entire tree
  const [stateOutcome, setStateOutcome] = useState(""); // Used for root creation
  const [isRootCreated, setIsRootCreated] = useState(false); // Tracks if the root is created
  const MAX_CHAR_LIMIT = 160; // Character limit for inputs

  // Fetch and update the tree
  const fetchTree = async () => {
    try {
      const tree = await getTree();
      setTreeData(tree);
    } catch (error) {
      console.error("Error fetching tree:", error);
    }
  };

  // Handle root creation
  const handleRootCreation = async () => {
    try {
      await createRoot(stateOutcome);
      setIsRootCreated(true);
      fetchTree();
    } catch (error) {
      console.error("Error creating root:", error);
    }
  };

  // Handle node expansion
  const handleNodeExpansion = async () => {
    try {
      await expandNode(outcomeID, additionalContext);
      fetchTree();
    } catch (error) {
      console.error("Error expanding node:", error);
    }
  };

  // Handle tree reset
  const handleResetTree = async () => {
    try {
      await resetTree();
      setTreeData({});
      setIsRootCreated(false);
      setStateOutcome("");
      setOutcomeID("");
      setAdditionalContext("");
    } catch (error) {
      console.error("Error resetting tree:", error);
    }
  };

  // Initial fetch for the tree when the component mounts
  useEffect(() => {
    fetchTree();
  }, []);

  return (
    <div className="app-container" style={{ display: "flex", height: "100vh" }}>
      {/* Tree Visualization */}
      <div
        className="tree-container"
        style={{
          flex: 7,
          border: "1px solid #ccc",
          padding: "10px",
          overflow: "auto",
        }}
      >
        <TreeVisualizerFlow treeData={treeData} />
      </div>

      {/* Input and Controls */}
      <div
        className="controls-container"
        style={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "20px",
          borderLeft: "1px solid #ccc",
        }}
      >
        {!isRootCreated ? (
          // Root Creation Mode
          <>
            <h1>Overthink</h1>
            <textarea
              placeholder="Enter the root state outcome..."
              value={stateOutcome}
              onChange={(e) =>
                e.target.value.length <= MAX_CHAR_LIMIT
                  ? setStateOutcome(e.target.value)
                  : null
              }
              rows="3"
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <p>{`${stateOutcome.length}/${MAX_CHAR_LIMIT}`}</p>
            <button
              onClick={handleRootCreation}
              disabled={stateOutcome.length === 0 || stateOutcome.length > MAX_CHAR_LIMIT}
              style={{ padding: "10px", backgroundColor: "#000", color: "#fff" }}
            >
              + New Thought
            </button>
          </>
        ) : (
          // Node Expansion Mode
          <>
            <h1>Overthink</h1>
            <div>
              <label htmlFor="outcomeID">Outcome ID:</label>
              <input
                type="number"
                id="outcomeID"
                value={outcomeID}
                onChange={(e) => setOutcomeID(e.target.value)}
                placeholder="Enter the Outcome ID"
                style={{ width: "100%", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label htmlFor="additionalContext">Few More Details:</label>
              <textarea
                id="additionalContext"
                value={additionalContext}
                onChange={(e) =>
                  e.target.value.length <= MAX_CHAR_LIMIT
                    ? setAdditionalContext(e.target.value)
                    : null
                }
                rows="3"
                style={{ width: "100%", marginBottom: "10px" }}
              />
              <p>{`${additionalContext.length}/${MAX_CHAR_LIMIT}`}</p>
            </div>
            <button
              onClick={handleNodeExpansion}
              disabled={outcomeID.length === 0 || additionalContext.length > MAX_CHAR_LIMIT}
              style={{ padding: "10px", backgroundColor: "#000", color: "#fff" }}
            >
              Over-Think
            </button>
          </>
        )}
        <button
          onClick={handleResetTree}
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#fff",
            color: "#000",
          }}
        >
          Forget About it
        </button>
      </div>
    </div>
  );
};

export default App;