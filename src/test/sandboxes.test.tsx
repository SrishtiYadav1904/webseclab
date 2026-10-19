import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { XssSandbox } from '../components/sandboxes/XssSandbox';
import { SqlInjectionSandbox } from '../components/sandboxes/SqlInjectionSandbox';
import { CsrfSandbox } from '../components/sandboxes/CsrfSandbox';
import { SecurityHeadersSandbox } from '../components/sandboxes/SecurityHeadersSandbox';

describe('WebSecLab Interactive Sandboxes', () => {
  it('XSS Sandbox renders controls and executes test', () => {
    const onComplete = vi.fn();
    render(<XssSandbox onComplete={onComplete} />);

    expect(screen.getByText(/Interactive Task: Exploit and Remediate Reflected & DOM XSS/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Render in Simulated Web App/i })).toBeInTheDocument();

    // Click render in vulnerable mode
    fireEvent.click(screen.getByRole('button', { name: /Render in Simulated Web App/i }));
    expect(screen.getByText(/JavaScript Execution Triggered!/i)).toBeInTheDocument();
  });

  it('SQL Injection Sandbox simulates authentication bypass', () => {
    const onComplete = vi.fn();
    render(<SqlInjectionSandbox onComplete={onComplete} />);

    expect(screen.getByText(/Interactive Task: Exploit Concatenated Query/i)).toBeInTheDocument();
    const executeBtn = screen.getByRole('button', { name: /Execute Database Query/i });
    expect(executeBtn).toBeInTheDocument();

    fireEvent.click(executeBtn);
    expect(screen.getByText(/AUTHENTICATION BYPASSED!/i)).toBeInTheDocument();
  });

  it('CSRF Sandbox simulates cross-site request and allows enabling anti-CSRF token', () => {
    const onComplete = vi.fn();
    render(<CsrfSandbox onComplete={onComplete} />);

    expect(screen.getByText(/Interactive Task: Simulate Cross-Site Request Forgery/i)).toBeInTheDocument();
    const attackBtn = screen.getByRole('button', { name: /Simulate Victim Clicking Phishing Link/i });
    
    // First run unprotected
    fireEvent.click(attackBtn);
    expect(screen.getByText(/EXPLOIT WORKED!/i)).toBeInTheDocument();

    // Toggle token
    const tokenBtn = screen.getByRole('button', { name: /DISABLED/i });
    fireEvent.click(tokenBtn);

    // Re-run
    fireEvent.click(attackBtn);
    expect(screen.getAllByText(/BLOCKED/i).length).toBeGreaterThanOrEqual(1);
  });

  it('Security Headers Sandbox evaluates grades and allows configuring CSP/HSTS', () => {
    const onComplete = vi.fn();
    render(<SecurityHeadersSandbox onComplete={onComplete} />);

    expect(screen.getByText(/Audit HTTP Response Headers & Achieve Security Grade A\+/i)).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument(); // initial grade
  });
});
