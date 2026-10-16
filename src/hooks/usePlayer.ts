import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function usePlayer() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      const { data } = await supabase.auth.getUser();
      if (alive) { setUser(data.user); setLoading(false); }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { void refresh(); });
    void refresh();
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);
  return { user, loading };
}