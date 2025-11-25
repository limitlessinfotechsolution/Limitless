# Test Fixes Steps

## 1. Fix Jest Configuration and Setup
- [x] Update jest.config.cjs transformIgnorePatterns for better ESM support
- [x] Fix NextRequest/Request mocking in jest.setup.js (url property getter)
- [x] Improve Supabase client mocking (onAuthStateChange structure)
- [x] Add createSupabaseClient to global mock in jest.setup.js

## 2. Create Missing Components
- [x] Create EnterpriseForm component in src/components/ui/
- [x] Create ErrorBoundary component in src/components/common/

## 3. Fix Component Tests
- [x] Fix EnterpriseChat test: Update Card mock to spread props
- [ ] Fix EnterpriseCalendar test: Update test to match placeholder or implement component
- [ ] Fix EnterpriseDataGrid test: Update test to match placeholder or implement component
- [ ] Fix EnterprisePage test: Fix ESM import issues
- [ ] Fix Toast test: Fix act warnings
- [ ] Fix ProfessionalInnovative test: Add missing uiConfig
- [ ] Fix EnterpriseComponents test: Add missing EnterpriseForm

## 4. Fix Hook Tests
- [ ] Fix useTheme test: Ensure window.matchMedia is properly mocked
- [ ] Fix useAuth test: Fix destructuring issues

## 5. Fix API Tests
- [x] Fix pages-simple.test.ts: Add NextResponse mock
- [ ] Fix testimonials route test: Add NextResponse mock
- [ ] Update pages.test.ts if needed

## 6. Fix Library Tests
- [ ] Fix supabaseClient test: Handle createSupabaseClient import
- [ ] Fix logger test if needed

## 7. Run Tests and Verify
- [ ] Run all tests to ensure fixes work
- [ ] Update any remaining failing tests
