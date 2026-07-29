export default function MentionsLegalesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Éditeur du site</h2>
          <p className="mb-2">Le site [Nom de ton site / de l'application] (ci-après "le Site") est édité par :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Nom / Raison sociale :</strong> [Ton Prénom Nom ou Nom de ta société]</li>
            <li><strong>Statut juridique :</strong> [ex: Auto-entrepreneur, SASU, SAS...]</li>
            <li><strong>Capital social :</strong> [Montant] €</li>
            <li><strong>Siège social :</strong> [Adresse de ton entreprise ou ton adresse perso]</li>
            <li><strong>Numéro SIRET :</strong> [Ton numéro SIRET]</li>
            <li><strong>RCS :</strong> [Ville de ton RCS]</li>
            <li><strong>Email de contact :</strong> [Ton adresse email de contact]</li>
            <li><strong>Téléphone :</strong> [Ton numéro de téléphone]</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Directeur de la publication</h2>
          <p>Le Directeur de la publication est : [Ton Prénom Nom].</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Hébergement du site</h2>
          <p className="mb-2">Le Site est hébergé par :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Nom de l'hébergeur :</strong> [ex: Vercel Inc. / AWS / OVH]</li>
            <li><strong>Adresse :</strong> [Adresse postale de l'hébergeur]</li>
            <li><strong>Contact :</strong> [Site web ou email de l'hébergeur]</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments figurant sur le Site (textes, graphismes, logos, conception technique, etc.) sont protégés par le droit de la propriété intellectuelle. Toute reproduction, représentation, modification ou adaptation de tout ou partie du Site est strictement interdite sans l'accord préalable écrit de l'éditeur.
          </p>
        </section>
      </div>
    </div>
  );
}