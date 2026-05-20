const DEV_UNLIMITED_PLAN={plan:"pro",trial:!1,promptsPerDay:1e9,promptsRemaining:1e9,promptsUsedToday:0};

function setUnlimitedPlan(){
  s=DEV_UNLIMITED_PLAN;
  const e=chrome.storage.local.set({turboflowPlan:DEV_UNLIMITED_PLAN,turboflowPlanTime:Date.now()});
  e.catch(e=>console.warn("[dev-unlimited] Failed to persist plan",e));
  return DEV_UNLIMITED_PLAN
}

if("function"==typeof Oe){
  Oe=async function(){return setUnlimitedPlan()}
}

if("function"==typeof Se){
  Se=async function(){return{allowed:!0,remaining:1e9}}
}

if("function"==typeof Ue){
  Ue=async function(e,t){
    m={unlockToken:"dev",timestamp:Date.now(),promptCount:e,mode:t};
    return{authorized:!0,remaining:1e9}
  }
}

if("function"==typeof $e){
  $e=async function(){return{ok:!0,remaining:1e9}}
}
