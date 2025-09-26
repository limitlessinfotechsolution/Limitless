import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterpriseUserProfile from '../EnterpriseUserProfile';

// Mock data for testing
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  jobTitle: 'Senior Software Engineer',
  department: 'Engineering',
  avatar: 'https://example.com/avatar.jpg',
  joinDate: '2022-01-15',
  lastActive: '2023-06-20',
  bio: 'Passionate developer with 10+ years of experience in building scalable web applications.',
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
  socialLinks: {
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    github: 'https://github.com/johndoe'
  }
};

describe('EnterpriseUserProfile', () => {
  test('renders user profile with correct information', () => {
    render(<EnterpriseUserProfile user={mockUser} />);
    
    expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer', { selector: 'p.text-gray-600' })).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    
    // Check that skills are displayed
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    
    // Check that bio is displayed
    expect(screen.getByText('Passionate developer with 10+ years of experience in building scalable web applications.')).toBeInTheDocument();
  });

  test('shows edit button when editable is true', () => {
    render(<EnterpriseUserProfile user={mockUser} editable={true} />);
    
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  test('hides edit button when editable is false', () => {
    render(<EnterpriseUserProfile user={mockUser} editable={false} />);
    
    expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument();
  });

  test('enters edit mode when edit button is clicked', () => {
    render(<EnterpriseUserProfile user={mockUser} editable={true} />);
    
    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);
    
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    
    // Check that input fields are rendered
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
  });

  test('updates user name when edited in edit mode', () => {
    render(<EnterpriseUserProfile user={mockUser} editable={true} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);
    
    // Change the name
    const nameInput = screen.getByDisplayValue('John Doe');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    
    expect(nameInput).toHaveValue('Jane Doe');
  });

  test('calls onSave when save button is clicked', () => {
    const mockOnSave = jest.fn();
    render(<EnterpriseUserProfile user={mockUser} editable={true} onSave={mockOnSave} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);
    
    // Click save
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith(mockUser);
  });

  test('resets form when cancel button is clicked', () => {
    render(<EnterpriseUserProfile user={mockUser} editable={true} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);
    
    // Change the name
    const nameInput = screen.getByDisplayValue('John Doe');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    
    // Click cancel
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Should be back in view mode
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
  });

  test('adds and removes skills in edit mode', () => {
    render(<EnterpriseUserProfile user={mockUser} editable={true} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);
    
    // Add a new skill
    const skillInput = screen.getByPlaceholderText('Add a skill');
    fireEvent.change(skillInput, { target: { value: 'Python' } });
    
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);
    
    // Should now show Python as a skill
    expect(screen.getByText('Python')).toBeInTheDocument();
    
    // Remove a skill
    const removeButtons = screen.getAllByRole('button', { name: '' });
    // Find the remove button for JavaScript (first skill)
    const jsRemoveButton = removeButtons[0];
    fireEvent.click(jsRemoveButton);
    
    // JavaScript should no longer be in the document
    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
  });

  test('shows default avatar when no avatar is provided', () => {
    const userWithoutAvatar = { ...mockUser, avatar: undefined };
    render(<EnterpriseUserProfile user={userWithoutAvatar} />);
    
    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeInTheDocument();
    // The default avatar should be from ui-avatars.com
    expect(avatar).toHaveAttribute('src', expect.stringContaining('ui-avatars.com'));
  });
});