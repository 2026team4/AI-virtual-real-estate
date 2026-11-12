import { supabaseAdmin } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { v4 as uuidv4 } from 'uuid';

const BUCKET = 'property-images';

// ── Upload image (base64 → Supabase Storage) ──────────────────────────────
export const uploadImage = async (req, res) => {
  try {
    const { file, fileName, folder = 'properties' } = req.body;

    if (!file) return sendError(res, 'file (base64) is required', 400);

    // Strip data URL prefix if present
    const base64 = file.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const ext    = fileName ? fileName.split('.').pop() : 'jpg';
    const name   = `${folder}/${uuidv4()}.${ext}`;

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(name, buffer, {
        contentType: `image/${ext}`,
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return sendSuccess(res, { url: publicUrl, path: data.path }, 'Image uploaded', 201);
  } catch (err) {
    console.error('uploadImage error:', err);
    return sendError(res, 'Image upload failed', 500);
  }
};

// ── Delete image from Supabase Storage ────────────────────────────────────
export const deleteImage = async (req, res) => {
  try {
    const { path } = req.body;
    if (!path) return sendError(res, 'path is required', 400);

    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);
    if (error) throw error;

    return sendSuccess(res, {}, 'Image deleted');
  } catch (err) {
    return sendError(res, 'Failed to delete image', 500);
  }
};
