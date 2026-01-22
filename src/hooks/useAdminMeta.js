import { useEffect } from 'react';

const useAdminMeta = (title, description) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;
    
    // Cleanup on unmount
    return () => {
      document.title = 'TechMart Admin';
    };
  }, [title, description]);
};

export default useAdminMeta;