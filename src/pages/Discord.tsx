import { useEffect } from "react";

export default function Discord() {
  useEffect(() => {
    window.location.href = "https://discord.gg/hanzo";
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting to Discord...</p>
      </div>
    </div>
  );
}
