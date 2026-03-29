# iOS + Django App Development — Quick Reference Card

**AI Agent Coworker Model (20/80 Split)**  
*Last updated: March 2026*

---

## The model explained

| Role | Responsibility |
|------|------------------|
| **Agent (~20%)** | Code scaffolding, templates, documentation structure, best practices |
| **Owner (~80%)** | Business logic, design decisions, code review, testing strategy, approvals, production accountability |

**Key principle:** The agent should only move past a gate after **explicit owner approval**.

---

## Daily agent delivery format

```
🤖 AGENT DELIVERABLE
====================

Phase [X] - Step [Y] Status: [READY FOR REVIEW / AWAITING FEEDBACK]

✅ What I Completed (20%):
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

📁 Files/Branches:
- github.com/yourrepo/feature-branch
- Documentation: [link]

🟠 BLOCKING YOU (Need 1 of 3):

1️⃣ DECISION: Should we use [Option A] or [Option B]?
   Impact: Affects [X]
   My recommendation: [Option A because...]

2️⃣ APPROVAL: Review [code/design/architecture] in [file]
   What to check: [specific review points]

3️⃣ FEEDBACK: What custom [behavior/field/flow] do you need?
   Default: [what I implemented]

⏸️ I CAN'T PROCEED until you:
[ ] Choose option / approve / provide feedback
[ ] Post decision in chat
[ ] Link to approved PR/commit if reviewing code

⏭️ Once you approve, I will immediately:
- [Next action 1]
- [Next action 2]
- Commit to branch [X]
```

### Owner’s approval response (template)

```
✅ OWNER APPROVAL
=================

Phase [X] - Step [Y]

✓ Decision Made:
- [Decision 1]: Chose [Option B]
- [Decision 2]: [Feedback on code]

✓ Custom Requirements:
- [Requirement 1]
- [Requirement 2]

Status: ✅ APPROVED

Proceed to: [Next step]
```

**Time target:** Owner responds within **24 hours** of agent delivery (or states a deliberate delay).

---

## Weekly rhythm

| When | Agent | Owner |
|------|--------|--------|
| **Monday** | Summarize what shipped last week | Approve progress or flag issues |
| **Wednesday** | Check-in, interim deliverables | Unblock or confirm decisions |
| **Friday** | Weekly summary + next-week blockers | Confirm bandwidth for next phase |

---

## Phase approval checklist

### Before agent starts a phase

- [ ] Owner defines exact requirements for the phase  
- [ ] Owner notes design constraints  
- [ ] Owner aligns on tech stack (or confirms existing choices)  
- [ ] Owner confirms deployment approach (high level)  

### During the phase (agent delivers daily)

- [ ] Owner reviews deliverables within ~24h  
- [ ] Owner gives feedback or approval  
- [ ] Owner smoke-tests on dev when needed  
- [ ] Agent incorporates feedback  

### End of phase (gate)

- [ ] Features match agreed spec  
- [ ] Code review done  
- [ ] Tests passing (target e.g. 80%+ coverage where agreed)  
- [ ] Documentation updated  
- [ ] Security checklist reviewed for that phase  
- [ ] **Owner sign-off** → next phase  

---

## If the agent is blocked

**Agent**

- States the blocker clearly  
- Asks a concrete question or lists 2–3 options  
- Optionally opens a GitHub issue labeled `blocked`  
- Waits (target: up to 24h for routine decisions)  

**Owner**

- Reads the blocker  
- Chooses an option or gives a decision  
- Replies in chat (and PR if relevant)  

**If no response in 24h**

- Agent may document a **documented assumption** and proceed with a safe default — owner corrects when back  

---

## Communication protocol

**Agent → owner**

- “Should we do A or B?”  
- “For [feature], behavior A or B?”  
- “Does this flow match your intent?”  
- “Should we add [optimization] now or later?”  

**Owner → agent**

- “Why did you choose X?”  
- “Explain [architecture / tradeoff].”  
- “How is [edge case] handled?”  
- “What tests cover [scenario]?”  

**Red flags**

- Agent: “I’ll decide and move on” without approval → risk of rework  
- Owner: vague “will look later” with no ETA → timeline slip  

---

## Timeline assumptions (indicative)

| Phase | Weeks | Approvals (typical) |
|-------|-------|---------------------|
| 0 Setup | 1 | 1–2 |
| 1 Init | 1–2 | 2–3 |
| 2 Auth | 2–3 | 3–4 |
| 3 Features | 3–8 | 8–10 |
| 4 QA | 9–10 | 2–3 |
| 5 Security | 10–11 | ~2 |
| 6 CI/CD | 11–12 | 2–3 |
| 7 Deploy | 12–16 | 3–5 |

