# Correction des paramètres React Query corrompus

## Problème identifié

L'URL des requêtes d'adresses était malformée :

```
❌ AVANT:
http://localhost:3333/api/v1/secured/addresses?type[client]=[object+Object]&type[queryKey][0]=user-addresses&type[signal]=[object+AbortSignal]
```

```
✅ APRÈS:
http://localhost:3333/api/v1/secured/addresses
http://localhost:3333/api/v1/secured/addresses?type=shipping
```

## Cause du problème

### Code problématique
```typescript
export function useAddresses() {
  return useQuery({
    queryKey: ['user-addresses'],
    queryFn: getUserAddresses,  // ❌ PROBLÈME ICI
    staleTime: 5 * 60 * 1000,
  });
}
```

### Que se passait-il ?
Quand on passe directement `getUserAddresses` comme `queryFn`, React Query transmet automatiquement ses paramètres internes :

```typescript
// React Query appelle implicitement :
getUserAddresses({
  queryKey: ['user-addresses'],
  signal: AbortSignal,
  meta: undefined
})
```

Ces paramètres étaient ensuite sérialisés comme query parameters dans l'URL !

## Solution appliquée

### Code corrigé
```typescript
export function useAddresses() {
  return useQuery({
    queryKey: ['user-addresses'],
    queryFn: () => getUserAddresses(),  // ✅ CORRECTION
    staleTime: 5 * 60 * 1000,
  });
}
```

### Pourquoi ça marche ?
En encapsulant dans une arrow function, on contrôle exactement quels paramètres sont passés :

```typescript
// Maintenant React Query appelle :
() => getUserAddresses()  // Sans paramètres parasites
```

## Bonnes pratiques React Query

### ✅ Recommandé
```typescript
// Pour les fonctions sans paramètres
queryFn: () => getUsers()

// Pour les fonctions avec paramètres contrôlés
queryFn: () => getUserAddresses(type)

// Avec des paramètres de queryKey
queryFn: ({ queryKey }) => getUserById(queryKey[1])
```

### ❌ À éviter
```typescript
// Ne jamais passer directement une fonction qui ne s'attend pas aux paramètres React Query
queryFn: getUserAddresses  // Problématique si la fonction ne gère pas les paramètres RQ
```

## Impact de la correction

### 🚀 Performances
- URLs propres et cachables
- Pas de sérialisation d'objets complexes
- Requêtes plus rapides

### 🔒 Sécurité  
- Pas de fuite d'informations internes React Query
- URLs prévisibles et auditables
- Logs plus propres

### 🛠 Debugging
- URLs lisibles dans les dev tools
- Paramètres contrôlés et intentionnels
- Easier troubleshooting

## Vérification

Pour vérifier que la correction fonctionne :

1. **Network Tab** : Vérifier les URLs dans les DevTools
2. **Backend logs** : Confirmer que les paramètres sont corrects
3. **API response** : S'assurer que les filtres fonctionnent

### URLs attendues
```
GET /api/v1/secured/addresses
GET /api/v1/secured/addresses?type=shipping  
GET /api/v1/secured/addresses?type=billing
```

## Leçon apprise

⚠️ **Attention** : Toujours encapsuler les fonctions `queryFn` qui ne sont pas spécifiquement conçues pour recevoir les paramètres React Query.

Cette correction garantit que nos APIs reçoivent exactement les paramètres attendus, ni plus, ni moins ! 🎯
