# Test Fixes Implementation TODO

## API Tests
- [ ] Fix app/api/__tests__/pages-simple.test.ts - Update Supabase mock to use mockImplementation for accurate query chaining (select with args, eq with args, order with args)

## Configuration
- [ ] Update jest.config.cjs - Ensure transformIgnorePatterns includes all necessary ES modules (e.g., expand if needed)

## Missing Files
- [ ] Create src/config/uiConfig.ts - Basic UI configuration object
- [ ] Create src/components/ui/EnterprisePricing.tsx - Basic pricing component

## Component Tests
- [ ] Fix src/components/ui/__tests__/EnterpriseChat.test.tsx - Remove invalid currentUser prop
- [ ] Fix src/components/ui/__tests__/EnterpriseDataGrid.test.tsx - Ensure proper export
- [ ] Fix src/components/ui/__tests__/Toast.test.tsx - Fix onClose callback test
- [ ] Fix src/components/common/__tests__/ErrorBoundary.test.tsx - Update text expectations
- [ ] Fix src/components/ui/__tests__/EnterpriseCalendar.test.tsx - Make queries more specific

## Hook Tests
- [ ] Fix src/hooks/__tests__/useTheme.test.ts - Mock window.matchMedia

## Supabase Client Tests
- [ ] Fix src/lib/__tests__/supabaseClient.test.ts - Ensure proxy lazy loading triggers correctly in tests

## Verification
- [ ] Run tests to verify all fixes
- [ ] Update TODO_TEST_FIXES.md with completed items
