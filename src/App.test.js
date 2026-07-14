import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the premium ministry homepage experience', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/faith-led spaces for lasting impact/i)).toBeInTheDocument();
});

test('renders the sermons page from the route', () => {
  render(
    <MemoryRouter initialEntries={['/sermons']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/recent sermons/i)).toBeInTheDocument();
});
