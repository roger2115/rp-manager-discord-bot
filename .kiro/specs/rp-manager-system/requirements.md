# Requirements Document: RP Manager System

## Executive Summary

The RP Manager System is a Discord roleplay management platform that enables users to create and manage roleplay characters through a web dashboard, with seamless integration into Discord via webhook-based message proxying. The system addresses the limitations of existing solutions like Tupperbox by implementing server-scoped character management, Discord permission-based access control, and an automated progression system. This document outlines the business requirements, user stories, acceptance criteria, and correctness properties that guide the technical implementation.

## Business Requirements

### BR-1: Server-Scoped Character Management
**Priority**: Critical  
**Description**: Characters must be isolated to specific Discord servers (guilds) to prevent cross-server usage and maintain roleplay integrity.

**Rationale**: Unlike Tupperbox where characters are global, server-scoped characters ensure that roleplay contexts remain separate. A character created on "Server A" cannot be used on "Server B", maintaining roleplay balance and preventing character misuse across different communities.

**Success Criteria**:
- Characters are tied to specific Guild IDs
- Users can only use characters on the server where they were created
- Character queries are filtered by Guild ID
- Dashboard displays characters per selected server

### BR-2: Permission-Based Access Control
**Priority**: Critical  
**Description**: Implement a two-tier permission system: character ownership and staff override based on Discord permissions.

**Rationale**: Eliminates the need for manual role assignment in the dashboard. The system automatically recognizes Discord moderators (users with BAN_MEMBERS or KICK_MEMBERS permissions) and grants them oversight capabilities.

**Success Criteria**:
- Character creators have full control over their characters
- Users with BAN_MEMBERS or KICK_MEMBERS permissions can view/edit/delete any character on their server
- Permission checks are cached to avoid Discord API overload
- Unauthorized access attempts are logged and rejected

### BR-3: Webhook-Based Message Proxying
**Priority**: Critical  
**Description**: Bot must intercept user messages containing bracket syntax and re-post them via Discord webhooks with character identity.

**Rationale**: Provides seamless roleplay experience where users can speak as their characters without manual commands. The original message is deleted and replaced with a webhook message displaying the character's name and avatar.

**Success Criteria**:
- Bot detects bracket patterns in messages (e.g., `[text]`, `(text)`, `{text}`)
- Original message is deleted within 1 second
- Webhook message appears with character's name and avatar
- Message content is preserved exactly (no truncation or modification)
- Bot respects Discord rate limits

### BR-4: Automated Progression System
**Priority**: High  
**Description**: Characters can progress through ranks automatically based on configurable triggers (time, message count, or manual promotion).

**Rationale**: Builds immersion and engagement without requiring constant admin intervention. Automated promotions reward active roleplay participation and create a sense of character development.

**Success Criteria**:
- Server admins can define rank hierarchies
- Promotion triggers can be set per rank (time-based, message count, or manual)
- Promotions are announced automatically in configured channels
- Promotion history is tracked and auditable
- System prevents rank regression (monotonic progression)

### BR-5: Secure Authentication and Session Management
**Priority**: Critical  
**Description**: Users authenticate via Discord OAuth2, and sessions are managed securely with encrypted tokens.

**Rationale**: Leverages Discord's existing authentication infrastructure, eliminating the need for separate user accounts. Ensures secure access to the dashboard and API.

**Success Criteria**:
- OAuth2 flow with Discord (identify and guilds scopes)
- Session tokens are hashed and stored securely
- OAuth access/refresh tokens are encrypted at rest
- Sessions expire after inactivity
- Token refresh is handled automatically

### BR-6: Input Sanitization and XSS Prevention
**Priority**: Critical  
**Description**: All user-generated content must be sanitized to prevent XSS attacks and code injection.

**Rationale**: Protects users from malicious content and maintains system integrity. Character names, tags, and other inputs could be vectors for XSS attacks if not properly sanitized.

**Success Criteria**:
- HTML entities are encoded for all user inputs
- Script tags and event handlers are neutralized
- Sanitization is applied on both client and server
- Semantic meaning of input is preserved
- Sanitization is idempotent

