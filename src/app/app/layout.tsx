export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* CORRECTION : h-[100dvh] et overflow-hidden stricts pour bloquer tout scroll global */
    <div className="h-[100dvh] w-full flex items-center justify-center bg-black text-white overflow-hidden">
      
      {/* Faux téléphone (max 430px) appliqué uniquement dans /app */}
      <div className="relative w-full max-w-[430px] h-[100dvh] bg-black shadow-2xl overflow-hidden transform-gpu border-x border-white/10">
        {children}
      </div>

    </div>
  );
}