import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── Get user's favorites ───────────────────────────────────────────────────
export const getFavorites = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('favorites')
      .select(`
        id, created_at,
        property:property_id (
          id, title, type, status, price, area_sqft, bedrooms, bathrooms,
          city, state, thumbnail, images, is_verified,
          owner:owner_id (id, full_name, avatar_url)
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return sendSuccess(res, { favorites: data });
  } catch (err) {
    return sendError(res, 'Failed to fetch favorites', 500);
  }
};

// ── Toggle favorite ────────────────────────────────────────────────────────
export const toggleFavorite = async (req, res) => {
  try {
    const { property_id } = req.body;
    if (!property_id) return sendError(res, 'property_id is required', 400);

    const { data: existing } = await supabaseAdmin
      .from('favorites')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('property_id', property_id)
      .single();

    if (existing) {
      // Remove
      await supabaseAdmin.from('favorites').delete().eq('id', existing.id);
      return sendSuccess(res, { favorited: false }, 'Removed from favorites');
    } else {
      // Add
      const { error } = await supabaseAdmin.from('favorites').insert([{
        id: uuidv4(),
        user_id: req.user.id,
        property_id,
        created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      return sendSuccess(res, { favorited: true }, 'Added to favorites');
    }
  } catch (err) {
    return sendError(res, 'Failed to toggle favorite', 500);
  }
};

// ── Check if favorited ─────────────────────────────────────────────────────
export const checkFavorite = async (req, res) => {
  try {
    const { property_id } = req.params;
    const { data } = await supabaseAdmin
      .from('favorites')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('property_id', property_id)
      .single();

    return sendSuccess(res, { favorited: !!data });
  } catch (err) {
    return sendError(res, 'Failed to check favorite', 500);
  }
};
