import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBookmarks } from '@/contexts/bookmarks-provider';
import { toast } from 'sonner';

export function ShareTargetHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addBookmark } = useBookmarks();

  useEffect(() => {
    const url = searchParams.get('url');
    const title = searchParams.get('title');
    const text = searchParams.get('text');

    if (url) {
      addBookmark({
        url,
        title: title || text || 'Shared Link',
        description: text || '',
        favicon_url: null
      }, []).then(() => {
        toast.success('Bookmark saved from share!');
        navigate('/dashboard');
      }).catch(() => {
        toast.error('Failed to save bookmark');
        navigate('/dashboard');
      });
    } else {
      navigate('/dashboard');
    }
  }, [searchParams, addBookmark, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Saving bookmark...</p>
      </div>
    </div>
  );
}
