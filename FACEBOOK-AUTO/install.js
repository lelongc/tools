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

(()=>{class e{constructor(){this.init()}async init(){const e=await chrome.storage.local.get(["userEmail","isSetupComplete","extensionVersion"]),n=chrome.runtime.getManifest().version;e.userEmail&&e.isSetupComplete||(this.showEmailModal(),await chrome.storage.local.set({extensionVersion:n}))}showEmailModal(){document.body.insertAdjacentHTML("beforeend",'\n      <div id="fb-autoposter-modal" class="fb-autoposter-overlay">\n        <div class="fb-autoposter-modal">\n          <div class="fb-autoposter-header">\n            <h2>🚀 Welcome to Facebook Auto Poster!</h2>\n            <p>Please enter your email address to get started</p>\n          </div>\n          \n          <form id="fb-autoposter-form" class="fb-autoposter-form">\n            <div class="fb-autoposter-input-group">\n              <label for="userEmail">Email Address *</label>\n              <input \n                type="email" \n                id="userEmail" \n                placeholder="your@email.com" \n                required\n              />\n              <div id="email-error" class="fb-autoposter-error"></div>\n            </div>\n            \n            <div class="fb-autoposter-checkbox-group">\n              <input type="checkbox" id="newsletter" />\n              <label for="newsletter">I want to receive updates and tips</label>\n            </div>\n            \n            <div class="fb-autoposter-buttons">\n              <button type="submit" class="fb-autoposter-btn-primary">\n                Continue\n              </button>\n            </div>\n          </form>\n          \n          <div class="fb-autoposter-footer">\n            <p><a href="https://goizantools4fb.web.app/privacy-policy" target="_blank" id="privacyPolicy">Privacy Policy</a> | \n               <a href="https://goizantools4fb.web.app/terms-and-conditions" target="_blank" id="termsOfUse">Terms of Use</a></p>  \n               <a href="https://docs.google.com/forms/d/e/1FAIpQLSf8oDe7LlqUvqS8myvVn2Wexyc7LKppd-vbnoNW3MwK2Jw6pQ/viewform" id="support" target="_blank">Support</a></p>\n          </div>\n        </div>\n      </div>\n    '),this.attachEventListeners()}attachEventListeners(){const e=document.getElementById("fb-autoposter-form"),n=document.getElementById("fb-autoposter-modal");e.addEventListener("submit",e=>{e.preventDefault(),this.handleEmailSubmit()}),n.addEventListener("click",e=>{e.stopPropagation()}),document.addEventListener("keydown",this.preventEscapeClose)}preventEscapeClose(e){"Escape"===e.key&&document.getElementById("fb-autoposter-modal")&&(e.preventDefault(),e.stopPropagation())}async handleEmailSubmit(){const e=document.getElementById("userEmail"),n=document.getElementById("email-error"),t=document.querySelector(".fb-autoposter-btn-primary"),o=document.getElementById("newsletter").checked;n.textContent="";const a=e.value.trim();if(this.isValidEmail(a)){t.textContent="Setting up...",t.disabled=!0;try{await chrome.storage.local.set({userEmail:a,newsletterOptIn:o,isSetupComplete:!0,setupDate:(new Date).toISOString(),extensionVersion:chrome.runtime.getManifest().version}),await this.sendUserData(a,o),this.showSuccess()}catch(e){console.error("Setup failed:",e),n.textContent="Setup failed. Please try again.",t.textContent="Continue",t.disabled=!1}}else n.textContent="Please enter a valid email address"}async handleSkip(){console.log("Skip option has been disabled")}isValidEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}async sendUserData(e,n){try{if(!(await fetch("https://script.google.com/macros/s/AKfycbzWo8SUBzLUxcLZzWNNA6agFIVMjrnkcuYmrmIaqT508qShM0ggvWb70ArLB97t8Gbe/exec",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"save_to_sheet",email:e,newsletter:n,extensionVersion:chrome.runtime.getManifest().version,timestamp:(new Date).toISOString()})})).ok)throw new Error("Server error")}catch(e){console.warn("Could not send user data to server:",e)}}showSuccess(){document.querySelector(".fb-autoposter-modal").innerHTML='\n      <div class="fb-autoposter-header text-center">\n        <h2>✅ Setup Complete!</h2>\n        <p>You can now use Facebook Auto Poster</p>\n        <button class="fb-autoposter-btn-primary" id="close-start">\n          Get Started\n        </button>\n      </div>\n    ',setTimeout(()=>{this.closeModal()},2e3)}closeModal(){document.removeEventListener("keydown",this.preventEscapeClose);const e=document.getElementById("fb-autoposter-modal");e&&e.remove()}closeModalAndCleanup(){const e=window.emailModalInstance;e&&e.closeModal()}}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{window.emailModalInstance=new e}):window.emailModalInstance=new e,window.closeModalAndCleanup=function(){window.emailModalInstance&&window.emailModalInstance.closeModal()};const n=document.createElement("style");n.textContent="\n.fb-autoposter-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.7);\n  z-index: 999999;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n}\n\n.fb-autoposter-modal {\n  background: white;\n  border-radius: 12px;\n  padding: 30px;\n  max-width: 480px;\n  width: 90%;\n  max-height: 90vh;\n  overflow-y: auto;\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);\n  animation: modalSlideIn 0.3s ease-out;\n}\n\n@keyframes modalSlideIn {\n  from {\n    opacity: 0;\n    transform: translateY(-30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.fb-autoposter-header h2 {\n  margin: 0 0 10px 0;\n  color: #1877f2;\n  font-size: 24px;\n  text-align: center;\n}\n\n.fb-autoposter-header p {\n  margin: 0 0 25px 0;\n  color: #666;\n  text-align: center;\n  font-size: 16px;\n}\n\n.fb-autoposter-input-group {\n  margin-bottom: 20px;\n}\n\n.fb-autoposter-input-group label {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #333;\n}\n\n.fb-autoposter-input-group input {\n  width: 100%;\n  padding: 12px;\n  border: 2px solid #e3e3e3;\n  border-radius: 8px;\n  font-size: 16px;\n  transition: border-color 0.3s;\n  box-sizing: border-box;\n}\n\n.fb-autoposter-input-group input:focus {\n  outline: none;\n  border-color: #1877f2;\n}\n\n.fb-autoposter-error {\n  color: #e74c3c;\n  font-size: 14px;\n  margin-top: 5px;\n  min-height: 20px;\n}\n\n.fb-autoposter-checkbox-group {\n  display: flex;\n  align-items: center;\n  margin-bottom: 25px;\n}\n\n.fb-autoposter-checkbox-group input {\n  margin-right: 10px;\n}\n\n.fb-autoposter-buttons {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 20px;\n}\n\n.fb-autoposter-btn-primary {\n  flex: 1;\n  background: #1877f2;\n  color: white;\n  border: none;\n  padding: 12px 24px;\n  border-radius: 8px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: background 0.3s;\n}\n\n.fb-autoposter-btn-primary:hover {\n  background: #166fe5;\n}\n\n.fb-autoposter-btn-primary:disabled {\n  background: #ccc;\n  cursor: not-allowed;\n}\n\n.fb-autoposter-btn-secondary {\n  flex: 1;\n  background: #f0f2f5;\n  color: #666;\n  border: none;\n  padding: 12px 24px;\n  border-radius: 8px;\n  font-size: 16px;\n  cursor: pointer;\n  transition: background 0.3s;\n}\n\n.fb-autoposter-btn-secondary:hover {\n  background: #e4e6ea;\n}\n\n.fb-autoposter-footer {\n  text-align: center;\n  border-top: 1px solid #eee;\n  padding-top: 15px;\n}\n\n.fb-autoposter-footer p {\n  margin: 0;\n  font-size: 12px;\n  color: #888;\n}\n\n.fb-autoposter-footer a {\n  color: #1877f2;\n  text-decoration: none;\n}\n\n.fb-autoposter-footer a:hover {\n  text-decoration: underline;\n}\n",document.head.appendChild(n)})();