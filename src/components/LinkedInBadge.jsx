import { useEffect } from 'react';

export default function LinkedInBadge({ vanityName }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.linkedin.com/badges/js/profile.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="flex justify-center w-full my-6">
      <div 
        className="badge-base LI-profile-badge" 
        data-locale="en_US" 
        data-size="large" 
        data-theme="light" 
        data-type="HORIZONTAL" 
        data-vanity={vanityName} 
        data-version="v1"
      >
        <a 
          className="badge-base__link LI-simple-link" 
          href={`https://lk.linkedin.com/in/${vanityName}?trk=profile-badge`}
        >
          Kavishka Dulshan
        </a>
      </div>
    </div>
  );
}