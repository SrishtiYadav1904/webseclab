import { describe, it, expect } from 'vitest';
import { QUIZ_QUESTIONS } from '../data/quizzes';

describe('WebSecLab Assessment Question Bank', () => {
  it('should contain comprehensive question set', () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(12);
  });

  it('all questions must have valid options and valid correct answer indices', () => {
    QUIZ_QUESTIONS.forEach(q => {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctAnswerIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctAnswerIndex).toBeLessThan(q.options.length);
      expect(q.explanation).toBeTruthy();
    });
  });

  it('covers all security domains', () => {
    const categories = new Set(QUIZ_QUESTIONS.map(q => q.labCategory));
    expect(categories.has('XSS')).toBe(true);
    expect(categories.has('SQL Injection')).toBe(true);
    expect(categories.has('CSRF')).toBe(true);
    expect(categories.has('Authentication')).toBe(true);
    expect(categories.has('Access Control')).toBe(true);
    expect(categories.has('File Security')).toBe(true);
    expect(categories.has('Security Headers')).toBe(true);
    expect(categories.has('Security Tools')).toBe(true);
  });
});
