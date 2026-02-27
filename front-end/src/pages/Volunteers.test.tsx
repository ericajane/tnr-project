import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import { apiClient } from '../api/client';
import Volunteers from './Volunteers';
import type { Volunteer } from '../types';

vi.mock('../api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockVolunteer: Volunteer = {
  id: '1',
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@test.com',
  phone: '555-1234',
  address: {
    streetNumberAndName: '123 Main St',
    city: 'Springfield',
    zip: '12345',
  },
  active: true,
  notes: [],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Volunteers page', () => {
  describe('initial render', () => {
    it('shows loading state while fetching', () => {
      vi.mocked(apiClient.get).mockReturnValue(new Promise(() => {}));
      render(<Volunteers />);
      expect(screen.getByText('Loading volunteers…')).toBeInTheDocument();
    });

    it('shows empty state when there are no volunteers', async () => {
      vi.mocked(apiClient.get).mockResolvedValue([]);
      render(<Volunteers />);
      await screen.findByText('No volunteers yet. Click "+ New Volunteer" to add one.');
    });

    it('renders each volunteer with name, email, phone, and address', async () => {
      vi.mocked(apiClient.get).mockResolvedValue([mockVolunteer]);
      render(<Volunteers />);
      await screen.findByText('Jane Smith');
      expect(screen.getByText('jane@test.com')).toBeInTheDocument();
      expect(screen.getByText('555-1234')).toBeInTheDocument();
      expect(screen.getByText('123 Main St, Springfield, 12345')).toBeInTheDocument();
    });

    it('renders multiple volunteers sorted by last name', async () => {
      const second: Volunteer = { ...mockVolunteer, id: '2', firstName: 'Bob', lastName: 'Adams', email: 'bob@test.com' };
      vi.mocked(apiClient.get).mockResolvedValue([mockVolunteer, second]);
      render(<Volunteers />);
      await screen.findByText('Jane Smith');
      expect(screen.getByText('Bob Adams')).toBeInTheDocument();
    });
  });

  describe('create form', () => {
    it('shows the create form when "+ New Volunteer" is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(apiClient.get).mockResolvedValue([]);
      render(<Volunteers />);
      await screen.findByText(/No volunteers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Volunteer' }));
      expect(screen.getByText('New Volunteer')).toBeInTheDocument();
    });

    it('hides the create form when Cancel is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(apiClient.get).mockResolvedValue([]);
      render(<Volunteers />);
      await screen.findByText(/No volunteers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Volunteer' }));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(screen.queryByText('New Volunteer')).not.toBeInTheDocument();
    });

    it('calls POST /volunteers with correct data on submit', async () => {
      const user = userEvent.setup();
      vi.mocked(apiClient.get)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockVolunteer]);
      vi.mocked(apiClient.post).mockResolvedValue(mockVolunteer);

      render(<Volunteers />);
      await screen.findByText(/No volunteers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Volunteer' }));

      await user.type(screen.getByPlaceholderText('Jane'), 'Jane');
      await user.type(screen.getByPlaceholderText('Smith'), 'Smith');
      await user.type(screen.getByPlaceholderText('jane@example.com'), 'jane@test.com');
      await user.type(screen.getByPlaceholderText('555-555-5555'), '555-1234');
      await user.type(screen.getByPlaceholderText('123 Main St'), '123 Main St');
      await user.type(screen.getByPlaceholderText('Springfield'), 'Springfield');
      await user.type(screen.getByPlaceholderText('12345'), '12345');

      await user.click(screen.getByRole('button', { name: 'Save volunteer' }));

      expect(vi.mocked(apiClient.post)).toHaveBeenCalledWith('/volunteers', {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@test.com',
        phone: '555-1234',
        address: {
          streetNumberAndName: '123 Main St',
          city: 'Springfield',
          zip: '12345',
        },
      });
    });

    it('closes the form and reloads the list after a successful create', async () => {
      const user = userEvent.setup();
      vi.mocked(apiClient.get)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockVolunteer]);
      vi.mocked(apiClient.post).mockResolvedValue(mockVolunteer);

      render(<Volunteers />);
      await screen.findByText(/No volunteers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Volunteer' }));
      await user.type(screen.getByPlaceholderText('Jane'), 'Jane');
      await user.type(screen.getByPlaceholderText('Smith'), 'Smith');
      await user.type(screen.getByPlaceholderText('jane@example.com'), 'jane@test.com');
      await user.click(screen.getByRole('button', { name: 'Save volunteer' }));

      await screen.findByText('Jane Smith');
      expect(screen.queryByText('New Volunteer')).not.toBeInTheDocument();
    });
  });

  describe('zip code validation', () => {
    it('shows an error for an invalid zip code', async () => {
      const user = userEvent.setup();
      vi.mocked(apiClient.get).mockResolvedValue([]);
      render(<Volunteers />);
      await screen.findByText(/No volunteers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Volunteer' }));

      await user.type(screen.getByPlaceholderText('Jane'), 'Jane');
      await user.type(screen.getByPlaceholderText('Smith'), 'Smith');
      await user.type(screen.getByPlaceholderText('jane@example.com'), 'jane@test.com');
      await user.type(screen.getByPlaceholderText('12345'), 'BADZIP');

      await user.click(screen.getByRole('button', { name: 'Save volunteer' }));

      expect(screen.getByText('Zip code must be 5 digits (12345) or ZIP+4 format (12345-6789)')).toBeInTheDocument();
      expect(vi.mocked(apiClient.post)).not.toHaveBeenCalled();
    });

    it('accepts a valid 5-digit zip', async () => {
      const user = userEvent.setup();
      vi.mocked(apiClient.get).mockResolvedValueOnce([]).mockResolvedValueOnce([mockVolunteer]);
      vi.mocked(apiClient.post).mockResolvedValue(mockVolunteer);
      render(<Volunteers />);
      await screen.findByText(/No volunteers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Volunteer' }));
      await user.type(screen.getByPlaceholderText('Jane'), 'Jane');
      await user.type(screen.getByPlaceholderText('Smith'), 'Smith');
      await user.type(screen.getByPlaceholderText('jane@example.com'), 'jane@test.com');
      await user.type(screen.getByPlaceholderText('12345'), '90210');
      await user.click(screen.getByRole('button', { name: 'Save volunteer' }));
      expect(screen.queryByText(/Zip code must be/)).not.toBeInTheDocument();
      expect(vi.mocked(apiClient.post)).toHaveBeenCalled();
    });

    it('accepts a valid ZIP+4 zip', async () => {
      const user = userEvent.setup();
      vi.mocked(apiClient.get).mockResolvedValueOnce([]).mockResolvedValueOnce([mockVolunteer]);
      vi.mocked(apiClient.post).mockResolvedValue(mockVolunteer);
      render(<Volunteers />);
      await screen.findByText(/No volunteers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Volunteer' }));
      await user.type(screen.getByPlaceholderText('Jane'), 'Jane');
      await user.type(screen.getByPlaceholderText('Smith'), 'Smith');
      await user.type(screen.getByPlaceholderText('jane@example.com'), 'jane@test.com');
      await user.type(screen.getByPlaceholderText('12345'), '90210-1234');
      await user.click(screen.getByRole('button', { name: 'Save volunteer' }));
      expect(screen.queryByText(/Zip code must be/)).not.toBeInTheDocument();
      expect(vi.mocked(apiClient.post)).toHaveBeenCalled();
    });
  });

  describe('edit form', () => {
    it('shows the inline edit form pre-filled when Edit is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(apiClient.get).mockResolvedValue([mockVolunteer]);
      render(<Volunteers />);
      await screen.findByText('Jane Smith');
      await user.click(screen.getByRole('button', { name: 'Edit' }));
      expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Smith')).toBeInTheDocument();
      expect(screen.getByDisplayValue('jane@test.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('555-1234')).toBeInTheDocument();
    });

    it('hides the edit form when Cancel is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(apiClient.get).mockResolvedValue([mockVolunteer]);
      render(<Volunteers />);
      await screen.findByText('Jane Smith');
      await user.click(screen.getByRole('button', { name: 'Edit' }));
      // Two "Cancel" buttons are present: the row toggle and the form button.
      // Click the form's Cancel (last one).
      const cancelButtons = screen.getAllByRole('button', { name: 'Cancel' });
      await user.click(cancelButtons[cancelButtons.length - 1]);
      expect(screen.queryByDisplayValue('Jane')).not.toBeInTheDocument();
    });

    it('calls PATCH /volunteers/:id with updated data on submit', async () => {
      const user = userEvent.setup();
      const updated = { ...mockVolunteer, firstName: 'Janet' };
      vi.mocked(apiClient.get)
        .mockResolvedValueOnce([mockVolunteer])
        .mockResolvedValueOnce([updated]);
      vi.mocked(apiClient.patch).mockResolvedValue(updated);

      render(<Volunteers />);
      await screen.findByText('Jane Smith');
      await user.click(screen.getByRole('button', { name: 'Edit' }));

      const firstNameInput = screen.getByDisplayValue('Jane');
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Janet');

      await user.click(screen.getByRole('button', { name: 'Save changes' }));

      expect(vi.mocked(apiClient.patch)).toHaveBeenCalledWith(
        '/volunteers/1',
        expect.objectContaining({ firstName: 'Janet' }),
      );
    });

    it('closes the edit form and reloads after a successful edit', async () => {
      const user = userEvent.setup();
      const updated = { ...mockVolunteer, firstName: 'Janet' };
      vi.mocked(apiClient.get)
        .mockResolvedValueOnce([mockVolunteer])
        .mockResolvedValueOnce([updated]);
      vi.mocked(apiClient.patch).mockResolvedValue(updated);

      render(<Volunteers />);
      await screen.findByText('Jane Smith');
      await user.click(screen.getByRole('button', { name: 'Edit' }));
      const firstNameInput = screen.getByDisplayValue('Jane');
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Janet');
      await user.click(screen.getByRole('button', { name: 'Save changes' }));

      await screen.findByText('Janet Smith');
      expect(screen.queryByDisplayValue('Janet')).not.toBeInTheDocument();
    });
  });
});
