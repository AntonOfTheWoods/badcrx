import content1 from './content1?script';

// @ts-ignore
declare const self: ServiceWorkerGlobalScope;
self.skipWaiting();

let newTab: chrome.tabs.Tab | undefined

// the following commented code fails with `world: 'MAIN'` but succeeds without

// chrome.scripting
//   .registerContentScripts([{
//     id: "session-script",
//     js: [content1],
//     persistAcrossSessions: false,
//     matches: ["*://www.google.com/*"],
//     runAt: "document_end",
//     world: 'MAIN',  // this fails
//   }])
//   .then(() => console.log("registration complete"))
//   .catch((err) => console.warn("unexpected error", err))

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (tabId === newTab?.id && changeInfo.status === 'loading') {
    chrome.scripting.executeScript({
      target: { tabId: newTab.id! },
      files: [content1],
      world: 'MAIN',  // this fails but succeeds without
    })
  }
})

chrome.action.onClicked.addListener(async function (tab) {
  chrome.tabs.query({active: true, currentWindow: true}).then((tabs) => {
    console.log("tabs", tabs)
    chrome.tabs.create({ url: tabs[0].url }).then((tab) => {
      newTab = tab
    })
  })
});

export {};