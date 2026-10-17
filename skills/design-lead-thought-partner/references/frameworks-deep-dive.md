# Frameworks Deep Dive

Extended explanations and case studies for decision-making frameworks.

## Cynefin Framework: Extended Guide

**Origins:** Developed by Dave Snowden at IBM in 1999, refined over two decades. Published in Harvard Business Review (2007) as "A Leader's Framework for Decision Making."

**Core Insight:** The mistake most leaders make is applying the same decision-making approach to all problems. The Cynefin framework helps you match your approach to the problem's complexity.

### The Five Contexts in Detail

#### 1. Clear/Simple Context (Obvious Domain)

**Characteristics:**
- Best practices exist and are well-documented
- Cause-and-effect relationships are visible to everyone
- Right answer is self-evident
- Stable, predictable environment

**Approach:** Sense → Categorize → Respond
1. Sense: Assess the facts
2. Categorize: Identify which known category this belongs to
3. Respond: Apply the established best practice

**Regulated-Software Examples:**
- Updating a button label that users reported as confusing
- Fixing a typo in regulatory text
- Changing a color that doesn't meet accessibility contrast requirements

**Pitfall:** Over-simplifying complex problems. "This seems simple" doesn't mean it is.

#### 2. Complicated Context (Knowable Domain)

**Characteristics:**
- Multiple right answers exist
- Cause-and-effect relationships require analysis or expertise
- May need data, models, or expert consultation
- Predictable once understood

**Approach:** Sense → Analyze → Respond
1. Sense: Gather relevant data
2. Analyze: Involve experts, use analytical methods
3. Respond: Choose from multiple good options

**Regulated-Software Examples:**
- Optimizing database query performance for regulatory reporting
- Choosing between different barcode or RFID encoding schemes
- Selecting an architecture for multi-jurisdiction data isolation

**Key Insight:** Engineering-heavy problems often live here. Get the right experts in the room.

#### 3. Complex Context (Unknowable Domain)

**Characteristics:**
- Cause-and-effect only understood in retrospect
- Emergent patterns, unpredictable outcomes
- No clear path forward at the start
- Requires experimentation

**Approach:** Probe → Sense → Respond
1. Probe: Run safe-to-fail experiments
2. Sense: Look for emerging patterns
3. Respond: Amplify what works, dampen what doesn't

**Regulated-Software Examples:**
- Launching a new workflow for inventory tracking (how will operators actually use it?)
- Introducing a redesigned inspection interface (will it speed up or slow down audits?)
- Rolling out a new feature to a diverse set of jurisdictions (adoption patterns unknown)

**Key Insight:** You can't analyze your way to the answer. You have to try things and learn. Use MVPs, A/B tests, phased rollouts.

#### 4. Chaotic Context (Incoherent Domain)

**Characteristics:**
- No clear cause-and-effect relationships at all
- Rapid, turbulent change
- Immediate action required
- High stress, high stakes

**Approach:** Act → Sense → Respond
1. Act: Take immediate action to establish order
2. Sense: Assess where stability exists
3. Respond: Transform from chaos to complexity (where you can probe-sense-respond)

**Regulated-Software Examples:**
- Critical production system outage affecting multiple jurisdictions
- Security breach requiring immediate lockdown
- Emergency regulatory change with 48-hour compliance deadline

**Key Insight:** This is crisis mode. Stabilize first, understand later. Don't try to analyze or plan—move fast to create stability, then assess.

#### 5. Confused/Disorder Context

**Characteristics:**
- Unclear which of the other four contexts apply
- Multiple competing frameworks fighting for dominance
- Often results from not assessing the situation properly

**Approach:** Break into Parts → Assign to Contexts
1. Decompose the problem into smaller pieces
2. Categorize each piece (Clear/Complicated/Complex/Chaotic)
3. Apply the appropriate approach to each piece

**Regulated-Software Example:**
- "Our system is too slow" could be:
  - Clear: Database indexes missing (apply best practice)
  - Complicated: Query optimization needed (analyze)
  - Complex: User behavior patterns unclear (probe)
  - Chaotic: Production crash causing timeout cascades (act)

### Decision Tree for Framework Selection

```
Is immediate action required to prevent disaster?
├─ YES → Chaotic (Act-Sense-Respond)
└─ NO → Continue

Is the problem well-understood with known solutions?
├─ YES → Clear (Sense-Categorize-Respond)
└─ NO → Continue

Can experts analyze this and find the right answer?
├─ YES → Complicated (Sense-Analyze-Respond)
└─ NO → Complex (Probe-Sense-Respond)

Still uncertain which applies?
└─ Confused (Break into parts)
```

---

## RICE Framework: Extended Guide

**Origins:** Developed by Intercom's product team (Sean McBride) in 2016, now widely adopted in product management.

**Core Insight:** Features compete for limited resources. RICE provides an objective scoring method to compare apples-to-oranges decisions.

### Component Definitions

#### Reach

**Question:** How many people/events/transactions does this impact over a given time period?