**Total:** ~12–16 weeks. If approvals often take 2–3 days, add ~2–4 weeks.

---

## Security sign-offs (before major deploys)

- [ ] Auth tokens handled securely  
- [ ] Encryption in transit (HTTPS) and at rest where required  
- [ ] API rate limiting where agreed  
- [ ] TLS enforced in production  
- [ ] Input validation on sensitive endpoints  
- [ ] No secrets in source control  
- [ ] DB access least-privilege  
- [ ] Logs avoid PII/secrets  

**Owner approval:** _______________ **Date:** _______________

---

## Week 1 — start here

**Owner**

- [ ] Fill business requirements (see `PHASE0_REQUIREMENTS_TEMPLATE.md`)  
- [ ] Confirm iOS min version (e.g. 14+)  
- [ ] Confirm DB (e.g. PostgreSQL)  
- [ ] Confirm API style (e.g. REST)  
- [ ] Apple Developer account (if App Store)  
- [ ] Cloud / billing (e.g. GCP) per **your** account — set up in console; agent cannot add credits  
- [ ] GitHub repos (iOS + backend)  
- [ ] First standup with agent/coworker  

**Agent (blocked until above are clear)**

- Waits for requirements and stack confirmation  
- Waits for first explicit approval to proceed past scope gates  

**Together**

- [ ] Weekly Friday standup slot  
- [ ] Channel (Discord, Slack, email, etc.)  
- [ ] Response SLA (24h recommended)  
- [ ] GitHub Project board (optional)  

---

## Golden rules

1. Agent **asks** instead of guessing on product/security tradeoffs.  
2. Owner **responds** within SLA or says when they’ll reply.  
3. **Document** approvals (chat + PR/issue).  
4. **Raise blockers** early.  
5. **Tests** before merge when that’s your rule.  
6. **Approval = authority** for that step; owner can still request follow-ups.  

---

## Emergency escalation

If owner is unavailable **>3 days:**

- Agent files issue: “Blocked: [reason], need [decision]”  
- Agent may ship a **documented best guess** behind a flag or branch  
- Owner reconciles on return  

Never: silent changes with no paper trail.

---

## Suggested channels

| Use | Channel |
|-----|---------|
| Daily updates | Chat |
| Code review | GitHub PRs + chat |
| Design | Screenshots / short Loom / call |
| Weekly standup | Async summary or 15-min call |
| Urgent | DM / call |

---

## Success metrics (end of each phase)

- [ ] Deliverables match what was asked  
- [ ] Code quality matches your bar for “next env”  
- [ ] Approvals within agreed SLA  
- [ ] Timeline roughly on track  
- [ ] Communication felt clear  

Any **no** → adjust before the next phase.

---

## Critical contacts (roles)

| Situation | Action |
|-----------|--------|
| CI fails | Agent captures logs; owner reviews workflow/secrets |
| Tests fail | Agent reproduces locally; owner reviews test intent |
| Deploy fails | Agent documents; owner approves rollback/forward |
| Scope change | Owner posts change; agent estimates impact |
| Scope creep | Schedule Phase 3.x or next release |

---

## Delivery checklist — before launch

### Backend

- [ ] Endpoints tested  
- [ ] Migrations tested on staging-like DB  
- [ ] Dev/staging/prod config separated  
- [ ] Error logging / monitoring  
- [ ] Rate limits in production  
- [ ] HTTPS  
- [ ] Secrets in env / secret manager  
- [ ] DB backups  
- [ ] Alerting  

### iOS

- [ ] Critical flows testable  
- [ ] Token refresh verified  
- [ ] Offline behavior (if in scope)  
- [ ] Icons / launch screen  
- [ ] Deep links (if in scope)  
- [ ] Push (if in scope)  
- [ ] Analytics (if in scope)  

### App Store (if applicable)

- [ ] Privacy policy + Terms URLs  
- [ ] Support contact  
- [ ] Screenshots / metadata  
- [ ] Age rating  
- [ ] Min OS version locked  

---

**Agent–owner model:** ~20% agent implementation / ~80% owner review & decisions · **Approval gates** at each phase transition.

*Note: GCP credits and billing are created in your own Google Cloud account; an AI agent cannot attach $300 or link accounts on your behalf.*
