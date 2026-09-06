Design a full enterprise-grade KPI Computation Engine module 
for a Solar Asset Management SaaS platform (E-SAMMP).

This is NOT just a KPI display page.
This is a contractual KPI configuration and governance engine.

Theme:
- Navy sidebar
- White workspace
- Green = compliant
- Red = non-compliant
- Yellow = warning
- Enterprise dense layout
- Professional PSU-style UI
- Minimal decorative elements
- Data-heavy presentation

==================================================
GLOBAL FILTER BAR (TOP)
==================================================

Include:
- Financial Year dropdown
- Month selector
- Plant / Cluster / Portfolio selector
- PPA Type selector
- KPI Category filter
- Duration toggle: Monthly / MTD / YTD / Annual
- Export button

==================================================
LEFT PANEL – KPI LIST
==================================================

Search bar: “Search KPIs…”

Group KPIs by category:

1. Operational KPIs
   - CUF
   - Grid Availability (GA)
   - Plant Availability (PA)
   - Plant Available Factor (PAF)
   - Transmission Line Loss (TLL)
   - Reactive Power Withdrawal
   - Curtailment Loss
   - Lost Production Index (LPI)

2. Commercial KPIs
   - Revenue Realization
   - Revenue Shortfall
   - O&M Deviation
   - Liquidated Damages (LD)
   - ROI
   - Payback Period

3. AI / Predictive KPIs
   - Degradation Ratio (PDR)
   - Forecasted Generation
   - Curtailment Pattern Analysis

Each KPI card must show:
- KPI Name
- Current Value
- Target Benchmark
- Compliance badge (Compliant / Warning / Non-Compliant)
- MoM % change
- Small trend sparkline
- LD Risk indicator (if applicable)

==================================================
KPI DETAIL VIEW (MAIN PANEL)
==================================================

When a KPI is clicked, open detailed governance view.

HEADER SECTION:
- KPI Name
- Category
- PPA Type applied
- Effective Version
- Compliance Status
- Impacted Plants count

PERFORMANCE CARDS:
- Current Value
- Target Benchmark
- Deviation %
- Revenue Impact (₹)
- LD Risk Estimate (₹)
- Benchmark Source (Contract Clause Reference)

TREND SECTION:
- 12-Month Line Chart
- MoM comparison
- YoY comparison

BREAKDOWN SECTION:
- Plant-wise comparison table
- Cluster-wise comparison
- Vendor ranking table

WATERFALL ANALYSIS (if applicable):
Budgeted → Expected → Actual → Evacuated

==================================================
FORMULA BUILDER INTERFACE
==================================================

When clicking “Edit Formula”, open right-side configuration drawer.

Include:

Formula Builder:
- Drag-and-drop parameter blocks
- Mathematical operators (+ - × ÷ %)
- Condition builder (if/else thresholds)
- Tolerance % configuration
- Threshold definition for alerts

Parameter Source Panel:
- JMR fields
- Derived fields
- Contractual parameters
- User-defined parameters

Simulation Panel:
- Preview calculation for last 3 months
- Error validation
- Logical validation check

Effective Date Controls:
- Effective From date
- Version auto-increment
- Change reason field
- Draft / Submit for approval button

==================================================
PPA-SPECIFIC FORMULA MAPPING
==================================================

Create PPA mapping section:

- Select PPA Type
- Map KPI formula to specific PPA
- Enable different formula per contract
- Display active formula version per PPA
- Allow duplication of formula for modification

==================================================
VERSION CONTROL TAB
==================================================

Include table:

- Version Number
- Effective From
- Formula Snapshot (short preview)
- Approved By
- Status (Active / Archived)
- Rollback button

Impact Summary Section:
- Change in Revenue Impact
- Change in LD Exposure
- Change in Compliance %

Audit Trail Section:
- User
- Timestamp
- Action taken
- IP log

==================================================
COMPLIANCE & IMPACT ANALYTICS PANEL
==================================================

Side analytics card showing:

- Total Revenue at Risk
- Total LD Exposure linked to this KPI
- Number of Non-Compliant Plants
- Escalation Trigger status
- Compliance Heatmap (Plants vs KPI)

==================================================
AI EXTENSION (For Predictive KPIs)
==================================================

For KPIs like:
- Degradation Ratio
- Forecasted Generation

Display:
- Model Confidence %
- Predicted vs Actual comparison
- Anomaly detection flag
- AI-generated recommendation text

Label clearly as:
“AI Insight – Based on Historical Monthly Dataset”

==================================================
DESIGN INSTRUCTIONS
==================================================

- Use compact tables
- Use enterprise grid system (12-column layout)
- Avoid excessive whitespace
- Focus on governance clarity
- Show realistic dummy data (220 MW portfolio, 45 plants)
- Use rupee symbol ₹ for financial impact
- Ensure drill-down capability
- Ensure professional PSU-grade presentation

The final design should resemble a contractual performance governance engine,
not just a monitoring dashboard.