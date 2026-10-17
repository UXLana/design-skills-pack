# Common Decision Scenarios

Recurring product and design decisions, each with a worked process. The numbers and thresholds in them are illustrations of how to reason, not rules: set real ones with the people who own the outcome.

## Scenario 1: Compliance Requirement vs. User Experience

**Pattern:** A compliance, legal or policy owner asks for a field, step or check that adds friction for the people who use the product every day.

**Example:** "Compliance wants a reason code on every record deletion. Power users say it adds 30 seconds per item, and they clean up hundreds of records at once."

**Framework Recommendation:** Multi-Criteria Decision Matrix + Human-Centered Design

**Decision Process:**
1. **Understand the intent:** Why do they need this data? Is it for audits, reporting, or enforcement? Can the need be met another way?
2. **Quantify the user pain:** How many users? How often? What's the time cost? Talk to actual users.
3. **Explore creative solutions:**
   - Bulk operations: Apply one reason to many items at once
   - Smart defaults: Remember the last-used reason
   - Optional detail: Required high-level category, optional detailed reason
   - Later collection: Capture it during a periodic review, not at every action
4. **Prototype and test:** Build a quick mockup and show it to both the compliance owner and the users
5. **Make the tradeoff explicit:** Document whose needs are being prioritized and why

**Key Principle:** Don't accept the premise. "They want X" often means "They need Y, and they think X is how to get it." Find creative solutions to Y.

---

## Scenario 2: Customers Asking for Incompatible Variations

**Pattern:** Different customers, markets or segments ask for incompatible versions of the same feature.

**Example:** "Customer A requires a manager's approval before anything is published. Customer B wants to publish immediately. Customer C wants it configurable per team."

**Framework Recommendation:** Cynefin + Tradeoff Analysis

**Decision Process:**
1. **Assess complexity:**
   - **Complicated:** The rules differ but the underlying workflow is the same → build a configurable system
   - **Complex:** Unclear how people will use the options → probe with one customer first

2. **Evaluate architecture options:**
   - One workflow with configuration settings
   - Separate code paths per customer (technical debt risk)
   - Phased rollout (ship for one customer, learn, adapt)

3. **Consider strategic factors:**
   - How many more variations are likely this year?
   - Is this a one-time divergence or an emerging pattern?
   - What's the cost of refactoring later vs. building flexibly now?

4. **Make the architecture decision** (an example rule of thumb; agree the real cut-offs with engineering):
   - A couple of variations: separate flows, revisit if the pattern grows
   - A handful: a configuration system
   - Many, and still growing: invest in a flexible workflow engine

**Key Principle:** Optimize for the future you're likely to face, not the future you fear. Premature generalization creates technical debt too.

---

## Scenario 3: Technical Debt vs. New Features

**Pattern:** Engineering warns that a feature will increase technical debt, but stakeholders want the feature now.

**Example:** "We can hack bulk export into the current system in 2 weeks, but it'll make the planned data-layer refactor much harder. Or we can wait 3 months and do it properly after the refactor."

**Framework Recommendation:** RICE + Multi-Criteria Decision Matrix

**Decision Process:**
1. **Quantify the feature value:**
   - Run RICE on the feature itself
   - What's the cost of waiting 3 months?
   - Is there a contractual or regulatory deadline?

2. **Quantify the technical debt:**
   - How much harder does this make the refactor? (effort multiplier)
   - Does it create compliance or security risk?
   - How long will this "temporary" solution stay in production?

3. **Calculate total cost:**
   - Quick hack: 2 weeks now + extra refactor effort later (ask engineering for the number)
   - Proper approach: 3 months' wait + proper implementation
   - Include the opportunity cost of delaying

4. **Criteria beyond effort:**
   - Stakeholder commitments (did we promise this?)
   - Team morale (is the team burned out on hacks?)
   - Market timing (does this enable a major launch?)

**Decision Matrix Example** (weights in brackets, scores 1–10 where 10 is best; weighted totals: hack 276, wait 255 of a possible 400):

| Option | User Value (9) | Effort (7) | Tech Debt (8) | Strategic Timing (10) | Team Health (6) |
|--------|----------------|------------|---------------|----------------------|----------------|
| Hack it now | 8 | 8 | 3 | 10 | 4 |
| Wait for refactor | 7 | 6 | 9 | 3 | 8 |

The totals are within 8% of each other, close enough that the matrix doesn't decide this one; the size of the refactor penalty does.

**Key Principle:** The right answer depends on whether "this will make the refactor harder" means 10% harder or 300% harder. Get engineering to quantify.

---

## Scenario 4: Feature Request from a Single Large Customer

**Pattern:** Your largest customer requests a feature. Build for one or generalize for all?

**Example:** "Our largest customer wants automated year-end reports in their own format. No one else has asked, but a change in their industry's rules might make others need it next year."

**Framework Recommendation:** RICE + Cynefin (Complex Context)

