# Mohania Welfare Foundation - Security Specification

## Data Invariants
1. A **User Profile** cannot be modified by anyone except the owner or a Super Admin.
    - Role escalation is strictly prohibited for non-admins.
    - Status can only be changed by Admin/Super Admin.
2. **Community Updates** can only be created by approved members/volunteers.
    - `likesCount` must be incremented atomically.
3. **Donations** are write-only for authenticated donors (or anonymous) but read-restricted (only Admin or Owner can see PII).
4. **Campaigns** are public for read, but write-restricted for Admin only.
5. **NGO Staff** roles require valid `under_review` status initially.

## The Dirty Dozen (Test Payloads)

1. **Self-Promotion Attack**: User attempts to update their own `role` to `super_admin`.
2. **Identity Spoofing**: User tries to create an update with `authorId` pointing to someone else's UID.
3. **Ghost Field Injection**: User tries to add `isVerified: true` to their profile during registration.
4. **Denial of Wallet**: Attacker tries to write a 1MB string into a `message` field.
5. **Unauthorized Campaign Edit**: A donor tries to change the `targetAmount` of a campaign.
6. **Report Tampering**: A user tries to delete reports against their own posts.
7. **Bypassing Verification**: User tries to change their status from `pending` to `approved`.
8. **PII Scraping**: Anonymous user tries to list all emails in the `users` collection.
9. **Counter Bloating**: User tries to set `likesCount` to 999999 without actual likes.
10. **Shadow Update**: User tries to modify `createdAt` timestamp of an existing donation.
11. **Relational Orphan**: User tries to create a donation for a non-existent campaign.
12. **Status Shortcut**: NGO Staff tries to skip `under_review` status to `approved`.

## Security Rules Architecture
We use the **Master Gate** pattern and **Relational Sync** to ensure that permissions are strictly derived from the central user registry.
