export function removeLevelAndAbove(arr, levelToRemove, childs = 'childs') {
    function processHierarchy(nodes, currentLevel) {
        let newRoot = [];

        nodes.forEach((node) => {
            if (currentLevel < levelToRemove) {
                // Recursively process children
                const filteredChildren = processHierarchy(
                    node[childs] || [],
                    currentLevel + 1
                );
                newRoot = newRoot.concat(filteredChildren);
            } else if (currentLevel === levelToRemove) {
                // Promote children if at the level to be removed
                if (node[childs] && node[childs].length > 0) {
                    newRoot = newRoot.concat(node[childs]); // Add children to new root without resetting their levels
                }
            }
        });

        return newRoot;
    }

    // Start processing from the root level (assumed level 1)
    if (levelToRemove == 0) return arr;
    return processHierarchy(arr, 1);
}