**Decision Process:**
1. **Assess reach and impact:**
   - Current: Only the requester benefits (limited reach)
   - Future: Many customers might benefit (high reach if the rule change happens)
   - Uncertainty: When will others need this? How confident are you?

2. **Probe before committing:**
   - Build a requester-specific MVP quickly
   - Learn from their usage patterns
   - Generalize later when others adopt

3. **Consider strategic value:**
   - Does this strengthen the relationship with a key customer?
   - Does this position us for the coming change?
   - Does this create competitive advantage?

4. **Decide the approach:**
   - If the requester is paying for development: build specific, generalize later if needed
   - If we're funding it: build generalized only if others have expressed interest
   - If uncertain: probe with a minimal requester-specific version and watch for signals

**Key Principle:** In complex environments, probe before building. Don't build the general solution for a problem only one customer has.

---

## Scenario 5: Convenience vs. Auditability

**Pattern:** A feature users want could, in theory, be misused or weaken the record of what happened.

**Example:** "Users want 'undo' on approvals to fix mistakes. The compliance owner worries it could be used to approve something, act on it, then quietly reverse it."

**Framework Recommendation:** Risk Matrix + Human-Centered Design

**Decision Process:**
1. **Identify the specific risks:**
   - Audit trail integrity (can we track undo events?)
   - Misuse scenarios (what could a bad actor do?)
   - Legitimate use cases (what share of undos are honest mistakes?)

2. **Design for auditability first:**
   - Undo creates a new audit event (never a deletion)
   - Undo requires a reason, and an approver for sensitive items
   - Undo has a time window
   - Undo is highly visible to reviewers

3. **Pilot with a controlled rollout:**
   - Enable for a subset of users first
   - Monitor for misuse patterns
   - Gather feedback from the compliance owner

4. **Make the go/no-go decision** (agree the thresholds with the compliance owner *before* the pilot starts):
   - Misuse below the agreed threshold: expand to everyone
   - Audit concerns raised: add safeguards
   - Misuse widespread: shut it down and learn from it

**Decision Matrix** (illustrative scores, 10 = best):

| Option | User Value | Compliance Risk | Audit Impact | Implementation Effort |
|--------|-----------|----------------|--------------|----------------------|
| No undo (status quo) | 2 | 10 (safe) | 10 (clean) | 10 (no effort) |
| Undo with audit log | 8 | 7 (controlled) | 8 (traceable) | 5 (moderate effort) |
| Undo with approval workflow | 7 | 9 (very safe) | 7 (complex) | 3 (high effort) |

**Key Principle:** In regulated or high-trust products, build auditability into the feature from day one. "We can't allow X because of compliance risk" often means "We haven't designed X to be auditable yet."

---

## Scenario 6: Prioritization with Multiple Stakeholders

**Pattern:** Product, Engineering, Sales and Customer Success all want different things. You can't do everything.

**Example:**
- Product: Wants a mobile app
- Engineering: Wants to refactor the data layer
- Sales: Wants a white-label option for new markets
- Customer Success: Wants better reporting

**Framework Recommendation:** RAPID + RICE + MoSCoW

**Decision Process:**
1. **Clarify decision roles (RAPID):**
   - Recommend: Product leadership (does the analysis and brings the proposal)
   - Agree: Only those with formal sign-off, such as Legal or Security when the work touches their area
   - Perform: Engineering, Design
   - Input: Engineering (feasibility and cost), Sales, Customer Success, key customers
   - Decide: Head of Product or CEO

2. **Score each initiative with RICE:**
   - Ask each stakeholder for Reach, Impact, Confidence and Effort estimates
   - Make assumptions explicit

3. **Apply MoSCoW to create tiers:**
   - Must Have: Required for compliance or a committed launch
   - Should Have: High RICE scores, strategic value
   - Could Have: Good ideas, not urgent
   - Won't Have: Below the cut line for this quarter

4. **Hold a single decision meeting:**
   - The Recommender presents the RICE scores and the recommendation
   - Agree roles sign off or raise a blocking concern, which goes back to the Recommender or up to the Decider
   - Input roles voice opinions but don't vote
   - The Decider makes the final call and documents the rationale

**Key Principle:** Decision paralysis comes from unclear authority. RAPID clarifies who owns the decision, which enables faster, clearer outcomes even when stakeholders disagree.

---

## Meta-Pattern: When to Use Which Framework

**Quick Reference:**

| Situation | Framework |
|-----------|-----------|
| Fast iteration under time pressure | OODA Loop |
| Unclear if problem is simple or complex | Cynefin |
| Competing options with several criteria | Multi-Criteria Decision Matrix |
| Feature prioritization, roadmap planning | RICE |
| Unclear user needs | Human-Centered Design |
| Unclear decision ownership | RAPID |
| Scope negotiation with stakeholders | MoSCoW |
| Design tension (UX vs. feasibility) | Common design tradeoffs (SKILL.md) |
