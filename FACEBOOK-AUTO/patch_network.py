import re
import os

filepath = r'd:\folder\tools\FACEBOOK-AUTO\background.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace function i(e)
new_i = """function i(url){return new Promise(t=>{chrome.tabs.create({url:url,active:!1,pinned:!0},tab=>{let isResolved=!1;let checkInterval;function completeLoad(){if(!isResolved){isResolved=!0;chrome.tabs.onUpdated.removeListener(onUpdated);if(checkInterval)clearInterval(checkInterval);t({id:tab.id})}}function onUpdated(tabId,changeInfo){if(tabId===tab.id&&changeInfo.status==="complete"&&navigator.onLine){completeLoad()}}chrome.tabs.onUpdated.addListener(onUpdated);let waitTime=0;let wasOffline=!navigator.onLine;checkInterval=setInterval(()=>{if(isResolved){clearInterval(checkInterval);return}if(!navigator.onLine){wasOffline=!0}else{if(wasOffline){wasOffline=!1;waitTime=0;chrome.tabs.reload(tab.id);return}waitTime+=5;if(waitTime>=45){waitTime=0;chrome.tabs.reload(tab.id)}}},5000)})})}"""

# Use string replace for i(e) to be safer if regex has weird escaping
old_i = 'function i(e){return new Promise(t=>{chrome.tabs.create({url:e,active:!1,pinned:!0},e=>{chrome.tabs.onUpdated.addListener(function o(s,n){s===e.id&&"complete"===n.status&&(chrome.tabs.onUpdated.removeListener(o),t({id:e.id}))})})})}'

if old_i in content:
    content = content.replace(old_i, new_i)
    print("Replaced i(e)")
else:
    print("Warning: could not find old_i")

# Replace function u()
new_u = """async function u(tabId, messageData){await c(5);let t=0;let wasOffline=!1;for(;;){const data=await chrome.storage.local.get(["operationStatus"]);const e=data.operationStatus;if(e)return"failed"==e?{result:!1,shouldWait:!1}:"pending"==e?{result:"pending",shouldWait:!0}:"restricted"==e?{result:"restricted",shouldWait:!0}:{result:!0,shouldWait:!0};await c(1);if(!navigator.onLine){wasOffline=!0}else{if(wasOffline){wasOffline=!1;t=0;console.log("Network came back, reloading and resending...");await new Promise(resolve=>{chrome.tabs.reload(tabId,()=>{let checkInterval=setInterval(async()=>{if(!navigator.onLine)return;let tab=await chrome.tabs.get(tabId).catch(()=>null);if(tab&&tab.status==="complete"){clearInterval(checkInterval);resolve()}},2000)})});await c(2);await g(tabId,messageData);await c(3)}t++}if(t>90)return{result:!1,shouldWait:!1}}}"""

old_u = 'async function u(){await c(5);let t=0;for(;;){const data=await chrome.storage.local.get(["operationStatus"]);const e=data.operationStatus;if(e)return"failed"==e?{result:!1,shouldWait:!1}:"pending"==e?{result:"pending",shouldWait:!0}:"restricted"==e?{result:"restricted",shouldWait:!0}:{result:!0,shouldWait:!0};if(await c(1),t++,t>90)return{result:!1,shouldWait:!1}}}'

if old_u in content:
    content = content.replace(old_u, new_u)
    print("Replaced u()")
else:
    print("Warning: could not find old_u")

# Update await u()
old_u_call = 'let f,{result:I,shouldWait:w}=await u();'
new_u_call = 'let f,{result:I,shouldWait:w}=await u(o.id,d);'

if old_u_call in content:
    content = content.replace(old_u_call, new_u_call)
    print("Replaced u() call")
else:
    print("Warning: could not find old_u_call")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching complete.")
