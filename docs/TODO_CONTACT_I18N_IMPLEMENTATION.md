# Contact Page Internationalization Implementation

## Overview
Implement Arabic (ar) language support for the contact page and related components, including form labels, messages, and navigation.

## Current State Analysis
- i18n setup exists in `src/lib/i18n.ts` with support for 'en', 'es', 'en-AE'
- Message files exist for English, Spanish, and English-AE
- Contact form components have hardcoded English text
- Navigation links are hardcoded in English

## Implementation Plan

### 1. Create Arabic Translation File
- Create `src/messages/ar.json` with translations for:
  - Navigation items (Home, About, Services, Portfolio, Contact)
  - Contact form labels and messages
  - Success/error messages
  - Form validation messages

### 2. Update i18n Configuration
- Modify `src/lib/i18n.ts` to include Arabic support
- Update resources object to include 'ar' translations
- Ensure proper RTL support for Arabic

### 3. Update Contact Form Components
- `GeneralInquiryForm.tsx`: Replace hardcoded strings with i18n keys
- `ContactComponent.tsx`: Translate static text and labels
- Add RTL support for Arabic layout

### 4. Update Navigation Component
- `Navigation.tsx`: Use i18n for navigation links
- Ensure proper RTL handling

### 5. Add Language Toggle
- Implement or update language toggle component
- Ensure proper language switching functionality

### 6. Testing
- Test Arabic translations display correctly
- Verify RTL layout works properly
- Test language switching functionality

## Files to Modify
- `src/messages/ar.json` (create)
- `src/lib/i18n.ts`
- `src/components/contact/GeneralInquiryForm.tsx`
- `src/components/contact/ContactComponent.tsx`
- `src/components/common/Navigation.tsx`
- `components/LanguageToggle.tsx` (if exists)

## Dependencies
- react-i18next
- i18next-browser-languagedetector
