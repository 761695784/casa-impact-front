# Casa Impact — Plan d'intégration frontend ↔ backend

Ce plan découle directement de l'audit livré (`casa-impact-audit-frontend-backend.md`). Il suit l'ordre de branchement déjà validé, avec pour chaque étape : l'objectif, les fichiers concernés, les actions concrètes, et un protocole de test que **tu** exécutes toi-même (backend en local sur ton PC), puisque c'est le mode de validation retenu. Après chaque étape, tu me dis ce qui marche et ce qui casse, je corrige, et on ne passe à l'étape suivante que quand c'est propre.

Règle constante sur tout le plan : le backend Laravel et ses Form Requests restent la source de vérité. Je ne modifie le backend que si l'audit a identifié une incohérence réelle côté backend (3 points identifiés, tous mineurs) — jamais pour imiter le frontend.

---

## Prérequis immédiat : confirmer l'URL du backend local

Avant la Phase 0, j'ai besoin d'une information que toi seul as : sur quel port tourne (ou tournera) ton `php artisan serve` (ou Herd/Valet/XAMPP) ? Par défaut Laravel écoute sur `http://127.0.0.1:8000`. Si c'est un autre port ou une autre configuration (Herd donne souvent une URL du type `http://casa-impact.test`), dis-le-moi et je m'en sers directement dans `.env.local`.

En parallèle, vérifie que ton backend a bien `SANCTUM_STATEFUL_DOMAINS` et `SESSION_DOMAIN` configurés pour accepter le frontend en local (ex: `localhost:3000`), sinon Sanctum refusera les cookies de session en cross-origin même une fois le CSRF correctement câblé.

---

## Phase 0 — Fondations transverses (bloquant, à faire en premier)

Rien d'autre ne peut être testé correctement tant que ces points ne sont pas réglés — ce sont les 4 premiers "constats qui bloquent tout" de l'audit.

**Fichiers concernés** : nouveau `.env.local`, client API central (à créer/localiser — actuellement chaque service a son propre `fetch`), `lib/auth/auth-context.tsx`, `hooks/use-permissions.ts`, `types/models.ts`/`types/admin.ts`, `app/admin/(protected)/layout.tsx`.

**Actions :**
1. Créer `.env.local` avec `NEXT_PUBLIC_API_URL` (ton URL locale) et `NEXT_PUBLIC_DATA_SOURCE=api`.
2. Centraliser les appels API dans un client unique qui : lit le cookie `XSRF-TOKEN` posé par `/sanctum/csrf-cookie` et l'envoie systématiquement en header `X-XSRF-TOKEN` sur POST/PUT/PATCH/DELETE ; envoie toujours `credentials: 'include'` ; lève une erreur typée qui conserve `error.errors` (422) en plus de `error.message`.
3. Corriger `User`/rôle : remplacer la lecture `user.role.slug` par la vraie forme `roles: string[]` + clé racine `permissions` renvoyée par `/api/admin/me`. Adapter `hasPermission`/`hasRole` en conséquence, avec le vrai format `"resource.action"`.
4. Fusionner les deux instances `AuthProvider` (login vs layout admin) en une seule, montée une fois au niveau racine du groupe `admin`.
5. Ajouter la redirection vers `/admin/login` sur 401/session absente dans le layout protégé.
6. Retirer les identifiants de démo pré-remplis du formulaire de login.

**Test à faire toi-même :**
- Lancer le backend local, vérifier `GET /sanctum/csrf-cookie` puis `GET /api/admin/me` répondent bien dans l'onglet réseau du navigateur (avant même de te connecter, `/me` doit renvoyer 401 proprement, pas planter l'app).
- Aucune fonctionnalité visible ne change encore à ce stade — c'est un test de plomberie, pas de fonctionnalité.

---

## Phase 1 — Lecture publique (site public)

**Objectif** : le site public n'affiche plus aucune donnée fabriquée.

**Fichiers concernés** : `lib/services/content.service.ts` (à réécrire entièrement avec le pattern `DATA_SOURCE` déjà utilisé côté admin), pages publiques correspondantes.

