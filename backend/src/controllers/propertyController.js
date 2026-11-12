import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── Helper: build filter query ─────────────────────────────────────────────
const applyFilters = (query, filters) => {
  const {
    type, status, city, state, min_price, max_price,
    min_area, max_area, bedrooms, bathrooms, furnished,
    parking, owner_id,
  } = filters;

  if (type)       query = query.eq('type', type);
  if (status)     query = query.eq('status', status);
  if (city)       query = query.ilike('city', `%${city}%`);
  if (state)      query = query.ilike('state', `%${state}%`);
  if (min_price)  query = query.gte('price', Number(min_price));
  if (max_price)  query = query.lte('price', Number(max_price));
  if (min_area)   query = query.gte('area_sqft', Number(min_area));
  if (max_area)   query = query.lte('area_sqft', Number(max_area));
  if (bedrooms)   query = query.gte('bedrooms', Number(bedrooms));
  if (bathrooms)  query = query.gte('bathrooms', Number(bathrooms));
  if (furnished !== undefined) query = query.eq('furnished', furnished === 'true');
  if (parking !== undefined)   query = query.eq('parking', parking === 'true');
  if (owner_id)   query = query.eq('owner_id', owner_id);

  return query;
};

// ── GET /properties ────────────────────────────────────────────────────────
export const getProperties = async (req, res) => {
  try {
    const {
      page = 1, limit = 12, sort = 'created_at', order = 'desc',
      search, ...filters
    } = req.query;

    const from = (Number(page) - 1) * Number(limit);
    const to   = from + Number(limit) - 1;

    let query = supabaseAdmin
      .from('properties')
      .select(`
        id, title, type, status, price, area_sqft, bedrooms, bathrooms,
        city, state, address, latitude, longitude,
        images, thumbnail, is_featured, is_verified, views,
        furnished, parking, amenities,
        owner:owner_id (id, full_name, email, phone, avatar_url, role),
        created_at
      `, { count: 'exact' })
      .eq('is_active', true)
      .order(sort, { ascending: order === 'asc' })
      .range(from, to);

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,city.ilike.%${search}%,address.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    query = applyFilters(query, filters);

    const { data, error, count } = await query;
    if (error) throw error;

    return sendSuccess(res, {
      properties: data,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (err) {
    console.error('getProperties error:', err);
    return sendError(res, 'Failed to fetch properties', 500);
  }
};

// ── GET /properties/featured ───────────────────────────────────────────────
export const getFeaturedProperties = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('properties')
      .select(`
        id, title, type, status, price, area_sqft, bedrooms, bathrooms,
        city, state, images, thumbnail, is_featured, is_verified, views,
        owner:owner_id (id, full_name, avatar_url),
        created_at
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) throw error;
    return sendSuccess(res, { properties: data });
  } catch (err) {
    return sendError(res, 'Failed to fetch featured properties', 500);
  }
};

// ── GET /properties/:id ────────────────────────────────────────────────────
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .select(`
        *,
        owner:owner_id (id, full_name, email, phone, avatar_url, role, bio)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !property) return sendError(res, 'Property not found', 404);

    // Increment view count (fire-and-forget)
    supabaseAdmin
      .from('properties')
      .update({ views: (property.views || 0) + 1 })
      .eq('id', id)
      .then(() => {});

    // Fetch similar properties
    const { data: similar } = await supabaseAdmin
      .from('properties')
      .select('id, title, type, status, price, area_sqft, bedrooms, city, thumbnail, images')
      .eq('type', property.type)
      .eq('city', property.city)
      .eq('is_active', true)
      .neq('id', id)
      .limit(4);

    return sendSuccess(res, { property, similar: similar || [] });
  } catch (err) {
    console.error('getPropertyById error:', err);
    return sendError(res, 'Failed to fetch property', 500);
  }
};

// ── POST /properties ───────────────────────────────────────────────────────
export const createProperty = async (req, res) => {
  try {
    const {
      title, description, type, status, price, area_sqft,
      bedrooms, bathrooms, floors, year_built,
      address, city, state, country, zip_code, latitude, longitude,
      images, thumbnail, video_url, virtual_tour_url,
      amenities, nearby_facilities,
      furnished, parking, construction_status, ownership_type,
    } = req.body;

    if (!title || !type || !status || !price || !city) {
      return sendError(res, 'title, type, status, price and city are required', 400);
    }

    const id = uuidv4();
    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .insert([{
        id,
        title,
        description,
        type,           // land | house | apartment | villa | shop | office | commercial
        status,         // sale | rent
        price: Number(price),
        area_sqft: area_sqft ? Number(area_sqft) : null,
        bedrooms:  bedrooms  ? Number(bedrooms)  : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        floors:    floors    ? Number(floors)    : null,
        year_built: year_built ? Number(year_built) : null,
        address, city, state,
        country: country || 'India',
        zip_code,
        latitude:  latitude  ? Number(latitude)  : null,
        longitude: longitude ? Number(longitude) : null,
        images:    images    || [],
        thumbnail: thumbnail || (images?.[0] || null),
        video_url,
        virtual_tour_url,
        amenities:          amenities          || [],
        nearby_facilities:  nearby_facilities  || [],
        furnished:          furnished          ?? false,
        parking:            parking            ?? false,
        construction_status: construction_status || 'ready',
        ownership_type:     ownership_type     || 'freehold',
        owner_id:           req.user.id,
        is_active:  true,
        is_featured: false,
        is_verified: false,
        views: 0,
        created_at: new Date().toISOString(),
      }])
      .select('*')
      .single();

    if (error) throw error;
    return sendSuccess(res, { property }, 'Property listed successfully', 201);
  } catch (err) {
    console.error('createProperty error:', err);
    return sendError(res, 'Failed to create property', 500);
  }
};

// ── PUT /properties/:id ────────────────────────────────────────────────────
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from('properties')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (!existing) return sendError(res, 'Property not found', 404);
    if (existing.owner_id !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized', 403);
    }

    const updates = { ...req.body, updated_at: new Date().toISOString() };
    // Prevent overwriting immutable fields
    delete updates.id; delete updates.owner_id; delete updates.created_at;

    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return sendSuccess(res, { property }, 'Property updated');
  } catch (err) {
    return sendError(res, 'Failed to update property', 500);
  }
};

