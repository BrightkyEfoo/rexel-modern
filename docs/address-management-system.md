# 🏠 Système de gestion des adresses - Livraison et Facturation

## 🎯 Fonctionnalités implémentées

1. **📝 Formulaire d'adresse complet** avec validation Zod
2. **🔍 Sélecteur d'adresses** réutilisable et intelligent
3. **💳 Gestion adresses de facturation** avec option "même adresse"
4. **💾 Sauvegarde backend** avec API REST complète
5. **⚡ Hooks React Query** pour cache et synchronisation

## 📁 Structure des composants

```
src/
├── components/ui/
│   ├── address-form.tsx              # Formulaire d'ajout/édition
│   ├── address-selector.tsx          # Sélecteur adresses de livraison
│   └── billing-address-selector.tsx  # Sélecteur avec logique "même adresse"
├── lib/
│   ├── api/addresses.ts              # API client pour CRUD adresses
│   └── hooks/useAddresses.ts         # Hooks React Query
└── app/panier/page.tsx               # Intégration dans ShippingStep
```

## 📝 **1. Composant AddressForm**

### 🎯 **Fonctionnalités**
- **Validation Zod** : Champs requis et formats
- **Types d'adresse** : shipping | billing
- **Adresse par défaut** : Case à cocher
- **UI/UX soignée** : États de soumission et erreurs

### 🔧 **Schéma de validation**
```typescript
const addressSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  company: z.string().optional(),
  street: z.string().min(1, 'L\'adresse est requise'),
  city: z.string().min(1, 'La ville est requise'),
  postalCode: z.string().min(1, 'Le code postal est requis'),
  country: z.string().min(1, 'Le pays est requis'),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
});
```

### 🎨 **Interface utilisateur**
- **Bouton fermeture** : X en haut à droite
- **Champs organisés** : Nom, entreprise, adresse, ville/CP, pays, téléphone
- **Actions** : Sauvegarder (loading) + Annuler
- **Feedback** : Messages d'erreur sous chaque champ

### 💾 **Utilisation**
```tsx
<AddressForm
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  type="shipping"
  title="Nouvelle adresse de livraison"
  isSubmitting={false}
/>
```

## 🔍 **2. Composant AddressSelector**

### 🎯 **Fonctionnalités**
- **Affichage adresses** : Filtrées par type (shipping/billing)
- **Sélection radio** : Une adresse active à la fois
- **Ajout nouvelle** : Basculement vers AddressForm
- **États de chargement** : UI responsive

### 🎨 **Design**
- **Cards sélectionnables** : Bordure primary quand active
- **Badge "Par défaut"** : Identification visuelle
- **Informations complètes** : Nom, entreprise, adresse, téléphone
- **Bouton ajout** : Avec icône Plus

### 📊 **Gestion d'état**
```tsx
const [showAddForm, setShowAddForm] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

// Toggle entre liste et formulaire
if (showAddForm) return <AddressForm ... />;
return <AddressList ... />;
```

### 💡 **Message d'aide**
```tsx
{filteredAddresses.length === 0 && (
  <div className="text-center py-8 text-muted-foreground">
    <p>Aucune adresse de livraison enregistrée</p>
    <p className="text-sm">Cliquez sur "Ajouter" pour commencer</p>
  </div>
)}
```

## 💳 **3. Composant BillingAddressSelector**

### 🎯 **Logique spécifique facturation**
- **Case "même adresse"** : Option par défaut recommandée
- **Sélection conditionnelle** : AddressSelector seulement si différente
- **Messages informatifs** : États visuels selon le contexte
- **Auto-sélection** : Adresse livraison copiée automatiquement

### 🔄 **Logique de basculement**
```typescript
const handleSameAddressChange = (checked: boolean) => {
  onUseSameAsShippingChange(checked);
  if (checked) {
    onBillingAddressSelect(selectedShippingAddressId);
  } else {
    onBillingAddressSelect('');
  }
};
```

### 🎨 **États visuels**
1. **Même adresse cochée + adresse livraison** : Message vert de confirmation
2. **Même adresse cochée + pas d'adresse livraison** : Alerte orange
3. **Même adresse décochée** : Affichage du sélecteur d'adresses

### 💬 **Messages contextuels**
```tsx
{useSameAsShipping && selectedShippingAddressId && (
  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
    <p className="text-sm text-primary">
      ✓ L'adresse de facturation sera la même que l'adresse de livraison
    </p>
  </div>
)}
```

## 💾 **4. API Backend (addresses.ts)**

### 🛠️ **Endpoints disponibles**
- `GET /api/v1/user/addresses` - Récupérer toutes les adresses
- `POST /api/v1/user/addresses` - Créer une nouvelle adresse
- `PUT /api/v1/user/addresses/:id` - Mettre à jour une adresse
- `DELETE /api/v1/user/addresses/:id` - Supprimer une adresse
- `PATCH /api/v1/user/addresses/:id/default` - Définir comme défaut

