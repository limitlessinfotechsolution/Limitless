# Test Fixes TODO

## Critical Issues
- [ ] Fix NextRequest/Request mocking in jest.setup.js (url property getter issue)
- [ ] Fix Supabase client mocking (onAuthStateChange structure)
- [ ] Create missing EnterpriseForm component
- [ ] Create missing ErrorBoundary component
- [ ] Fix ESM module issues in jest.config.cjs

## Component Implementation Issues
- [ ] Fix EnterpriseReporting component (missing actual implementation)
- [ ] Fix EnterpriseCalendar component (missing actual implementation)
- [ ] Fix EnterpriseDataGrid component (missing actual implementation)
- [ ] Fix EnterpriseChat component (missing actual implementation)
- [ ] Fix EnterprisePage component (ESM import issues)

## Test-Specific Issues
- [ ] Fix Toast test act warnings
- [ ] Fix ThemeProvider window.matchMedia mocking
- [ ] Fix useAuth hook destructuring issues
- [ ] Fix supabaseClient test mocking

## Configuration Updates
- [ ] Update jest.config.cjs transformIgnorePatterns
- [ ] Improve jest.setup.js mocks
