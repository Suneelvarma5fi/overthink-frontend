const generateMermaidScript = (treeData) => {
    let script = "graph TD\n"; // Start with the graph direction
  
    // Helper function for recursive traversal
    const traverseTree = (nodeID) => {
      const node = treeData[nodeID];
      if (!node) return;
  
      // Add the current node
      script += `    ${nodeID}["${node.stateOutcome}"]\n`;
  
      // Add edges for positive and negative children
      if (node.positiveChildID) {
        script += `    ${nodeID} -->|Positive| ${node.positiveChildID}["${treeData[node.positiveChildID]?.stateOutcome || ''}"]\n`;
        traverseTree(node.positiveChildID); // Recurse for the positive child
      }
  
      if (node.negativeChildID) {
        script += `    ${nodeID} -->|Negative| ${node.negativeChildID}["${treeData[node.negativeChildID]?.stateOutcome || ''}"]\n`;
        traverseTree(node.negativeChildID); // Recurse for the negative child
      }
    };
  
    // Start traversal from the root node (ID = 1)
    traverseTree(1);
  
    return script;
  };