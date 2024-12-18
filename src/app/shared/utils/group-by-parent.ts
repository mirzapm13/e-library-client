export function groupByParent(arr, childs = 'childs', parent_id = 'parentId') {
    // Create a map to store objects by their IDs for quick look-up
    const map = new Map();

    // Initialize all objects with an empty `childs` array
    arr.forEach((obj) => map.set(obj.id, { ...obj, [childs]: [], level: 0 }));

    let root = [];

    // Iterate again to place each object in its parentId's `[childs]` array
    arr.forEach((obj) => {
        if (obj[parent_id] != null) {
            const parentObj = map.get(obj[parent_id]);
            if (parentObj) {
                const currentObj = map.get(obj.id);
                currentObj.level = parentObj.level + 1; // Set the child's level based on the parent's level
                parentObj[childs].push(currentObj);
            } else {
                root.push(map.get(obj.id));
            }
        } else {
            // If no parent, this is a root object
            const rootObj = map.get(obj.id);
            rootObj.level = 1; // Root objects start at level 1
            root.push(rootObj);
        }
    });

    // Helper function to mark deepest child elements
    function markDeepest(obj) {
        if (obj[childs].length === 0) {
            obj.deepest = true; // Mark as deepest
            obj.selectable = true;
            delete obj[childs]; // Remove `[childs]` if it’s an empty array
        } else {
            obj[childs].forEach(markDeepest); // Recursively process child nodes
        }
    }

    // Mark all root objects and their `[childs]` recursively
    root.forEach(markDeepest);

    return root;
}
