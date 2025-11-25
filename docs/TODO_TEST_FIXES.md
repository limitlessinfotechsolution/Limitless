# Test Fixes TODO

## API Tests
- [ ] Fix app/api/__tests__/pages-simple.test.ts - Correct Supabase query mock chain
- [ ] Fix app/api/testimonials/__tests__/route.test.ts - Fix NextResponse.json mock

## Component Tests
- [ ] Fix src/components/ui/__tests__/EnterpriseChat.test.tsx - Remove invalid currentUser prop
- [ ] Fix src/components/ui/__tests__/EnterpriseDataGrid.test.tsx - Ensure proper export
- [ ] Fix src/components/ui/__tests__/Toast.test.tsx - Fix onClose callback test
- [ ] Fix src/components/common/__tests__/ErrorBoundary.test.tsx - Update text expectations
- [ ] Fix src/components/ui/__tests__/EnterpriseCalendar.test.tsx - Make queries more specific

## Hook Tests
- [ ] Fix src/hooks/__tests__/useTheme.test.ts - Mock window.matchMedia

## Missing Files/Components
- [ ] Create src/config/uiConfig.ts - UI configuration file
- [ ] Create src/components/ui/EnterprisePricing.tsx - Pricing component

## Configuration
- [ ] Update jest.config.cjs - Add transformIgnorePatterns for ES modules

## Verification
- [ ] Run tests to verify all fixes
