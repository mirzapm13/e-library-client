// export function groupByParent(arr, childs = 'childs') {
//     // Create a map to store objects by their IDs for quick look-up
//     const map = new Map();

//     // Initialize all objects with an empty `items` array
//     arr.forEach((obj) => map.set(obj.id, { ...obj, childs: [] }));

//     let root = [];

//     // Iterate again to place each object in its parentId's `childs` array
//     arr.forEach((obj) => {
//         if (obj.parentId != null) {
//             const parentId = map.get(obj.parentId);
//             if (parentId) {
//                 parentId.childs.push(map.get(obj.id));
//             } else {
//                 root.push(map.get(obj.id));
//             }
//         } else {
//             // If no parent, this is a root object
//             root.push(map.get(obj.id));
//         }
//     });

//     // Helper function to remove `childs` property from leaf nodes
//     function cleanProperty(obj) {
//         if (obj.childs.length === 0) {
//             delete obj.childs; // Remove `childs` if it’s an empty array
//         } else {
//             obj.childs.forEach(cleanProperty); // Recursively clean child nodes
//         }
//     }

//     // Clean all root objects and their childs recursively
//     root.forEach(cleanProperty);

//     return root;
// }

export function groupByParent(arr, childs = 'childs') {
    // Create a map to store objects by their IDs for quick look-up
    const map = new Map();

    // Initialize all objects with an empty `items` array
    arr.forEach((obj) => map.set(obj.id, { ...obj, [childs]: [] }));

    let root = [];

    // Iterate again to place each object in its parentId's `[childs]` array
    arr.forEach((obj) => {
        if (obj.parentId != null) {
            const parentId = map.get(obj.parentId);
            if (parentId) {
                parentId[childs].push(map.get(obj.id));
            } else {
                root.push(map.get(obj.id));
            }
        } else {
            // If no parent, this is a root object
            root.push(map.get(obj.id));
        }
    });

    // Helper function to remove `[childs]` property from leaf nodes
    function cleanProperty(obj) {
        if (obj[childs].length === 0) {
            delete obj[childs]; // Remove `[childs]` if it’s an empty array
        } else {
            obj[childs].forEach(cleanProperty); // Recursively clean child nodes
        }
    }

    // Clean all root objects and their [childs] recursively
    root.forEach(cleanProperty);

    return root;
}
