# Test Fixes Plan

## Information Gathered
- Analyzed all failing test files and their corresponding components
- Identified specific issues in each test file
- Understood the component implementations and their expected behavior

## Plan

### 1. Fix Toast.test.tsx
- Issue: Auto-close test uses `act()` incorrectly with `setTimeout`
- Fix: Use `waitFor` instead of `act` for async operations, or properly wrap state updates

### 2. Fix EnterpriseCalendar.test.tsx
- Issue: Test expects "Calendar" but component renders with title prop
- Fix: Update test expectations to match actual component behavior

### 3. Fix ProfessionalInnovative.test.tsx
- Issue: Tests components that don't exist (ProfessionalCard, InnovativeBackground, etc.)
- Fix: Either create the missing components or remove/update the tests

### 4. Fix useTheme.test.ts
- Issue: window.matchMedia mock not working properly
- Fix: Improve the mock implementation

### 5. Fix useAuth.test.ts
- Issue: Incomplete test implementation
- Fix: Add proper test cases for auth functionality

### 6. Fix supabaseClient.test.ts
- Issue: Lazy initialization not properly tested
- Fix: Update test to handle proxy behavior

### 7. Fix logger.test.ts
- Issue: Date format mismatch in expectations
- Fix: Update regex patterns to match actual output

### 8. Fix pages-simple.test.ts
- Issue: NextRequest/NextResponse mocking issues
- Fix: Improve mock setup

### 9. Fix EnterpriseDataGrid.test.tsx
- Issue: Export issues
- Fix: Ensure proper component export

## Dependent Files to be edited
- src/components/ui/__tests__/Toast.test.tsx
- src/components/ui/__tests__/EnterpriseCalendar.test.tsx
- src/components/ui/__tests__/ProfessionalInnovative.test.tsx
- src/hooks/__tests__/useTheme.test.ts
- src/hooks/__tests__/useAuth.test.ts
- src/lib/__tests__/supabaseClient.test.ts
- src/lib/__tests__/logger.test.ts
- app/api/__tests__/pages-simple.test.ts
- src/components/ui/__tests__/EnterpriseDataGrid.test.tsx

## Followup steps
- Run tests after each fix to verify
- Update TODO_TEST_FIXES.md with completed items
- Ensure all tests pass
