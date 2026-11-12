import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── Get notifications ──────────────────────────────────────────────────────
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const from = (Number(page) - 1) * Number(limit);
    const to   = from + Number(limit) - 1;

    const { data, error, count } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const unread = data.filter((n) => !n.is_read).length;
    return sendSuccess(res, { notifications: data, unread, total: count });
  } catch (err) {
    return sendError(res, 'Failed to fetch notifications', 500);
  }
};

// ── Mark as read ───────────────────────────────────────────────────────────
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === 'all') {
      await supabaseAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', req.user.id);
      return sendSuccess(res, {}, 'All notifications marked as read');
    }

    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    return sendSuccess(res, {}, 'Notification marked as read');
  } catch (err) {
    return sendError(res, 'Failed to update notification', 500);
  }
};

// ── Delete notification ────────────────────────────────────────────────────
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    return sendSuccess(res, {}, 'Notification deleted');
  } catch (err) {
    return sendError(res, 'Failed to delete notification', 500);
  }
};
