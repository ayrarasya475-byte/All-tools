# Security Specification - NecroCore V5

## Data Invariants
1. A user profile MUST have a valid role ('user', 'admin', 'owner').
2. Only one 'owner' should ideally exist (enforced by initial setup/admin logic).
3. Security logs are append-only for the system.
4. Messages must be tied to a valid authenticated user.

## The "Dirty Dozen" Payloads (Denial Expected)

1. **Identity Spoofing**: User A tries to update User B's profile.
2. **Privilege Escalation**: User A tries to set their own role to 'admin'.
3. **Ghost Field Injection**: User tries to add `isVerified: true` to their profile.
4. **ID Poisoning**: User tries to create a document with a 1MB string as ID.
5. **PII Leak**: Unauthenticated user tries to list all user emails.
6. **Log Tampering**: User tries to delete a security log.
7. **System Hijack**: User tries to update `system/config`.
8. **Message Impersonation**: User A tries to send a message with User B's `userId`.
9. **Role Bypass**: Admin tries to change Owner's role.
10. **Resource Exhaustion**: User sends a 1MB string in a chat message.
11. **State Shortcut**: User tries to set their own status to 'active' from 'banned'.
12. **Unverified Write**: User with unverified email tries to post in chat.

## Implementation Strategy
- Use `isValidUser()` helper for all user writes.
- Use `affectedKeys().hasOnly()` for partial updates.
- Master Gate pattern for collection access.
