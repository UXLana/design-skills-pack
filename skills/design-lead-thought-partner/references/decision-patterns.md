# Common Decision Scenarios

This document captures recurring decision patterns specific to regulated software environments serving both government agencies and regulated businesses.

## Scenario 1: Regulatory Requirement vs. User Experience

**Pattern:** A regulator requests a feature or data field that adds friction for the operators who use the product.

**Example:** "The agency wants a reason code on every inventory disposal event. Operators say this adds 30 seconds per item and they dispose of hundreds at once."

**Framework Recommendation:** Multi-Criteria Decision Matrix + Human-Centered Design

**Decision Process:**
1. **Understand the regulatory intent:** Why does the agency need this data? Is it for audits, policy analysis, or enforcement? Can the need be met another way?
2. **Quantify the user pain:** How many operators? How often? What's the time cost? Interview actual users.
3. **Explore creative solutions:**
   - Bulk operations: Apply disposal reason to multiple items at once
   - Smart defaults: Remember last-used reason code
   - Optional detail: Required high-level category, optional detailed reason
   - Audit-time collection: Collect during inspections, not real-time entry
4. **Prototype and test:** Build quick mockup, show to both regulators and operators
5. **Make the tradeoff explicit:** Document which stakeholder's needs are being prioritized and why

**Key Principle:** Don't accept the premise. "Regulators want X" often means "Regulators need Y, and they think X is how to get it." Find creative solutions to Y.

---

## Scenario 2: Multi-Jurisdiction Feature Divergence

**Pattern:** Different jurisdictions request incompatible variations of the same feature.

**Example:** "Jurisdiction A requires lab test results before a product can ship. Jurisdiction B allows shipping with results pending. Jurisdiction C wants both options selectable per license."

**Framework Recommendation:** Cynefin + Tradeoff Analysis

**Decision Process:**
1. **Assess complexity:**
   - **Complicated:** Jurisdictions have different rules but underlying workflow is similar → Build configurable system
   - **Complex:** Unclear how users will adapt to options → Probe with pilots in one jurisdiction first
   
2. **Evaluate architecture options:**
   - Unified workflow with configuration flags
   - Separate code paths per jurisdiction (technical debt risk)
   - Phased rollout (ship one jurisdiction, learn, adapt)
   
3. **Consider strategic factors:**
   - How many more jurisdictions will we add this year?
   - Is this a one-time divergence or emerging pattern?
   - What's the cost of refactoring later vs. building flexibly now?
   
4. **Make architecture decision:**
   - If <3 jurisdictions: Separate flows, revisit if pattern emerges
   - If 3-5 jurisdictions: Configuration system
   - If >5 jurisdictions: Invest in flexible workflow engine

**Key Principle:** Optimize for the future you're likely to face, not the future you fear. Premature generalization creates technical debt too.

---

## Scenario 3: Technical Debt vs. New Features

**Pattern:** Engineering warns that a feature will increase technical debt, but stakeholders want the feature now.

**Example:** "We can hack the batch recall feature into the current system in 2 weeks, but it'll make the planned inventory refactor much harder. Or we can wait 3 months to do it properly after the refactor."

**Framework Recommendation:** RICE + Multi-Criteria Decision Matrix

**Decision Process:**
1. **Quantify the feature value:**
   - Run RICE on the feature itself
   - What's the cost of waiting 3 months?
   - Is there a regulatory deadline?
   
2. **Quantify the technical debt:**
   - How much harder does this make the refactor? (effort multiplier)
   - Does it create compliance/security risk?
   - How long will this "temporary" solution stay in production?
   
3. **Calculate total cost:**
   - Quick hack: 2 weeks now + 4 weeks extra refactor later = 6 weeks total
   - Proper approach: 3 months wait + proper implementation
   - Include opportunity cost of delaying
   
4. **Criteria beyond effort:**
   - Stakeholder commitments (did we promise this?)
   - Team morale (is the team burned out on hacks?)
   - Market timing (does this enable a major market launch?)

**Decision Matrix Example:**

| Option | User Value (9) | Effort (7) | Tech Debt (8) | Strategic Timing (10) | Team Health (6) |
|--------|----------------|------------|---------------|----------------------|----------------|
| Hack it now | 8 | 8 | 3 | 10 | 4 |
| Wait for refactor | 7 | 6 | 9 | 3 | 8 |

**Key Principle:** The right answer depends on whether "this will make refactor harder" means 10% harder or 300% harder. Get engineering to quantify.

---

## Scenario 4: Crisis Response (System Outage)

**Pattern:** Production system serving multiple jurisdictions goes down. Pressure to restore service immediately.

**Framework Recommendation:** OODA Loop + Chaotic Context (Cynefin)

**Decision Process:**
1. **Act First (Establish Order):**
   - Failover to backup systems if available
   - Communicate status to affected customers and agencies immediately
   - Isolate affected systems to prevent cascade
   
2. **Observe (Gather Data):**
   - Which jurisdictions are affected? Which customers impacted?
   - What broke? What changed recently?
   - Can we restore partial service?
   
3. **Orient (Analyze Context):**
   - Is this a known issue with a known fix?
   - Is this a novel failure requiring investigation?
   - What's the compliance/legal exposure?
   
4. **Decide (Choose Action):**
   - Rollback recent changes
   - Apply emergency patch
   - Redirect traffic to alternate infrastructure
   
5. **Loop Back:**
   - Monitor for stability
   - If still failing, iterate faster

