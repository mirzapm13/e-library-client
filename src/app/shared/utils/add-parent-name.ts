export function addParentName(flatArray) {
    // Create a lookup table with each item keyed by its id
    const lookup = Object.fromEntries(flatArray.map((item) => [item.id, item]));

    // Map through the array and add the parentName property
    return flatArray.map((item) => ({
        ...item,
        parentName: item.parentId ? lookup[item.parentId]?.name || null : null,
    }));
}
