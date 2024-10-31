export function groupByParent(arr) {
    // Create a map to store objects by their IDs for quick look-up
    const map = new Map();

    // Initialize all objects with an empty `items` array
    arr.forEach((obj) => map.set(obj.id, { ...obj, items: [] }));

    let root = [];

    // Iterate again to place each object in its parentId's `items` array
    arr.forEach((obj) => {
        if (obj.parentId != null) {
            const parentId = map.get(obj.parentId);
            if (parentId) {
                parentId.items.push(map.get(obj.id));
            }
        } else {
            // If no parent, this is a root object
            root.push(map.get(obj.id));
        }
    });

    // Helper function to remove `items` property from leaf nodes
    function cleanitems(obj) {
        if (obj.items.length === 0) {
            delete obj.items; // Remove `items` if it’s an empty array
        } else {
            obj.items.forEach(cleanitems); // Recursively clean child nodes
        }
    }

    // Clean all root objects and their items recursively
    root.forEach(cleanitems);

    return root;
}
