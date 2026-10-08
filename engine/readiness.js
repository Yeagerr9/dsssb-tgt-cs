export function readiness(topics,weights={}){
 const keys=Object.keys(topics);if(!keys.length)return {score:0,coverage:0,explanation:'No topic data yet.'};
 let num=0,den=0,covered=0;for(const k of keys){const w=Number(weights[k]||1),m=Number(topics[k].mastery??.3);num+=w*m;den+=w;if((topics[k].attempts||0)>=5)covered++}
 const base=den?num/den:0,coverage=covered/keys.length,adjusted=base*(.8+.2*coverage);
 const weakest=keys.map(k=>({k,m:topics[k].mastery??0})).sort((a,b)=>a.m-b.m)[0];
 return {score:Math.round(adjusted*100),base,coverage,explanation:weakest?weakest.k+' is currently the largest mastery gap.':'Build more attempts to establish evidence.'}
}