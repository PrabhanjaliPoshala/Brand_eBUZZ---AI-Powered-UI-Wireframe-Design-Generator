import { createClient } from '@supabase/supabase-js';
import { User, UserRole } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabase client initialization
let supabase: ReturnType<typeof createClient> | null = null;

export const isSupabaseConfigured =
  SUPABASE_URL.trim() !== '' && SUPABASE_KEY.trim() !== '';

export { supabase };

if (isSupabaseConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (err) {
    console.warn('Failed to initialize Supabase:', err);
    supabase = null;
  }
}

/**
 * Authentication service wrapping Supabase Auth
 */
export const authService = {
  async signUp(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: User | null; error: string | null }> {
    if (!supabase) {
      return {
        user: null,
        error: 'Supabase is not configured.',
      };
    }

    try {
      // Never allow the client to choose an admin role.
      const role: UserRole = 'user';

      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        return {
          user: null,
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          user: null,
          error: 'Signup failed. No user was returned.',
        };
      }

      const user = data.user as any;
      const profile: User = {
        id: user.id,
        name: name || email.split('@')[0],
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          name || email
        )}`,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      // Create/update the user's profile.
      const { error: profileError } = await supabase!
        .from('profiles')
        .upsert(
          {
            id: user.id,
            email,
            name: profile.name,
            role: 'user',
            avatar: profile.avatar,
            status: 'active',
          } as any,
          {
            onConflict: 'id',
          }
        ) as any;

      if (profileError) {
        console.error('Profile creation failed:', profileError);

        return {
          user: null,
          error: `Account created, but profile setup failed: ${profileError.message}`,
        };
      }

      return {
        user: profile,
        error: null,
      };
    } catch (err: any) {
      return {
        user: null,
        error: err?.message || 'Supabase signup failed',
      };
    }
  },

  async signIn(
    email: string,
    password: string
  ): Promise<{ user: User | null; error: string | null }> {
    if (!supabase) {
      return {
        user: null,
        error: 'Supabase is not configured.',
      };
    }

    try {
      const { data, error } =
        await supabase!.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        return {
          user: null,
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          user: null,
          error: 'Login failed. No user was returned.',
        };
      }

      // Get application profile.
      const { data: profile, error: profileError } =
        await supabase!
          .from('profiles')
          .select('*')
          .eq('id', (data.user as any).id)
          .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile lookup failed:', profileError);
      }

      const profileData = profile as any;
      const userData = data.user as any;
      const user: User = profileData
        ? {
            id: profileData.id,
            name: profileData.name,
            email: profileData.email,
            role: profileData.role || 'user',
            avatar: profileData.avatar || '',
            status: profileData.status || 'active',
            createdAt:
              profileData.created_at ||
              new Date().toISOString(),
          }
        : {
            id: userData.id,
            name:
              userData.user_metadata?.name ||
              email.split('@')[0],
            email,
            role: 'user',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
              email
            )}`,
            status: 'active',
            createdAt: new Date().toISOString(),
          };

      return {
        user,
        error: null,
      };
    } catch (err: any) {
      return {
        user: null,
        error: err?.message || 'Supabase login failed',
      };
    }
  },

  async signOut(): Promise<void> {
    if (!supabase) return;

    try {
      const { error } = await supabase!.auth.signOut();

      if (error) {
        console.warn('Supabase sign out warning:', error.message);
      }
    } catch (err) {
      console.warn('Supabase sign out warning:', err);
    }
  },

  async resetPassword(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    if (!supabase) {
      return {
        success: false,
        message: 'Supabase is not configured.',
      };
    }

    try {
      const { error } =
        await supabase!.auth.resetPasswordForEmail(email);

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: true,
        message:
          'Password reset link sent to your email address.',
      };
    } catch (err: any) {
      return {
        success: false,
        message:
          err?.message ||
          'Failed to send password reset link.',
      };
    }
  },
};