export interface QuestionTemplate {
  question: string;
  category: 'Technical' | 'HR' | 'Aptitude';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  domain: 'Frontend' | 'Backend' | 'DevOps' | 'Data Analyst' | 'Cyber Security' | 'General';
  suggestedAnswer: string;
}

export const questionBank: QuestionTemplate[] = [
  // ==========================================
  // FRONTEND DEVELOPER QUESTIONS
  // ==========================================
  {
    question: "What is Tailwind CSS and how does its utility-first approach compare to traditional semantic CSS stylesheets?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Frontend",
    suggestedAnswer: "Tailwind CSS provides low-level utility classes that let you build custom designs directly in your markup. Compared to traditional semantic CSS, it eliminates the need to write custom class names, keeps style sheets small by reusing classes, and avoids cascading style side-effects. However, it can make HTML look cluttered and has a learning curve for class name memorization."
  },
  {
    question: "Explain the concept of React state and props. What are the key differences between them?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Frontend",
    suggestedAnswer: "State represents the local, mutable data private to a component that can change over time (e.g., via useState). Props (properties) are immutable inputs passed down from parent components to child components to configure them. When state changes, the component re-renders. When props change, the child component re-renders to reflect the new values."
  },
  {
    question: "What is Next.js Incremental Static Regeneration (ISR) and how does it optimize page loading performance?",
    category: "Technical",
    difficulty: "Medium",
    domain: "Frontend",
    suggestedAnswer: "ISR allows developers to update static pages after building the site, without needing to rebuild the entire application. It combines the speed of Static Site Generation (SSG) with fresh data of Server-Side Rendering (SSR). Pages are served from cache, and rebuilt in the background only when a request comes in after the revalidate timer expires."
  },
  {
    question: "How does Redux Toolkit simplify state management compared to traditional Redux boilerplate?",
    category: "Technical",
    difficulty: "Medium",
    domain: "Frontend",
    suggestedAnswer: "Redux Toolkit (RTK) simplifies Redux by providing configureStore() to set up standard middleware, createSlice() to auto-generate action creators and reducers, and built-in Immer integration to write mutable-looking code that safely updates state immutably. It removes 80% of traditional Redux boilerplate like constants and manual root reducer configurations."
  },
  {
    question: "Explain how event delegation works in vanilla JavaScript and React. How does it improve performance?",
    category: "Technical",
    difficulty: "Medium",
    domain: "Frontend",
    suggestedAnswer: "Event delegation is a technique where a single event listener is attached to a parent element rather than individual child elements. It leverages event bubbling, where events bubble up from target elements to parents. It reduces memory usage by creating fewer listeners and automatically handles dynamically added child elements without binding new events."
  },
  {
    question: "Explain the virtual DOM diffing algorithm in React. How do keys help, and what happens when they are index-based?",
    category: "Technical",
    difficulty: "Hard",
    domain: "Frontend",
    suggestedAnswer: "React uses a virtual DOM to optimize UI updates. The diffing algorithm compares two virtual trees (reconciliation) in O(N) complexity by assuming components of different types produce different trees and keys identify stable elements. Keys help React match children across renders. Using array indices as keys can cause rendering bugs, incorrect state mapping in inputs, and poor performance when items are sorted or inserted at the top."
  },
  {
    question: "How does TypeScript's structural type system differ from a nominal type system, and how do you use generics to enforce type safety?",
    category: "Technical",
    difficulty: "Hard",
    domain: "Frontend",
    suggestedAnswer: "TypeScript uses structural typing (duck typing), meaning types are compatible if they share the same shape (methods/properties), regardless of their declared names. Nominal systems (like Java/C#) match types by explicit declarations. Generics allow us to write reusable, type-safe code by parameterizing types (e.g., Stack<T>), letting the type be determined dynamically when invoked while enforcing compiler constraints."
  },
  {
    question: "Design an API integration layer in Next.js that implements request deduplication, caching, and retry logic.",
    category: "Technical",
    difficulty: "Hard",
    domain: "Frontend",
    suggestedAnswer: "Use a fetch wrapper or Axios interceptor. For deduplication, maintain a map of active promises keyed by URL/params and return the existing promise if a duplicate request occurs concurrently. For caching, utilize an in-memory Map or Redis cache with custom TTLs. For retry, implement exponential backoff with a max retry cap (e.g., retrying up to 3 times after 1s, 2s, and 4s delays if a 5xx status is encountered)."
  },

  // ==========================================
  // BACKEND DEVELOPER QUESTIONS
  // ==========================================
  {
    question: "What is a REST API and what are the standard HTTP methods used to create, read, update, and delete resources?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Backend",
    suggestedAnswer: "A REST (Representational State Transfer) API is an architectural style for designing networked applications using HTTP protocol. It maps CRUD operations to HTTP methods: POST creates a resource, GET reads a resource, PUT updates a resource (fully replacement), PATCH updates a resource partially, and DELETE removes a resource. Status codes (2xx, 4xx, 5xx) communicate result outcomes."
  },
  {
    question: "Explain the role of the Node.js Event Loop. Why is it single-threaded but able to handle high concurrent operations?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Backend",
    suggestedAnswer: "The Event Loop is the engine that handles asynchronous operations in Node.js. Node is single-threaded for Javascript execution, but delegates blocking I/O tasks (file system, network, database) to the OS kernel or thread pool (libuv) which run multi-threaded. When tasks complete, callbacks are pushed to queues, and the Event Loop processes them sequentially, avoiding thread context-switch overhead."
  },
  {
    question: "How does JWT (JSON Web Token) authentication work? Explain access tokens, refresh tokens, and secure storage.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Backend",
    suggestedAnswer: "JWT is a stateless auth protocol. Upon login, the server issues an Access Token (short-lived, e.g. 15m) signed with a secret containing user payload. The client attaches this in HTTP headers for requests. A Refresh Token (long-lived, e.g. 7d) is stored in a secure HTTP-only cookie and used to obtain new access tokens when they expire. Access tokens should not be stored in localStorage due to XSS vulnerability."
  },
  {
    question: "Explain the differences between SQL normalization and denormalization. When should you denormalize a database?",
    category: "Technical",
    difficulty: "Medium",
    domain: "Backend",
    suggestedAnswer: "Normalization structures database tables to reduce redundancy and improve data integrity (up to 3NF, using foreign keys). Denormalization intentionally adds redundant data to speed up read queries by avoiding expensive JOIN operations. You should denormalize in high-read architectures (like data warehouses or dashboard landing pages) where read performance is critical."
  },
  {
    question: "How do you handle middleware in Express.js? Explain the request-response cycle and error-handling middleware.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Backend",
    suggestedAnswer: "Middleware in Express are functions that run during the request-response cycle, receiving (req, res, next) objects. They can modify requests, execute code, end cycles, or call next() to pass control. Error-handling middleware is defined with four arguments (err, req, res, next) and is placed at the end of the router queue to catch thrown errors."
  },
  {
    question: "Design a scalable rate limiter for Express APIs using Redis. How do sliding window algorithms work?",
    category: "Technical",
    difficulty: "Hard",
    domain: "Backend",
    suggestedAnswer: "A sliding window rate limiter stores timestamps of user requests in a Redis Sorted Set (ZSET) keyed by user IP. For each request, remove elements older than current time minus window size (e.g. 1 minute). Count the remaining elements using ZCARD. If count exceeds limit, reject request. Otherwise, add the new timestamp using ZADD and set a key TTL to expire the set."
  },
  {
    question: "Compare SQL vs. NoSQL indexing. How do B-Trees compare to MongoDB's wildcard indexes in query execution?",
    category: "Technical",
    difficulty: "Hard",
    domain: "Backend",
    suggestedAnswer: "SQL databases use B-Trees for primary and secondary indexing, keeping elements sorted for logarithmic search, insertions, and range queries. MongoDB also uses B-Trees for standard keys, but offers Wildcard Indexes to index all subdocuments dynamically. Wildcard indexes are convenient for polymorphic fields but consume substantial storage and slow down write operations compared to structured B-Tree keys."
  },
  {
    question: "Explain database transactions in MongoDB. How do you implement ACID properties using sessions and two-phase commits?",
    category: "Technical",
    difficulty: "Hard",
    domain: "Backend",
    suggestedAnswer: "MongoDB supports multi-document ACID transactions via Sessions (client.startSession()). You start a transaction within a session, execute operations passing the session object, and commit or abort the transaction. If any operation fails, all changes are rolled back. Under the hood, this uses replica set oplogs and locks to ensure Atomicity, Consistency, Isolation, and Durability."
  },

  // ==========================================
  // DEVOPS ENGINEER QUESTIONS
  // ==========================================
  {
    question: "What is a Docker container, and how does it differ from a Virtual Machine?",
    category: "Technical",
    difficulty: "Easy",
    domain: "DevOps",
    suggestedAnswer: "Docker containers share the host OS kernel and isolate processes using namespaces and cgroups, making them lightweight (MBs) and fast to boot (seconds). Virtual Machines run a full guest OS on top of a hypervisor, consuming significant memory and disk storage (GBs) and booting much slower. Containers offer high density and portability for microservices."
  },
  {
    question: "What is CI/CD, and why is it important in modern software engineering loops?",
    category: "Technical",
    difficulty: "Easy",
    domain: "DevOps",
    suggestedAnswer: "CI (Continuous Integration) is the automated process of building and testing code changes whenever developers commit to a central repository. CD (Continuous Deployment) automatically deploys passing builds to production environments. It is critical because it shortens feedback loops, catches bugs early, ensures deployment consistency, and minimizes manual delivery risks."
  },
  {
    question: "Explain Kubernetes Pods, Deployments, and Services. How does traffic flow from outside to a pod?",
    category: "Technical",
    difficulty: "Medium",
    domain: "DevOps",
    suggestedAnswer: "A Pod is the smallest deployable unit in Kubernetes, hosting one or more containers. A Deployment manages Pod replicas, handling scaling and rolling updates. A Service exposes Pods to networking. Incoming traffic enters through an Ingress Controller, which routes it to a ClusterIP Service. The service load balances the TCP/UDP traffic to individual Pod IPs using iptables or IPVS rules."
  },
  {
    question: "Explain rolling updates vs. blue-green deployments in AWS. What are the cost and uptime tradeoffs?",
    category: "Technical",
    difficulty: "Medium",
    domain: "DevOps",
    suggestedAnswer: "Rolling updates replace old pods/instances gradually with new ones, keeping capacity constant. It consumes no extra resources (low cost) but can lead to mixed-version states and slow rollbacks. Blue-Green deployments spin up an identical target environment (Green) running the new version alongside the old one (Blue), shifting traffic at once. It has zero downtime and instant rollbacks, but doubles infrastructure costs during deployment."
  },
  {
    question: "How do you monitor application performance using Prometheus and Grafana? What are the Golden Signals of monitoring?",
    category: "Technical",
    difficulty: "Medium",
    domain: "DevOps",
    suggestedAnswer: "Prometheus pulls metrics (time-series data) from application HTTP scrapers, and Grafana queries Prometheus to render charts. The four Golden Signals of monitoring are: Latency (time taken to service requests), Traffic (demand/requests per second), Errors (rate of failed requests), and Saturation (system resource utilization like CPU or memory)."
  },
  {
    question: "Design a secure multi-tenant Kubernetes cluster structure. How do network policies and RBAC restrict access?",
    category: "Technical",
    difficulty: "Hard",
    domain: "DevOps",
    suggestedAnswer: "Create separate Namespaces for tenants. Apply Kubernetes RBAC (Role-Based Access Control) to restrict namespace access using Roles and RoleBindings mapped to user groups. Implement Network Policies to restrict cross-namespace pod communication, blocking ingress traffic by default. Enable ResourceQuotas and LimitRanges to prevent a tenant from exhausting node resources."
  },
  {
    question: "Explain horizontal pod autoscaling (HPA) in Kubernetes. How do metrics adapters scale pods using custom Prometheus queries?",
    category: "Technical",
    difficulty: "Hard",
    domain: "DevOps",
    suggestedAnswer: "HPA scales the number of replica pods based on CPU/memory metrics or custom API queries. To scale based on custom metrics, deploy the Prometheus Adapter (metrics-server wrapper) which registers custom APIs in the K8s aggregation layer. HPA queries this endpoint, compares the metric value (e.g. HTTP request rate) against target thresholds, and modifies the Deployment's replica count."
  },
  {
    question: "Design a disaster recovery backup strategy on AWS for a database cluster using multi-region replication and Route53 failover.",
    category: "Technical",
    difficulty: "Hard",
    domain: "DevOps",
    suggestedAnswer: "Deploy an Amazon Aurora Global Database with active-passive cross-region replication (latency < 1s). Set up automatic snapshots saved in S3, replicated to secondary regions. Use AWS Route53 with Failover Routing Policies linked to CloudWatch health checks. If the primary database region fails, CloudWatch triggers a DNS failover, Route53 updates routes to the secondary region, and an AWS Lambda promotes the secondary db reader to writer."
  },

  // ==========================================
  // DATA ANALYST QUESTIONS
  // ==========================================
  {
    question: "What is SQL JOIN and what is the difference between an INNER JOIN, LEFT JOIN, and RIGHT JOIN?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Data Analyst",
    suggestedAnswer: "SQL JOIN is used to combine rows from two or more tables based on a related column. INNER JOIN returns only records that have matching values in both tables. LEFT JOIN returns all records from the left table, and matching records from the right table (returning NULL if no match). RIGHT JOIN does the opposite, returning all records from the right table and matching ones from the left."
  },
  {
    question: "What is the difference between descriptive and inferential statistics?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Data Analyst",
    suggestedAnswer: "Descriptive statistics summarizes and describes the characteristics of a dataset (e.g., mean, median, standard deviation, count). Inferential statistics uses sample data to make predictions, generalizations, or test hypotheses about a larger population (e.g., t-tests, ANOVA, linear regression, confidence intervals)."
  },
  {
    question: "How do you handle missing or null data in a Python pandas DataFrame? What are the implications of imputation?",
    category: "Technical",
    difficulty: "Medium",
    domain: "Data Analyst",
    suggestedAnswer: "In Pandas, you can detect missing data with df.isnull() and drop them with df.dropna(), or fill them using df.fillna() (imputation with mean, median, or ffill). Imputing maintains sample size and avoids discarding data, but it can introduce bias, underestimate standard errors, and weaken relationships between variables if the data is not missing at random."
  },
  {
    question: "What is Power BI DAX? Explain the difference between a Calculated Column and a Measure.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Data Analyst",
    suggestedAnswer: "DAX (Data Analysis Expressions) is the formula language in Power BI. A Calculated Column is computed row-by-row during data refresh, stored in the database, and consumes memory. A Measure is computed on-the-fly when visuals are updated, dynamically reacting to filter contexts, and consumes CPU rather than persistent storage."
  },
  {
    question: "Explain the Central Limit Theorem and its importance in statistical hypothesis testing.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Data Analyst",
    suggestedAnswer: "The CLT states that if you take sufficiently large random samples from any population (usually N >= 30), the distribution of the sample means will be approximately normal, regardless of the population's underlying distribution. This allows us to use parametric statistics (like z-scores and t-tests) and normal probability tables to perform hypothesis testing."
  },
  {
    question: "Explain how to write a recursive Common Table Expression (CTE) in SQL to traverse hierarchical database structures.",
    category: "Technical",
    difficulty: "Hard",
    domain: "Data Analyst",
    suggestedAnswer: "A recursive CTE uses the WITH RECURSIVE syntax. It consists of two parts joined by UNION ALL: an Anchor Member (which queries the base/top level of hierarchy, e.g. parent_id IS NULL) and a Recursive Member (which references the CTE itself and joins it back to the source table, e.g., CTE.id = source.parent_id). A termination condition is met when the recursive join yields no more rows."
  },
  {
    question: "What is A/B testing? How do you calculate sample size, statistical power, and p-value to verify test results?",
    category: "Technical",
    difficulty: "Hard",
    domain: "Data Analyst",
    suggestedAnswer: "A/B testing compares two versions (Control and Treatment) to measure changes in metric conversion. Calculate sample size using baseline conversion, minimum detectable effect (MDE), significance level (alpha, typically 5%), and power (1-beta, typically 80%). The p-value is the probability of observing test results at least as extreme as the actual results, assuming the null hypothesis is true. Reject null hypothesis if p-value < alpha."
  },
  {
    question: "Design an interactive executive dashboard in Power BI that processes star-schema data models and maintains sub-second query latency.",
    category: "Technical",
    difficulty: "Hard",
    domain: "Data Analyst",
    suggestedAnswer: "Organize the dataset into a strict Star Schema (Fact tables linked to Dimension tables via 1-to-many relationships). Avoid bi-directional filters and nested DAX queries. Use Aggregation Tables to pre-summarize detailed facts. Enable DirectQuery only for real-time transactions, and use Import Mode for general visuals. Limit card visual counts per report page, and filter out unused columns in Power Query."
  },

  // ==========================================
  // CYBER SECURITY QUESTIONS
  // ==========================================
  {
    question: "What is OWASP Top 10, and why is it a reference standard for web application security?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Cyber Security",
    suggestedAnswer: "OWASP (Open Web Application Security Project) Top 10 is a regularly updated report outlining the ten most critical security risks facing web applications. It serves as a global reference because it is based on industry consensus, details attack vectors, provides mitigation guides, and helps developers build security checks into the software lifecycle."
  },
  {
    question: "What is the difference between symmetric and asymmetric encryption?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Cyber Security",
    suggestedAnswer: "Symmetric encryption uses a single shared key to both encrypt and decrypt data (e.g. AES), making it fast and efficient for bulk data. Asymmetric encryption uses a mathematically linked key pair: a Public Key for encryption and a Private Key for decryption (e.g. RSA). It is slower but solves the key distribution problem, enabling secure handshakes and digital signatures."
  },
  {
    question: "Explain how Cross-Site Scripting (XSS) works and how to prevent it in modern React frontend applications.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Cyber Security",
    suggestedAnswer: "XSS occurs when an application inserts unsanitized user input into web pages, executing malicious scripts in the user's browser. React automatically escapes strings rendered in JSX, preventing simple XSS. However, XSS can still occur via dangerouslySetInnerHTML, javascript: URLs in anchor tags, or direct DOM manipulation. Prevent it by sanitizing input (e.g. DOMPurify) and setting a Content Security Policy (CSP)."
  },
  {
    question: "How does OAuth 2.0 work? Explain the difference between Authentication and Authorization.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Cyber Security",
    suggestedAnswer: "OAuth 2.0 is an authorization framework. The user logs in to an Identity Provider (IDP) which issues an Access Token to a third-party app, granting access to resources without sharing credentials. Authentication verifies *who* a user is (e.g., logging in via OIDC), whereas Authorization verifies *what* permission access level they have (OAuth 2.0 scopes)."
  },
  {
    question: "Explain SQL Injection (SQLi) and how parameterized queries prevent malicious database commands.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Cyber Security",
    suggestedAnswer: "SQLi occurs when user inputs are concatenated directly into SQL statements, allowing attackers to manipulate queries. Parameterized queries (prepared statements) solve this by separating the SQL code structure from the user data parameters. The database compiles the SQL query structure first, then inserts parameters, treating inputs strictly as literal values rather than executable commands."
  },
  {
    question: "Design a secure authentication system that resists brute-force, credential stuffing, and session hijacking.",
    category: "Technical",
    difficulty: "Hard",
    domain: "Cyber Security",
    suggestedAnswer: "Store passwords using bcrypt or Argon2 hashing with unique salts. Implement Multi-Factor Authentication (MFA) via TOTP. Resist brute-force using rate limiting and temporary account lockouts. Mitigate credential stuffing via IP reputation checks and CAPTCHAs. Prevent session hijacking by using secure HTTP-only, SameSite=Strict cookies for JWTs, rotate session IDs upon auth change, and track active user agent fingerprints."
  },
  {
    question: "Explain how a man-in-the-middle (MITM) attack works on TLS handshakes, and how Certificate Pinning mitigates it.",
    category: "Technical",
    difficulty: "Hard",
    domain: "Cyber Security",
    suggestedAnswer: "In a MITM attack, an attacker intercepts TLS handshakes, presenting a fake certificate to the client to decrypt and forward traffic. Certificate Pinning mitigates this by embedding the server's public key or root certificate hash directly in the client application. The client compares the server's presented certificate chain against this pinned copy, closing connections immediately if there is a mismatch."
  },
  {
    question: "Explain how to perform static and dynamic vulnerability analysis (SAST/DAST) in an automated DevSecOps build pipeline.",
    category: "Technical",
    difficulty: "Hard",
    domain: "Cyber Security",
    suggestedAnswer: "SAST (Static Application Security Testing) scans source code during builds without executing it (e.g. SonarQube), catching OWASP flaws and key leaks early. DAST (Dynamic Application Security Testing) runs automated attacks against the compiled, running application in staging (e.g. OWASP ZAP), catching runtime config and environment auth flaws. Integrate SAST on git commit hooks and DAST during nightly CD pipelines."
  },

  // ==========================================
  // HR / BEHAVIORAL QUESTIONS
  // ==========================================
  {
    question: "Tell me about a time you had a conflict with a team member. How did you resolve it?",
    category: "HR",
    difficulty: "Medium",
    domain: "General",
    suggestedAnswer: "Detail a professional disagreement (e.g., technical design choice). Frame it constructively: list the perspectives, focus on objective data, schedule a private conversation, find a compromise aligned with project goals, and commit to the decided route."
  },
  {
    question: "Describe a project you are proud of. What was your role and how did you measure success?",
    category: "HR",
    difficulty: "Medium",
    domain: "General",
    suggestedAnswer: "Use the STAR model. Describe the situation, your responsibilities, the action steps (e.g. refactoring code, containerizing services), and quantify results (e.g. reduced build times by 40%, cut latency by 150ms)."
  },
  {
    question: "Describe a time you failed or made a mistake on a task. What did you learn and how did you handle it?",
    category: "HR",
    difficulty: "Hard",
    domain: "General",
    suggestedAnswer: "Acknowledge the mistake honestly (e.g., broke a staging pipeline, missed an edge-case bug). Focus on active resolution steps taken immediately, and describe the long-term process changes (e.g., added pre-commit tests) to prevent reoccurrence."
  },
  {
    question: "How do you explain a complex technical concept to a non-technical stakeholder?",
    category: "HR",
    difficulty: "Easy",
    domain: "General",
    suggestedAnswer: "Emphasize empathy and simplicity. Avoid acronyms and technical jargon. Use real-world analogies (e.g., comparing caching to a desk workspace). Focus on the 'why' and business outcome rather than implementation detail."
  },

  // ==========================================
  // COMMUNICATION / APTITUDE QUESTIONS
  // ==========================================
  {
    question: "Estimate the number of tennis balls that can fit inside a standard yellow school bus. Explain your Fermi estimation logic.",
    category: "Aptitude",
    difficulty: "Medium",
    domain: "General",
    suggestedAnswer: "Apply Fermi estimation: estimate bus volume (approx 8ft x 6ft x 30ft = 1,440 cubic feet, convert to inches). Estimate tennis ball volume (diameter 2.7 in, volume approx 10 cubic inches). Calculate ideal packing density (approx 60-70% for spheres). Divide total volume by ball volume, multiply by packing density, resulting in approx 150,000 to 200,000 tennis balls."
  },
  {
    question: "Design a toll booth payment system for a highway. How do you optimize traffic flow and handle payment failures?",
    category: "Aptitude",
    difficulty: "Hard",
    domain: "General",
    suggestedAnswer: "Propose a multi-tier system: contactless automatic lanes (RFID/license tag readers), physical credit/cash lanes, and online backup portals. Optimize throughput via buffer lanes and overhead signaling. Handle failures gracefully: snap a license plate photo, allow cars to proceed to clear lanes, and issue a digital invoice to avoid highway gridlocks."
  }
];
