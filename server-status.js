function currentQueries(nsPattern) {
   return db.$cmd.sys.inprog.findOne(  { $all : true } ).inprog.filter(d=>!!d.ns && d.ns.match(nsPattern))
}
function activeQuerySummary(nsPat) {
    return currentQueries(nsPat).map(d=>d.ns).reduce((r,n) => {r[n] = r[n] ? r[n]+1 : 1; return r}, {});
}
