// PRO and Privacy Bypass Hook
(function() {
  const PRO_KEYS = {
    licenseVerified: true,
    licenseStatus: "active",
    license_key: "TEAM_PRO_FREE",
    licenseExpiration: "2099-12-31T23:59:59.000Z",
    userEmail: "pro-team@example.com",
    isSetupComplete: true
  };

  const globalObj = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this;
  if (!globalObj) return;

  // 1. Mock storage API to always return PRO status
  const origGet = chrome.storage.local.get;
  chrome.storage.local.get = function(keys, callback) {
    if (typeof callback === 'function') {
      const wrappedCallback = function(items) {
        if (items) {
          Object.assign(items, PRO_KEYS);
        }
        callback(items);
      };
      if (typeof keys === 'string') {
        return origGet.call(chrome.storage.local, [keys], (items) => {
          wrappedCallback(items);
        });
      } else {
        return origGet.call(chrome.storage.local, keys, wrappedCallback);
      }
    } else {
      return origGet.call(chrome.storage.local, keys).then(items => {
        if (items) {
          Object.assign(items, PRO_KEYS);
        }
        return items;
      });
    }
  };

  const origSet = chrome.storage.local.set;
  chrome.storage.local.set = function(items, callback) {
    if (items) {
      if (items.hasOwnProperty('licenseVerified')) items.licenseVerified = true;
      if (items.hasOwnProperty('licenseStatus')) items.licenseStatus = "active";
      if (items.hasOwnProperty('isSetupComplete')) items.isSetupComplete = true;
    }
    return origSet.call(chrome.storage.local, items, callback);
  };

  if (chrome.storage.onChanged && chrome.storage.onChanged.addListener) {
    const origAddListener = chrome.storage.onChanged.addListener;
    chrome.storage.onChanged.addListener = function(callback) {
      const wrappedCallback = function(changes, areaName) {
        if (changes) {
          if (changes.licenseVerified) changes.licenseVerified.newValue = true;
          if (changes.licenseStatus) changes.licenseStatus.newValue = "active";
          if (changes.isSetupComplete) changes.isSetupComplete.newValue = true;
        }
        callback(changes, areaName);
      };
      return origAddListener.call(chrome.storage.onChanged, wrappedCallback);
    };
  }

  // 2. Intercept and mock network requests (Privacy Protection)
  const origFetch = globalObj.fetch;
  globalObj.fetch = function(input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) ? input.url : '';
    
    // Intercept license check
    if (url.includes("AKfycbz_wJUh9Zc0fRNW-E0b6WyV1fZFudzucTwMN-93U_My1R2yoZdRvqin48hIt4SGQ5Cv")) {
      console.log("[Bypass] Intercepted license verification request");
      const mockResponseText = 'myFunc({"status":"active","tool_id":"fb-poster-ce","reason":"Activated successfully"})';
      return Promise.resolve(new Response(mockResponseText, {
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "text/javascript" }
      }));
    }
    
    // Block email signup
    if (url.includes("AKfycbzWo8SUBzLUxcLZzWNNA6agFIVMjrnkcuYmrmIaqT508qShM0ggvWb70ArLB97t8Gbe")) {
      console.log("[Bypass] Blocked email telemetry registration");
      return Promise.resolve(new Response(JSON.stringify({ success: true }), {
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "application/json" }
      }));
    }
    
    // Block limit stats
    if (url.includes("AKfycbxKxqamBf3hUv3MDBrSC0ohgjpxoJ1xspdvT-vKD4W9Dx_1qM1Z96VMAXYypnsfpCNk")) {
      console.log("[Bypass] Blocked limit exceeded statistics");
      return Promise.resolve(new Response(JSON.stringify({ success: true }), {
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "application/json" }
      }));
    }
    
    return origFetch.apply(this, arguments);
  };
})();