### BR-7: Futuristic Dashboard Design
**Priority**: Medium  
**Description**: Web dashboard must have a modern, futuristic aesthetic with blue, purple, white, and black color scheme.

**Rationale**: Creates an engaging user experience that aligns with the sci-fi/futuristic theme common in roleplay communities. Visual appeal increases user adoption and satisfaction.

**Success Criteria**:
- Color palette limited to blue, purple, white, and black
- Smooth animations and transitions
- Responsive design for mobile and desktop
- Optimized performance (fast load times)
- Accessible UI (WCAG guidelines)

## User Stories

### US-1: Character Creation
**As a** Discord user  
**I want to** create roleplay characters through a web dashboard  
**So that** I can use them in Discord roleplay sessions

**Acceptance Criteria**:
- [ ] User can access dashboard after Discord OAuth2 login
- [ ] User can select a Discord server from their server list
- [ ] User can fill out character form with: Name, Avatar URL/Upload, Tag, Brackets
- [ ] Form validates that brackets are not empty
- [ ] Form validates that avatar URL is HTTPS
- [ ] Character is saved to database with user ID and guild ID
- [ ] User receives confirmation message upon successful creation
- [ ] Character appears in user's character list for that server

### US-2: Message Proxying
**As a** Discord user  
**I want to** send messages as my character using bracket syntax  
**So that** my messages appear with my character's name and avatar

**Acceptance Criteria**:
- [ ] User sends message with brackets (e.g., `[Hello world]`)
- [ ] Bot detects bracket pattern and matches to user's character
- [ ] Original message is deleted within 1 second
- [ ] Webhook message appears with character's name and avatar
- [ ] Message content inside brackets is preserved exactly
- [ ] If no matching character found, message is ignored (not deleted)
- [ ] If user doesn't own the character, message is ignored

### US-3: Character Editing
**As a** character owner  
**I want to** edit my character's details  
**So that** I can update their appearance or bracket syntax

**Acceptance Criteria**:
- [ ] User can click "Edit" button on their character
- [ ] Form is pre-filled with current character data
- [ ] User can modify name, avatar, tag, or brackets
- [ ] Changes are validated before submission
- [ ] Updated character is saved to database
- [ ] User receives confirmation message
- [ ] Changes are reflected immediately in Discord (next message)

### US-4: Staff Override
**As a** Discord moderator  
**I want to** view and manage all characters on my server  
**So that** I can moderate roleplay content and enforce server rules

**Acceptance Criteria**:
- [ ] Moderator (with BAN_MEMBERS or KICK_MEMBERS permission) can view all characters on their server
- [ ] Moderator can edit any character's details
- [ ] Moderator can delete any character
- [ ] Moderator actions are logged with timestamp and user ID
- [ ] Character owner is notified when their character is modified by staff
- [ ] Permission check is cached for 5 minutes

### US-5: Rank Progression
**As a** server administrator  
**I want to** define rank hierarchies and promotion triggers  
**So that** characters can progress automatically based on activity

**Acceptance Criteria**:
- [ ] Admin can create ranks with names and order
- [ ] Admin can set promotion trigger type (time, message count, manual)
- [ ] Admin can set trigger value (days or message count)
- [ ] Admin can configure announcement channel for promotions
- [ ] Characters are promoted automatically when trigger conditions are met
- [ ] Promotion announcement is sent to configured channel with rich embed
- [ ] Promotion history is viewable in dashboard

### US-6: Manual Promotion
**As a** Discord moderator  
**I want to** manually promote characters  
**So that** I can reward exceptional roleplay or handle special cases

**Acceptance Criteria**:
- [ ] Moderator can view character's current rank
- [ ] Moderator can select next rank from dropdown
- [ ] Moderator can click "Promote" button
- [ ] Character's rank is updated immediately
- [ ] Promotion announcement is sent to configured channel
- [ ] Promotion is marked as "manual" in history
- [ ] Moderator's user ID is recorded as triggeredBy

### US-7: Character Deletion
**As a** character owner  
**I want to** delete my characters  
**So that** I can remove characters I no longer use

