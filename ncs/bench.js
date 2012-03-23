(function() {
  var n, start, sum;

  start = Date.now();

  sum = 0;

  for (n = 1; n <= 1000000000; n++) {
    sum += Math.sqrt(n);
  }

  console.log("sum of sqrts of the numbers 1 to 1 billion", sum);

  console.log("took", Date.now() - start);

}).call(this);
