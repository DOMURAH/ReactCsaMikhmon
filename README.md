# CSVMikhmon — Intégration Clerk

Documentation des modifications apportées au frontend React pour intégrer l'authentification **Clerk**, tout en conservant le design existant des pages de connexion et d'inscription.

---

## Résumé

| Avant | Après |
|-------|-------|
| `/` affichait le formulaire Login custom (API `127.0.0.1:8000`) | `/` affiche une page d'accueil professionnelle avec boutons Clerk |
| `/signup` pour l'inscription manuelle | `/sign-up` avec design custom à gauche + composant Clerk à droite |
| Protection des routes via `fetch` + cookies backend | Protection via `useAuth()` de `@clerk/react` |
| Pas de Clerk configuré | `ClerkProvider` + redirection vers `/dashboard` après auth |

---

## Parcours utilisateur

```
/  (Welcome)
├── Bouton "Se connecter"  →  /sign-in
├── Bouton "S'inscrire"    →  /sign-up
│
/sign-in  (Login.jsx + <SignIn /> Clerk)
└── Après connexion        →  /dashboard

/sign-up  (Signup.jsx + <SignUp /> Clerk)
└── Après inscription      →  /dashboard

/dashboard, /upload
└── Accessibles uniquement si connecté (Clerk)
```

---

## Fichiers créés

### `src/components/Auth/Welcome.jsx`
Page d'accueil affichée à la première visite (`/`).

- Fond animé `DarkVeil` (même style que Login)
- Texte animé avec `SplitText`
- Boutons officiels Clerk : `SignInButton` et `SignUpButton` (mode `redirect`)
- Liens manuels vers `/sign-in` et `/sign-up`

### `src/components/Auth/ClerkAuthSync.jsx`
Synchronise l'utilisateur Clerk vers le contexte React existant (`AuthContext`).

- Utilise `useUser()` de Clerk
- Met à jour `setUser()` avec le prénom, nom complet ou email
- Permet à la **Sidebar** d'afficher le nom de l'utilisateur connecté

### `src/lib/clerkAppearance.js`
Thème visuel des composants Clerk (couleurs slate/purple/green, fond transparent, boutons en dégradé).

---

## Fichiers modifiés

### `src/main.jsx`
**Avant :** `ClerkProvider` sans clé ni configuration.