**Acceptance Criteria**:
- [ ] User can click "Delete" button on their character
- [ ] Confirmation dialog appears to prevent accidental deletion
- [ ] Character is removed from database
- [ ] User receives confirmation message
- [ ] Character can no longer be used in Discord
- [ ] Deletion is permanent (no undo)

### US-8: Server Configuration
**As a** server administrator  
**I want to** configure system settings for my server  
**So that** I can customize the progression system and announcements

**Acceptance Criteria**:
- [ ] Admin can enable/disable progression system
- [ ] Admin can select announcement channel from dropdown
- [ ] Admin can save configuration changes
- [ ] Configuration is applied immediately
- [ ] Configuration is persisted in database
- [ ] Admin receives confirmation message

### US-9: Session Management
**As a** dashboard user  
**I want to** stay logged in across sessions  
**So that** I don't have to re-authenticate frequently

**Acceptance Criteria**:
- [ ] User remains logged in for 7 days (default)
- [ ] Session is refreshed on activity (sliding expiration)
- [ ] User can manually log out
- [ ] Expired sessions redirect to login page
- [ ] OAuth tokens are refreshed automatically when expired
- [ ] User is notified if token refresh fails

### US-10: Error Handling
**As a** user  
**I want to** receive clear error messages  
**So that** I understand what went wrong and how to fix it

**Acceptance Criteria**:
- [ ] Validation errors show specific field issues
- [ ] Permission errors explain why access was denied
- [ ] Rate limit errors show wait time
- [ ] Network errors suggest retry
- [ ] Error messages are user-friendly (no technical jargon)
- [ ] Errors are logged for debugging

## Functional Requirements

### FR-1: Authentication System
**Description**: Implement Discord OAuth2 authentication flow

**Requirements**:
- OAuth2 authorization code flow with Discord
- Request `identify` and `guilds` scopes
- Store access token and refresh token (encrypted)
- Generate session token (hashed)
- Implement token refresh logic
- Handle OAuth errors gracefully

### FR-2: Character Management API
**Description**: REST API endpoints for character CRUD operations

**Endpoints**:
- `POST /api/characters` - Create character
- `GET /api/characters?guildId={id}` - List characters for guild
- `GET /api/characters/:id` - Get character details
- `PATCH /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete character
- `GET /api/characters/by-bracket?guildId={id}&bracket={bracket}` - Find character by bracket

**Requirements**:
- Validate all inputs
- Check permissions (owner or staff override)
- Sanitize user inputs
- Return appropriate HTTP status codes
- Include error messages in responses

### FR-3: Discord Bot Message Handler
**Description**: Bot listens to messages and triggers webhook proxying

**Requirements**:
- Listen to `messageCreate` event
- Parse bracket syntax from message content
- Query backend API for character by bracket
- Verify character ownership
- Check rate limits
- Delete original message
- Send webhook message with character identity
- Update message count for progression
- Handle errors silently (no user-facing errors)

### FR-4: Webhook Management
**Description**: Bot manages Discord webhooks for message proxying

**Requirements**:
- Get or create webhook for channel
- Cache webhook objects per channel
- Send webhook messages with custom username and avatar
- Handle webhook creation failures
- Verify bot has MANAGE_WEBHOOKS permission
- Clean up unused webhooks periodically

### FR-5: Progression System
**Description**: Automated rank progression based on triggers

**Requirements**:
- Increment message count atomically on each proxied message
- Check promotion trigger after message count update
- Support three trigger types: time, message_count, manual
- Calculate time-based triggers from character creation date
- Execute promotion (update rank, create promotion record)
- Send promotion announcement to configured channel
- Prevent rank regression (monotonic progression)

### FR-6: Permission System
**Description**: Two-tier permission model with caching

**Requirements**:
- Check character ownership (userId matches)
- Check staff override (BAN_MEMBERS or KICK_MEMBERS permission)
- Cache permission results for 5 minutes
- Fetch permissions from Discord API on cache miss
- Handle Discord API errors (fail closed)
- Log permission checks for audit

### FR-7: Input Sanitization
**Description**: Sanitize all user inputs to prevent XSS

**Requirements**:
- Encode HTML entities: `<`, `>`, `&`, `"`, `'`
- Remove or neutralize script tags
- Remove event handlers (onclick, onerror, etc.)
- Apply sanitization on client and server
- Preserve semantic meaning of input
- Ensure idempotence (sanitize(sanitize(x)) === sanitize(x))