**Time Period Convention:**
- Use "per quarter" as default for product features
- Use "per month" for operational improvements
- Use "per year" for strategic initiatives

**Regulated-Software Examples:**
- New transfer workflow: "8,000 transfers per quarter across all jurisdictions"
- Improved barcode scanning UI: "45,000 scan events per quarter"
- Bulk record creation feature: "600 operator accounts × 12 uses per quarter = 7,200 uses"

**Common Mistake:** Counting "all users" when only a subset actually encounters the feature. Be specific about the user segment.

#### Impact

**Question:** How much does this improve outcomes for each person/event?

**Scale:**
- **3 = Massive Impact:** Game-changing, transforms a core workflow, eliminates major pain
- **2 = High Impact:** Significant improvement, saves substantial time/effort
- **1 = Medium Impact:** Noticeable improvement, clear benefit
- **0.5 = Low Impact:** Minor improvement, nice-to-have
- **0.25 = Minimal Impact:** Barely noticeable, edge case

**Regulated-Software Examples:**
- Batch recall feature for contaminated product: **3** (Massive - public health and legal compliance)
- Auto-save on form inputs: **1** (Medium - prevents data loss frustration)
- Tooltip explaining an ID format: **0.5** (Low - minor education value)

**Common Mistake:** Inflating impact scores because "we really want to build this." Be honest about actual user benefit.

#### Confidence

**Question:** How certain are you of your Reach and Impact estimates?

**Scale:**
- **100% = High Confidence:** Strong data, proven patterns, validated assumptions
- **80% = Medium Confidence:** Some data, reasonable estimates, few unknowns
- **50% = Low Confidence:** Mostly guessing, many unknowns, high uncertainty

**Regulated-Software Examples:**
- Optimizing existing high-traffic page: **100%** (we have analytics)
- New feature inspired by competitor: **80%** (educated guess based on their success)
- Experimental workflow with unclear adoption: **50%** (just a hypothesis)

**Why This Matters:** Confidence is your uncertainty tax. A 50% confidence score cuts your RICE score in half. It forces you to acknowledge when you're guessing.

**Common Mistake:** Always using 80% or 100% because admitting uncertainty feels bad. Low confidence scores are valuable signals to do research first.

#### Effort

**Question:** How much work is this, realistically?

**Units:** Person-months (1 person working full-time for 1 month)

**Include:**
- Design time
- Engineering implementation
- QA/testing
- Documentation
- Deployment/rollout coordination

**Regulated-Software Examples:**
- Simple UI text change: **0.1 person-months** (few hours)
- New form with validation: **0.5 person-months** (2 weeks)
- Complex multi-jurisdiction reporting feature: **3 person-months** (one engineer for 3 months)
- Major system re-architecture: **24 person-months** (4 engineers for 6 months)

**Common Mistake:** Underestimating effort by forgetting testing, edge cases, per-jurisdiction variations, and deployment complexity.

### RICE Calculation Example

**Feature:** Automated batch ID generation from parent records

- **Reach:** 12,000 batch creation events per quarter (across all users)
- **Impact:** 1 (Medium - saves manual typing, reduces errors)
- **Confidence:** 80% (we have usage data, but uncertain about error reduction impact)
- **Effort:** 1.5 person-months (moderate complexity)

**RICE Score = (12,000 × 1 × 0.8) / 1.5 = 6,400**

### Interpreting RICE Scores

**Relative, Not Absolute:** RICE scores only matter in comparison to each other. A score of 6,400 means nothing alone—it's only useful when comparing to other features' scores.

**When Scores Are Close:** If two features score within 20% of each other, treat them as tied. Use qualitative factors to break the tie:
- Strategic alignment
- Stakeholder commitments
- Technical dependencies
- Market timing

**When to Override RICE:** Framework provides guidance, not dogma. Valid reasons to deprioritize a high-RICE feature:
- Regulatory deadline trumps score
- Strategic bet on long-term positioning
- Engineering capacity constraints
- External dependencies block progress

---

## Multi-Criteria Decision Matrix: Extended Guide

When multiple factors compete and stakeholders disagree, a weighted decision matrix brings structure to the chaos.

### Step-by-Step Process

#### Step 1: List All Real Options

**Not Just:**
- Do Feature A
- Do Feature B

**But Also Consider:**
- Do both in sequence (A then B)
- Do minimal version of both
- Do neither and invest in C instead
- Do hybrid: combine elements of A and B

**Regulated-Software Example:**

*Problem: Dashboard performance is slow. What to do?*

Options to evaluate:
1. Client-side caching
2. Server-side query optimization
3. Reduced data granularity (aggregate by day instead of hour)
4. Hybrid: Light caching + moderate optimization
5. Do nothing (acknowledge as known constraint)

#### Step 2: Identify Decision Criteria

**Ask:** What actually matters for this decision?