**Ordre (du plus simple/aligné au plus risqué) :**
1. Domaines
2. Partenaires
3. Programmes + Types de programme
4. Appels à candidatures
5. Actualités
6. Talents + Témoignages (corrections de champs : `domain_id`, `presentation`, `liens_externes`, `role_organisation`, `citation`, `program_id`, ajout de `projet`/`realisations`/`temoignage`/`recit_titre`/`recit_corps` sur Talent, `contexte`/`application_call_id` sur Témoignage)
7. Indicateurs d'impact public
8. Cartographie (`GET /api/public/map`)

**Test à faire toi-même, page par page :**
- La page affiche les vraies données du backend (pas de flash de contenu mock).
- La pagination fonctionne (si plusieurs pages de données existent).
- Une page de détail par slug charge bien la bonne ressource.
- Un état vide (aucune donnée dans une catégorie) s'affiche proprement, sans erreur JS.

---

## Phase 2 — Authentification admin

**Fichiers concernés** : `lib/auth/auth-context.tsx`, page de login admin.

**Actions** : basculer réellement sur `DATA_SOURCE=api`, s'assurer que le flux `csrf-cookie → POST /api/admin/login → /api/admin/me` fonctionne de bout en bout avec un vrai compte que tu me donneras (ou que tu testeras toi-même).

**Test à faire toi-même :**
- Connexion avec un compte valide → redirection dashboard, nom/rôle affiché correctement.
- Connexion avec mauvais mot de passe → message d'erreur clair, pas de crash.
- Déconnexion → session bien coupée côté serveur (retester `/me` après logout, doit redonner 401).
- Rôle non-`administrateur-principal` → vérifier que les sections interdites sont bien masquées/bloquées dans le menu.

---

## Phase 3 — Lecture admin

