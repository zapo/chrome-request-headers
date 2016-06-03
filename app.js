var appWindow = document.getElementById("app").contentWindow
appWindow.addEventListener('load', function() {
  chrome.storage.sync.get('rules', function(data) {
    appWindow.postMessage(data.rules, '*')
  })
  return true;
}, false)

window.addEventListener('message', function(event) {
  if (!event.data) { return }
  chrome.storage.sync.set({ 'rules': event.data });
}, false);
