var rules = []

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (let key in changes) {
    let change = changes[key]
    if(key === 'rules') {
      rules = change.newValue
      break;
    }
  }
});

chrome.storage.sync.get('rules', function(data) {
  if(data.rules) { rules = data.rules }
})

function rewriteRequestHeaders(details) {
  let headersByName = details.requestHeaders.reduce(function(m, header) {
    m[header.name.toLowerCase()] = header
    return m
  }, {})

  let newHeaders = []
  for(let rule of rules) {
    let header = headersByName[rule.header.toLowerCase()]

    if(header) {
      header.value = header.value.replace(rule.match, rule.replace)
    } else {
      details.requestHeaders.push({ name: rule.header, value: rule.replace })
    }
  }

  return { requestHeaders: details.requestHeaders };
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  rewriteRequestHeaders,
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders']
)
