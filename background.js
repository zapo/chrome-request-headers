var rules = []

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
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
    m[header.name] = header
    return m
  }, {})

  let rulesByHeaderName = rules.reduce(function(m, rule) {
    m[rule.header] = rule
    return m
  }, {})

  let requestHeaders = details.requestHeaders.map(function(header) {
    if(!!(rule = rulesByHeaderName[header.name])) {
      return {
        name: header.name,
        value: header.value.replace(rule.match, rule.replace)
      }
    } else {
      return {
        name: header.name,
        value: header.value
      }
    }
  })

  newHeaders = Object.keys(rulesByHeaderName)
    .filter((name) => !headersByName[name])

  for(let key of newHeaders) {
    requestHeaders.push({
      name: key,
      value: rulesByHeaderName[key].replace
    })
  }

  return { requestHeaders: requestHeaders };
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  rewriteRequestHeaders,
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders']
)
