export default function CGUPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Conditions Générales d'Utilisation (CGU)</h1>
      <p className="text-sm text-gray-500 mb-8">Date de dernière mise à jour : [Date du jour]</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Objet</h2>
          <p>
            Les présentes Conditions Générales d’Utilisation ont pour objet d'encadrer l'accès et l'utilisation du site https://www.toneden.io/ et de ses services. En naviguant sur ce site, l'utilisateur accepte sans réserve les présentes CGU.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Accès au site et aux services</h2>
          <p className="mb-2">
            Le site est accessible gratuitement en tout lieu à tout utilisateur ayant un accès à Internet. L'éditeur met en œuvre tous les moyens techniques pour assurer un accès de qualité, mais ne saurait être tenu responsable des coupures ou dysfonctionnements du réseau ou des serveurs.
          </p>
          <p>
            L'accès à certains services peut nécessiter la création d'un compte utilisateur. [À adapter au besoin]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Responsabilité de l'utilisateur</h2>
          <p>
            L'utilisateur s'engage à utiliser le site de manière conforme à la loi et s'interdit toute action pouvant nuire au bon fonctionnement technique du site. L'utilisateur est seul responsable de l'usage qu'il fait des informations présentes sur le site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Responsabilité de l'éditeur</h2>
          <p>
            L'éditeur s'efforce de fournir des informations précises et à jour, mais ne peut garantir l'exactitude absolue des contenus. L'éditeur décline toute responsabilité quant aux éventuels bugs, virus ou dommages matériels liés à l'utilisation du site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Données personnelles et cookies</h2>
          <p>
            L'utilisation du site peut entraîner la collecte de données personnelles. Celles-ci sont traitées dans le respect du RGPD. Pour en savoir plus sur la gestion de vos données et vos droits, veuillez consulter notre [Politique de Confidentialité].
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Modification des CGU</h2>
          <p>
            L'éditeur se réserve le droit de modifier librement et à tout moment les présentes CGU afin de les adapter aux évolutions du site ou de la législation. Les utilisateurs seront informés de ces changements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7. Droit applicable et juridiction compétente</h2>
          <p>
            Les présentes CGU sont régies par la loi française. En cas de litige, et à défaut d'accord amiable, les tribunaux français seront seuls compétents.
          </p>
        </section>
      </div>
    </div>
  );
}