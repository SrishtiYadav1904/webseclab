import type { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // XSS
  {
    id: 'q-xss-1',
    labCategory: 'XSS',
    type: 'multiple_choice',
    question: 'Which DOM sink is inherently dangerous when populated with unsanitized user-supplied strings?',
    options: ['element.textContent', 'element.innerHTML', 'element.innerText', 'element.setAttribute("title", ...)'],
    correctAnswerIndex: 1,
    explanation: 'element.innerHTML parses the assigned string as HTML markup. If the string contains HTML or script tags, the browser executes the script, causing Cross-Site Scripting.'
  },
  {
    id: 'q-xss-2',
    labCategory: 'XSS',
    type: 'true_false',
    question: 'A strict Content Security Policy (CSP) with script-src \'self\' stops all XSS attacks without needing input sanitization.',
    options: ['True', 'False'],
    correctAnswerIndex: 1,
    explanation: 'False. CSP is a powerful layer of defense-in-depth, but it does not replace safe output encoding. Vulnerabilities can still arise from JSONP endpoints, script gadgets, or DOM-based execution.'
  },
  {
    id: 'q-xss-3',
    labCategory: 'XSS',
    type: 'code_identify',
    question: 'Identify which line in this search handler contains an XSS vulnerability:',
    codeSnippet: `1: const searchParam = new URLSearchParams(window.location.search).get('q');
2: const outputDiv = document.getElementById('search-output');
3: outputDiv.innerHTML = "<div>Search for: " + searchParam + "</div>";
4: console.log("Search query rendered");`,
    options: ['Line 1', 'Line 2', 'Line 3', 'Line 4'],
    correctAnswerIndex: 2,
    explanation: 'Line 3 interpolates unsanitized query parameters directly into the innerHTML DOM sink, creating a classic DOM-based/Reflected XSS flaw.'
  },

  // SQL Injection
  {
    id: 'q-sqli-1',
    labCategory: 'SQL Injection',
    type: 'multiple_choice',
    question: 'Why do parameterized queries (Prepared Statements) prevent SQL Injection?',
    options: [
      'They encode all single quotes into double quotes before sending to the database',
      'The database pre-compiles the query template, treating input parameters strictly as literal values',
      'They automatically strip all dashes and SQL comments from input',
      'They convert all string queries into binary format'
    ],
    correctAnswerIndex: 1,
    explanation: 'In parameterized queries, the query logic is compiled first by the database engine. Untrusted parameters are sent separately and treated exclusively as literal data, never as executable code.'
  },
  {
    id: 'q-sqli-2',
    labCategory: 'SQL Injection',
    type: 'code_identify',
    question: 'Which query construction is completely safe from SQL injection?',
    options: [
      'db.query("SELECT * FROM items WHERE id = " + req.params.id)',
      'db.query(`SELECT * FROM items WHERE name = \'${req.body.name}\'`)',
      'db.query("SELECT * FROM items WHERE id = $1 AND active = true", [req.params.id])',
      'db.query("SELECT * FROM items WHERE category = \'" + sanitize(req.query.cat) + "\'")'
    ],
    correctAnswerIndex: 2,
    explanation: 'Option 3 uses prepared statement parameter placeholders ($1) with parameter binding arrays, preventing untrusted input from modifying the SQL command structure.'
  },

  // CSRF
  {
    id: 'q-csrf-1',
    labCategory: 'CSRF',
    type: 'multiple_choice',
    question: 'What is the primary condition that makes Cross-Site Request Forgery (CSRF) possible?',
    options: [
      'The browser executes JavaScript from untrusted third-party CDNs',
      'The browser automatically includes ambient session cookies with cross-site requests to target domains',
      'The victim has JavaScript disabled in their browser settings',
      'The web server uses HTTP/2 rather than HTTP/1.1'
    ],
    correctAnswerIndex: 1,
    explanation: 'CSRF relies on the browser’s default behavior of attaching authentication cookies to cross-site requests, making forged requests appear legitimate to the destination server.'
  },
  {
    id: 'q-csrf-2',
    labCategory: 'CSRF',
    type: 'multiple_choice',
    question: 'Which cookie attribute configuration provides the best modern protection against CSRF?',
    options: [
      'SameSite=None; Secure',
      'SameSite=Lax or SameSite=Strict',
      'HttpOnly=false',
      'Domain=.com'
    ],
    correctAnswerIndex: 1,
    explanation: 'SameSite=Strict prevents the cookie from being sent on any cross-site request. SameSite=Lax permits only top-level navigational GET requests, blocking cross-site POST form submissions.'
  },

  // Authentication
  {
    id: 'q-auth-1',
    labCategory: 'Authentication',
    type: 'multiple_choice',
    question: 'What does the HttpOnly flag on a session cookie accomplish?',
    options: [
      'Forces the cookie to be sent only over HTTPS TLS encryption',
      'Prevents client-side scripts (such as JavaScript document.cookie) from accessing the cookie',
      'Restricts the cookie to only HTTP/1.1 servers',
      'Automatically invalidates the session after 15 minutes of inactivity'
    ],
    correctAnswerIndex: 1,
    explanation: 'The HttpOnly flag instructs the browser that the cookie must not be exposed through document.cookie, mitigating session theft via XSS.'
  },
  {
    id: 'q-auth-2',
    labCategory: 'Authentication',
    type: 'multiple_choice',
    question: 'Which algorithm is recommended for securely hashing user passwords in modern web applications?',
    options: ['MD5', 'SHA-256 without salt', 'Argon2id or bcrypt', 'Base64 with XOR'],
    correctAnswerIndex: 2,
    explanation: 'Argon2id and bcrypt are slow, memory-hard adaptive hashing algorithms designed specifically to resist GPU-based brute-force and dictionary attacks.'
  },

  // Access Control / IDOR
  {
    id: 'q-idor-1',
    labCategory: 'Access Control',
    type: 'multiple_choice',
    question: 'What constitutes an Insecure Direct Object Reference (IDOR)?',
    options: [
      'A server sends unminified JavaScript source maps to production',
      'An application uses user-supplied keys to access objects without verifying the user\'s authorization for that record',
      'An API endpoint allows HTTP requests instead of HTTPS',
      'An image tag references an invalid CDN domain'
    ],
    correctAnswerIndex: 1,
    explanation: 'IDOR occurs when an application receives an identifier from the client (e.g. /receipts?id=992) and directly retrieves the database entity without checking if the current user owns it.'
  },
  {
    id: 'q-idor-2',
    labCategory: 'Access Control',
    type: 'true_false',
    question: 'Hiding the "Delete User" button in the client-side UI prevents standard users from deleting other users.',
    options: ['True', 'False'],
    correctAnswerIndex: 1,
    explanation: 'False. Client-side UI controls are easily bypassed by sending direct HTTP requests to the backend endpoint. Authorization must always be enforced on the server.'
  },

  // File Upload
  {
    id: 'q-file-1',
    labCategory: 'File Security',
    type: 'multiple_choice',
    question: 'Why is checking only the Content-Type header insufficient for file upload security?',
    options: [
      'Content-Type is only supported on HTTP/1.0',
      'The client can trivially spoof the Content-Type header in multipart/form-data requests',
      'Browsers convert all files to text/plain before uploading',
      'MIME types are randomized by web servers'
    ],
    correctAnswerIndex: 1,
    explanation: 'The Content-Type header is supplied entirely by the client. An attacker uploading a PHP shell can simply set Content-Type: image/jpeg to bypass naive MIME checks.'
  },
  {
    id: 'q-file-2',
    labCategory: 'File Security',
    type: 'multiple_choice',
    question: 'What is the most secure storage strategy for user-uploaded profile pictures?',
    options: [
      'Store files in /var/www/html/avatars/ with original filenames',
      'Rename files with randomized UUIDs, store outside the web root or on isolated object storage, and serve with non-executable headers',
      'Compress files into ZIP archives in the public web root',
      'Encode files into cookies'
    ],
    correctAnswerIndex: 1,
    explanation: 'Random UUID filenames eliminate path traversal and collisions, while storing outside the web root prevents server engines from executing uploaded scripts.'
  },

  // Security Headers
  {
    id: 'q-sec-1',
    labCategory: 'Security Headers',
    type: 'multiple_choice',
    question: 'Which HTTP response header forces the browser to load the site strictly over HTTPS for a defined duration?',
    options: [
      'X-Content-Type-Options: nosniff',
      'Strict-Transport-Security: max-age=31536000; includeSubDomains',
      'Content-Security-Policy: default-src https:',
      'Referrer-Policy: no-referrer'
    ],
    correctAnswerIndex: 1,
    explanation: 'Strict-Transport-Security (HSTS) instructs the browser that the domain must only be accessed using HTTPS, protecting against SSL stripping attacks.'
  },
  {
    id: 'q-sec-2',
    labCategory: 'Security Headers',
    type: 'multiple_choice',
    question: 'What attack is prevented by setting X-Frame-Options: DENY or CSP frame-ancestors \'none\'?',
    options: ['SQL Injection', 'Clickjacking', 'Buffer Overflow', 'DNS Spoofing'],
    correctAnswerIndex: 1,
    explanation: 'Clickjacking is prevented by disallowing the site from being embedded inside transparent iframes on third-party pages.'
  },

  // Security Tools
  {
    id: 'q-tools-1',
    labCategory: 'Security Tools',
    type: 'multiple_choice',
    question: 'What is the primary role of an intercepting proxy like OWASP ZAP or Burp Suite in web security testing?',
    options: [
      'To compile TypeScript code into WebAssembly',
      'To capture, inspect, and modify HTTP requests and responses between the browser and the target server in real time',
      'To perform physical penetration testing on data centers',
      'To replace the operating system firewall'
    ],
    correctAnswerIndex: 1,
    explanation: 'Intercepting proxies sit between the tester\'s browser and the target application, allowing precise inspection and tampering with headers, cookies, and parameters before requests reach the server.'
  },
  {
    id: 'q-tools-2',
    labCategory: 'Security Tools',
    type: 'multiple_choice',
    question: 'In automated scanner results (like Nikto or ZAP), what is a "False Positive"?',
    options: [
      'A critical vulnerability that was missed by the scan',
      'A finding flagged as a vulnerability by the tool that is not actually exploitable or present in the application',
      'A scan that took longer than 60 seconds to finish',
      'A scanner crash caused by an invalid SSL certificate'
    ],
    correctAnswerIndex: 1,
    explanation: 'A false positive occurs when a security scanner flags an issue based on heuristic patterns (such as a generic 200 OK page), but manual verification confirms no real security flaw exists.'
  }
];