**Communication Cadence:**
- **First 15 minutes:** "We're aware, investigating, ETA TBD"
- **Every 30 minutes:** Status update, even if no progress
- **When restored:** Root cause summary, prevention plan

**Key Principle:** In chaos, speed matters more than perfection. Stabilize first, understand later, prevent recurrence eventually.

---

## Scenario 5: Feature Request from a Single Large Customer

**Pattern:** Your largest customer or jurisdiction requests a feature. Build for one or generalize for all?

**Example:** "Your largest jurisdiction wants automated manifest generation for cross-border transfers. No other jurisdiction allows cross-border transfers yet, but a pending policy change might enable it."

**Framework Recommendation:** RICE + Cynefin (Complex Context)

**Decision Process:**
1. **Assess reach and impact:**
   - Current: Only the requester benefits (limited reach)
   - Future: Many jurisdictions might benefit (high reach if the policy change happens)
   - Uncertainty: When will others need this? 50% confidence?
   
2. **Probe before committing:**
   - Build a requester-specific MVP quickly
   - Learn from their usage patterns
   - Generalize later when others adopt
   
3. **Consider strategic value:**
   - Does this strengthen the relationship with a key partner?
   - Does this position us for coming policy changes?
   - Does this create competitive advantage?
   
4. **Decide architecture approach:**
   - If the requester is paying for development: Build specific, generalize later if needed
   - If we're funding: Build generalized only if 2+ others express interest
   - If uncertain: Probe with a minimal requester-specific version, watch for signals

**Key Principle:** In complex environments, probe before building. Don't build the general solution for a problem only one customer has.

---

## Scenario 6: Compliance Risk Trade-offs

**Pattern:** A feature could theoretically enable compliance violations or data integrity issues.

**Example:** "Operators want 'undo' for inventory transfers to fix mistakes. Regulators worried about abuse: transferring to hide audit findings, then undoing."

**Framework Recommendation:** Risk Matrix + Human-Centered Design

**Decision Process:**
1. **Identify the specific risks:**
   - Audit trail integrity (can we track undo events?)
   - Abuse scenarios (what could bad actors do?)
   - Legitimate use cases (what % of undos are honest mistakes?)
   
2. **Design for auditability first:**
   - Undo creates a new audit log event (not deletion)
   - Undo requires reason code + manager approval
   - Undo has time window (only within 24 hours)
   - Undo is highly visible in inspection views
   
3. **Pilot with controlled rollout:**
   - Enable for subset of trusted operators first
   - Monitor for abuse patterns
   - Gather feedback from regulators during audits
   
4. **Make go/no-go decision:**
   - If pilot shows <5% abuse rate: Expand to all operators
   - If regulators report audit concerns: Add more safeguards
   - If abuse is rampant: Shut it down, learn from failure

**Decision Matrix:**

| Option | User Value | Compliance Risk | Audit Impact | Implementation Effort |
|--------|-----------|----------------|--------------|----------------------|
| No undo (status quo) | 2 | 10 (safe) | 10 (clean) | 10 (no effort) |
| Undo with audit log | 8 | 7 (controlled) | 8 (traceable) | 5 (moderate effort) |
| Undo with approval workflow | 7 | 9 (very safe) | 7 (complex) | 3 (high effort) |

**Key Principle:** In regulated environments, build auditability into the feature from day one. "We can't allow X because of compliance risk" often means "We haven't designed X to be auditable yet."

---

## Scenario 7: Prioritization with Multiple Stakeholders

**Pattern:** Product, Engineering, Sales, and Government Relations all want different things. Can't do everything.

**Example:** 
- Product: Wants mobile app for operators
- Engineering: Wants to refactor database layer
- Sales: Wants white-label option for new markets
- Government Relations: Wants enhanced audit reporting

**Framework Recommendation:** RAPID + RICE + MoSCoW

**Decision Process:**
1. **Clarify decision roles (RAPID):**
   - Recommend: Product Leadership (based on data)
   - Agree: Engineering (on feasibility), Government Relations (on regulatory impact)
   - Perform: Engineering, Design
   - Input: Sales, Customer Success, Agency Partners
   - Decide: Head of Product or CEO
   
2. **Score each initiative with RICE:**
   - Force each stakeholder to provide Reach, Impact, Confidence, Effort estimates
   - Make assumptions explicit
   
3. **Apply MoSCoW to create tiers:**
   - Must Have: Initiatives required for regulatory compliance or major market launches
   - Should Have: High RICE scores, strategic value
   - Could Have: Good ideas, not urgent
   - Won't Have: Below the cut line for this quarter
   
4. **Hold a single decision meeting:**
   - Decide person presents RICE scores + recommendation
   - Agree stakeholders can veto if serious concerns
   - Input stakeholders voice opinions but don't vote
   - Decide person makes final call, documents rationale

**Key Principle:** Decision paralysis comes from unclear authority. RAPID clarifies who owns the decision, which enables faster, clearer outcomes even when stakeholders disagree.

---

## Meta-Pattern: When to Use Which Framework

**Quick Reference:**

| Situation | Framework |
|-----------|-----------|
| Crisis, outage, emergency | OODA Loop |
| Unclear if problem is simple or complex | Cynefin |
| Competing stakeholder priorities | Multi-Criteria Decision Matrix |
| Feature prioritization, roadmap planning | RICE |
| Unclear user needs | Human-Centered Design |
| Unclear decision ownership | RAPID |
| Scope negotiation with stakeholders | MoSCoW |
| Design tension (UX vs. feasibility) | NN/g Design Tradeoffs |
