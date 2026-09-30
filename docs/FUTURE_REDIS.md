# Redis is intentionally deferred

PostgreSQL with Prisma is the source of truth for projects, notes, settings, and lifecycle state. The MVP does not require Redis and must work without it.

Redis may later be evaluated for:

- caching frequently read project and note views;
- rate limiting public or mutation endpoints;
- distributed locking when multiple scheduler instances run expiration work;
- background job queues;
- realtime updates and pub/sub; and
- temporary capture state, only if a future workflow needs it.

If it is introduced, cache misses and Redis outages must fall back to PostgreSQL. An expiration lock would prevent duplicate work, but the archival query remains idempotent and PostgreSQL remains authoritative.
