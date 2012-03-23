start = Date.now()
sum = 0
for n in [1..1000000000]
	sum += Math.sqrt(n)
console.log "sum of sqrts of the numbers 1 to 1 billion", sum
console.log "took", Date.now()-start