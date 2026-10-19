import { describe, it, expect } from 'vitest';
import { LABS, INITIAL_ACHIEVEMENTS } from '../data/labs';

describe('WebSecLab Core Lab Definitions', () => {
  it('should define at least 8 functional laboratory modules', () => {
    expect(LABS.length).toBeGreaterThanOrEqual(8);
  });

  it('should contain all required core AppSec categories', () => {
    const categories = LABS.map(l => l.category);
    expect(categories).toContain('XSS');
    expect(categories).toContain('SQL Injection');
    expect(categories).toContain('CSRF');
    expect(categories).toContain('Authentication');
    expect(categories).toContain('Access Control');
    expect(categories).toContain('File Security');
    expect(categories).toContain('Security Headers');
    expect(categories).toContain('Security Tools');
  });

  it('each lab must provide learning objectives, theory, and code comparison', () => {
    LABS.forEach(lab => {
      expect(lab.id).toBeTruthy();
      expect(lab.slug).toBeTruthy();
      expect(lab.title).toBeTruthy();
      expect(lab.learningObjectives.length).toBeGreaterThanOrEqual(3);
      expect(lab.theory.overview).toBeTruthy();
      expect(lab.theory.attackVector).toBeTruthy();
      expect(lab.theory.impact).toBeTruthy();
      expect(lab.theory.prevention).toBeTruthy();
      expect(lab.codeComparison.vulnerableCode).toBeTruthy();
      expect(lab.codeComparison.secureCode).toBeTruthy();
      expect(lab.hints.length).toBeGreaterThanOrEqual(2);
      expect(lab.remediationGuidance.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should define default initial gamification achievements', () => {
    expect(INITIAL_ACHIEVEMENTS.length).toBeGreaterThanOrEqual(5);
    const achievementIds = INITIAL_ACHIEVEMENTS.map(a => a.id);
    expect(achievementIds).toContain('first_blood');
    expect(achievementIds).toContain('xss_slayer');
    expect(achievementIds).toContain('sql_defender');
  });
});
