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
