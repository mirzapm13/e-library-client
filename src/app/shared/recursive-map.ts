export function recursiveMap(items, mapFn) {
    return items.map((item) => {
        // Apply the mapping function to the current item
        const newItem = mapFn(item);

        // If the item has children, recursively map over them
        if (Array.isArray(newItem.items)) {
            newItem.items = recursiveMap(newItem.items, mapFn);
        }

        return newItem;
    });
}

export function addParentName(flatArray) {
    // Create a lookup table with each item keyed by its id
    const lookup = Object.fromEntries(flatArray.map((item) => [item.id, item]));

    // Map through the array and add the parentName property
    return flatArray.map((item) => ({
        ...item,
        parentName: item.parentId ? lookup[item.parentId]?.name || null : null,
    }));
}
