// export function recursiveMap(items, mapFn) {
//     return items.map((item) => {
//         // Apply the mapping function to the current item
//         const newItem = mapFn(item);

//         // If the item has children, recursively map over them
//         if (Array.isArray(newItem.items)) {
//             newItem.items = recursiveMap(newItem.items, mapFn);
//         }

//         return newItem;
//     });
// }

export function recursiveMap(data, callback, newChildrenKey = 'items') {
    return data.map((item) => {
        // Apply the transformation to the current item
        const newItem = callback(item);

        // If the item has a `children` array, apply the recursive map to it and use the new key name
        if (Array.isArray(item.childs)) {
            newItem[newChildrenKey] = recursiveMap(
                item.childs,
                callback,
                newChildrenKey
            );
            delete newItem.childs; // Remove the original `children` key
        }

        return newItem;
    });
}
