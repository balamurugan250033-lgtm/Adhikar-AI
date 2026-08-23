import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the citizen assistance shell', () => {
  render(<App />);
  expect(screen.getAllByText('Adhikar AI').length).toBeGreaterThan(0);
  expect(screen.getByText(/independent citizen-assistance tool/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /skip to content/i })).toBeInTheDocument();
});
