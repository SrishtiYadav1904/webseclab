-- =========================================================================
-- WebSecLab Initial Seed Data
-- =========================================================================

-- Seed 8 Lab Definitions
INSERT INTO public.labs (id, slug, title, category, difficulty, points) VALUES
('lab-xss-01', 'cross-site-scripting', 'Cross-Site Scripting (XSS)', 'XSS', 'Beginner', 100),
('lab-sqli-02', 'sql-injection', 'SQL Injection (SQLi)', 'SQL Injection', 'Intermediate', 125),
('lab-csrf-03', 'cross-site-request-forgery', 'Cross-Site Request Forgery (CSRF)', 'CSRF', 'Intermediate', 110),
('lab-auth-04', 'authentication-and-session-security', 'Authentication & Session Security', 'Authentication', 'Intermediate', 110),
('lab-idor-05', 'broken-access-control-idor', 'Broken Access Control & IDOR', 'Access Control', 'Intermediate', 120),
('lab-upload-06', 'file-upload-security', 'File Upload Security', 'File Security', 'Intermediate', 115),
('lab-headers-07', 'security-headers-and-https', 'Security Headers & HTTPS', 'Security Headers', 'Beginner', 95),
('lab-tools-08', 'web-server-scanning-tools', 'Web Server Scanning with Nikto, OWASP ZAP & Burp Suite', 'Security Tools', 'Advanced', 130)
ON CONFLICT (id) DO NOTHING;

-- Seed Gamification Achievements
INSERT INTO public.achievements (id, title, description, icon, category, points) VALUES
('first_blood', 'First Blood', 'Complete your first virtual security lab challenge.', 'Sword', 'completion', 50),
('xss_slayer', 'XSS Slayer', 'Master Cross-Site Scripting defenses and secure DOM APIs.', 'Code', 'mastery', 100),
('sql_defender', 'SQL Defender', 'Neutralize SQL Injection with parameterized queries.', 'Database', 'mastery', 100),
('session_sentinel', 'Session Sentinel', 'Harden session cookies with HttpOnly, Secure, and SameSite.', 'Lock', 'mastery', 100),
('scanner_pro', 'Tool Master', 'Execute scans with Nikto, OWASP ZAP, and inspect traffic in Burp Suite.', 'Terminal', 'mastery', 125),
('pentester_elite', 'WebSecLab Graduate', 'Complete all 8 virtual labs and finish the comprehensive final exam.', 'Award', 'special', 300)
ON CONFLICT (id) DO NOTHING;
