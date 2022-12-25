import _ from "lodash";

export function paginate(items, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize;
  return _.slice(items, startIndex, startIndex + pageSize);
  // return _(items).slice(startIndex).take(pageSize).value();
}
