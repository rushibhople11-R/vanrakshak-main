import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db.js';

export const authRouter = Router();

// In-memory session token map
const sessions = new Map<string, any>();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_vanrakshak_salt_2026').digest('hex');
}

function sanitizeUser(user: any) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

/**
 * POST /api/auth/register
 * Registers a new Forest Ranger or Officer and persists details to SQLite database
 */
authRouter.post('/register', (req, res) => {
  try {
    const {
      name,
      mobileNumber,
      email,
      password,
      role = 'ranger',
      division = 'Tadoba-Andhari Tiger Reserve',
      beat = 'Moharli Core Beat',
      badgeNumber,
      emergencyContact = '',
    } = req.body;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid full name (minimum 2 characters).' });
    }

    if (!mobileNumber || typeof mobileNumber !== 'string') {
      return res.status(400).json({ error: 'Mobile number is required for ranger alert notifications.' });
    }

    const cleanMobile = mobileNumber.trim();
    const digitsOnly = cleanMobile.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!password || typeof password !== 'string' || password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters.' });
    }

    // 2. Check for duplicate registration
    const existingMobile = db.prepare('SELECT id, name FROM users WHERE mobileNumber = ?').get(cleanMobile);
    if (existingMobile) {
      return res.status(409).json({
        error: `Mobile number ${cleanMobile} is already registered with VanRakshak. Please log in instead.`,
      });
    }

    const existingEmail = db.prepare('SELECT id, name FROM users WHERE LOWER(email) = ?').get(cleanEmail);
    if (existingEmail) {
      return res.status(409).json({
        error: `Email address ${cleanEmail} is already registered. Please log in instead.`,
      });
    }

    // 3. Generate ID, username, and badge number
    const newId = `user-${Date.now()}`;
    const baseUsername = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_') || `ranger_${Date.now()}`;
    let finalUsername = baseUsername;

    const existingUsername = db.prepare('SELECT id FROM users WHERE username = ?').get(finalUsername);
    if (existingUsername) {
      finalUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
    }

    const badge = badgeNumber && badgeNumber.trim().length > 0
      ? badgeNumber.trim()
      : `MH-FR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const now = new Date().toISOString();
    const pwdHash = hashPassword(password);

    // 4. Insert into SQLite users table
    const insertStmt = db.prepare(`
      INSERT INTO users (
        id, username, name, role, email, mobileNumber, passwordHash,
        badgeNumber, division, beat, emergencyContact, createdAt, updatedAt, lastLoginAt
      ) VALUES (
        @id, @username, @name, @role, @email, @mobileNumber, @passwordHash,
        @badgeNumber, @division, @beat, @emergencyContact, @createdAt, @updatedAt, @lastLoginAt
      )
    `);

    insertStmt.run({
      id: newId,
      username: finalUsername,
      name: name.trim(),
      role: role === 'admin' ? 'admin' : 'ranger',
      email: cleanEmail,
      mobileNumber: cleanMobile,
      passwordHash: pwdHash,
      badgeNumber: badge,
      division: division.trim(),
      beat: beat.trim(),
      emergencyContact: emergencyContact.trim(),
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    });

    // Checkpoint immediately to ensure disk write
    try {
      db.pragma('wal_checkpoint(PASSIVE)');
    } catch (e) {
      // WAL checkpoint
    }

    const registeredUser = db.prepare('SELECT * FROM users WHERE id = ?').get(newId);
    const safeUser = sanitizeUser(registeredUser);

    const token = `vr_token_${safeUser.id}_${Date.now()}`;
    sessions.set(token, safeUser);

    return res.status(201).json({
      message: 'Registration successful! Profile registered in VanRakshak.',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Registration failed:', err);
    return res.status(500).json({ error: 'Server error during registration', details: err.message });
  }
});

/**
 * POST /api/auth/login
 * Supports credentials login (mobile number or email + password)
 * and role switching.
 */
authRouter.post('/login', (req, res) => {
  try {
    const { identifier, password, role, username } = req.body;

    let user: any = null;

    // 1. Credentials login (mobile number or email + password)
    if (identifier) {
      const cleanIdent = identifier.trim();
      const cleanLower = cleanIdent.toLowerCase();

      user = db.prepare(`
        SELECT * FROM users
        WHERE mobileNumber = ? OR LOWER(email) = ? OR LOWER(username) = ?
        LIMIT 1
      `).get(cleanIdent, cleanLower, cleanLower);

      if (!user) {
        return res.status(404).json({ error: 'No ranger account found with this mobile number or email.' });
      }

      if (password) {
        const inputHash = hashPassword(password);
        const matchesHash = user.passwordHash === inputHash;
        const matchesPlain = user.passwordHash === password;

        if (user.passwordHash && !matchesHash && !matchesPlain) {
          return res.status(401).json({ error: 'Incorrect password. Please verify your credentials.' });
        }
      }
    }
    // 2. Role switch
    else if (role) {
      user = db.prepare('SELECT * FROM users WHERE role = ? ORDER BY createdAt DESC LIMIT 1').get(role);
    } else if (username) {
      user = db.prepare('SELECT * FROM users WHERE username = ? LIMIT 1').get(username);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found in VanRakshak database.' });
    }

    // Update last login timestamp
    const now = new Date().toISOString();
    try {
      db.prepare('UPDATE users SET lastLoginAt = ? WHERE id = ?').run(now, user.id);
      db.pragma('wal_checkpoint(PASSIVE)');
      user.lastLoginAt = now;
    } catch (e) {
      // ignore
    }

    const safeUser = sanitizeUser(user);
    const token = `vr_token_${safeUser.id}_${Date.now()}`;
    sessions.set(token, safeUser);

    res.json({
      token,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal login error', details: err.message });
  }
});

/**
 * GET /api/auth/me
 * Retrieves current active user profile
 */
authRouter.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const defaultOfficer = db.prepare("SELECT * FROM users WHERE role = 'ranger' ORDER BY createdAt DESC LIMIT 1").get();
    return res.json({ user: sanitizeUser(defaultOfficer), authenticated: true, isGuest: false });
  }

  const token = authHeader.replace('Bearer ', '');
  const sessionUser = sessions.get(token);

  if (!sessionUser) {
    const defaultOfficer = db.prepare("SELECT * FROM users WHERE role = 'ranger' ORDER BY createdAt DESC LIMIT 1").get();
    return res.json({ user: sanitizeUser(defaultOfficer), authenticated: true, isGuest: false });
  }

  // Fetch freshest state from database
  const fresh = db.prepare('SELECT * FROM users WHERE id = ?').get(sessionUser.id);
  const safeUser = fresh ? sanitizeUser(fresh) : sessionUser;

  res.json({ user: safeUser, authenticated: true, isGuest: false });
});

/**
 * PUT /api/auth/profile
 * Updates the user's profile details in the database
 */
authRouter.put('/profile', (req, res) => {
  try {
    const { id, userId, name, mobileNumber, email, division, beat, badgeNumber, emergencyContact } = req.body;

    const targetId = id || userId || (sessions.get((req.headers.authorization || '').replace('Bearer ', '')) || {}).id;

    if (!targetId) {
      return res.status(400).json({ error: 'User ID is required to update profile.' });
    }

    const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(targetId);
    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE users SET
        name = COALESCE(?, name),
        mobileNumber = COALESCE(?, mobileNumber),
        email = COALESCE(?, email),
        division = COALESCE(?, division),
        beat = COALESCE(?, beat),
        badgeNumber = COALESCE(?, badgeNumber),
        emergencyContact = COALESCE(?, emergencyContact),
        updatedAt = ?
      WHERE id = ?
    `).run(
      name ? name.trim() : null,
      mobileNumber ? mobileNumber.trim() : null,
      email ? email.trim().toLowerCase() : null,
      division ? division.trim() : null,
      beat ? beat.trim() : null,
      badgeNumber ? badgeNumber.trim() : null,
      emergencyContact ? emergencyContact.trim() : null,
      now,
      targetId
    );

    try {
      db.pragma('wal_checkpoint(PASSIVE)');
    } catch (e) {
      // WAL checkpoint
    }

    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(targetId);
    const safeUser = sanitizeUser(updated);

    // Update active sessions if present
    for (const [t, u] of sessions.entries()) {
      if (u.id === targetId) {
        sessions.set(t, safeUser);
      }
    }

    res.json({ success: true, user: safeUser, message: 'Profile updated successfully.' });
  } catch (err: any) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

