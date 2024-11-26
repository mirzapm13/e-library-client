export function setSelectedNodesByKey(arr: any[], keys: string[]) {
    let selectedNodes = [];
    const findNodeByKey = (nodes, key) => {
        for (let node of nodes) {
            if (node.key === key) {
                return node;
            }
            if (node.children) {
                const childNode = findNodeByKey(node.children, key);
                if (childNode) {
                    return childNode;
                }
            }
        }
        return null;
    };

    keys.forEach((key) => {
        const node = findNodeByKey(arr, key);
        if (node) {
            selectedNodes.push(node);
        }
    });

    return selectedNodes;
}
