import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import SearchAllPitches from '../components/pitches/SearchAllPitches';

jest.mock('axios');

describe('SearchAllPitches', () => {
  it('fetches and renders pitches from Symfony API', async () => {
    const mockedResponse = {
      data: {
        'hydra:member': [
          { id: 1, name: 'Pitch 1' },
          { id: 2, name: 'Pitch 2' },
        ],
      },
    };

    axios.get.mockResolvedValue(mockedResponse);

    render(<SearchAllPitches />);

    await waitFor(() => screen.getByText('Pitch 1'));

    expect(screen.getByText('Pitch 1')).toBeInTheDocument();
    expect(screen.getByText('Pitch 2')).toBeInTheDocument();

    expect(axios.get).toHaveBeenCalledWith('/api/grounds?page=1&isApproved=true');
  });
});
