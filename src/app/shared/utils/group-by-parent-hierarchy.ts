export function groupByParentHierarchy(
    arr,
    childs = 'childs',
    parent_id = 'parentId',
    hierarchyKey = 'id',
    callback = (item) => {}
) {
    // Create a map to store objects by their IDs for quick look-up
    const map = new Map();

    // Initialize all objects with an empty `childs` array, `hierarchy`, and default `level`
    arr.forEach((obj) =>
        map.set(obj.id, {
            ...obj,
            [childs]: [],
            hierarchy: [],
            level: 0, // Default level, will be updated later
            command: () => {},
        })
    );

    let root = [];

    // Iterate again to place each object in its parentId's `[childs]` array
    arr.forEach((obj) => {
        if (obj[parent_id] != null) {
            const parent = map.get(obj[parent_id]);

            if (parent) {
                const child = map.get(obj.id);
                child.hierarchy = [...parent.hierarchy, parent[hierarchyKey]]; // Append parent's hierarchy
                child.level = parent.level + 1; // Set level based on parent's level

                parent[childs].push(child);
            } else {
                root.push(map.get(obj.id));
            }
        } else {
            // If no parent, this is a root object
            const rootObj = map.get(obj.id);
            rootObj.level = 1; // Root level starts at 1
            root.push(rootObj);
        }
    });

    // Helper function to mark deepest child elements
    function markDeepest(obj) {
        obj.command = () => {
            callback(obj);
        };

        if (obj[childs].length === 0) {
            obj.selectable = true; // Mark as selectable (deepest)
            delete obj[childs]; // Remove `[childs]` if it’s an empty array
        } else {
            obj[childs].forEach(markDeepest); // Recursively process child nodes
        }
    }

    // Mark all root objects and their `[childs]` recursively
    root.forEach(markDeepest);

    return root;
}