### FR-8: Rate Limiting
**Description**: Implement rate limits to prevent abuse

**Requirements**:
- API: 100 requests per minute per user
- Discord API: Respect per-endpoint rate limits
- Webhook sending: 5 messages per second per channel
- Implement token bucket algorithm
- Queue requests when rate limit exceeded
- Return 429 status code with retry-after header

### FR-9: Database Schema
**Description**: PostgreSQL database with Prisma ORM

**Tables**:
- `characters`: Character data
- `ranks`: Rank definitions
- `guild_configs`: Server configurations
- `user_sessions`: Session tokens
- `promotions`: Promotion history

**Requirements**:
- Use UUIDs for primary keys
- Create indexes for common queries
- Implement foreign key constraints
- Use transactions for atomic operations
- Enable connection pooling

### FR-10: Frontend Dashboard
**Description**: Next.js/React web application

**Pages**:
- `/` - Landing page with login button
- `/dashboard` - Main dashboard (server selection, character list)
- `/characters/new` - Character creation form
- `/characters/:id/edit` - Character editing form
- `/ranks` - Rank management (admin only)
- `/settings` - Server configuration (admin only)

**Requirements**:
- Responsive design (mobile and desktop)
- Form validation with React Hook Form and Zod
- Loading states and error handling
- Futuristic theme (blue, purple, white, black)
- Smooth animations and transitions

## Non-Functional Requirements

### NFR-1: Performance
- Dashboard loads in under 2 seconds
- API response time under 200ms (95th percentile)
- Bot processes messages in under 1 second
- Database queries optimized with indexes
- Caching reduces Discord API calls by 80%

### NFR-2: Scalability
- System supports up to 10,000 concurrent users
- Database handles 1 million characters
- Bot handles 100 messages per second
- Horizontal scaling via load balancer
- Stateless API design for easy scaling

### NFR-3: Reliability
- System uptime: 99.5% (excluding planned maintenance)
- Automatic recovery from transient failures
- Database backups every 24 hours
- Graceful degradation when Discord API is down
- Error logging and monitoring

### NFR-4: Security
- All API communication over HTTPS
- OAuth tokens encrypted at rest (AES-256)
- Session tokens hashed (bcrypt)
- Input sanitization on all user inputs
- SQL injection prevention via ORM
- Rate limiting to prevent DDoS

### NFR-5: Maintainability
- Code coverage: 80% minimum
- TypeScript for type safety
- ESLint and Prettier for code quality
- Comprehensive documentation
- Modular architecture for easy updates

### NFR-6: Usability
- Intuitive UI with clear navigation
- Helpful error messages
- Responsive design for all devices
- Accessible (keyboard navigation, screen readers)
- Consistent visual design

## Correctness Properties

### CP-1: Server Isolation Property
**Formal Statement**: ∀ character ∈ Characters, ∀ guild ∈ Guilds: character.guildId === guild.id ⟹ character only usable in guild ∧ character.guildId ≠ guild.id ⟹ character not accessible in guild

**Testing Strategy**: Property-based test that generates random characters and guilds, verifies that characters are only accessible in their assigned guild

**Validation**: 
- Unit tests for character query filtering
- Integration tests for cross-server access attempts
- Property-based tests with fast-check

### CP-2: Permission Enforcement Property
**Formal Statement**: ∀ user ∈ Users, ∀ character ∈ Characters: (user.id === character.userId) ∨ hasStaffOverride(user, character.guildId) ⟹ canModify(user, character)

**Testing Strategy**: Property-based test that generates random users and characters, verifies that only owners and staff can modify characters

**Validation**:
- Unit tests for permission checks
- Integration tests for unauthorized access attempts
- Property-based tests with various permission combinations