/**
 * GET /api/auth/users
 * Returns all registered users from database
 */
authRouter.get('/users', (req, res) => {
  try {
    const allUsers = db.prepare(`
      SELECT id, username, name, role, email, mobileNumber, badgeNumber, division, beat, emergencyContact, createdAt, lastLoginAt
      FROM users
      WHERE role != 'guest'
      ORDER BY createdAt DESC
    `).all();

    res.json(allUsers);
  } catch (err: any) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to retrieve registered users' });
  }
});

/**
 * POST /api/auth/logout
 */
authRouter.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    sessions.delete(token);
  }
  res.json({ success: true });
});

/**
 * GET /api/auth/me
 * Returns current authenticated officer or 401
 */
authRouter.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ authenticated: false, user: null });
  }
  const token = authHeader.replace('Bearer ', '');
  let sessionUser = sessions.get(token);

  if (!sessionUser && token.startsWith('vr_token_')) {
    // Attempt extracting userId from token format vr_token_<userId>_<timestamp>
    const parts = token.split('_');
    if (parts.length >= 3) {
      const extractedId = parts.slice(2, -1).join('_');
      const dbUser = db.prepare('SELECT * FROM users WHERE id = ?').get(extractedId);
      if (dbUser) {
        sessionUser = sanitizeUser(dbUser);
        sessions.set(token, sessionUser);
      }
    }
  }

  if (sessionUser) {
    return res.json({ authenticated: true, user: sessionUser });
  }

  return res.status(401).json({ authenticated: false, user: null });
});