// ── DELETE /properties/:id ─────────────────────────────────────────────────
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: existing } = await supabaseAdmin
      .from('properties')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (!existing) return sendError(res, 'Property not found', 404);
    if (existing.owner_id !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized', 403);
    }

    // Soft delete
    await supabaseAdmin
      .from('properties')
      .update({ is_active: false, deleted_at: new Date().toISOString() })
      .eq('id', id);

    return sendSuccess(res, {}, 'Property deleted');
  } catch (err) {
    return sendError(res, 'Failed to delete property', 500);
  }
};

// ── POST /properties/ai-estimate ──────────────────────────────────────────
export const aiPriceEstimate = async (req, res) => {
  try {
    const { type, city, state, area_sqft, bedrooms, bathrooms, year_built, furnished } = req.body;

    if (!type || !city || !area_sqft) {
      return sendError(res, 'type, city and area_sqft are required for estimation', 400);
    }

    // Fetch comparable properties from DB
    const { data: comparables } = await supabaseAdmin
      .from('properties')
      .select('price, area_sqft, bedrooms, bathrooms, furnished, year_built')
      .eq('type', type)
      .ilike('city', `%${city}%`)
      .eq('is_active', true)
      .eq('status', 'sale')
      .limit(50);

    let estimated_price = null;
    let confidence = 'low';
    let comparable_count = 0;

    if (comparables && comparables.length > 0) {
      comparable_count = comparables.length;
      // Base: price per sqft from comparables
      const pricesPerSqft = comparables
        .filter(p => p.area_sqft > 0)
        .map(p => p.price / p.area_sqft);

      const avgPricePerSqft = pricesPerSqft.reduce((a, b) => a + b, 0) / pricesPerSqft.length;

      estimated_price = Math.round(avgPricePerSqft * Number(area_sqft));

      // Adjust for bedrooms
      if (bedrooms) {
        const avgBedrooms = comparables.reduce((a, b) => a + (b.bedrooms || 2), 0) / comparables.length;
        const bedroomDiff = Number(bedrooms) - avgBedrooms;
        estimated_price += bedroomDiff * 50000;
      }
      // Adjust for furnished
      if (furnished === true || furnished === 'true') {
        estimated_price = Math.round(estimated_price * 1.08);
      }
      // Age adjustment
      if (year_built) {
        const age = new Date().getFullYear() - Number(year_built);
        if (age > 20) estimated_price = Math.round(estimated_price * 0.92);
        else if (age < 3) estimated_price = Math.round(estimated_price * 1.05);
      }

      confidence = comparable_count >= 20 ? 'high' : comparable_count >= 5 ? 'medium' : 'low';
    } else {
      // Fallback: city-tier base rates (INR per sqft)
      const cityTiers = {
        mumbai: 25000, delhi: 18000, bangalore: 12000, hyderabad: 9000,
        pune: 8000, chennai: 7500, kolkata: 6000, default: 5000,
      };
      const rate = cityTiers[city.toLowerCase()] || cityTiers.default;
      estimated_price = Math.round(rate * Number(area_sqft));
      confidence = 'low';
    }

    const range_low  = Math.round(estimated_price * 0.9);
    const range_high = Math.round(estimated_price * 1.1);

    return sendSuccess(res, {
      estimate: {
        estimated_price,
        range_low,
        range_high,
        confidence,
        comparable_count,
        currency: 'INR',
        basis: comparable_count > 0 ? 'market_data' : 'city_average',
      },
    }, 'Price estimation complete');
  } catch (err) {
    console.error('aiPriceEstimate error:', err);
    return sendError(res, 'Estimation failed', 500);
  }
};

// ── GET /properties/stats ──────────────────────────────────────────────────
export const getPlatformStats = async (req, res) => {
  try {
    const [
      { count: total_properties },
      { count: for_sale },
      { count: for_rent },
      { count: total_users },
    ] = await Promise.all([
      supabaseAdmin.from('properties').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabaseAdmin.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'sale').eq('is_active', true),
      supabaseAdmin.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'rent').eq('is_active', true),
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
    ]);

    return sendSuccess(res, {
      stats: { total_properties, for_sale, for_rent, total_users, happy_clients: total_users },
    });
  } catch (err) {
    return sendError(res, 'Failed to fetch stats', 500);
  }
};

// ── GET /properties/my-listings ────────────────────────────────────────────
export const getMyListings = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('owner_id', req.user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return sendSuccess(res, { properties: data });
  } catch (err) {
    return sendError(res, 'Failed to fetch your listings', 500);
  }
};
