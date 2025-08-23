# Migration des emojis vers des icônes et composants Shadcn

## Vue d'ensemble

Tous les emojis ont été remplacés par des icônes Lucide et tous les inputs HTML basiques ont été remplacés par les composants Shadcn correspondants.

## Changements effectués

### 🎯 1. Remplacement des emojis par des icônes

#### AddressSelector
**Avant :**
```tsx
📞 {address.phone}
```

**Après :**
```tsx
<div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
  <Phone className="w-3 h-3" />
  {address.phone}
</div>
```

#### BillingAddressSelector  
**Avant :**
```tsx
✓ L'adresse de facturation sera la même que l'adresse de livraison
⚠️ Veuillez d'abord sélectionner une adresse de livraison
```

**Après :**
```tsx
<p className="text-sm text-primary flex items-center gap-2">
  <Check className="w-4 h-4" />
  L'adresse de facturation sera la même que l'adresse de livraison
</p>

<p className="text-sm text-amber-700 flex items-center gap-2">
  <AlertTriangle className="w-4 h-4" />
  Veuillez d'abord sélectionner une adresse de livraison
</p>
```

### 🔧 2. Migration vers composants Shadcn

#### Radio Buttons
**Avant (Input HTML) :**
```tsx
<input
  type="radio"
  checked={selectedAddressId === address.id}
  onChange={() => onAddressSelect(address.id)}
  className="text-primary"
  readOnly
/>
```

**Après (Composant Shadcn) :**
```tsx
<RadioGroupItem
  value={address.id}
  checked={selectedAddressId === address.id}
  onClick={() => onAddressSelect(address.id)}
/>
```

#### Checkboxes
**Avant (Input HTML) :**
```tsx
<input
  type="checkbox"
  id="same-address"
  checked={useSameAsShipping}
  onChange={(e) => handleSameAddressChange(e.target.checked)}
  className="rounded border-border text-primary focus:ring-primary"
/>
```

**Après (Composant Shadcn) :**
```tsx
<Checkbox
  id="same-address"
  checked={useSameAsShipping}
  onCheckedChange={handleSameAddressChange}
/>
```

#### Checkbox dans React Hook Form
**Avant :**
```tsx
<input
  type="checkbox"
  id="isDefault"
  {...register('isDefault')}
  className="rounded border-border text-primary focus:ring-primary"
/>
```

**Après :**
```tsx
<Controller
  name="isDefault"
  control={control}
  render={({ field }) => (
    <Checkbox
      id="isDefault"
      checked={field.value}
      onCheckedChange={field.onChange}
    />
  )}
/>
```

## Nouveau composant créé

### RadioGroup Component
Créé `/src/components/ui/radio-group.tsx` basé sur Radix UI :

```tsx
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
```

## Icônes utilisées

### Imports ajoutés
```tsx
// AddressSelector
import { Plus, Phone } from 'lucide-react';

// BillingAddressSelector  
import { Check, AlertTriangle } from 'lucide-react';

// RadioGroup
import { Circle } from 'lucide-react';
```

### Mappings emojis → icônes
- 📞 → `<Phone className="w-3 h-3" />`
- ✓ → `<Check className="w-4 h-4" />`
- ⚠️ → `<AlertTriangle className="w-4 h-4" />`
- Plus button → `<Plus className="w-4 h-4" />` (déjà existant)

## Avantages de la migration

### 🎨 Design cohérent
- **Icônes vectorielles** : Qualité parfaite à toutes les tailles
- **Couleurs thématiques** : Adaptation automatique au thème
- **Tailles standardisées** : `w-3 h-3` pour petites, `w-4 h-4` pour moyennes

### ♿ Accessibilité améliorée
- **Composants Radix UI** : Support ARIA/WCAG complet
- **Navigation clavier** : Focus et navigation optimisés
- **Screen readers** : Sémantique appropriée

### 🔧 API standardisée
- **Props cohérentes** : Même interface pour tous les composants
- **onCheckedChange** : Callback standard Shadcn
- **Styling automatique** : Thème appliqué par défaut

### 📱 UX mobile
- **Touch targets** : Zones de clic optimisées
- **Feedback visuel** : States hover/focus/active
- **Performance** : Composants optimisés

## Migrations similaires recommandées

### Autres emojis à remplacer dans l'app
```tsx
// Exemples d'autres emojis courants
🔒 → <Lock />
🏠 → <Home />
📧 → <Mail />
🛒 → <ShoppingCart />
⭐ → <Star />
❤️ → <Heart />
```

### Pattern de migration d'emojis
```tsx
// Template pour remplacer un emoji
// Avant
{emoji} Text

// Après  
<div className="flex items-center gap-1/2">
  <IconName className="w-X h-X" />
  Text
</div>
```

### Migration d'inputs HTML
```tsx
// Pattern pour remplacer les inputs HTML
// 1. Import du composant Shadcn
import { Checkbox } from '@/components/ui/checkbox';

// 2. Pour react-hook-form, utiliser Controller
<Controller
  name="fieldName"
  control={control}
  render={({ field }) => (
    <Checkbox
      checked={field.value}
      onCheckedChange={field.onChange}
    />
  )}
/>
```

## Résultat final

✅ **Zéro emoji** dans les composants d'adresses  
✅ **100% composants Shadcn** pour les inputs  
✅ **Icônes Lucide** cohérentes et accessibles  
✅ **Design system** unifié

Les composants d'adresses sont maintenant entièrement alignés avec le design system moderne et accessible ! 🎯✨
