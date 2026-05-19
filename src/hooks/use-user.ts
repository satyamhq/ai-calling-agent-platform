import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/app-store';

export function useUser() {
  const supabase = createClient();
  const { profile, setProfile } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setProfile(null);
          return;
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!profile) {
      fetchUser();
    } else {
      setLoading(false);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        } else if (session) {
          fetchUser();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { profile, loading };
}
