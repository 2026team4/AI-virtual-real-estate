import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '../config/supabase.js';
import { generateToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── Register ───────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { full_name, email, password, role = 'buyer', phone } = req.body;

    if (!full_name || !email || !password) {
      return sendError(res, 'full_name, email and password are required', 400);
    }
    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters', 400);
    }

    // Check duplicate email
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) return sendError(res, 'Email already registered', 409);

    const hashed = await bcrypt.hash(password, 12);
    const id = uuidv4();

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert([{
        id,
        full_name,
        email: email.toLowerCase(),
        password_hash: hashed,
        role: ['buyer', 'seller', 'agent'].includes(role) ? role : 'buyer',
        phone: phone || null,
        is_verified: false,
        created_at: new Date().toISOString(),
      }])
      .select('id, full_name, email, role, phone, avatar_url, is_verified, created_at')
      .single();

    if (error) throw error;

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return sendSuccess(res, { user, token }, 'Registration successful', 201);
  } catch (err) {
    console.error('register error:', err);
    return sendError(res, 'Registration failed', 500);
  }
};

// ── Login ──────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return sendError(res, 'Email and password required', 400);

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, full_name, email, password_hash, role, phone, avatar_url, is_verified')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) return sendError(res, 'Invalid credentials', 401);

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return sendError(res, 'Invalid credentials', 401);

    const { password_hash, ...safeUser } = user;
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    // Update last_login
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    return sendSuccess(res, { user: safeUser, token }, 'Login successful');
  } catch (err) {
    console.error('login error:', err);
    return sendError(res, 'Login failed', 500);
  }
};

// ── Get current user ───────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, full_name, email, role, phone, avatar_url, bio, is_verified, created_at')
      .eq('id', req.user.id)
      .single();

    if (error || !user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, { user });
  } catch (err) {
    return sendError(res, 'Failed to fetch user', 500);
  }
};

// ── Update profile ─────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, bio, avatar_url } = req.body;
    const updates = {};
    if (full_name) updates.full_name = full_name;
    if (phone !== undefined) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    updates.updated_at = new Date().toISOString();

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select('id, full_name, email, role, phone, avatar_url, bio, is_verified')
      .single();

    if (error) throw error;
    return sendSuccess(res, { user }, 'Profile updated');
  } catch (err) {
    return sendError(res, 'Failed to update profile', 500);
  }
};

// ── Change password ────────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return sendError(res, 'current_password and new_password are required', 400);
    }
    if (new_password.length < 6) {
      return sendError(res, 'New password must be at least 6 characters', 400);
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('password_hash')
      .eq('id', req.user.id)
      .single();

    const match = await bcrypt.compare(current_password, user.password_hash);
    if (!match) return sendError(res, 'Current password is incorrect', 401);

    const hashed = await bcrypt.hash(new_password, 12);
    await supabaseAdmin
      .from('users')
      .update({ password_hash: hashed, updated_at: new Date().toISOString() })
      .eq('id', req.user.id);

    return sendSuccess(res, {}, 'Password changed successfully');
  } catch (err) {
    return sendError(res, 'Failed to change password', 500);
  }
};

// ── Logout (client-side token discard; optionally blacklist here) ──────────
export const logout = async (req, res) => {
  return sendSuccess(res, {}, 'Logged out successfully');
};
