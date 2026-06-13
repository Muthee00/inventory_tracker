import { useEffect, useRef } from "react";
import { useAuth } from "./../contexts/AuthContext";
import { toast } from "./../hooks/use-toast";

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleSignInButton() {
  const ref = useRef<HTMLDivElement>(null);
  const { googleLogin } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!clientId || !ref.current) return;
    let cancelled = false;

    const init = () => {
      if (cancelled || !window.google || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (resp: { credential: string }) => {
          try {
            await googleLogin(resp.credential);
          } catch (err: any) {
            toast({
              title: "Google sign-in failed",
              description: err?.message ?? "Please try again.",
              variant: "destructive",
            });
          }
        },
      });
      window.google.accounts.id.renderButton(ref.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with",
      });
    };

    if (window.google?.accounts?.id) {
      init();
    } else {
      const interval = window.setInterval(() => {
        if (window.google?.accounts?.id) {
          window.clearInterval(interval);
          init();
        }
      }, 200);
      return () => {
        cancelled = true;
        window.clearInterval(interval);
      };
    }
  }, [clientId, googleLogin]);

  if (!clientId) {
    return (
      <p className="text-xs text-muted-foreground text-center">
        Set <code>VITE_GOOGLE_CLIENT_ID</code> to enable Google sign-in.
      </p>
    );
  }

  return <div ref={ref} className="flex justify-center" />;
}