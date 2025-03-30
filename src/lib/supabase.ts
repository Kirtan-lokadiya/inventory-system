import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our parts table
export interface Part {
  id: number;
  serial_number: number;
  part_name: string;
  description: string | null;
  quantity: number;
  rate: number;
  image_url: string | null;
  warehouse_location: string | null;
  created_at: string;
  updated_at: string;
}

// Helper function to search parts
export async function searchParts(query: string) {
  const { data, error } = await supabase
    .from('parts')
    .select('*')
    .textSearch('part_name', query)
    .order('part_name', { ascending: true });
  
  if (error) throw error;
  return data;
}

// CRUD operations
export const partsApi = {
  // Create a new part
  create: async (part: Omit<Part, 'id' | 'serial_number' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('parts')
      .insert([part])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all parts
  getAll: async () => {
    const { data, error } = await supabase
      .from('parts')
      .select('*')
      .order('part_name', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Get a single part
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('parts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update a part
  update: async (id: number, updates: Partial<Part>) => {
    const { data, error } = await supabase
      .from('parts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a part
  delete: async (id: number) => {
    const { error } = await supabase
      .from('parts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Search parts by location
  searchByLocation: async (location: string) => {
    const { data, error } = await supabase
      .from('parts')
      .select('*')
      .ilike('warehouse_location', `%${location}%`)
      .order('warehouse_location', { ascending: true });
    
    if (error) throw error;
    return data;
  }
}; 