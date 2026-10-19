import type { Lab } from '../types';

export const LABS: Lab[] = [
  {
    id: 'lab-xss-01',
    slug: 'cross-site-scripting',
    title: 'Cross-Site Scripting (XSS)',
    category: 'XSS',
    difficulty: 'Beginner',
    estimatedMinutes: 25,
    points: 100,
    summary: 'Explore Reflected, DOM-based, and Stored XSS vectors. Learn safe DOM APIs, contextual output encoding, and Content Security Policy (CSP).',
    description: 'Cross-Site Scripting occurs when an application includes untrusted data in a web page without proper validation or escaping. Attackers exploit XSS to execute malicious scripts in victims’ browsers, steal session cookies, deface sites, or redirect users.',
    learningObjectives: [
      'Understand how user inputs become executable JavaScript in a web page.',
      'Differentiate between Reflected, Stored, and DOM-based XSS.',
      'Identify unsafe DOM sinks (such as innerHTML, document.write, eval).',
      'Implement context-aware output encoding and safe DOM properties (textContent).',
      'Deploy Content Security Policy (CSP) headers as defense-in-depth.'
    ],
    prerequisites: ['Basic HTML & JavaScript', 'HTTP request/response basics'],
    theory: {
      overview: 'XSS vulnerabilities arise when web applications process user-supplied input and render it into the browser DOM without appropriate sanitization or encoding. The browser cannot distinguish executable scripts from trusted application logic.',
      impact: 'Session hijacking via document.cookie theft, credential harvesting through fake login overlays, keylogging, forced client-side actions, and full browser compromise.',
      attackVector: 'Submitting payloads containing script tags (<script>), event handlers (onload, onerror), or JavaScript URI schemes (javascript:) via query parameters, form fields, or stored databases.',
      prevention: 'Never insert untrusted data directly into HTML contexts. Use framework-level automatic escaping, strict DOM APIs like node.textContent, client-side sanitizers like DOMPurify, and restrict execution via CSP script-src directives.'
    },
    codeComparison: {
      vulnerableCode: `// VULNERABLE: Direct HTML injection into DOM sink
function displaySearchResults(query) {
  const resultContainer = document.getElementById('results');
  // Unsanitized query concatenated directly into innerHTML
  resultContainer.innerHTML = '<h3>Results for: ' + query + '</h3>';
}`,
      secureCode: `// SECURE: Safe DOM node creation and text assignment
function displaySearchResults(query) {
  const resultContainer = document.getElementById('results');
  resultContainer.innerHTML = ''; // Clear previous content safely
  
  const heading = document.createElement('h3');
  // textContent treats input strictly as plain text, preventing execution
  heading.textContent = 'Results for: ' + query;
  resultContainer.appendChild(heading);
}`,
      explanation: 'Using textContent ensures the browser treats the input strictly as a string of text rather than parsing HTML tags or executing script elements.'
    },
    hints: [
      { id: 1, text: 'Look for where user-controlled search queries or comments are written directly into innerHTML.', costPoints: 5 },
      { id: 2, text: 'Try testing with an image tag payload that triggers an event: <img src=x onerror=alert(1)>', costPoints: 10 },
      { id: 3, text: 'To fix the vulnerability, replace direct string concatenation inside innerHTML with safe DOM APIs like textContent or DOMPurify.sanitize().', costPoints: 15 }
    ],
    remediationGuidance: [
      'Use textContent or innerText instead of innerHTML when rendering text.',
      'If HTML formatting is necessary, sanitize input with an audited library such as DOMPurify.',
      'Implement a strict Content Security Policy (e.g. script-src \'self\' \'nonce-...\').',
      'Set HttpOnly flags on session cookies so JavaScript cannot read session tokens.'
    ],
    externalReferences: [
      { title: 'OWASP Cross Site Scripting (XSS) Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html' },
      { title: 'CWE-79: Improper Neutralization of Input During Web Page Generation', url: 'https://cwe.mitre.org/data/definitions/79.html' }
    ]
  },
  {
    id: 'lab-sqli-02',
    slug: 'sql-injection',
    title: 'SQL Injection (SQLi)',
    category: 'SQL Injection',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    points: 125,
    summary: 'Inspect how SQL queries interact with unsanitized user inputs. Detect vulnerable string concatenation and construct parameterized queries.',
    description: 'SQL Injection happens when untrusted user input is directly concatenated into dynamic database queries. Attackers manipulate the query structure to bypass authentication, dump sensitive database tables, or execute administrative commands.',
    learningObjectives: [
      'Understand how string concatenation alters SQL syntax and execution semantics.',
      'Recognize common authentication bypass vectors like \' OR 1=1 --.',
      'Analyze query execution plans and database error disclosures.',
      'Construct secure parameterized queries (prepared statements).',
      'Understand least privilege database user configuration.'
    ],
    prerequisites: ['Basic SQL (SELECT, WHERE, JOIN)', 'Relational database concepts'],
    theory: {
      overview: 'Databases parse queries into command trees. When dynamic input contains SQL metacharacters (quotes, dashes, semicolons), the parser treats user input as executable SQL commands instead of literal data.',
      impact: 'Unauthorized database read/write access, bypass of authentication mechanisms, exposure of hashed passwords or personal data, data destruction, and potential remote code execution via database features.',
      attackVector: 'Inputting syntax-breaking characters such as \' OR \'1\'=\'1, \' UNION SELECT ..., or -- comments to truncate remaining SQL clauses.',
      prevention: 'Always use parameterized queries (Prepared Statements) or Object Relational Mappers (ORMs) with parameter binding. Never concatenate user input directly into SQL strings.'
    },
    codeComparison: {
      vulnerableCode: `// VULNERABLE: Direct string interpolation into SQL query
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  // Dangerous: Input alters query logic directly
  const query = "SELECT id, username, role FROM users WHERE username = '" 
    + username + "' AND password = '" + password + "'";
  const user = await db.query(query);
  return res.json(user);
});`,
      secureCode: `// SECURE: Parameterized query with bound parameters ($1, $2)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  // Parameters are transmitted separately from query logic
  const query = 'SELECT id, username, role, password_hash FROM users WHERE username = $1';
  const result = await db.query(query, [username]);
  
  if (result.rows.length === 0) return res.status(401).send('Invalid credentials');
  const valid = await bcrypt.compare(password, result.rows[0].password_hash);
  return valid ? res.json(result.rows[0]) : res.status(401).send('Invalid credentials');
});`,
      explanation: 'Parameterized queries ensure the database engine compiles the query template first, treating parameters strictly as literals without possibility of changing query logic.'
    },
    hints: [
      { id: 1, text: 'Examine how the query handles single quotes. An unmatched quote breaks the string literal.', costPoints: 5 },
      { id: 2, text: 'Use a comment delimiter like -- to instruct the database engine to ignore the remainder of the query (such as password checks).', costPoints: 10 },
      { id: 3, text: 'In parameterized queries, placeholders like ? or $1 separate the SQL code from untrusted input.', costPoints: 15 }
    ],
    remediationGuidance: [
      'Use Prepared Statements and Parameterized Queries across all database operations.',
      'Employ modern ORMs with bound parameters.',
      'Enforce least-privilege principles on database user accounts.',
      'Never reveal database system error messages or stack traces to end users.'
    ],
    externalReferences: [
      { title: 'OWASP SQL Injection Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html' },
      { title: 'CWE-89: Improper Neutralization of Special Elements used in an SQL Command', url: 'https://cwe.mitre.org/data/definitions/89.html' }
    ]
  },
  {
    id: 'lab-csrf-03',
    slug: 'cross-site-request-forgery',
    title: 'Cross-Site Request Forgery (CSRF)',
    category: 'CSRF',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    points: 110,
    summary: 'Analyze how browsers transmit ambient session credentials. Implement anti-CSRF token verification and SameSite cookie defenses.',
    description: 'CSRF tricks an authenticated victim into executing unwanted actions on a trusted web application. Because browsers automatically attach cookies to cross-site requests, the server cannot distinguish between legitimate user actions and forged requests.',
    learningObjectives: [
      'Understand how ambient browser credential transmission enables request forgery.',
      'Identify state-changing requests executed via GET or unprotected POST endpoints.',
      'Implement cryptographic synchronizer anti-CSRF tokens.',
      'Configure SameSite cookie attributes (Strict vs Lax vs None).',
      'Examine preflight CORS and custom header protections.'
    ],
    prerequisites: ['HTTP request methods (GET, POST)', 'Cookie mechanics and sessions'],
    theory: {
      overview: 'When a user visits a malicious website while logged into a banking or email service, the malicious site can submit a form to the banking site. The browser automatically includes the user’s session cookies.',
      impact: 'Unauthorized financial transfers, changing account passwords or email addresses, updating critical system configurations, and identity impersonation.',
      attackVector: 'Hidden auto-submitting HTML forms (<form action="https://bank.com/transfer" method="POST">) or malicious image tags targeting state-changing GET endpoints.',
      prevention: 'Require unique, unpredictable, cryptographically strong anti-CSRF tokens for state-changing requests, set SameSite=Strict/Lax on session cookies, and verify custom headers (e.g. X-Requested-With).'
    },
    codeComparison: {
      vulnerableCode: `// VULNERABLE: State-changing endpoint without anti-CSRF verification
app.post('/api/account/email', (req, res) => {
  // Only checks if cookie session exists, blind to request origin
  const sessionUser = req.session.user;
  if (!sessionUser) return res.status(401).send('Unauthorized');
  
  db.updateUserEmail(sessionUser.id, req.body.newEmail);
  return res.json({ success: true, email: req.body.newEmail });
});`,
      secureCode: `// SECURE: Validating anti-CSRF synchronizer token
app.post('/api/account/email', csrfProtection, (req, res) => {
  const sessionUser = req.session.user;
  if (!sessionUser) return res.status(401).send('Unauthorized');

  // Verify that the submitted csrf token matches session token
  const clientToken = req.headers['x-csrf-token'] || req.body._csrf;
  if (!isValidCsrfToken(sessionUser.id, clientToken)) {
    return res.status(403).json({ error: 'Invalid or missing CSRF token' });
  }

  db.updateUserEmail(sessionUser.id, req.body.newEmail);
  return res.json({ success: true });
});`,
      explanation: 'Anti-CSRF tokens are unpredictable values known only to the user’s browser and server session. Malicious cross-site origins cannot read or guess this token due to the Same-Origin Policy.'
    },
    hints: [
      { id: 1, text: 'Notice that the transfer request only requires recipient and amount, with no validation token.', costPoints: 5 },
      { id: 2, text: 'A malicious site can trigger this request using an invisible form submission.', costPoints: 10 },
      { id: 3, text: 'Add a synchronizer token in the form or HTTP headers, and set SameSite=Lax or Strict on cookies.', costPoints: 15 }
    ],
    remediationGuidance: [
      'Implement Anti-CSRF Synchronizer Tokens on all state-changing endpoints (POST, PUT, DELETE, PATCH).',
      'Use SameSite=Strict or SameSite=Lax for session cookies.',
      'Check Origin and Referer request headers on incoming requests.',
      'Require user re-authentication for sensitive actions like password changes.'
    ],
    externalReferences: [
      { title: 'OWASP Cross-Site Request Forgery Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html' },
      { title: 'CWE-352: Cross-Site Request Forgery', url: 'https://cwe.mitre.org/data/definitions/352.html' }
    ]
  },
  {
    id: 'lab-auth-04',
    slug: 'authentication-and-session-security',
    title: 'Authentication & Session Security',
    category: 'Authentication',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    points: 110,
    summary: 'Inspect session cookie flags (HttpOnly, Secure, SameSite), session lifecycles, and secure password management practices.',
    description: 'Flaws in authentication and session management allow attackers to hijack accounts, forge user identities, or bypass password policies. Learn to configure defense-in-depth cookie controls and session invalidation.',
    learningObjectives: [
      'Inspect session cookies and configure HttpOnly, Secure, and SameSite attributes.',
      'Understand the risks of predictable or unexpired session identifiers.',
      'Implement proper logout workflows with full server-side session revocation.',
      'Evaluate secure password storage algorithms (Argon2, bcrypt, PBKDF2).',
      'Distinguish authentication (identity verification) from authorization (permission check).'
    ],
    prerequisites: ['Browser devtools cookie knowledge', 'Session token concepts'],
    theory: {
      overview: 'HTTP is stateless, requiring cookies or tokens to maintain user identity. If session tokens are exposed in URLs, stored insecurely without HttpOnly, or kept active indefinitely, attackers can impersonate users indefinitely.',
      impact: 'Total account takeover, persistent session hijacking, bypass of multi-factor authentication, and privilege escalation.',
      attackVector: 'XSS-based document.cookie reading, session fixation, network eavesdropping over unencrypted HTTP, and replay of stale session tokens.',
      prevention: 'Issue cryptographically random session IDs with 128 bits of entropy, mark cookies HttpOnly and Secure, enforce idle and absolute timeouts, and regenerate session IDs upon login.'
    },
    codeComparison: {
      vulnerableCode: `// VULNERABLE: Insecure session cookie configuration
res.cookie('session_id', user.id, {
  httpOnly: false, // Accessible to JavaScript document.cookie!
  secure: false,   // Transmitted in cleartext over unencrypted HTTP
  sameSite: 'none' // Sent with all cross-site requests
  // Missing maxAge or expires: session never invalidates on server!
});`,
      secureCode: `// SECURE: Hardened cookie flags with crypto token & expiration
const sessionId = crypto.randomBytes(32).toString('hex');
await sessionStore.set(sessionId, { userId: user.id, createdAt: Date.now() }, 3600);

res.cookie('session_id', sessionId, {
  httpOnly: true,  // Mitigates cookie theft via XSS
  secure: true,    // Enforces HTTPS transport only
  sameSite: 'lax', // Protects against CSRF
  maxAge: 3600000, // 1 hour expiration
  path: '/'
});`,
      explanation: 'Setting HttpOnly prevents client-side scripts from reading session cookies. The Secure flag prevents transmission over cleartext HTTP, and maxAge enforces session expiration.'
    },
    hints: [
      { id: 1, text: 'Look at the cookie flags in the inspector. Is HttpOnly enabled?', costPoints: 5 },
      { id: 2, text: 'Check if the session ID is predictable or based on sequential user IDs.', costPoints: 10 },
      { id: 3, text: 'Ensure the server destroys the session token upon logout so it cannot be replayed.', costPoints: 15 }
    ],
    remediationGuidance: [
      'Set HttpOnly, Secure, and SameSite=Lax/Strict on all sensitive cookies.',
      'Regenerate session identifiers upon user privilege changes or authentication.',
      'Implement both idle timeouts (e.g. 15 mins) and absolute session lifetimes.',
      'Use secure hashing (bcrypt or Argon2id) for credential storage.'
    ],
    externalReferences: [
      { title: 'OWASP Session Management Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html' },
      { title: 'CWE-384: Session Fixation', url: 'https://cwe.mitre.org/data/definitions/384.html' }
    ]
  },
  {
    id: 'lab-idor-05',
    slug: 'broken-access-control-idor',
    title: 'Broken Access Control & IDOR',
    category: 'Access Control',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    points: 120,
    summary: 'Diagnose Insecure Direct Object References (IDOR) and missing server-side authorization checks. Enforce granular tenant-level authorization.',
    description: 'Broken access control occurs when an application fails to properly enforce that a requesting user has permission to view, edit, or delete a target resource. IDOR is a common manifestation where user-supplied IDs grant direct access to unauthorized records.',
    learningObjectives: [
      'Identify horizontal and vertical privilege escalation scenarios.',
      'Detect Insecure Direct Object References in REST APIs and URLs.',
      'Understand why client-side visibility toggling is not access control.',
      'Implement robust server-side authorization checks binding resource ownership to session identity.',
      'Apply Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC).'
    ],
    prerequisites: ['REST API fundamentals', 'JSON request/response inspection'],
    theory: {
      overview: 'When software exposes direct database keys (e.g. /invoices/1042 or ?userId=84) without checking whether the authenticated user owns that record, attackers simply increment or tamper with the identifier to access other users’ private data.',
      impact: 'Mass exposure of sensitive personal data, unauthorized financial records viewing, account takeover, and vertical escalation to administrator role.',
      attackVector: 'Modifying numerical IDs, GUIDs, or path parameters in API endpoints and inspecting whether the server returns records belonging to other tenants.',
      prevention: 'Never trust client-supplied resource IDs alone. Every request must be validated on the server by checking that the authenticated user has explicit permission for the requested entity.'
    },
    codeComparison: {
      vulnerableCode: `// VULNERABLE: Direct access to record without ownership verification
app.get('/api/documents/:docId', async (req, res) => {
  const { docId } = req.params;
  // Blindly fetches document by ID without checking if req.user owns it!
  const doc = await db.documents.findById(docId);
  if (!doc) return res.status(404).send('Not found');
  return res.json(doc);
});`,
      secureCode: `// SECURE: Enforcing resource ownership and role-based permissions
app.get('/api/documents/:docId', requireAuth, async (req, res) => {
  const { docId } = req.params;
  const currentUserId = req.user.id;
  const userRole = req.user.role;

  const doc = await db.documents.findById(docId);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  // Verify ownership or administrative authorization
  if (doc.ownerId !== currentUserId && userRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Access denied' });
  }

  return res.json(doc);
});`,
      explanation: 'The server must explicitly verify that the record ownerId matches req.user.id (or that the user possesses administrative permissions) before delivering the data.'
    },
    hints: [
      { id: 1, text: 'Look at the document ID parameter in the simulated API URL.', costPoints: 5 },
      { id: 2, text: 'Try changing the document ID to an adjacent record number (e.g., from 1042 to 1043).', costPoints: 10 },
      { id: 3, text: 'The server should check "doc.ownerId === session.userId" before responding.', costPoints: 15 }
    ],
    remediationGuidance: [
      'Enforce access control policies server-side on every request.',
      'Use indirect reference maps or tie queries directly to session tenant IDs (e.g. WHERE id = ? AND user_id = ?).',
      'Disable directory browsing and enforce strict object-level authorization.',
      'Log access control failures and trigger security alerts for brute-force ID probing.'
    ],
    externalReferences: [
      { title: 'OWASP Top 10: Broken Access Control', url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/' },
      { title: 'CWE-639: Authorization Bypass Through User-Controlled Key', url: 'https://cwe.mitre.org/data/definitions/639.html' }
    ]
  },
  {
    id: 'lab-upload-06',
    slug: 'file-upload-security',
    title: 'File Upload Security',
    category: 'File Security',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    points: 115,
    summary: 'Discover extension bypasses, MIME-type spoofing, and directory traversal. Implement secure storage, filename randomization, and file signature validation.',
    description: 'Unrestricted file uploads allow malicious users to upload server-executable scripts (such as web shells), overwrite system files, or exhaust disk space. Learn comprehensive validation and defense-in-depth storage techniques.',
    learningObjectives: [
      'Identify file upload pitfalls (double extensions like shell.php.jpg, null bytes, MIME spoofing).',
      'Understand the risk of serving user-uploaded files from executable web root directories.',
      'Validate file signatures (magic bytes) rather than relying on client-provided extensions.',
      'Generate secure randomized filenames (UUIDs) and enforce strict size limits.',
      'Configure non-executable storage buckets and Content-Disposition headers.'
    ],
    prerequisites: ['MIME types', 'HTTP multipart/form-data basics'],
    theory: {
      overview: 'When a web application allows users to upload files without rigorous validation, an attacker can upload executable code (e.g. PHP, ASPX, JSP, SVG with JavaScript). If stored in the public web root, requesting the uploaded file executes the code on the web server.',
      impact: 'Remote Code Execution (RCE), complete web server takeover, malware distribution, defacement, and denial of service via storage exhaustion.',
      attackVector: 'Bypassing client-side JavaScript checks by spoofing Content-Type headers, utilizing alternative extensions (.phtml, .php5), or including directory traversal sequences (../../file.txt).',
      prevention: 'Store uploads outside the web root or in isolated object storage (S3/Supabase Storage), rename files with random UUIDs, strictly allowlist extensions and verify file magic headers, and prevent execution permissions.'
    },
    codeComparison: {
      vulnerableCode: `// VULNERABLE: Direct save with client-supplied filename and extension check
app.post('/upload', upload.single('avatar'), (req, res) => {
  const originalName = req.file.originalname;
  // Flawed client-side extension check bypassable with shell.php.png or .phtml
  if (originalName.endsWith('.exe')) return res.status(400).send('Invalid file');
  
  // Saves directly to public web root with original filename!
  fs.copyFileSync(req.file.path, './public/uploads/' + originalName);
  res.json({ url: '/uploads/' + originalName });
});`,
      secureCode: `// SECURE: Whitelist validation, magic byte check, UUID filename & isolated storage
const ALLOWED_MIME = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png']
]);

app.post('/upload', upload.single('avatar'), async (req, res) => {
  const buffer = await fs.promises.readFile(req.file.path);
  const detectedType = await fileTypeFromBuffer(buffer); // Checks magic bytes!

  if (!detectedType || !ALLOWED_MIME.has(detectedType.mime)) {
    return res.status(400).json({ error: 'Only valid PNG and JPEG images are allowed' });
  }

  // Generate safe random name and store in non-executable directory
  const safeFilename = crypto.randomUUID() + '.' + ALLOWED_MIME.get(detectedType.mime);
  await storageService.save(safeFilename, buffer, { isPublic: false });
  return res.json({ id: safeFilename });
});`,
      explanation: 'Verifying magic bytes inspects actual file content rather than spoofable headers. Randomized UUID filenames prevent path traversal and overwrite attacks.'
    },
    hints: [
      { id: 1, text: 'Notice how the server determines the file type based solely on the file extension.', costPoints: 5 },
      { id: 2, text: 'Check what happens when a filename contains directory traversal characters like "../".', costPoints: 10 },
      { id: 3, text: 'Files should be validated by magic bytes, renamed randomly, and stored in non-executable storage.', costPoints: 15 }
    ],
    remediationGuidance: [
      'Validate file content using file signature / magic number inspection.',
      'Enforce an allowlist of permitted extensions (never rely on denylists).',
      'Generate random filenames (UUIDs) and discard original client filenames.',
      'Store uploads outside of the web server document root with no execution privileges.'
    ],
    externalReferences: [
      { title: 'OWASP File Upload Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html' },
      { title: 'CWE-434: Unrestricted Upload of File with Dangerous Type', url: 'https://cwe.mitre.org/data/definitions/434.html' }
    ]
  },
  {
    id: 'lab-headers-07',
    slug: 'security-headers-and-https',
    title: 'Security Headers & HTTPS',
    category: 'Security Headers',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    points: 95,
    summary: 'Analyze HTTP response headers. Configure Content-Security-Policy (CSP), HSTS, X-Content-Type-Options, and clickjacking defenses.',
    description: 'Modern browsers provide powerful security mechanisms configured via HTTP response headers. Misconfigured or missing security headers leave web applications vulnerable to clickjacking, protocol downgrade attacks, MIME-confusion attacks, and cross-site scripting.',
    learningObjectives: [
      'Inspect HTTP response headers and calculate security grades.',
      'Configure Content-Security-Policy (CSP) to restrict script and resource loading.',
      'Enforce HTTPS and prevent SSL stripping via Strict-Transport-Security (HSTS).',
      'Mitigate MIME sniffing attacks with X-Content-Type-Options: nosniff.',
      'Prevent clickjacking attacks with X-Frame-Options and frame-ancestors directives.'
    ],
    prerequisites: ['HTTP response structure', 'Browser security model'],
    theory: {
      overview: 'Security headers instruct the browser on how to behave when handling site content. Without headers like CSP, HSTS, and X-Content-Type-Options, the browser falls back to legacy permissive behaviors.',
      impact: 'Clickjacking (embedding sites in malicious iframes), Man-in-the-Middle credential interception over plaintext HTTP, MIME sniffing exploits, and unconstrained script execution.',
      attackVector: 'Framing a target site behind an invisible UI overlay, downgrading HTTPS connections to HTTP, and uploading files disguised as images that browsers execute as scripts.',
      prevention: 'Configure hardened HTTP response headers at the web server (Nginx, Apache, Cloudflare) or application layer (Helmet middleware).'
    },
    codeComparison: {
      vulnerableCode: `// VULNERABLE: Default HTTP response without security headers
HTTP/1.1 200 OK
Server: Apache/2.4.41 (Ubuntu)
Content-Type: text/html; charset=UTF-8
Connection: keep-alive
X-Powered-By: PHP/7.4.3
// Missing CSP, HSTS, X-Frame-Options, X-Content-Type-Options!`,
      secureCode: `// SECURE: Hardened response with modern security headers
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()`,
      explanation: 'HSTS guarantees all future traffic uses TLS/HTTPS. CSP limits executable script sources, and frame-ancestors \'none\' eliminates clickjacking vulnerabilities.'
    },
    hints: [
      { id: 1, text: 'Look for missing HSTS headers which allow downgrade attacks from HTTPS to HTTP.', costPoints: 5 },
      { id: 2, text: 'Examine X-Frame-Options: without it, any malicious website can load your app in an invisible iframe.', costPoints: 10 },
      { id: 3, text: 'A strong CSP default-src \'self\' restricts loading scripts and assets to trusted origins only.', costPoints: 15 }
    ],
    remediationGuidance: [
      'Enable Strict-Transport-Security with at least 1 year duration (31536000 seconds).',
      'Implement Content-Security-Policy with strict script-src and object-src directives.',
      'Set X-Content-Type-Options to nosniff.',
      'Use frame-ancestors \'none\' or X-Frame-Options: DENY to block framing.',
      'Remove revealing headers like Server and X-Powered-By.'
    ],
    externalReferences: [
      { title: 'OWASP Secure Headers Project', url: 'https://owasp.org/www-project-secure-headers/' },
      { title: 'Mozilla Observatory', url: 'https://observatory.mozilla.org/' }
    ]
  },
  {
    id: 'lab-tools-08',
    slug: 'web-server-scanning-tools',
    title: 'Web Server Scanning with Nikto, OWASP ZAP & Burp Suite',
    category: 'Security Tools',
    difficulty: 'Advanced',
    estimatedMinutes: 35,
    points: 130,
    summary: 'Operate an interactive security terminal. Run Nikto and OWASP ZAP scans, analyze vulnerability reports, and simulate Burp Suite request tampering.',
    description: 'Automated vulnerability scanners and intercepting proxies are foundational tools for security professionals. Master command-line scanning with Nikto and OWASP ZAP, interpret findings, filter false positives, and inspect HTTP requests using a Burp Suite simulator.',
    learningObjectives: [
      'Run active and passive vulnerability scans using command-line security tools.',
      'Interpret Nikto scan output for outdated software and exposed administrative files.',
      'Evaluate OWASP ZAP alerts categorized by risk (High, Medium, Low, Informational).',
      'Differentiate true security vulnerabilities from false positives.',
      'Simulate HTTP traffic interception, request repeater modifications, and parameter testing with Burp Suite.'
    ],
    prerequisites: ['Basic command line familiarity', 'HTTP protocol understanding'],
    theory: {
      overview: 'Vulnerability scanners automate the detection of known flaws, outdated versions, dangerous default files, and missing security headers. Intercepting proxies (like Burp Suite) allow penetration testers to inspect and tamper with HTTP traffic between client and server in real time.',
      impact: 'Rapid identification of exposed attack surfaces, compliance auditing, and discovery of exploitable vulnerabilities before adversaries can leverage them.',
      attackVector: 'Automated enumeration of directories, fuzzing HTTP parameters for injection, dictionary attacks, and header analysis.',
      prevention: 'Regular automated scanning in CI/CD pipelines, swift remediation of identified high/critical findings, hardening server banners, and implementing automated security regression tests.'
    },
    codeComparison: {
      vulnerableCode: `# Sample Raw Nikto Scan Finding Output
+ Server: Apache/2.2.8 (Ubuntu) DAV/2 mod_ssl/2.2.8 OpenSSL/0.9.8g
+ Server leaks inodes via ETags
+ OSVDB-3268: /test/: Directory indexing found.
+ OSVDB-3092: /admin/: This might be interesting...
+ /phpmyadmin/: phpMyAdmin directory found
+ Missing X-Frame-Options header (Clickjacking risk)`,
      secureCode: `# Hardened Server Output Post-Remediation
+ Target IP: 192.168.1.105 (HTTPS: 443)
+ Server banner masked: [REDACTED]
+ Directory indexing: DISABLED
+ Administrative paths: Restricted to VPN / IP allowlist
+ Strict-Transport-Security: ACTIVE (max-age=31536000)
+ Content-Security-Policy: ACTIVE
+ 0 critical or high vulnerability alerts identified`,
      explanation: 'Remediation involves hiding server identification banners, disabling directory indexing, restricting administrative interfaces, and applying comprehensive security headers.'
    },
    hints: [
      { id: 1, text: 'Type "help" in the terminal to see available scan commands (nikto, zap-cli, burp).', costPoints: 5 },
      { id: 2, text: 'Run "nikto -h http://target-app.local" to discover exposed directories and outdated server components.', costPoints: 10 },
      { id: 3, text: 'In the Burp Suite tab, tamper with the price or role parameter before clicking Forward.', costPoints: 15 }
    ],
    remediationGuidance: [
      'Mask web server version information by configuring ServerTokens Prod in Apache or server_tokens off in Nginx.',
      'Disable directory indexing (Options -Indexes in Apache).',
      'Isolate or protect administrative dashboards with multi-factor authentication and IP allowlists.',
      'Integrate OWASP ZAP baseline scans into automated CI/CD deployment pipelines.'
    ],
    externalReferences: [
      { title: 'OWASP ZAP (Zed Attack Proxy) Documentation', url: 'https://www.zaproxy.org/docs/' },
      { title: 'Nikto Web Server Scanner Repository', url: 'https://cirt.net/Nikto2' },
      { title: 'PortSwigger Burp Suite User Guide', url: 'https://portswigger.net/burp/documentation' }
    ]
  }
];

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'first_blood',
    title: 'First Blood',
    description: 'Complete your first virtual security lab challenge.',
    icon: 'Sword',
    category: 'completion' as const,
    points: 50
  },
  {
    id: 'xss_slayer',
    title: 'XSS Slayer',
    description: 'Master Cross-Site Scripting defenses and secure DOM APIs.',
    icon: 'Code',
    category: 'mastery' as const,
    points: 100
  },
  {
    id: 'sql_defender',
    title: 'SQL Defender',
    description: 'Neutralize SQL Injection with parameterized queries.',
    icon: 'Database',
    category: 'mastery' as const,
    points: 100
  },
  {
    id: 'session_sentinel',
    title: 'Session Sentinel',
    description: 'Harden session cookies with HttpOnly, Secure, and SameSite.',
    icon: 'Lock',
    category: 'mastery' as const,
    points: 100
  },
  {
    id: 'scanner_pro',
    title: 'Tool Master',
    description: 'Execute scans with Nikto, OWASP ZAP, and inspect traffic in Burp Suite.',
    icon: 'Terminal',
    category: 'mastery' as const,
    points: 125
  },
  {
    id: 'pentester_elite',
    title: 'WebSecLab Graduate',
    description: 'Complete all 8 virtual labs and finish the comprehensive final exam.',
    icon: 'Award',
    category: 'special' as const,
    points: 300
  }
];
