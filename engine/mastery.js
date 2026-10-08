export const initialMastery=.3;
export function updateMastery(prev,correct,difficulty=3,seconds=0,expectedSeconds=45,attempts=0){
 const score=correct?(seconds>2*expectedSeconds?.7:1):0;
 const weight=.15+.05*Math.max(1,Math.min(5,difficulty));
 const mastery=(prev??initialMastery)+weight*(score-(prev??initialMastery));
 return {mastery:Math.max(0,Math.min(1,mastery)),attempts:attempts+1,confidence:attempts+1>=5?'measured':'not-enough-data'};
}
export function statusFromMastery(m){return m>=.85?'mastered':m>=.65?'revising':m>=.35?'learning':'not-started'};