**Common Criteria Categories:**
- **User Value:** User satisfaction, pain relief, feature request volume
- **Business Value:** Revenue impact, cost savings, strategic positioning
- **Technical:** Engineering effort, technical debt, maintainability, scalability
- **Risk:** Compliance risk, security risk, operational risk
- **Timeline:** Time to market, regulatory deadlines
- **Cross-Functional Impact:** Affects other teams, requires coordination

**Regulated-Software Example for Dashboard Performance:**

Criteria:
1. User experience improvement (perceived speed)
2. Engineering effort (person-weeks)
3. Technical debt impact (future maintainability)
4. Compliance risk (any risk to data integrity/auditability?)
5. Multi-jurisdiction applicability (works for all jurisdictions?)

#### Step 3: Weight Each Criterion

**Scale:** 1-10, where 10 = extremely important, 1 = barely matters

**Method:** Do pairwise comparisons or use stakeholder voting.

**Example Weights for Dashboard Performance Decision:**
- User experience improvement: **9** (primary driver)
- Engineering effort: **7** (resource-constrained team)
- Technical debt impact: **6** (maintenance burden matters)
- Compliance risk: **10** (non-negotiable, any risk is disqualifying)
- Multi-jurisdiction applicability: **8** (must work everywhere)

**Total Weight:** 40

#### Step 4: Score Each Option on Each Criterion

**Scale:** 1-10, where 10 = best possible outcome, 1 = worst

**Be Honest:** Not every option scores well on every criterion. That's the point.

**Example Scoring:**

| Option | User Experience (9) | Effort (7) | Tech Debt (6) | Compliance Risk (10) | Multi-Jurisdiction (8) |
|--------|---------------------|------------|---------------|----------------------|-----------------|
| 1. Client-side caching | 8 | 6 | 4 | 9 | 10 |
| 2. Server optimization | 9 | 4 | 8 | 10 | 10 |
| 3. Reduce granularity | 5 | 9 | 7 | 10 | 8 |
| 4. Hybrid (cache + optimize) | 9 | 3 | 5 | 9 | 10 |
| 5. Do nothing | 2 | 10 | 10 | 10 | 10 |

#### Step 5: Calculate Weighted Scores

**Formula:** (Criterion Weight × Option Score) for each cell, then sum across row

**Example:**

**Option 2 (Server optimization):**
- (9 × 9) + (7 × 4) + (6 × 8) + (10 × 10) + (8 × 10)
- = 81 + 28 + 48 + 100 + 80
- = **337**

Full table:

| Option | Weighted Score |
|--------|----------------|
| 1. Client-side caching | 298 |
| 2. Server optimization | **337** ← Winner |
| 3. Reduce granularity | 298 |
| 4. Hybrid | 312 |
| 5. Do nothing | 318 |

#### Step 6: Interpret Results + Qualitative Overlay

**Quantitative Winner:** Server optimization (337)

**But Consider:**
- Options 2, 4, and 5 are within 8% of each other—treat as a three-way tie
- "Do nothing" scores surprisingly high because it has zero compliance risk and zero effort
- Hybrid option nearly matches server optimization but takes 3× the effort

**Qualitative Decision:**
Given the team's limited bandwidth and the small score difference, **server optimization** is the clear choice: best user experience improvement, no compliance risk, reasonable effort, and improves technical debt rather than adding to it.

Document: "We chose server optimization over hybrid approach despite slightly lower score because hybrid requires 3× the engineering effort for only marginal UX improvement. Client-side caching was ruled out due to technical debt concerns."

---

## Additional Frameworks: Quick Reference

### Design Thinking (Nielsen Norman Group / IDEO)

**Six Phases:**
1. **Empathize:** Observe users, understand context
2. **Define:** Frame the problem clearly
3. **Ideate:** Generate multiple solutions
4. **Prototype:** Build quick, cheap versions
5. **Test:** Get user feedback
6. **Implement:** Ship and iterate

**When to Use:** New features, unclear user needs, exploring solution space

**Key Principle:** Fall in love with the problem, not your solution.

### OODA Loop (Observe-Orient-Decide-Act)

**Origin:** Military strategist John Boyd, 1960s

**When to Use:** Fast-moving crises, rapid iteration needed

**Key Insight:** Speed through the loop creates competitive advantage. Don't get stuck overanalyzing.

### MoSCoW Prioritization

**Categories:**
- **Must Have:** Non-negotiable
- **Should Have:** Important, but has workarounds
- **Could Have:** Nice to have
- **Won't Have:** Out of scope

**When to Use:** Scope negotiations, MVP definitions, stakeholder communication

**Key Discipline:** Challenge every "Must Have." Most things are "Should Haves" in disguise.

### RAPID (Bain & Company)

**Roles in Decision-Making:**
- **R - Recommend:** Person who does the analysis
- **A - Agree:** Has veto power
- **P - Perform:** Executes the decision
- **I - Input:** Provides expertise
- **D - Decide:** Makes the final call

**When to Use:** Unclear decision authority, stakeholder bottlenecks, cross-functional projects

**Key Insight:** "Input" does not mean "Decide." Most org confusion comes from conflating these roles.
