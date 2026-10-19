const fixture = {
  runId: 'RUN-0914-014',
  leadKey: 'CL-014',
  idempotencyKey: 'gmail-msg-8841'
}

const rows = [
  { key: 'gmail_read', title: 'Gmail intake', detail: 'Read the synthetic enquiry and validate the stated fields', receipt: 'gmail-msg-8841' },
  { key: 'sheets', title: 'Google Sheets lead', detail: 'Upsert one lead row and append an audit record', receipt: 'fixture-sheet-row-CL-014' },
  { key: 'github', title: 'GitHub issue', detail: 'Create one estimate task with the same lead key', receipt: 'fixture-issue-42' },
  { key: 'calendar', title: 'Google Calendar follow-up', detail: 'Create one proposed Thursday follow-up', receipt: 'fixture-event-7K2' },
  { key: 'gmail_draft', title: 'Gmail reply draft', detail: 'Create the factual reply as a draft, without sending', receipt: 'fixture-draft-9021' }
]

const state = {
  approved: false,
  running: false,
  finished: false,
  retryCount: 0,
  audit: [],
  processed: false,
  runToken: 0
}

const views = {
  queue: document.getElementById('queue-view'),
  review: document.getElementById('review-view'),
  execution: document.getElementById('execution-view')
}

const title = document.getElementById('page-title')
const statusPill = document.getElementById('status-pill')
const timeline = document.getElementById('timeline')
const runHeadline = document.getElementById('run-headline')
const runState = document.getElementById('run-state')
const auditLog = document.getElementById('audit-log')
const retryValue = document.getElementById('retry-value')
const outcomeValue = document.getElementById('outcome-value')
const validationValue = document.getElementById('validation-value')
const runId = document.getElementById('run-id')
const approveBtn = document.getElementById('approve-btn')
const replayBtn = document.getElementById('replay-btn')
const successMetrics = document.getElementById('success-metrics')
const metricWrites = document.getElementById('metric-writes')
const metricDuplicates = document.getElementById('metric-duplicates')

