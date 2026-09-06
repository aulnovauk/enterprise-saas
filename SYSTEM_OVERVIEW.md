# E-SAMMP - EESL Solar Asset Management & Monitoring Platform

## System Overview

A comprehensive enterprise SaaS web application for managing solar assets, built for Energy Efficiency Services Limited (EESL).

### Key Features

- **Governance-Focused**: Compliance-driven, reporting-intensive platform
- **Monthly JMR Data**: Operates on Joint Meter Reading data uploaded via CSV files
- **Enterprise-Grade Design**: Professional government-aligned aesthetic

### Design System

- **Primary Color**: Deep Blue (#0B3C5D)
- **Accent Color**: Solar Yellow (#F4B400)
- **Background**: Clean White
- **Typography**: Inter / Roboto
- **Spacing**: 8px system
- **Layout**: Structured grid with high readability

### Navigation Structure

#### Left Sidebar
1. Dashboard
2. JMR Data Management
3. KPI Engine
4. Outage & Loss Analytics
5. Contract & LD Analytics
6. Reports & MIS
7. AI & Trend Analytics
8. Site & Portfolio Management
9. User Management
10. Audit Logs
11. ERP Integration
12. Settings

#### Top Header
- Financial Year selector
- Month selector
- Plant / Cluster filter
- Export button
- User profile dropdown

### Pages

#### 1. Dashboard
- KPI summary cards (Generation, Availability, CUF, Active Outages, LD Amount, PR)
- Monthly generation trend charts
- Outage distribution pie chart
- Plant performance comparison
- Recent alerts and issues

#### 2. JMR Data Management
- Upload JMR data via CSV files or manual entry
- File upload history with validation status
- Daily JMR records viewer
- Data validation and error reporting

#### 3. KPI Engine
- Track key performance indicators across all plants
- Generation performance metrics (PLF, CUF, PR, Specific Yield)
- Availability metrics
- Loss factors analysis
- Monthly trends and plant comparisons

#### 4. Outage & Loss Analytics
- Active outage monitoring
- Energy loss calculations by category
- Monthly energy loss trends
- Recent outage events with severity tracking
- Resolution time analytics

#### 5. Contract & LD Analytics
- Liquidated damages calculation
- Contract compliance tracking
- Plant-wise LD summary
- Contract parameter monitoring
- Monthly LD trends

#### 6. Reports & MIS
- Generated reports library (Monthly, Quarterly)
- Report templates
- Scheduled reports configuration
- Download and share functionality

#### 7. AI & Trend Analytics
- AI-generated insights
- Generation forecasting
- Anomaly detection
- Performance trend analysis
- Predictive maintenance recommendations

#### 8. Site & Portfolio Management
- Plant inventory management
- Technical details and specifications
- Asset tracking
- Location and capacity management

#### 9. User Management
- User directory
- Role-based access control
- Department management
- Activity tracking

#### 10. Audit Logs
- Complete activity tracking
- User action logging
- Security event monitoring
- Compliance reporting

#### 11. ERP Integration
- SAP ERP integration
- Oracle ERP integration
- SCADA system connectivity
- Sync status and history
- Data synchronization management

#### 12. Settings
- General system preferences
- Notification configuration
- Security settings
- Data retention policies
- Backup and export settings

### Technology Stack

- **Frontend**: React 18.3.1
- **Routing**: React Router 7.13.0
- **Styling**: Tailwind CSS 4.1.12
- **Charts**: Recharts 2.15.2
- **Icons**: Lucide React 0.487.0
- **UI Components**: Radix UI primitives

### Data Flow

1. **Monthly JMR Data Upload**: Plant managers upload CSV files with daily generation data
2. **Validation**: System validates data against expected formats and thresholds
3. **KPI Calculation**: Automated calculation of performance indicators
4. **Compliance Check**: Contract parameters evaluated for LD calculation
5. **Report Generation**: Automated monthly and quarterly reports
6. **AI Analytics**: Machine learning models analyze trends and detect anomalies
7. **ERP Sync**: Financial and operational data synchronized with external systems

### User Roles

- **Admin**: Full system access and configuration
- **Plant Manager**: Manage plant data and operations
- **Data Analyst**: View and analyze all data
- **Viewer**: Read-only access to reports

### Compliance & Governance

- All user actions logged for audit trail
- Role-based access control
- Data retention policies
- Contract parameter tracking
- Automated compliance reporting
