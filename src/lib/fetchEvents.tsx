import { supabase } from './supabase'; 

export const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('events') 
    .select('*');

  if (error) {
    console.error('Error fetching events from Supabase:', error.message);
    return [];
  }

  return data || [];
};
