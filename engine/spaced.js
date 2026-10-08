export function scheduleTopic(old={},correct,fast,daysToExam=999){
 let ease=Number(old.ease||2.5),n=Number(old.reps||0),interval=Number(old.interval||0);
 const quality=correct?(fast?5:4):2;
 if(quality<3){interval=1;ease=Math.max(1.3,ease-.2);n=0}
 else{interval=n===0?1:n===1?3:Math.round(Math.max(1,interval)*ease);n++ ;ease=Math.max(1.3,ease+(0.1-(5-quality)*(.08+(5-quality)*.02)))}
 const cap=Math.max(1,Math.floor(Math.max(1,daysToExam)/2));interval=Math.min(interval,cap);
 return {...old,reps:n,ease,interval,due:Date.now()+interval*86400000,last:Date.now()}
}
export function due(item,now=Date.now()){return !item?.due||item.due<=now}