### CP-3: Bracket Uniqueness Property
**Formal Statement**: ∀ c1, c2 ∈ Characters: (c1.guildId === c2.guildId) ∧ (c1.userId === c2.userId) ∧ (c1.brackets === c2.brackets) ⟹ c1.id === c2.id

**Testing Strategy**: Property-based test that attempts to create duplicate characters with same brackets, verifies that duplicates are rejected

**Validation**:
- Database unique constraint on (guildId, userId, brackets)
- Unit tests for duplicate detection
- Integration tests for character creation

### CP-4: Progression Monotonicity Property
**Formal Statement**: ∀ character ∈ Characters, ∀ t1, t2 ∈ Time: t1 < t2 ⟹ character.messageCount(t1) ≤ character.messageCount(t2) ∧ character.currentRank.order(t1) ≤ character.currentRank.order(t2)

**Testing Strategy**: Property-based test that simulates message sending and promotions, verifies that counts and ranks never decrease

**Validation**:
- Unit tests for message count increment
- Integration tests for promotion flow
- Property-based tests with time-series data

### CP-5: Webhook Message Integrity Property
**Formal Statement**: ∀ message ∈ ProxiedMessages: message.author.name === message.character.name ∧ message.author.avatar === message.character.avatarUrl ∧ message.content === extractBracketContent(originalMessage.content)

**Testing Strategy**: Property-based test that generates random messages and characters, verifies that webhook messages match character identity

**Validation**:
- Unit tests for bracket parsing
- Integration tests for message proxying
- Property-based tests with various bracket patterns

### CP-6: Rate Limit Compliance Property
**Formal Statement**: ∀ endpoint ∈ DiscordAPIEndpoints, ∀ timeWindow ∈ TimeWindows: count(requests(endpoint, timeWindow)) ≤ rateLimit(endpoint)

**Testing Strategy**: Property-based test that generates burst requests, verifies that rate limits are never exceeded

**Validation**:
- Unit tests for rate limiter
- Integration tests with burst traffic
- Property-based tests with random request patterns

### CP-7: Input Sanitization Property
**Formal Statement**: ∀ input ∈ UserInputs: sanitize(input) contains no executable scripts ∧ sanitize(input) preserves semantic meaning

**Testing Strategy**: Property-based test that generates random inputs including XSS payloads, verifies that sanitized output is safe

**Validation**:
- Unit tests for sanitization function
- Integration tests with malicious inputs
- Property-based tests with XSS attack vectors

## Constraints and Assumptions

### Constraints
- Discord API rate limits (50 requests per second per bot)
- Webhook limit: 10 webhooks per channel
- Message length limit: 2000 characters
- Avatar URL must be publicly accessible
- PostgreSQL database required
- Redis cache required for production

### Assumptions
- Users have Discord accounts
- Users are members of at least one Discord server
- Bot has necessary permissions (MANAGE_WEBHOOKS, MANAGE_MESSAGES)
- Server admins configure announcement channels
- Users understand bracket syntax
- Internet connection is stable

## Success Metrics

### User Adoption
- 1,000 registered users within 3 months
- 10,000 characters created within 6 months
- 100,000 messages proxied per month

### User Engagement
- Average 50 messages per character per month
- 80% of users create multiple characters
- 60% of users return weekly

### System Performance
- 99.5% uptime
- Average API response time under 200ms
- Bot message processing under 1 second

### User Satisfaction
- 4.5/5 star rating on feedback surveys
- Less than 5% error rate
- Less than 1% support tickets per active user

## Glossary

- **Character**: A roleplay persona with name, avatar, and bracket syntax
- **Bracket**: Syntax pattern used to trigger message proxying (e.g., `[text]`)
- **Webhook**: Discord feature that allows posting messages with custom identity
- **Guild**: Discord server
- **Staff Override**: Permission for moderators to manage all characters
- **Progression**: Automated rank advancement based on triggers
- **Rank**: Hierarchical position in progression system
- **Promotion**: Advancement from one rank to another
- **Proxy**: Re-posting a message via webhook with character identity
- **Session**: Authenticated user session with encrypted tokens
- **Sanitization**: Process of removing malicious code from user input
