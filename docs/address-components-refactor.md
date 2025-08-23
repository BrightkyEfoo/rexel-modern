# Refactorisation des composants d'adresses

## Vue d'ensemble

Les composants d'adresses ont été refactorisés pour une architecture plus modulaire et flexible. Maintenant, les composants peuvent être utilisés dans n'importe quel conteneur.

## Architecture avant/après

### ❌ Avant (Architecture rigide)
```
AddressSelector (avec Card intégrée)
├── CardHeader + CardTitle
├── CardContent
└── Logic de sélection
```

### ✅ Après (Architecture modulaire)
```
Composants de base (sans UI conteneur):
├── AddressSelector (logique pure)
├── BillingAddressSelector (logique + checkbox)

Composants conteneurs (avec Cards):
├── ShippingAddressCard
└── BillingAddressCard
```

## Composants refactorisés

### 1. `AddressSelector` (Base modulaire)
```typescript
// ✅ NOUVEAU: Sans Card, flexible
<AddressSelector
  addresses={addresses}
  selectedAddressId={selectedId}
  onAddressSelect={onSelect}
  onAddressAdd={onAdd}
  type="shipping"
  className="custom-styling"  // ✨ Personnalisable
  showEmptyMessage={false}   // ✨ Configurable
/>
```

**Nouvelles propriétés :**
- `className` : Styling personnalisé
- `showEmptyMessage` : Contrôler l'affichage du message vide
- Plus de `title` : Géré par le conteneur

### 2. `BillingAddressSelector` (Logique + Checkbox)
```typescript
// ✅ Inchangé mais utilise le nouveau AddressSelector
<BillingAddressSelector
  useSameAsShipping={boolean}
  onUseSameAsShippingChange={callback}
  // ... autres props
/>
```

**Fonctionnalités :**
- ✅ Checkbox "Utiliser la même adresse"
- ✅ Messages conditionnels
- ✅ Validation automatique

### 3. `ShippingAddressCard` (Conteneur Card)
```typescript
// ✨ NOUVEAU: Card conteneur pour adresse de livraison
<ShippingAddressCard
  addresses={addresses}
  selectedAddressId={selectedId}
  onAddressSelect={onSelect}
  onAddressAdd={onAdd}
/>
```

### 4. `BillingAddressCard` (Conteneur Card)
```typescript
// ✨ NOUVEAU: Card conteneur pour adresse de facturation
<BillingAddressCard
  addresses={addresses}
  selectedBillingAddressId={billingId}
  selectedShippingAddressId={shippingId}
  onBillingAddressSelect={onBillingSelect}
  onAddressAdd={onAdd}
  useSameAsShipping={boolean}
  onUseSameAsShippingChange={callback}
/>
```

## Utilisation dans la page panier

### ❌ Avant
```typescript
// Composants avec Cards intégrées (pas flexible)
<AddressSelector title="Adresse de livraison" ... />
<BillingAddressSelector ... />
```

### ✅ Après
```typescript
// Cards séparées, plus propre
<ShippingAddressCard ... />
<BillingAddressCard ... />
```

## Avantages de l'architecture modulaire

### 🔧 Flexibilité
- **Réutilisabilité** : `AddressSelector` utilisable dans n'importe quel conteneur
- **Personnalisation** : Styling via `className` 
- **Composition** : Combiner avec d'autres composants UI

### 🎨 Design cohérent
- **Cards uniformes** : Même style pour livraison et facturation
- **Titles centralisés** : Gérés dans les Cards conteneurs
- **Responsive** : Cards adaptées aux différentes tailles

### 🛠 Maintenabilité
- **Séparation des responsabilités** : Logique vs Présentation
- **Composants spécialisés** : Chaque composant a un rôle clair
- **Tests plus faciles** : Logique isolée

### 📦 Réutilisabilité future
```typescript
// Exemples d'usage flexible
<Card>
  <CardHeader>
    <CardTitle>Adresses favorites</CardTitle>
  </CardHeader>
  <CardContent>
    <AddressSelector 
      type="shipping" 
      showEmptyMessage={false}
      className="my-custom-class"
    />
  </CardContent>
</Card>

// Ou dans un modal
<Dialog>
  <DialogContent>
    <AddressSelector type="billing" />
  </DialogContent>
</Dialog>

// Ou dans un drawer mobile
<Sheet>
  <SheetContent>
    <AddressSelector type="shipping" />
  </SheetContent>
</Sheet>
```

## Structure des fichiers

```
src/components/ui/
├── address-selector.tsx          # 🔧 Base modulaire
├── billing-address-selector.tsx  # 🔧 Logique + checkbox  
├── shipping-address-card.tsx     # 📦 Conteneur Card livraison
├── billing-address-card.tsx      # 📦 Conteneur Card facturation
├── address-form.tsx              # 📝 Formulaire (inchangé)
└── ...
```

## Migration et compatibilité

### ✅ Rétrocompatibilité
- `BillingAddressSelector` fonctionne identiquement
- Même API pour les fonctions de callback
- Types TypeScript maintenus

### 🔄 Points de migration
- `AddressSelector` : Enlever la prop `title`
- Entourer dans une Card si besoin de conteneur
- Utiliser `ShippingAddressCard` et `BillingAddressCard` pour les cas standard

## Performance

### 🚀 Optimisations
- **Moins de re-renders** : Logique isolée
- **Bundle plus petit** : Import sélectif des composants
- **Mémoire** : Composants plus légers

### 📊 Impact
- Pas de dégradation de performance
- Amélioration possible grâce à la modularité
- Meilleure tree-shaking

L'architecture modulaire permet une meilleure flexibilité tout en conservant la facilité d'utilisation ! 🎯✨
