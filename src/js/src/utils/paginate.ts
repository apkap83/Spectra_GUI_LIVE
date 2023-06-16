import _ from "lodash";

export function paginate(
  items: ArrayLike<unknown>,
  pageNumber: number,
  pageSize: number
) {
  const startIndex = (pageNumber - 1) * pageSize;
  return _.slice(items, startIndex, startIndex + pageSize);
  // return _(items).slice(startIndex).take(pageSize).value();
}