**Après :**
- Lecture de la clé publique : `VITE_CLERK_PUBLISHABLE_KEY` ou `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Erreur explicite si la clé est absente
- Configuration globale :
  - `signInUrl="/sign-in"`
  - `signUpUrl="/sign-up"`
  - `signInFallbackRedirectUrl="/dashboard"`
  - `signUpFallbackRedirectUrl="/dashboard"`
  - `appearance={clerkAppearance}`

### `src/App.jsx`
**Avant :**
- Route `/` → `Login`
- Route `/signup` → `SignUp`
- `ProtectedRoute` basé sur `fetch("http://127.0.0.1:8000/dashboard")` + refresh token

**Après :**
- Route `/` → `Welcome` (page d'accueil)
- Route `/sign-in` → `Login`
- Route `/sign-up` → `SignUp`
- `ProtectedRoute` : utilise `useAuth()` (`isLoaded`, `isSignedIn`)
- `PublicAuthRoute` : redirige vers `/dashboard` si déjà connecté
- `ClerkAuthSync` monté dans l'arbre des composants
- Route catch-all `*` → redirection vers `/`

### `src/components/Login/Login.jsx`
**Avant :** Formulaire email/mot de passe + appel API `POST /login` + `navigate("/dashboard")`.

**Après :**
- **Gauche :** design conservé (DarkVeil, SplitText, bouton « Explorer » → `/sign-up`)
- **Droite :** composant `<SignIn />` de Clerk dans un panneau glassmorphism
- Propriétés Clerk :
  - `routing="path"`
  - `path="/sign-in"`
  - `signUpUrl="/sign-up"`
  - `forceRedirectUrl="/dashboard"`

### `src/components/Signup/Signup.jsx`
**Avant :** Formulaire nom/email/mot de passe + appel API `POST /register`.

**Après :**
- **Gauche :** design conservé (image, titre dégradé, bouton « Se connecter » → `/sign-in`)
- **Droite :** composant `<SignUp />` de Clerk
- Propriétés Clerk :
  - `routing="path"`
  - `path="/sign-up"`
  - `signInUrl="/sign-in"`
  - `forceRedirectUrl="/dashboard"`

### `.env`
Ajout de la variable requise par **Vite** :

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

La variable `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` est conservée en secours (compatibilité).

> **Important :** `CLERK_SECRET_KEY` reste côté serveur uniquement. Ne jamais l'exposer dans le frontend.

---

## Fichiers non modifiés (mais liés)

| Fichier | Rôle |
|---------|------|
| `src/components/Auth/AuthContext.jsx` | Contexte `user` / `setUser` — toujours utilisé par la Sidebar |
| `src/components/Layout/Sidebar.jsx` | Affiche `authContext.user` (alimenté par `ClerkAuthSync`) |
| `package.json` | `@clerk/react` était déjà présent (`^6.6.2`) |

---

## Routes (récapitulatif)

| Route | Composant | Accès |
|-------|-----------|-------|
| `/` | `Welcome` | Public (redirige si connecté) |
| `/sign-in` | `Login` | Public (redirige si connecté) |
| `/sign-up` | `SignUp` | Public (redirige si connecté) |
| `/dashboard` | `Home` | Protégé (Clerk) |
| `/upload` | `Upload` | Protégé (Clerk) |
| `*` | — | Redirection vers `/` |

---

## Configuration Clerk Dashboard

Dans [dashboard.clerk.com](https://dashboard.clerk.com) → votre application → **Paths** / **URLs** :

| Paramètre | Valeur |
|-----------|--------|
| Sign-in URL | `/sign-in` |
| Sign-up URL | `/sign-up` |
| After sign-in URL | `/dashboard` |
| After sign-up URL | `/dashboard` |

**Allowed redirect URLs** (développement local) :

```
http://localhost:5173/
http://localhost:5173/sign-in
http://localhost:5173/sign-up
http://localhost:5173/dashboard
```

Adapter le port si Vite utilise un autre (ex. `5174`).

---

## Démarrage

```bash
# Installer les dépendances (si besoin)
npm install

# Vérifier .env
# VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Lancer le dev server
npm run dev

# Build production
npm run build
```

---

## Ce qui a été retiré / remplacé

- Appels `fetch` vers `http://127.0.0.1:8000/login` et `/register` dans Login et Signup
- Vérification d'auth backend (`fetch /dashboard` + `/refresh`) dans `ProtectedRoute`
- Route `/signup` (remplacée par `/sign-up`)

L'API Python locale n'est **plus** utilisée pour l'authentification frontend. Si le backend doit valider les requêtes, il faudra ajouter la vérification du **JWT Clerk** côté serveur (étape future).

---

## Prochaine étape possible (backend)

Pour reconnecter le frontend Clerk à votre API FastAPI/Django :

1. Obtenir le token : `const token = await getToken()` (`@clerk/react`)
2. Envoyer `Authorization: Bearer <token>` sur chaque requête API
3. Valider le JWT avec la clé secrète Clerk côté backend

---

## Arborescence des changements

```
csv_mikhmon/
├── .env                          # modifié (+ VITE_CLERK_PUBLISHABLE_KEY)
├── README.md                     # ce fichier
├── src/
│   ├── main.jsx                  # modifié
│   ├── App.jsx                   # modifié
│   ├── lib/
│   │   └── clerkAppearance.js    # créé
│   └── components/
│       ├── Auth/
│       │   ├── Welcome.jsx       # créé
│       │   └── ClerkAuthSync.jsx # créé
│       ├── Login/
│       │   └── Login.jsx         # modifié
│       └── Signup/
│           └── Signup.jsx        # modifié
```

---

## Dépendance utilisée

- [@clerk/react](https://clerk.com/docs/references/react/overview) `^6.6.2`

Documentation officielle : [https://clerk.com/docs](https://clerk.com/docs)