**Ordre recommandé** (aligné avec l'audit, du moins risqué au plus cassé) :
1. Dashboard
2. Domaines, Partenaires
3. Programmes, Types de programme
4. Appels à candidatures, Candidatures
5. Actualités
6. Talents, Témoignages
7. Pages CMS, Messages de contact (corriger `contenu`→`corps` sur Pages ; retirer l'appel à la route `/{id}/read` inexistante et aligner l'enum de statut sur 2 valeurs)
8. Impact (corriger la base URL `/api/admin/impact` → `/api/admin/impact-indicators`, `valeurs`→`values`)
9. Cartographie (corriger l'endpoint, implémenter les fonctions d'écriture manquantes `PUT /api/admin/locations` / `DELETE .../{id}`)
10. Adhésions
11. Utilisateurs & rôles

**Test à faire toi-même, par ressource :**
- La liste affiche les vraies données, pagination + filtres + tri fonctionnent.
- Erreurs de validation lisibles si tu forces une recherche/filtre invalide.
- Comportement correct sans données (liste vide).
- Permissions : un rôle sans droit sur une ressource ne voit pas l'action correspondante (ou reçoit un 403 propre).

---

## Phase 4 — Créations et mises à jour

Câblées ressource par ressource, dans le même ordre que la Phase 3, une fois sa lecture validée.

**Actions transverses :**
- Chaque formulaire de création/édition doit respecter exactement les champs du vrai Form Request (pas de champ inventé envoyé en plus, pas de champ requis manquant).
- Ajouter partout la lecture de `error.errors` (422) pour afficher les erreurs par champ, au lieu du seul message générique.

**Décisions produit à trancher avec toi avant de coder certains écrans** (rappel de l'audit — section "Décisions à prendre") : scope de la médiathèque, champ `ordre` sur Talent/Témoignage, association Talent↔Programme, champs `slug`/`contact_*` sur Partenaire, notion de message "lu", `notes_internes` sur Candidature, champs additionnels Impact, vue liste des localisations, statut de compte utilisateur, nullabilité `domaine_contribution`/`type_contribution` sur Adhésion.

**Test à faire toi-même, par ressource :**
- Création avec données valides → l'élément apparaît bien dans la liste juste après.
- Création avec un champ obligatoire manquant → message d'erreur au bon endroit du formulaire (pas juste un toast générique).
- Modification → les changements persistent après rechargement de la page.

---

## Phase 5 — Uploads

**Fichiers concernés** : `lib/services/media.service.ts` (à réécrire sur les 2 vrais endpoints `POST`/`DELETE /api/admin/media`), formulaires Talents/Témoignages/Partenaires, upload de documents de candidature, photo d'adhésion.

**Actions :**
- Tout flux qui envoie actuellement du JSON avec un champ `photo`/`logo` direct doit passer par le mécanisme polymorphe (`mediable_type`/`mediable_id`) en `multipart/form-data`.
- Documents de candidature et photo d'adhésion : confirmer `FormData`/multipart, pas JSON.

**Test à faire toi-même :**
- Upload d'une image sur une fiche Talent → l'image est bien visible ensuite sur la fiche publique.
- Suppression d'un média → disparaît bien des deux côtés (admin + public).
- Upload d'un fichier trop lourd ou d'un mauvais format → message d'erreur clair (test des règles de validation réelles du backend).

---

## Phase 6 — Formulaires publics

C'est la phase la plus visible côté utilisateur final — les 3 formulaires publics ne font aujourd'hui aucun appel réseau.

**Candidature** (`components/opportunities/application-form.tsx`) :
- Ajouter les champs manquants : `application_call_id`, `region`, `tranche_age`, `niveau_etudes`.
- Ajouter l'UI d'upload de documents (actuellement absente).
- Remplacer la simulation par un vrai `POST` en `multipart/form-data`.

**Adhésion** (`components/membership/membership-form.tsx`) :
- Ajouter la case à cocher `engagement_moral` (absente).
- Rendre `departement` conditionnellement obligatoire selon la région choisie.
- Utiliser le bon numéro (`shopPhone`/`shopWhatsapp`, pas `phone`) pour le parcours Wave.
- Retirer toute formulation laissant croire à une validation/paiement automatique ("validation immédiate", carte de membre pré-affichée) — remplacer par un message honnête : la demande est enregistrée, la confirmation de paiement Wave est manuelle côté admin.
- Rendre la photo réellement obligatoire si le backend l'exige, connecter au vrai `POST` multipart.

**Contact** (`components/contact/contact-form.tsx` ou équivalent) :
- Déjà aligné côté champs — juste connecter au vrai `POST`.

**Test à faire toi-même :**
- Soumettre chaque formulaire avec des données valides → vérifier côté admin (Phase 3 déjà câblée) que l'entrée apparaît bien réellement en base, avec la bonne référence générée par le serveur (pas une référence inventée côté client).
- Soumettre avec un champ invalide → l'erreur 422 s'affiche au bon endroit.
- Adhésion : vérifier qu'aucun message n'affirme une confirmation de paiement avant l'action manuelle de l'admin.

---

## Phase 7 — Erreurs, chargement, et nettoyage final

**Actions :**
- Harmoniser la gestion 401 (redirection login), 403 (message clair, pas de crash), 404 (page/état "introuvable"), 422 (erreurs par champ), 500 (message générique + log console pour debug).
- États de chargement (skeletons/spinners) et états vides cohérents sur toutes les listes.
- Retirer ou isoler tous les fichiers mock restants (`lib/mock/*`) dans un dossier explicitement non importé par le code de production, ou les supprimer une fois chaque ressource migrée — pour qu'un retour accidentel à `DATA_SOURCE=mock` en production soit impossible (on peut par exemple forcer `DATA_SOURCE` à `'api'` en dur pour les builds de production et ne garder le mock que pour un usage `next dev` explicitement documenté).

**Test à faire toi-même :**
- Couper le backend et recharger l'app → vérifier qu'on a un message d'erreur propre partout, pas un écran blanc ou un crash React.
- Vérifier qu'aucune donnée mock n'apparaît plus nulle part, même en cas d'erreur réseau.

---

## Comment on procède concrètement

Je code une phase (ou une sous-partie clairement délimitée d'une phase), je te dis précisément quoi tester et où regarder (quel écran, quelle action), tu testes sur ta machine et tu me rapportes le résultat — captures d'écran ou description de ce qui s'affiche/plante suffisent. Je corrige si besoin, puis on passe à la suite. On garde ce fichier comme feuille de route ; je peux le remettre à jour au fil de l'eau si l'ordre doit changer suite à une découverte en cours de route.

**Prochaine action concrète** : confirme l'URL locale de ton backend (port `php artisan serve`, ou URL Herd/Valet), et dis-moi si `SANCTUM_STATEFUL_DOMAINS`/`SESSION_DOMAIN` sont déjà configurés côté `.env` Laravel — sinon je te donne les valeurs à y mettre. Dès que j'ai ça, j'attaque la Phase 0.
