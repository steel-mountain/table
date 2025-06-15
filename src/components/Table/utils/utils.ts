// export function countVisibleDescendants(children: any[], expandedIds: Array<string | number>) {
//   if (children?.length === 0) return 0;

//   let count = 0;
//   for (const child of children) {
//     count++;
//     if (expandedIds.includes(child.id)) {
//       count += countVisibleDescendants(child, expandedIds);
//     }
//   }
//   return count;
// }

export function countVisibleDescendants(node: any, expandedIds: Array<string | number>) {
  if (!node.children || node.children.length === 0) return 0;

  let count = 0;
  for (const child of node.children) {
    count++;
    if (expandedIds.includes(child.id)) {
      count += countVisibleDescendants(child, expandedIds);
    }
  }
  return count;
}

export const generateStableIds = (items: any[], parentPath: string): any[] => {
  return items.map((item, index) => {
    const currentId = `${parentPath}-${index}`;
    return {
      ...item,
      id: currentId,
      children: Array.isArray(item.children) ? generateStableIds(item.children, currentId) : [],
    };
  });
};

export const updateChildren = (
  items: any[],
  parentId: string | number,
  element: string | number,
  children: any[]
): any[] => {
  return items.map((item) => {
    if (item.id === parentId) {
      return {
        ...item,
        children: updateChildren(item.children || [], parentId, element, children),
      };
    }

    if (item.id === element) {
      return {
        ...item,
        children,
      };
    }

    return item;
  });
};
