# Migration vers Checkbox Shadcn

## Vue d'ensemble

Le composant `BillingAddressSelector` a été mis à jour pour utiliser le composant Checkbox de Shadcn au lieu d'un input HTML basique.

## Changements effectués

### ❌ Avant (Input HTML basique)
```tsx
<div className="flex items-center space-x-2 p-4 border border-border rounded-lg bg-muted/20">
  <input
    type="checkbox"
    id="same-address"
    checked={useSameAsShipping}
    onChange={(e) => handleSameAddressChange(e.target.checked)}
    className="rounded border-border text-primary focus:ring-primary"
  />
  <Label htmlFor="same-address" className="text-sm font-normal cursor-pointer">
    Utiliser la même adresse que la livraison
  </Label>
</div>
```

### ✅ Après (Composant Shadcn)
```tsx
<div className="flex items-center space-x-2">
  <Checkbox
    id="same-address"
    checked={useSameAsShipping}
    onCheckedChange={handleSameAddressChange}
  />
  <Label htmlFor="same-address" className="text-sm font-normal cursor-pointer">
    Utiliser la même adresse que la livraison
  </Label>
</div>
```

## Avantages de la migration

### 🎨 Design cohérent
- **Style uniforme** : Utilise les tokens de design Shadcn
- **Thème automatique** : S'adapte au thème de l'application
- **Accessibilité** : Composant Radix UI avec ARIA complet

### 🔧 API simplifiée
- **onCheckedChange** : Callback direct avec la valeur boolean
- **Pas de styling custom** : Utilise automatiquement les couleurs du thème
- **Props standardisées** : Même API que tous les composants Shadcn

### 📱 UX améliorée
- **Animations fluides** : Transitions Radix UI
- **States visuels** : Hover, focus, disabled automatiques
- **Touch friendly** : Optimisé pour mobile

## Composant Checkbox Shadcn

### Fonctionnalités intégrées
```tsx
// Styles automatiques basés sur le thème
className="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow 
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
          disabled:cursor-not-allowed disabled:opacity-50 
          data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
```

### Props principales
- `checked` : État coché (boolean)
- `onCheckedChange` : Callback avec nouvelle valeur
- `disabled` : Désactiver la checkbox
- `id` : Identifiant pour le label

### États visuels
- ✅ **Checked** : Fond primary avec icône Check
- ⬜ **Unchecked** : Bordure primary, fond transparent
- 🎯 **Focus** : Ring de focus visible
- 🚫 **Disabled** : Opacité réduite, cursor disabled

## Migration similaire recommandée

Cette amélioration peut être appliquée à d'autres checkboxes dans l'application :

### Autres composants à migrer
```tsx
// Formulaires de préférences
<Checkbox id="newsletter" onCheckedChange={setNewsletter} />

// Options de livraison  
<Checkbox id="express" onCheckedChange={setExpress} />

// Conditions d'utilisation
<Checkbox id="terms" onCheckedChange={setAcceptTerms} />
```

### Pattern recommandé
```tsx
// Template standard pour tous les checkboxes
<div className="flex items-center space-x-2">
  <Checkbox
    id="unique-id"
    checked={state}
    onCheckedChange={setState}
  />
  <Label htmlFor="unique-id" className="text-sm cursor-pointer">
    Description de l'option
  </Label>
</div>
```

## Compatibilité

### ✅ Rétrocompatibilité
- Même comportement fonctionnel
- API callback identique (`boolean` en paramètre)
- Accessibilité maintenue

### 🔧 Améliorations techniques
- **Bundle optimisé** : Composant Radix UI tree-shakable
- **Performance** : Pas de re-renders inutiles
- **TypeScript** : Types stricts automatiques

La checkbox est maintenant entièrement alignée avec le design system Shadcn ! ✨
