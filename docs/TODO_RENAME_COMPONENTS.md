# Rename Enterprise Components to Simplified Names

## Steps to Complete

### 1. Update Exports in src/components/ui/enterprise.ts
- Change export statements for all target components (Team, Chat, Calendar, Analytics, Dashboard, KPI, Pricing)
- Update from `export { default as EnterpriseTeam }` to `export { default as Team }`, etc.

### 2. Update Page Files (app/enterprise/*/page.tsx)
- **team/page.tsx**: Update import and usage of EnterpriseTeam to Team
- **chat/page.tsx**: Update import and usage of EnterpriseChat to Chat
- **calendar/page.tsx**: Update import and usage of EnterpriseCalendar to Calendar
- **analytics/page.tsx**: Update import and usage of EnterpriseAnalytics to Analytics
- **dashboard/page.tsx**: Update import and usage of EnterpriseDashboard to Dashboard, and EnterpriseKPI to KPI
- **pricing/page.tsx**: Update import and usage of EnterprisePricing to Pricing

### 3. Update Demo Files
- **EnterpriseSuiteDemo.tsx**: Update imports and usages
- **EnterpriseExample.tsx**: Update imports and usages
- **EnterpriseDemo.tsx**: Update imports and usages

### 4. Rename Component Files and Update Content
- Rename src/components/enterprise/EnterpriseTeam.tsx to Team.tsx and update component name/interface/export
- Rename src/components/enterprise/EnterpriseChat.tsx to Chat.tsx and update component name/interface/export
- Rename src/components/enterprise/EnterpriseCalendar.tsx to Calendar.tsx and update component name/interface/export
- Rename src/components/enterprise/EnterpriseAnalytics.tsx to Analytics.tsx and update component name/interface/export
- Rename src/components/enterprise/EnterpriseDashboard.tsx to Dashboard.tsx and update component name/interface/export
- Rename src/components/enterprise/EnterpriseKPI.tsx to KPI.tsx and update component name/interface/export
- Rename src/components/enterprise/EnterprisePricing.tsx to Pricing.tsx and update component name/interface/export

### 5. Update Documentation and References
- Update TODO.md references
- Update src/components/ui/ENTERPRISE_COMPONENTS.md references

### 6. Verification
- Run development server to ensure no broken imports
- Check for any remaining references using search
