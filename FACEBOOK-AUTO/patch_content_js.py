js_code = """
// --- EXTENSION: Keyword Filter Extract Listener ---
chrome.runtime.onMessage.addListener((e, t, n) => {
  if ("startKeywordExtract" === e.action) {
    (async () => {
      try {
        const token = (() => {
          try {
            const scripts = document.querySelectorAll("script");
            for (const script of scripts) {
              if (script.textContent.includes("DTSGInitialData")) {
                const match = script.textContent.match(/"?token"?\\s*:\\s*"([^"]+)"/);
                if (match) return match[1];
              }
            }
          } catch (err) {
            console.warn("Could not parse fb_dtsg from DOM", err);
          }
          try {
            const sessionData = sessionStorage.getItem("fbGroupTokens");
            if (sessionData) return JSON.parse(sessionData).fbDtsg;
          } catch (err) {}
          return null;
        })();

        if (!token) throw new Error("Authentication tokens not found. Make sure you are logged into Facebook.");

        const fetchGroups = async (docId, variables) => {
          const params = new URLSearchParams();
          params.append("fb_dtsg", token);
          params.append("doc_id", docId);
          params.append("variables", JSON.stringify(variables));

          const response = await fetch("https://www.facebook.com/api/graphql/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString()
          });

          if (!response.ok) throw new Error(`API request failed with HTTP status: ${response.status}`);
          
          const text = await response.text();
          if (!text) throw new Error("API returned an empty response.");

          for (const line of text.split("\\n")) {
            if (!line.trim()) continue;
            const cleanLine = line.startsWith("for (;;);") ? line.substring(9) : line;
            try {
              const data = JSON.parse(cleanLine);
              if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                const msg = data.errors[0].message || "Unknown Facebook API error.";
                throw new Error(`Facebook API Error: ${msg}`);
              }
              if (data.data) return data;
            } catch (err) {}
          }
          throw new Error("Could not find a valid data object in the API response.");
        };

        let resultLinks = [];
        const kw = (e.keyword || "").toLowerCase();

        const docId1 = "7740459739385247";
        const vars1 = { ordering: ["viewer_added"], scale: 1 };
        const res1 = await fetchGroups(docId1, vars1);
        const groupsTab = res1.data?.viewer?.groups_tab;

        if (!groupsTab) throw new Error("Could not find `data.viewer.groups_tab` in the API response.");

        // Helper function to extract and filter edges
        const extractAndFilter = (edges) => {
          if (!edges) return;
          for (const edge of edges) {
            if (edge && edge.node && edge.node.id) {
              const name = edge.node.name || "";
              if (name.toLowerCase().includes(kw)) {
                resultLinks.push(`https://www.facebook.com/groups/${edge.node.id}`);
              }
            }
          }
        };

        extractAndFilter(groupsTab.pinned_groups?.edges);
        extractAndFilter(groupsTab.tab_groups_list?.edges);

        let hasNext = groupsTab.tab_groups_list?.page_info?.has_next_page || false;
        let cursor = groupsTab.tab_groups_list?.page_info?.end_cursor || null;
        const docId2 = "7218669964900608";

        while (hasNext) {
          await new Promise(resolve => setTimeout(resolve, 300));
          const vars2 = { count: 10, cursor: cursor, ordering: ["viewer_added"], scale: 1 };
          const res2 = await fetchGroups(docId2, vars2);
          const list2 = res2.data?.viewer?.groups_tab?.tab_groups_list;
          
          extractAndFilter(list2?.edges);

          hasNext = list2?.page_info?.has_next_page || false;
          cursor = list2?.page_info?.end_cursor || null;
        }

        resultLinks = [...new Set(resultLinks)];
        chrome.storage.local.set({ KeywordLinksArray: resultLinks });
        console.log(`Keyword extraction successful for "${kw}", found ${resultLinks.length} groups.`);

      } catch (err) {
        console.error("Keyword group extraction failed:", err);
        chrome.storage.local.set({ KeywordExtractError: err.message });
      }
    })();
    return true;
  }
});
"""

with open('content.js', 'a', encoding='utf-8') as f:
    f.write('\\n' + js_code)

print("Appended new listener to content.js")
