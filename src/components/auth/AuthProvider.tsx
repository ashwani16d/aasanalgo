import React, { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser, setProfile } = useAuthStore();

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          const { data: user } = await supabase.auth.getUser();
          if (user?.user?.email) {
            const { data: newProfile } = await supabase
              .from('profiles')
              .insert([
                {
                  id: userId,
                  email: user.user.email,
                  role: 'user'
                }
              ])
              .select()
              .single();

            if (newProfile) {
              setProfile(newProfile);
            }
          }
        }
        return;
      }

      if (profile) {
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Check for admin login status
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('adminLoggedIn');
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setProfile]);

  return <>{children}</>;
};