(()=>{"use strict";new class{constructor(){this.dbName="FacebookPosterDB",this.version=1,this.db=null}async init(){return new Promise((e,t)=>{const o=indexedDB.open(this.dbName,this.version);o.onerror=()=>{console.error("IndexedDB failed to open:",o.error),t(o.error)},o.onsuccess=()=>{this.db=o.result,console.log("✅ IndexedDB initialized successfully"),e(this.db)},o.onupgradeneeded=e=>{const t=e.target.result;t.objectStoreNames.contains("postImages")||t.createObjectStore("postImages",{keyPath:"id",autoIncrement:!0}),t.objectStoreNames.contains("productImages")||t.createObjectStore("productImages",{keyPath:"id",autoIncrement:!0}),console.log("📦 IndexedDB object stores created")}})}async saveImages(e,t="postImages"){this.db||await this.init();const o=[];for(const s of e){const e=await this.saveImage(s,t);o.push(e)}return o}async saveImage(e,t="postImages"){return new Promise((o,s)=>{const n=this.db.transaction([t],"readwrite").objectStore(t).add({data:e,timestamp:Date.now()});n.onsuccess=()=>o(n.result),n.onerror=()=>s(n.error)})}async getImages(e,t="postImages"){this.db||await this.init();const o=[];for(const s of e){const e=await this.getImage(s,t);e&&o.push(e)}return o}async getImage(e,t="postImages"){return new Promise((o,s)=>{const n=this.db.transaction([t],"readonly").objectStore(t).get(e);n.onsuccess=()=>{o(n.result?n.result.data:null)},n.onerror=()=>s(n.error)})}async deleteImages(e,t="postImages"){this.db||await this.init();for(const o of e)await this.deleteImage(o,t)}async deleteImage(e,t="postImages"){return new Promise((o,s)=>{const n=this.db.transaction([t],"readwrite").objectStore(t).delete(e);n.onsuccess=()=>o(),n.onerror=()=>s(n.error)})}async clearStore(e="postImages"){return new Promise((t,o)=>{const s=this.db.transaction([e],"readwrite").objectStore(e).clear();s.onsuccess=()=>{console.log(`🗑️ Cleared all images from ${e}`),t()},s.onerror=()=>o(s.error)})}async getAllImageIds(e="postImages"){return new Promise((t,o)=>{const s=this.db.transaction([e],"readonly").objectStore(e).getAllKeys();s.onsuccess=()=>t(s.result),s.onerror=()=>o(s.error)})}},chrome.action.onClicked.addListener(e=>{const t=`injected-page-${e.id}&callback=myFunc`;chrome.storage.local.get([t],function(o){o[t]?chrome.tabs.sendMessage(e.id,{action:"OpenGroupPostingPopup"}):chrome.scripting.executeScript({target:{tabId:e.id},files:["content.js"]},()=>{let o={};o[t]=!0,chrome.storage.local.set(o,()=>{chrome.tabs.sendMessage(e.id,{action:"OpenGroupPostingPopup"})})})})}),chrome.tabs.onRemoved.addListener(function(e,t){const o=`injected-page-${e}`;chrome.storage.local.remove(o,()=>{})});let e=!1,t=[],o=[],s=[];async function n(e,t="postImages"){if(!e||0===e.length)return[];try{const o=await new Promise((e,t)=>{const o=indexedDB.open("FacebookPosterDB",1);o.onerror=()=>t(o.error),o.onsuccess=()=>e(o.result),o.onupgradeneeded=e=>{const t=e.target.result;t.objectStoreNames.contains("postImages")||t.createObjectStore("postImages",{keyPath:"id",autoIncrement:!0}),t.objectStoreNames.contains("productImages")||t.createObjectStore("productImages",{keyPath:"id",autoIncrement:!0})}}),s=[];for(const n of e){const e=await r(o,n,t);e&&s.push(e)}return s}catch(e){return console.error("Error getting images from IndexedDB:",e),[]}}function r(e,t,o){return new Promise((s,n)=>{const r=e.transaction([o],"readonly").objectStore(o).get(t);r.onsuccess=()=>{s(r.result?r.result.data:null)},r.onerror=()=>n(r.error)})}async function a(r){try{let a=null;e=!1,s=[],t=[],o=[],d("started"),l("Posting beginning");const{timeInSeconds:p,group:f}=r,y=f.links;t=f.links.slice();for(let t=0;t<y.length&&!e;t++){l(`Posting a ${t+1} / ${y.length} in the group`),console.log(`Currently at ${t+1}`);const e=y[t],o=await i(e);let d;if(await c(1),"createQuickPost"===r.action){let e={...r.post};e.imageIds&&e.imageIds.length>0?(console.log("Loading images from IndexedDB:",e.imageIds),e.images=await n(e.imageIds,"postImages"),console.log("Images loaded:",e.images.length)):e.images=[];const t=`post-${Date.now()}`;a=t,await chrome.storage.local.set({[t]:e}),d={action:"contentcreateQuickPost",postKey:t}}await g(o.id,d),await c(3),await new Promise(e=>{chrome.storage.local.remove("operationStatus",()=>{e()})});let f,{result:I,shouldWait:w}=await u();chrome.storage.local.remove(a),f=!0===I?"successful":!1===I?"failed":"restricted"===I?"restricted":"pending",s.push({link:y[t],response:f}),h(o.id),I&&t+1!=y.length&&w&&await m(p,t,y.length),await c(2)}!function(e){chrome.storage.local.set({postsCompleted:e},()=>{}),l("Posting successfully completed."),d("done")}(s)}catch(e){console.error("Error in handlePostingOperations:",e),d("error")}}function c(e){return new Promise(t=>setTimeout(t,1e3*e))}function i(e){return new Promise(t=>{chrome.tabs.create({url:e,active:!1,pinned:!0},e=>{chrome.tabs.onUpdated.addListener(function o(s,n){s===e.id&&"complete"===n.status&&(chrome.tabs.onUpdated.removeListener(o),t({id:e.id}))})})})}function l(e){chrome.storage.local.set({postingStatus:e},function(){})}function d(e){chrome.storage.local.set({isPostingInProgress:e},function(){})}async function g(e,t){chrome.tabs.sendMessage(e,t),await c(2)}async function u(){let e;await c(5);let t=0;for(;;){if(chrome.storage.local.get(["operationStatus"],t=>{e=t.operationStatus}),e)return"failed"==e?{result:!1,shouldWait:!1}:"pending"==e?{result:"pending",shouldWait:!0}:"restricted"==e?{result:"restricted",shouldWait:!0}:{result:!0,shouldWait:!0};if(await c(1),t++,t>60)return{result:!1,shouldWait:!1}}}async function m(e,t,o){for(console.log(`Waiting for ${e} seconds before the next post.`),l(`Post ${t+1} / ${o} completed. The next post will continue in ${e} seconds.`);e>0;)await c(10),(e-=10)<0&&(e=0),l(`Post ${t+1} / ${o} completed. The next post will continue in ${e} seconds.`)}async function h(e){chrome.tabs.remove(e,async()=>{await c(2),chrome.tabs.query({active:!0,currentWindow:!0},function(e){e.length>0&&(console.log("removing overlay message has been sent"),chrome.tabs.sendMessage(e[0].id,{action:"removeOverlay"}))})})}async function p(e,t="NA"){const o=await new Promise(e=>{chrome.storage.local.get(["deviceId"],t=>{if(t.deviceId)e(t.deviceId);else{const t=crypto.randomUUID();chrome.storage.local.set({deviceId:t},()=>{e(t)})}})}),s=`https://script.google.com/macros/s/AKfycbz_wJUh9Zc0fRNW-E0b6WyV1fZFudzucTwMN-93U_My1R2yoZdRvqin48hIt4SGQ5Cv/exec?action=get&id=${encodeURIComponent(e)}&deviceId=${encodeURIComponent(o)}&callback=myFunc`;return new Promise(t=>{fetch(s,{credentials:"omit"}).then(e=>e.text()).then(e=>{const t=e.replace(/^myFunc\(/,"").replace(/\);?$/,"");return JSON.parse(t)}).then(o=>{o&&"paused"==o.status?chrome.storage.local.set({licenseStatus:"paused"},()=>{t({isValid:!1,reason:o.reason})}):o&&"active"==o.status?o.tool_id&&"fb-poster-ce"==o.tool_id&&chrome.storage.local.set({licenseVerified:!0,license_key:e,licenseStatus:"active"},()=>{t({isValid:!0,reason:o.reason})}):t({isValid:!1,reason:o.reason})}).catch(()=>{t({isValid:!1,reason:data.reason})})})}function f(e){try{const t=new Date;let o=new Date,s=0,n=0;if(e.time){const t=e.time.split(":");s=parseInt(t[0],10)||0,n=parseInt(t[1],10)||0,o.setHours(s,n,0,0)}if("once"===e.frequency){if(e.startDate){const t=new Date(e.startDate);o.setFullYear(t.getFullYear(),t.getMonth(),t.getDate())}return o.toISOString()}if("daily"===e.frequency)o<=t&&o.setDate(o.getDate()+1);else if("weekly"===e.frequency){const s=t.getDay(),n={sunday:0,monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6};let r=(e.recurring?.weekDays||[]).map(e=>n[e.toLowerCase()]);if(r.sort((e,t)=>e-t),0===r.length)return o.toISOString();let a=!1;for(const e of r)if(e>s||e===s&&o>t){o.setDate(t.getDate()+(e-s)),a=!0;break}a||o.setDate(t.getDate()+(7-s+r[0]))}else if("monthly"===e.frequency){const s=t.getDate();let n=(e.recurring?.monthDays||[]).map(Number).sort((e,t)=>e-t);if(0===n.length)return o.toISOString();let r=!1,a=t.getMonth(),c=t.getFullYear();for(const e of n)if(e>s||e===s&&o>t){o.setDate(Math.min(e,new Date(c,a+1,0).getDate())),r=!0;break}r||(a++,a>11&&(a=0,c++),o.setFullYear(c,a),o.setDate(Math.min(n[0],new Date(c,a+1,0).getDate())))}return o.toISOString()}catch(e){const t=new Date;return t.setHours(t.getHours()+1),t.toISOString()}}chrome.runtime.onMessage.addListener(function(r,c,i){if(["createQuickPost","postProduct","postBoth"].includes(r.action))return a(r).then(()=>{console.log("Posting operations completed")}).catch(e=>{console.error("Error in posting operations:",e)}),!1;if("checkLicenceStatus"===r.action)chrome.storage.local.get(["license_key"],function(e){const t=e.license_key;console.log("licenseKey",t),p(t,"checkLicenseKey").then(e=>{chrome.storage.local.set({licenseVerified:e.isValid})}).catch(e=>{console.error("License validation error:",e)})});else{if("stopPosting"===r.action)return e=!0,l("Posting stopped. Summarizing..."),d("done"),console.log("posting has stopped in the background"),o=t.slice(s.length),o.forEach(e=>{s.push({link:e,response:"failed"})}),chrome.storage.local.set({postsCompleted:s},()=>{console.log("postsCompleted saved on stop")}),chrome.tabs.query({active:!0,currentWindow:!0},function(e){e.length>0&&chrome.tabs.sendMessage(e[0].id,{action:"removeOverlay"})}),console.log("posting is stopped on the background, message has been sent to the popup.js"),!1;if("checkLicense"===r.action)return console.log(r.licenseKey+" is being validated..."),p(r.licenseKey).then(e=>{chrome.storage.local.set({licenseVerified:e.isValid}),i(e)}).catch(e=>{console.error("License validation error:",e),i(!1)}),!0;if("getImagesFromIndexedDB"===r.action)return n(r.imageIds,r.storeName).then(e=>{i({success:!0,images:e})}).catch(e=>{console.error("Error retrieving images:",e),i({success:!1,images:[]})}),!0}}),chrome.runtime.onInstalled.addListener(e=>{"install"===e.reason?(chrome.tabs.create({url:"https://goizantools4fb.web.app/pricing"}),chrome.storage.local.set({isNewInstall:!0,extensionVersion:chrome.runtime.getManifest().version})):"update"===e.reason&&(chrome.storage.local.get(["userEmail"],e=>{e.userEmail||chrome.storage.local.set({needsEmailSetup:!0,extensionVersion:chrome.runtime.getManifest().version})}),chrome.storage.local.get(["delete_temp_posts"],async e=>{e.delete_temp_posts?console.log("ℹ️ Temp already deleted"):(chrome.storage.local.get(null,e=>{Object.keys(e).forEach(e=>{e.startsWith("post-")&&(chrome.storage.local.remove(e),console.log("All temp data deleted!!"))})}),chrome.storage.local.set({delete_temp_posts:!0}))}))}),chrome.alarms.create("scheduleTicker",{periodInMinutes:1}),console.log("Schedule ticker alarm created/verified"),chrome.alarms.onAlarm.addListener(e=>{"scheduleTicker"===e.name&&(console.log(`[${(new Date).toLocaleTimeString()}] Alarm 'scheduleTicker' fired`),async function(){try{const e=await chrome.storage.local.get(["scheduledPosts","isPostingInProgress"]),t=e.scheduledPosts||[],o=e.isPostingInProgress;if(console.log(`Checking ${t.length} total schedules (Status: ${o})`),"started"===o)return void console.log("Posting in progress, skipping schedule check");const s=new Date;let n=!1;for(const e of t)if(console.log(`- Schedule ${e.id}: Status=${e.status}, NextRun=${e.nextRunTime}`),"active"===e.status){if(!e.nextRunTime){console.log(`Schedule ${e.id} is active but missing nextRunTime. Calculating one now...`),e.nextRunTime=f(e),n=!0;continue}if(new Date(e.nextRunTime)<=s){console.log(`Executing schedule: ${e.id} (${e.metadata.postTitle})`);const t={action:"createQuickPost",timeInSeconds:30,group:{links:e.metadata.groupLinks||[]},post:{title:e.metadata.postTitle,text:e.metadata.text||e.metadata.content,imageIds:e.metadata.imageIds||[],images:e.metadata.images||[],videos:e.metadata.videos||[]}};"once"===e.frequency?e.status="completed":(e.lastTriggered=s.toISOString(),e.nextRunTime=f(e)),n=!0,a(t).catch(e=>console.error("Schedule execution error:",e));break}}n&&await chrome.storage.local.set({scheduledPosts:t})}catch(e){console.error("Error checking schedules:",e)}}())})})();