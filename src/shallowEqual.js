
/* Efficient shallow comparison of two objects */

export default function shallowEqual(objA, objB) {
  if (objA === objB) return true;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  // Test for A's keys different from B's.
  for (var i = 0; i < keysA.length; i++) {
    if (objA[keysA[i]] !== objB[keysA[i]]) return false;
  }

  // Test for B's keys different from A's.
  // Handles the case where B has a property that A doesn't.
  for (var i = 0; i < keysB.length; i++) {
    if (objA[keysB[i]] !== objB[keysB[i]]) return false;
  }

  return true;
}
