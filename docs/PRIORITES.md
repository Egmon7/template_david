# B.E.A.U — Feuille de route et priorités

Plateforme de **centralisation, organisation, analyse et valorisation** des données urbaines (Kinshasa).  
Le système ne produit pas les données : il capitalise celles issues d'archives, ministères, ONG, ODK, ArcGIS, GPS et observations terrain.

---

## Priorité 1 — Réorganiser la navigation (5 domaines + Sources) ✅

- [x] Menu structuré en **5 domaines d'étude** + page transversale **Sources & documents**
- [x] **Géographie & démographie** (page dédiée, mock)
- [x] **Urbanisme & aménagement** (ex-planification, enrichi)
- [x] **Infrastructures & équipements** (tableau détaillé, import)
- [x] **Économie, mobilité & administration** (fusion mobilité + socio-éco)
- [x] **Environnement & patrimoines** (indicateurs + bloc patrimoine)
- [x] **Sources & documents** (catalogue mock : archives, ODK, ArcGIS…)
- [x] Outil transversal **Cartographie SIG** (24 communes, panneau détail)
- [x] Rôles et permissions par profil (admin, SIG, infra, env, projet, visiteur)
- [x] Redirections anciennes URLs (`planification`, `mobilite`, `socio-economique`)

---

## Priorité 2 — Traçabilité des données ⏳ partiel

Sur chaque fiche ou import :

- [x] **Commune / zone** (sélection obligatoire à l'import ; colonne dans le tableau)
- [x] **Type d'information** (infrastructure, indicateur env., indicateur socio-éco)
- [x] **Fichier d'origine** (nom affiché à la confirmation d'import)
- [x] **Responsable / référence / inspection** (fiches infrastructure mock + enrichissement)
- [x] **Catalogue sources** (origine, domaine, type, date, format sur page Sources)
- [ ] Champ **source explicite** à l'import (ODK, ArcGIS, ministère, terrain…)
- [ ] **Date de collecte** enregistrée sur chaque import
- [ ] Historique des versions / qui a importé quoi

---

## Priorité 3 — Intégration des outils existants ⏳ partiel

| Outil | Action | État |
|-------|--------|------|
| **Fichiers** | Import CSV, Excel (.xlsx), JSON | ✅ |
| **ODK** | Import dédié des exports d'enquêtes | ⏳ CSV/Excel générique (pas de connecteur ODK) |
| **ArcGIS** | Import GeoJSON / couches cartographiques | ❌ |
| **GPS** | Latitude / longitude sur chaque infrastructure | ❌ |

Autres livrés (hors outils métier) :

- [x] Modal import avec **confirmation** avant validation
- [x] Mise à jour des indicateurs après import (env., socio-éco, infrastructures)
- [x] Données en **session** (sessionStorage — perdues à la fermeture du navigateur)

---

## Priorité 4 — Enrichissement par domaine ✅

- [x] **Géographie** — population, foncier, conflits, acteurs (mock de base)
- [x] **Urbanisme** — occupation du sol, réserves foncières, évolution quartiers (mock)
- [x] **Infrastructures** — tableau détaillé, filtres, badges état, surbrillance imports
- [x] **Économie & mobilité** — indicateurs mobilité + grille socio-éco (mock + import)
- [x] **Environnement** — 6 indicateurs + patrimoine / sites (mock + import)
- [x] **Géographie** — enquêtes habitat-ménages liées aux données
- [x] **Urbanisme** — générateurs de déplacements, zones de croissance
- [x] **Infrastructures** — ports/rails, culture (financements gérés dans Gestion des projets)
- [x] **Économie** — finances locales, profil ménages détaillé
- [x] **Environnement** — ressources en eau, risques détaillés, tourisme

---

## Priorité 5 — Backend et persistance ❌

- [ ] API + base de données (PostgreSQL + PostGIS)
- [ ] Authentification réelle et droits par partenaire
- [ ] Persistance des imports (au-delà de la session navigateur)
- [ ] Historique des versions
- [ ] Exports rapports PDF / Excel réels

---

## Déjà en place (transversal)

- [x] Identité **B.E.A.U** (accueil, login, application)
- [x] Architecture multi-pages + tableau de bord
- [x] Carte cliquable + panneau latéral commune
- [x] Cohérence chiffres dashboard / carte / secteurs (depuis infrastructures affichées)
- [x] États vides et badges couleur (Critique, Dégradé, Bon…)
- [x] Mobile — menu burger, scroll contenu

---

## Synthèse rapide

| Priorité | Statut |
|----------|--------|
| 1 — Navigation 5 domaines | ✅ Fait |
| 2 — Traçabilité | ⏳ Partiel |
| 3 — ODK / ArcGIS / GPS | ⏳ Partiel (imports fichiers seulement) |
| 4 — Enrichissement domaines | ⏳ Partiel (mock + imports de base) |
| 5 — Backend | ❌ À faire |
