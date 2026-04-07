import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './auth-provider';
import { toast } from 'sonner';
import { Tables } from '@/types/supabase';

type Profile = Tables<'profiles'>;

interface ProfileContextType {
    profile: Profile | null;
    loading: boolean;
    updateProfile: (updates: { username: string; avatar_file?: File | null }) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error, status } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setProfile(data);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast.error('Could not get profile: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = async ({ username, avatar_file }: { username: string; avatar_file?: File | null }) => {
        if (!user) return;

        const promise = async () => {
            let avatar_url = profile?.avatar_url;

            if (avatar_file) {
                const fileExt = avatar_file.name.split('.').pop();
                const filePath = `${user.id}-${Math.random()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatar_file, { upsert: true });

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
                avatar_url = urlData.publicUrl;
            }

            const updates = {
                id: user.id,
                username,
                avatar_url,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;
            
            // Re-fetch profile to update UI state
            await fetchProfile();
        };

        toast.promise(promise(), {
            loading: 'Updating profile...',
            success: 'Profile updated successfully!',
            error: 'Failed to update profile.',
        });
    };

    const value = {
        profile,
        loading,
        updateProfile,
    };

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}
