import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('WebSecLab App Navigation & Routing', () => {
  it('renders landing page with headline and navigation links', () => {
    render(<App />);

    expect(screen.getByText(/Master Web Application Security/i)).toBeInTheDocument();
    expect(screen.getByText(/Lab Catalogue/i)).toBeInTheDocument();
    expect(screen.getByText(/Student Dashboard/i, { selector: 'a, span' })).toBeInTheDocument();
  });

  it('can navigate to lab catalogue and filter labs', async () => {
    render(<App />);

    // Click Lab Catalogue link
    const labCatalogueLink = screen.getAllByRole('link', { name: /Lab Catalogue/i })[0];
    fireEvent.click(labCatalogueLink);

    expect(screen.getByText(/Virtual Security Lab Catalogue/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Cross-Site Scripting \(XSS\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/SQL Injection \(SQLi\)/i).length).toBeGreaterThanOrEqual(1);

    // Type in search box
    const searchInput = screen.getByPlaceholderText(/Search labs by vulnerability/i);
    fireEvent.change(searchInput, { target: { value: 'Nikto' } });

    expect(screen.getByText(/Web Server Scanning with Nikto/i)).toBeInTheDocument();
  });
});
