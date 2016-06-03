let vm = {
  rules: ko.observableArray(),
  candidate: {
    header: ko.observable(''),
    match: ko.observable(''),
    replace: ko.observable('')
  },

  addRule(rule) {
    this.rules.push({
      header: ko.observable(rule.header),
      match: ko.observable(rule.match),
      replace: ko.observable(rule.replace),
    })
  },
  addCandidateRule() {
    this.addRule(ko.toJS(this.candidate))

    this.candidate.header('')
    this.candidate.match('')
    this.candidate.replace('')
  },

  toJS() {
    return ko.toJS(this.rules())
  },

  fromJS(rules) {
    for(rule of rules) { this.addRule(rule) }
  }
}

ko.computed(() => vm.toJS()).subscribe((rules) => {
  window.parent.postMessage(rules, '*')
})

window.addEventListener('message', function(event) {
  if (!event.data) return
  vm.fromJS(event.data)
})

ko.applyBindings(vm)
