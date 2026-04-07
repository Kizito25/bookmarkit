import { useState, useEffect } from "react";
import { X, Download, Share, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-install-dismissed-at";
const DISMISS_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const rememberDismissal = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // Ignore storage failures; dismissal state still stored in memory
    }
    setShowAndroidPrompt(false);
    setShowIOSPrompt(false);
  };

  const hasRecentDismissal = () => {
    try {
      const stored = localStorage.getItem(DISMISS_KEY);
      if (!stored) return false;
      const timestamp = Number.parseInt(stored, 10);
      if (Number.isNaN(timestamp)) return false;
      return Date.now() - timestamp < DISMISS_TTL;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const recentlyDismissed = hasRecentDismissal();
    if (recentlyDismissed) {
      setIsDismissed(true);
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    if (recentlyDismissed) return;

    // Android Chrome install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowAndroidPrompt(true);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setShowAndroidPrompt(false);
      setShowIOSPrompt(false);
    };

    // iOS Safari detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = (window.navigator as unknown as { standalone?: boolean }).standalone;

    if (isIOS && !isInStandaloneMode) {
      // Show iOS prompt after a delay
      setTimeout(() => setShowIOSPrompt(true), 3000);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowAndroidPrompt(false);
      setIsInstalled(true);
    } else {
      rememberDismissal();
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || isDismissed) return null;

  return (
    <>
      {/* Android Install Prompt */}
      {showAndroidPrompt && (
        <div className="fixed bottom-4 left-4 right-4 bg-background border rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-start gap-3">
            <Download className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Install Bookmc</h3>
              <p className="text-xs text-muted-foreground">
                Add to home screen for quick access
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAndroidInstall}>
                Install
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={rememberDismissal}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Install Prompt */}
      {showIOSPrompt && (
        <div className="fixed bottom-4 left-4 right-4 bg-background border rounded-lg p-2 shadow-lg z-50">
          <div className="flex items-start gap-3">
            <Share className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex flex-1 flex-col">
              <h3 className="font-semibold text-sm mb-2">Install Bookmc</h3>
              <p className="text-xs text-muted-foreground mb-2 flex items-center">
                Tap <Share className="inline h-3 w-3 mx-1" /> then "Add to Home
                Screen"
              </p>
              <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                <p className="text-muted-foreground flex items-center">
                  <span>1. Tap</span>
                  <Share className="h-3 w-3" />
                </p>
                <p className="text-muted-foreground flex items-center">
                  <span>2. Scroll down </span>
                </p>
                <p className="text-muted-foreground flex items-center">
                  <span>3. Tap</span>
                  <Plus className="h-3 w-3" />
                  <span>"Add to Home Screen"</span>
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={rememberDismissal}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