### 📋 **Type Address**
```typescript
interface Address {
  id: string;
  name: string;
  company?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  type: 'shipping' | 'billing';
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

### 🔐 **Sécurité**
- **Authentification** : Token utilisateur via apiClient
- **Autorisation** : Accès aux adresses de l'utilisateur connecté uniquement
- **Validation** : Côté backend pour intégrité des données

## ⚡ **5. Hooks React Query (useAddresses.ts)**

### 🗄️ **Cache et synchronisation**
```typescript
// Hook principal - récupération
export function useAddresses()

// Hook création avec mise à jour du cache
export function useCreateAddress()

// Hook mise à jour
export function useUpdateAddress()

// Hook suppression
export function useDeleteAddress()

// Hook adresse par défaut
export function useSetDefaultAddress()

// Hook filtré par type
export function useAddressesByType(type: 'shipping' | 'billing')
```

### 🔄 **Gestion du cache**
```typescript
// Ajout optimiste au cache
onSuccess: (newAddress) => {
  queryClient.setQueryData(['user-addresses'], (oldAddresses: Address[] = []) => {
    return [...oldAddresses, newAddress];
  });
}

// Mise à jour cache après modification
onSuccess: (updatedAddress) => {
  queryClient.setQueryData(['user-addresses'], (oldAddresses: Address[] = []) => {
    return oldAddresses.map(addr => 
      addr.id === updatedAddress.id ? updatedAddress : addr
    );
  });
}
```

### 📱 **Feedback utilisateur**
- **Success** : Messages de confirmation dans la console
- **Error** : Logs d'erreur détaillés
- **Loading** : États de chargement propagés aux composants

## 🔗 **6. Intégration dans ShippingStep**

### 🏗️ **Structure mise à jour**
```typescript
function ShippingStep({...}) {
  const [useSameAsShipping, setUseSameAsShipping] = useState(false);
  const { data: addresses = [], isLoading } = useAddresses();
  const createAddressMutation = useCreateAddress();

  const handleAddAddress = async (addressData, type) => {
    const newAddress = await createAddressMutation.mutateAsync({
      ...addressData,
      type
    });
    
    // Auto-sélection de la nouvelle adresse
    if (type === 'shipping') {
      setSelectedShippingAddress(newAddress.id);
    } else {
      setSelectedBillingAddress(newAddress.id);
    }
  };
}
```

### 🎯 **Remplacement des sections**
1. **Ancienne section shipping** → `<AddressSelector type="shipping" />`
2. **Ancienne section billing** → `<BillingAddressSelector />`
3. **Loading state** : Affichage conditionnel pendant chargement

### 🔄 **Flux utilisateur optimisé**
1. **Chargement** : Récupération adresses existantes
2. **Sélection** : Radio buttons adresses existantes
3. **Ajout** : Formulaire en overlay, auto-sélection après création
4. **Facturation** : Logique "même adresse" simplifiée

## 🎨 **7. Améliorations UX**

### 📱 **Responsive design**
- **Mobile-first** : Formulaires optimisés petits écrans
- **Grid adaptatif** : Code postal + ville sur la même ligne
- **Touch-friendly** : Zones de clic suffisantes

### ⚡ **Performance**
- **Cache React Query** : Pas de re-fetch inutiles
- **Lazy loading** : Formulaire seulement quand nécessaire
- **Optimistic updates** : UI réactive immédiatement

### 🎯 **Accessibilité**
- **Labels appropriés** : Association form/input
- **Feedback erreurs** : Couleurs + textes explicites
- **Navigation clavier** : Tab order logique
- **Screen readers** : Attributs ARIA

### 💡 **Guidance utilisateur**
- **Messages contextuels** : Aide selon l'état
- **Validation en temps réel** : Erreurs à la saisie
- **Auto-focus** : Sur premier champ du formulaire
- **Confirmation visuelle** : États sélectionnés évidents

## 🚀 **Avantages du nouveau système**

### 🔧 **Pour les développeurs**
- **Composants réutilisables** : AddressForm/Selector partout
- **Type safety** : TypeScript + Zod pour robustesse
- **Cache géré** : React Query évite la duplication
- **API modulaire** : CRUD complet et extensible

### 🎯 **Pour les utilisateurs**
- **Workflow simplifié** : Moins de clics et de saisie
- **Données persistantes** : Adresses sauvées pour futurs achats
- **Interface claire** : États visuels et messages explicites
- **Flexibilité** : Multiple adresses + option "même adresse"

### 📈 **Pour le business**
- **Conversion améliorée** : Checkout plus fluide
- **Données clients** : Historique adresses pour analytics
- **Expérience premium** : Fonctionnalités e-commerce modernes
- **Scalabilité** : Architecture prête pour nouvelles fonctionnalités

Le système d'adresses offre maintenant une expérience utilisateur complète et professionnelle ! 🎉
