export function predict(mocks,maxMarks){
 if(mocks.length<3)return {ready:false,text:'Not enough mocks'};
 const recent=mocks.slice(-5).reverse(),weights=[.35,.25,.2,.1,.1].slice(0,recent.length),sum=weights.slice(0,recent.length).reduce((a,b)=>a+b,0);
 const vals=recent.map(m=>Number(m.score||0));const mean=vals.reduce((s,v,i)=>s+v*weights[i],0)/sum;
 const variance=vals.reduce((s,v)=>s+Math.pow(v-mean,2),0)/vals.length;
 return {ready:true,mean,low:Math.max(0,mean-Math.sqrt(variance)),high:Math.min(maxMarks,mean+Math.sqrt(variance))};
}