// Fichier : src/app/app/layout.tsx

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* Fond noir centré sur PC/iPad */
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      
      {/* Faux téléphone (max 430px) appliqué uniquement dans /app */}
      <div className="relative w-full max-w-[430px] h-[100dvh] bg-black shadow-2xl overflow-hidden transform-gpu border-x border-white/10">
        {children}
      </div>

    </div>
  );
}