function showView(name) {
  Object.values(views).forEach(view => view.classList.remove('active'))
  views[name].classList.add('active')
  title.setAttribute('tabindex', '-1')
  title.focus({ preventScroll: false })
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function addAudit(step, result, detail) {
  const entry = { step, result, detail, at: nowLabel() }
  state.audit.push(entry)
  renderAudit()
}

function renderAudit() {
  auditLog.replaceChildren()
  if (!state.audit.length) {
    const empty = document.createElement('p')
    empty.className = 'muted'
    empty.textContent = 'No external write is claimed in fixture mode.'
    auditLog.appendChild(empty)
    return
  }
  state.audit.forEach(entry => {
    const div = document.createElement('div')
    div.className = 'audit-entry'
    const head = document.createElement('div')
    head.className = 'audit-head'
    const step = document.createElement('span')
    step.className = 'audit-step'
    step.textContent = `${entry.step}, ${entry.result.replace(/_/g, ' ')}`
    const at = document.createElement('time')
    at.textContent = entry.at
    head.append(step, at)
    const detail = document.createElement('p')
    detail.textContent = entry.detail
    div.append(head, detail)
    auditLog.appendChild(div)
  })
  auditLog.scrollTop = auditLog.scrollHeight
}

function renderTimeline(statusMap = {}) {
  timeline.replaceChildren()
  rows.forEach(row => {
    const status = statusMap[row.key] || 'pending'
    const li = document.createElement('li')
    li.className = `timeline-row ${status}`
    const statusCopy = status === 'success' ? 'Fixture receipt recorded' : status === 'warning' ? 'Failed once, retrying' : status === 'skipped' ? 'Existing run reused' : status === 'running' ? 'Running' : 'Pending'
    const dot = document.createElement('span')
    dot.className = 'status-dot'
    dot.setAttribute('aria-hidden', 'true')
    const body = document.createElement('div')
    const rowTitle = document.createElement('div')
    rowTitle.className = 'row-title'
    rowTitle.textContent = row.title
    const detail = document.createElement('div')
    detail.className = 'row-detail'
    detail.textContent = `${row.detail}. ${statusCopy}.`
    body.append(rowTitle, detail)
    const receipt = document.createElement('div')
    receipt.className = 'row-receipt'
    receipt.textContent = status === 'success' || status === 'skipped' ? row.receipt : ''
    li.append(dot, body, receipt)
    timeline.appendChild(li)
  })
}

function setTopStatus(copy, className) {
  statusPill.textContent = copy
  statusPill.className = `pill ${className}`
}

function preparePlan() {
  title.textContent = 'Review and approve'
  setTopStatus('Approval required', 'warning')
  validationValue.textContent = 'Fixture fields validated'
  outcomeValue.textContent = 'Awaiting one approval'
  addAudit('validate', 'pass', 'Fixture fields validated and no existing lead key found')
  showView('review')
}

function rejectPlan() {
  title.textContent = 'New enquiries'
  setTopStatus('1 enquiry ready', 'neutral')
  outcomeValue.textContent = 'Plan rejected. No writes performed.'
  addAudit('approval', 'rejected', 'Operator rejected the plan before any write')
  showView('queue')
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function executeApprovedPlan() {
  if (state.running) return
  const token = ++state.runToken
  const cancelled = () => token !== state.runToken
  state.approved = true
  state.running = true
  state.finished = false
  state.retryCount = 0
  approveBtn.disabled = true
  title.textContent = 'Execution and evidence'
  setTopStatus('Executing approved plan', 'warning')
  runId.textContent = fixture.runId
  outcomeValue.textContent = 'Running fixture adapters'
  addAudit('approval', 'approved', 'One human approval recorded')
  showView('execution')

  const status = {}
  for (const row of rows) {
    status[row.key] = 'running'
    renderTimeline(status)
    addAudit(row.key, 'start', `Begin ${row.title}`)
    await wait(700)
    if (cancelled()) return

    if (row.key === 'calendar' && state.retryCount === 0) {
      status[row.key] = 'warning'
      state.retryCount = 1
      retryValue.textContent = '1'
      renderTimeline(status)
      addAudit('calendar', 'injected_error', '503 fixture failure before the write. Completed receipts kept.')
      await wait(900)
      if (cancelled()) return
      addAudit('calendar', 'duplicate_check', 'Lead key search found no existing Calendar fixture receipt')
      status[row.key] = 'running'
      renderTimeline(status)
      await wait(650)
      if (cancelled()) return
    }

    status[row.key] = 'success'
    renderTimeline(status)
    addAudit(row.key, 'success', `${row.receipt} recorded as a synthetic fixture receipt`)
  }

  state.running = false
  state.processed = true
  state.finished = true
  runHeadline.textContent = 'Loop closed'
  runState.textContent = 'Fixture success'
  runState.className = 'pill success'
  setTopStatus('Loop closed', 'success')
  outcomeValue.textContent = 'Fixture path complete. No live external write claimed.'
  successMetrics.classList.remove('hidden')
  replayBtn.classList.remove('hidden')
  metricWrites.textContent = '4'
  metricDuplicates.textContent = '0'
  addAudit('run', 'complete', 'Four fixture writes completed after one approval and one bounded retry')
}

function replaySameEnquiry() {
  if (!state.processed) return
  const status = {}
  rows.forEach(row => { status[row.key] = 'skipped' })
  renderTimeline(status)
  runHeadline.textContent = `Already processed as ${fixture.runId}`
  runState.textContent = 'Duplicate blocked'
  runState.className = 'pill duplicate'
  setTopStatus('0 writes performed', 'duplicate')
  outcomeValue.textContent = 'Existing run reused. Zero new writes.'
  metricWrites.textContent = '0'
  metricDuplicates.textContent = '0'
  addAudit('deduplicate', 'pass', `Idempotency key ${fixture.idempotencyKey} reused the original run with zero new writes`)
}

function resetFixture() {
  state.runToken++
  state.approved = false
  state.running = false
  state.finished = false
  state.retryCount = 0
  state.audit = []
  state.processed = false
  approveBtn.disabled = false
  runId.textContent = 'Not started'
  validationValue.textContent = 'Ready'
  retryValue.textContent = '0'
  outcomeValue.textContent = 'Pending approval'
  renderAudit()
  successMetrics.classList.add('hidden')
  replayBtn.classList.add('hidden')
  runHeadline.textContent = 'Executing approved plan'
  runState.textContent = 'Running'
  runState.className = 'pill warning'
  title.textContent = 'New enquiries'
  setTopStatus('1 enquiry ready', 'neutral')
  renderTimeline()
  showView('queue')
}

document.getElementById('prepare-btn').addEventListener('click', preparePlan)
document.getElementById('reject-btn').addEventListener('click', rejectPlan)
approveBtn.addEventListener('click', executeApprovedPlan)
replayBtn.addEventListener('click', replaySameEnquiry)
document.getElementById('reset-btn').addEventListener('click', resetFixture)

renderTimeline()
