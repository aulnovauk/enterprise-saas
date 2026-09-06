Design a full enterprise-grade JMR Data Management module 
for a Solar Asset Management SaaS platform (E-SAMMP).

This module captures certified Monthly Joint Measurement Report (JMR) data.

This is a governance-critical module.
It must look secure, structured, workflow-driven, and audit-compliant.

Theme:
- Navy sidebar
- White workspace
- Green = approved
- Yellow = pending
- Red = rejected
- Compact enterprise layout
- PSU-grade seriousness

==================================================
GLOBAL HEADER
==================================================

Top Filters:
- Financial Year dropdown
- Month selector
- State filter
- Plant selector
- Vendor filter
- PPA Type filter

Show:
- Submission Status
- Approval Status
- Lock Status
- Last Modified Timestamp

==================================================
TAB STRUCTURE
==================================================

Create 4 primary tabs:

1. Manual Entry
2. Excel Bulk Upload
3. JMR Repository
4. Audit & Version History

==================================================
TAB 1 – MANUAL JMR ENTRY
==================================================

SECTION 1 – PLANT METADATA
- State
- District
- Plant Name
- Capacity (MW)
- COD
- Vendor
- Procurer
- Contract Type (ADB / Domestic etc.)
- PPA Type

SECTION 2 – OPERATIONAL PARAMETERS

Monthly Fields:
- Gross Generation (MWh)
- Net Export Energy
- Import Units
- Grid Availability (%)
- Plant Availability (%)
- Curtailment Units
- Solar Downtime Hours
- Grid Downtime Hours
- Preventive Maintenance Hours
- Breakdown Hours
- Transmission Line Loss
- Reactive Power Withdrawal

SECTION 3 – COMMERCIAL PARAMETERS
- Contractual Target Generation
- Revenue Realized (₹)
- O&M Deviation Data
- Any additional defined parameter

SECTION 4 – AUTO-COMPUTED PREVIEW
Display:
- CUF
- PAF
- Expected Generation
- Revenue Shortfall
- LD Risk Indicator

All computed live (read-only preview).

SECTION 5 – VALIDATION PANEL
- Field-level validation
- Threshold warnings
- Missing mandatory data alerts
- Logical consistency check

Bottom Action Buttons:
- Save Draft
- Submit for Review
- Reset
- Cancel

==================================================
TAB 2 – EXCEL BULK UPLOAD
==================================================

Include:

- Download Template button
- Drag-and-drop upload zone
- Field mapping preview
- Error highlighting grid
- Invalid row summary
- Bulk validation report

Show:
- Total records uploaded
- Valid records
- Error records
- Duplicate entries
- Warning entries

Actions:
- Fix & Re-upload
- Submit All for Review

==================================================
TAB 3 – DIGITAL JMR REPOSITORY
==================================================

Table View Columns:

- Financial Year
- Month
- Plant
- Vendor
- Gross Generation
- Revenue
- Approval Status
- Lock Status
- Version
- PDF Uploaded (Yes/No)
- Actions

Include:
- Search bar
- Advanced filter
- Sort by plant/state/vendor
- View PDF
- Download
- Compare versions
- Lock record after approval

Status Tags:
- Draft
- Pending Review
- Approved
- Rejected
- Locked

==================================================
TAB 4 – AUDIT & VERSION HISTORY
==================================================

Audit Table Columns:

- Version No
- Modified By
- Role
- Timestamp
- Fields Changed
- Change Summary
- Approval Status
- IP Address

Include:
- Compare Version button
- Rollback option (admin only)
- PDF archive access

==================================================
WORKFLOW PANEL (SIDE PANEL)
==================================================

Display:

Maker:
- Data entered by

Checker:
- Reviewed by

Approver:
- Final approval

Include:
- Approval comment box
- Reject with reason
- Escalation trigger if pending > X days

==================================================
DESIGN RULES
==================================================

- 12-column enterprise grid
- Compact data table
- Financial values use ₹
- Strong compliance emphasis
- Visible locking indicator
- Show last sync status (ERP Ready)

The final design should resemble a 
Certified Government Data Governance System,
not a simple form UI.