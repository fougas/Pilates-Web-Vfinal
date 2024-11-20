import React, { useState, useEffect } from "react";

const InstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier si on est sur iOS et dans Safari
    const isIos = /iphone|ipad|ipod/.test(
      window.navigator.userAgent.toLowerCase()
    );
    const isInStandaloneMode =
      "standalone" in window.navigator && window.navigator.standalone;

    // Montrer la bannière uniquement sur iOS Safari et si pas déjà installée
    if (isIos && !isInStandaloneMode) {
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-200">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold">Installez l'application</h3>
          <p className="text-xs text-gray-600">
            1. Appuyez sur le bouton partager 2. "Sur l'écran d'accueil"
          </p>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="text-sm text-gray-500 px-3 py-1"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default InstallBanner;
