export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let strengthScore = 0;

  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    strengthScore += 1;
  }

  // Check maximum length
  if (password.length > 128) {
    errors.push('Password must be no more than 128 characters long');
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    strengthScore += 1;
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    strengthScore += 1;
  }

  // Check for number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    strengthScore += 1;
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    strengthScore += 1;
  }

  // Check for common weak passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    '1234567890', 'password1', 'qwerty123', 'admin123'
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a stronger password');
    strengthScore = 0;
  }

  // Check for sequential characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password should not contain repeated characters');
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong';
  if (strengthScore <= 2 || errors.length > 0) {
    strength = 'weak';
  } else if (strengthScore <= 4) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

export function getPasswordRequirements(): string[] {
  return [
    'At least 8 characters long',
    'At least one uppercase letter',
    'At least one lowercase letter',
    'At least one number',
    'At least one special character',
    'Not a common password',
    'No more than 128 characters'
  ];
}
