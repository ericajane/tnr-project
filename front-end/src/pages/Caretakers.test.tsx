import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import { apiClient } from '../api/client';
import Caretakers from './Caretakers';
import type { Caretaker, Colony } from '../types';

vi.mock('../api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockColony: Colony = {
  id: 'colony-1',
  name: 'Riverside Colony',
  notes: [],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockCaretaker: Caretaker = {
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
  notes: [],
  colonyIds: [],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Each load() call fires two get requests: caretakers then colonies.
function mockLoad(caretakers: Caretaker[], colonies: Colony[] = []) {
  vi.mocked(apiClient.get)
    .mockResolvedValueOnce(caretakers)
    .mockResolvedValueOnce(colonies);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Caretakers page', () => {
  describe('initial render', () => {
    it('shows loading state while fetching', () => {
      vi.mocked(apiClient.get).mockReturnValue(new Promise(() => {}));
      render(<Caretakers />);
      expect(screen.getByText('Loading caretakers…')).toBeInTheDocument();
    });

    it('shows empty state when there are no caretakers', async () => {
      mockLoad([]);
      render(<Caretakers />);
      await screen.findByText('No caretakers yet. Click "+ New Caretaker" to add one.');
    });

    it('renders each caretaker with name, email, phone, and address', async () => {
      mockLoad([mockCaretaker]);
      render(<Caretakers />);
      await screen.findByText('Jane Smith');
      expect(screen.getByText('jane@test.com')).toBeInTheDocument();
      expect(screen.getByText('555-1234')).toBeInTheDocument();
      expect(screen.getByText('123 Main St, Springfield, 12345')).toBeInTheDocument();
    });

    it('renders multiple caretakers', async () => {
      const second: Caretaker = { ...mockCaretaker, id: '2', firstName: 'Bob', lastName: 'Adams', email: 'bob@test.com' };
      mockLoad([mockCaretaker, second]);
      render(<Caretakers />);
      await screen.findByText('Jane Smith');
      expect(screen.getByText('Bob Adams')).toBeInTheDocument();
    });

    it('shows assigned colony names for a caretaker', async () => {
      const caretakerWithColony: Caretaker = { ...mockCaretaker, colonyIds: ['colony-1'] };
      mockLoad([caretakerWithColony], [mockColony]);
      render(<Caretakers />);
      await screen.findByText('Jane Smith');
      expect(screen.getByText('Colonies: Riverside Colony')).toBeInTheDocument();
    });

    it('does not show Colonies line when caretaker has no assigned colonies', async () => {
      mockLoad([mockCaretaker], [mockColony]);
      render(<Caretakers />);
      await screen.findByText('Jane Smith');
      expect(screen.queryByText(/Colonies:/)).not.toBeInTheDocument();
    });
  });

  describe('create form', () => {
    it('shows the create form when "+ New Caretaker" is clicked', async () => {
      const user = userEvent.setup();
      mockLoad([]);
      render(<Caretakers />);
      await screen.findByText(/No caretakers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Caretaker' }));
      expect(screen.getByText('New Caretaker')).toBeInTheDocument();
    });

    it('hides the create form when Cancel is clicked', async () => {
      const user = userEvent.setup();
      mockLoad([]);
      render(<Caretakers />);
      await screen.findByText(/No caretakers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Caretaker' }));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(screen.queryByText('New Caretaker')).not.toBeInTheDocument();
    });

    it('calls POST /caretakers with correct data on submit', async () => {
      const user = userEvent.setup();
      mockLoad([]);
      mockLoad([mockCaretaker]);
      vi.mocked(apiClient.post).mockResolvedValue(mockCaretaker);

      render(<Caretakers />);
      await screen.findByText(/No caretakers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Caretaker' }));

      await user.type(screen.getByPlaceholderText('Jane'), 'Jane');
      await user.type(screen.getByPlaceholderText('Smith'), 'Smith');
      await user.type(screen.getByPlaceholderText('jane@example.com'), 'jane@test.com');
      await user.type(screen.getByPlaceholderText('555-555-5555'), '555-1234');
      await user.type(screen.getByPlaceholderText('123 Main St'), '123 Main St');
      await user.type(screen.getByPlaceholderText('Springfield'), 'Springfield');
      await user.type(screen.getByPlaceholderText('12345'), '12345');

      await user.click(screen.getByRole('button', { name: 'Save caretaker' }));

      expect(vi.mocked(apiClient.post)).toHaveBeenCalledWith('/caretakers', {
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
      mockLoad([]);
      mockLoad([mockCaretaker]);
      vi.mocked(apiClient.post).mockResolvedValue(mockCaretaker);

      render(<Caretakers />);
      await screen.findByText(/No caretakers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Caretaker' }));
      await user.type(screen.getByPlaceholderText('Jane'), 'Jane');
      await user.type(screen.getByPlaceholderText('Smith'), 'Smith');
      await user.type(screen.getByPlaceholderText('jane@example.com'), 'jane@test.com');
      await user.click(screen.getByRole('button', { name: 'Save caretaker' }));

      await screen.findByText('Jane Smith');
      expect(screen.queryByText('New Caretaker')).not.toBeInTheDocument();
    });
  });

  describe('zip code validation', () => {
    it('shows an error for an invalid zip code', async () => {
      const user = userEvent.setup();
      mockLoad([]);
      render(<Caretakers />);
      await screen.findByText(/No caretakers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Caretaker' }));

      await user.type(screen.getByPlaceholderText('Jane'), 'Jane');
      await user.type(screen.getByPlaceholderText('Smith'), 'Smith');
      await user.type(screen.getByPlaceholderText('jane@example.com'), 'jane@test.com');
      await user.type(screen.getByPlaceholderText('12345'), 'BADZIP');

      await user.click(screen.getByRole('button', { name: 'Save caretaker' }));

      expect(screen.getByText('Zip code must be 5 digits (12345) or ZIP+4 format (12345-6789)')).toBeInTheDocument();
      expect(vi.mocked(apiClient.post)).not.toHaveBeenCalled();
    });

    it('accepts a valid 5-digit zip', async () => {
      const user = userEvent.setup();
      mockLoad([]);
      mockLoad([mockCaretaker]);
      vi.mocked(apiClient.post).mockResolvedValue(mockCaretaker);
      render(<Caretakers />);
      await screen.findByText(/No caretakers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Caretaker' }));
      await user.type(screen.getByPlaceholderText('Jane'), 'Jane');
      await user.type(screen.getByPlaceholderText('Smith'), 'Smith');
      await user.type(screen.getByPlaceholderText('jane@example.com'), 'jane@test.com');
      await user.type(screen.getByPlaceholderText('12345'), '90210');
      await user.click(screen.getByRole('button', { name: 'Save caretaker' }));
      expect(screen.queryByText(/Zip code must be/)).not.toBeInTheDocument();
      expect(vi.mocked(apiClient.post)).toHaveBeenCalled();
    });

    it('accepts a valid ZIP+4 zip', async () => {
      const user = userEvent.setup();
      mockLoad([]);
      mockLoad([mockCaretaker]);
      vi.mocked(apiClient.post).mockResolvedValue(mockCaretaker);
      render(<Caretakers />);
      await screen.findByText(/No caretakers yet/);
      await user.click(screen.getByRole('button', { name: '+ New Caretaker' }));
      await user.type(screen.getByPlaceholderText('Jane'), 'Jane');
      await user.type(screen.getByPlaceholderText('Smith'), 'Smith');
      await user.type(screen.getByPlaceholderText('jane@example.com'), 'jane@test.com');
      await user.type(screen.getByPlaceholderText('12345'), '90210-1234');
      await user.click(screen.getByRole('button', { name: 'Save caretaker' }));
      expect(screen.queryByText(/Zip code must be/)).not.toBeInTheDocument();
      expect(vi.mocked(apiClient.post)).toHaveBeenCalled();
    });
  });

  describe('edit form', () => {
    it('shows the inline edit form pre-filled when Edit is clicked', async () => {
      const user = userEvent.setup();
      mockLoad([mockCaretaker]);
      render(<Caretakers />);
      await screen.findByText('Jane Smith');
      await user.click(screen.getByRole('button', { name: 'Edit' }));
      expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Smith')).toBeInTheDocument();
      expect(screen.getByDisplayValue('jane@test.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('555-1234')).toBeInTheDocument();
    });

    it('hides the edit form when Cancel is clicked', async () => {
      const user = userEvent.setup();
      mockLoad([mockCaretaker]);
      render(<Caretakers />);
      await screen.findByText('Jane Smith');
      await user.click(screen.getByRole('button', { name: 'Edit' }));
      // Two "Cancel" buttons are present: the row toggle and the form button.
      // Click the form's Cancel (last one).
      const cancelButtons = screen.getAllByRole('button', { name: 'Cancel' });
      await user.click(cancelButtons[cancelButtons.length - 1]);
      expect(screen.queryByDisplayValue('Jane')).not.toBeInTheDocument();
    });

    it('calls PATCH /caretakers/:id with updated data on submit', async () => {
      const user = userEvent.setup();
      const updated = { ...mockCaretaker, firstName: 'Janet' };
      mockLoad([mockCaretaker]);
      mockLoad([updated]);
      vi.mocked(apiClient.patch).mockResolvedValue(updated);

      render(<Caretakers />);
      await screen.findByText('Jane Smith');
      await user.click(screen.getByRole('button', { name: 'Edit' }));

      const firstNameInput = screen.getByDisplayValue('Jane');
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Janet');

      await user.click(screen.getByRole('button', { name: 'Save changes' }));

      expect(vi.mocked(apiClient.patch)).toHaveBeenCalledWith(
        '/caretakers/1',
        expect.objectContaining({ firstName: 'Janet' }),
      );
    });

    it('closes the edit form and reloads after a successful edit', async () => {
      const user = userEvent.setup();
      const updated = { ...mockCaretaker, firstName: 'Janet' };
      mockLoad([mockCaretaker]);
      mockLoad([updated]);
      vi.mocked(apiClient.patch).mockResolvedValue(updated);

      render(<Caretakers />);
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
