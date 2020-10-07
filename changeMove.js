const minMoves = (arr1, arr2) => {
    const ray1 = arr1.toString().split("");
    const ray2 = arr2.toString().split("");
    let incs = 0;

    for (let i = 0; i <= ray1.length; i++) {
      if (ray1[i] > ray2[i]) {
        const res = ray1[i] - ray2[i];
        incs += res;
      } else if (ray2[i] > ray1[i]) {
        const diff = ray2[i] - ray1[i];
        incs += diff;
      }
    }
    return incs;
};
console.log(minMoves([3545], [3214]));