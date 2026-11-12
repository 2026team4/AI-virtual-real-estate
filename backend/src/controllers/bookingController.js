import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── Create booking / visit request ────────────────────────────────────────
export const createBooking = async (req, res) => {
  try {
    const { property_id, visit_date, visit_time, message, booking_type = 'visit' } = req.body;

    if (!property_id || !visit_date) {
      return sendError(res, 'property_id and visit_date are required', 400);
    }

    // Verify property exists
    const { data: property } = await supabaseAdmin
      .from('properties')
      .select('id, title, owner_id, price')
      .eq('id', property_id)
      .eq('is_active', true)
      .single();

    if (!property) return sendError(res, 'Property not found', 404);

    const id = uuidv4();
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert([{
        id,
        property_id,
        buyer_id:  req.user.id,
        seller_id: property.owner_id,
        visit_date,
        visit_time: visit_time || null,
        message:    message    || null,
        booking_type, // visit | virtual | inquiry
        status: 'pending',
        created_at: new Date().toISOString(),
      }])
      .select(`
        *,
        property:property_id (id, title, thumbnail, city, price),
        buyer:buyer_id   (id, full_name, email, phone, avatar_url),
        seller:seller_id (id, full_name, email, phone, avatar_url)
      `)
      .single();

    if (error) throw error;

    // Create notification for seller
    await supabaseAdmin.from('notifications').insert([{
      id: uuidv4(),
      user_id: property.owner_id,
      title: 'New Booking Request',
      message: `${req.user.full_name} has requested a ${booking_type} for "${property.title}"`,
      type: 'booking',
      reference_id: id,
      is_read: false,
      created_at: new Date().toISOString(),
    }]);

    return sendSuccess(res, { booking }, 'Booking request sent', 201);
  } catch (err) {
    console.error('createBooking error:', err);
    return sendError(res, 'Failed to create booking', 500);
  }
};

// ── Get bookings for current user ─────────────────────────────────────────
export const getMyBookings = async (req, res) => {
  try {
    const { role } = req.query; // 'buyer' or 'seller'

    let query = supabaseAdmin
      .from('bookings')
      .select(`
        *,
        property:property_id (id, title, thumbnail, city, price, type, status),
        buyer:buyer_id   (id, full_name, email, phone, avatar_url),
        seller:seller_id (id, full_name, email, phone, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (role === 'seller') {
      query = query.eq('seller_id', req.user.id);
    } else {
      query = query.eq('buyer_id', req.user.id);
    }

    const { data, error } = await query;
    if (error) throw error;

    return sendSuccess(res, { bookings: data });
  } catch (err) {
    return sendError(res, 'Failed to fetch bookings', 500);
  }
};

// ── Update booking status ──────────────────────────────────────────────────
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response_message } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return sendError(res, `Status must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (!booking) return sendError(res, 'Booking not found', 404);

    // Only buyer can cancel; only seller can confirm/complete
    if (status === 'cancelled' && booking.buyer_id !== req.user.id) {
      return sendError(res, 'Only the buyer can cancel', 403);
    }
    if (['confirmed', 'completed'].includes(status) && booking.seller_id !== req.user.id) {
      return sendError(res, 'Only the seller can confirm or complete', 403);
    }

    const { data: updated, error } = await supabaseAdmin
      .from('bookings')
      .update({ status, response_message: response_message || null, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    // Notify the other party
    const notifyUserId = booking.buyer_id === req.user.id ? booking.seller_id : booking.buyer_id;
    await supabaseAdmin.from('notifications').insert([{
      id: uuidv4(),
      user_id: notifyUserId,
      title: 'Booking Update',
      message: `Your booking has been ${status}.`,
      type: 'booking',
      reference_id: id,
      is_read: false,
      created_at: new Date().toISOString(),
    }]);

    return sendSuccess(res, { booking: updated }, `Booking ${status}`);
  } catch (err) {
    return sendError(res, 'Failed to update booking', 500);
  }
};
