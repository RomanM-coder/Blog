// import { useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

// const BrowserChecker = () => {
//   const navigate = useNavigate();
//   const hasRedirected = useRef(false); // Флаг для отслеживания редиректа

//   useEffect(() => {
//     if (hasRedirected.current) return; // Уже был редирект
    
//     const isUnsupported = () => {
//       const ua = navigator.userAgent;
//       const checks = [
//         /MSIE [1-9]\./,      // IE < 10
//         /Trident\/7\.0/,      // IE11
//         /Chrome\/[0-5][0-9]\./, // Chrome < 60
//         /Firefox\/[0-4][0-9]\./ // Firefox < 50
//       ];
//       return checks.some(regex => regex.test(ua));
//     };

//     if (isUnsupported()) {
//       hasRedirected.current = true; // Помечаем редирект как выполненный
//       navigate('/unsupported-browser', { replace: true });
//     }
//   }, [navigate]);

//   return null;
// };

// export default BrowserChecker;

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BrowserChecker = () => {
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current || typeof navigator === 'undefined') return;

    const isUnsupported = () => {
      try {
        const ua = navigator.userAgent;
        console.log('Detected User-Agent:', ua); // Для отладки
        
        // Расширенные проверки
        const checks = [
          /MSIE [1-9]\./i,       // IE < 10
          /Trident\/[0-7]\.0/i,   // IE до 11
          /Edge\/[0-9]\./i,       // Старые Edge
          /Chrome\/[0-5][0-9]\./i, // Chrome < 60
          /Firefox\/[0-4][0-9]\./i, // Firefox < 50
          /Safari\/[0-5][0-9]\./i,  // Старые Safari
          /Opera\/[0-4][0-9]\./i    // Старые Opera
        ];
        
        return checks.some(regex => regex.test(ua));
      } catch (e) {
        console.error('Browser check failed:', e);
        return false;
      }
    };

    if (isUnsupported()) {
      console.log('Unsupported browser detected - redirecting');
      hasRedirected.current = true;
      
      // Два варианта на случай проблем с navigate
      try {
        navigate('/unsupported-browser', { replace: true });
      } catch (e) {
        console.error('Navigation failed, using window.location:', e);
        window.location.replace('/unsupported-browser');
      }
    }
  }, [navigate]);

  return null;
};

export default BrowserChecker;