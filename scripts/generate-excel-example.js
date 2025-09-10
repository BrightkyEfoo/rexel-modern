const XLSX = require('xlsx');
const path = require('path');

// Données d'exemple pour le fichier Excel
const data = [
  {
    name: "Smartphone Galaxy ProXS",
    description: "Smartphone haut de gamme avec écran OLED 6.7 pouces",
    shortDescription: "Smartphone premium",
    longDescription: "Smartphone haut de gamme avec écran OLED 6.7 pouces, processeur octa-core et triple caméra 108MP. Idéal pour la photographie professionnelle.",
    features: "Écran OLED 6.7 pouces|Processeur octa-core|Triple caméra 108MP|Batterie 5000mAh",
    applications: "Photographie professionnelle|Gaming|Usage quotidien",
    sku: "SMART001",
    price: 899.99,
    salePrice: 799.99,
    stockQuantity: 25,
    manageStock: true,
    inStock: true,
    isFeatured: true,
    isActive: true,
    brandName: "Samsung",
    categoryNames: "Électronique,Smartphones",
    imageUrls: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500,https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
    fileUrls: "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf,https://thetestdata.com/samplefiles/text/Thetestdata_Text_35KB.zip",
    fabricationCountryCode: "KR",
    weight: 180,
    dimensions_length: 158.2,
    dimensions_width: 75.8,
    dimensions_height: 8.9,
    warranty: "2 ans",
    certifications: "CE,FCC"
  },
  {
    name: "Casque Audio BluetoothXS",
    description: "Casque sans fil avec réduction de bruit active",
    shortDescription: "Casque Bluetooth premium",
    longDescription: "Casque sans fil haute qualité avec réduction de bruit active, autonomie 30h et son haute fidélité. Parfait pour les audiophiles.",
    features: "Réduction de bruit active|Autonomie 30h|Son haute fidélité|Bluetooth 5.0",
    applications: "Musique|Appels|Voyage",
    sku: "AUDIO001",
    price: 249.99,
    salePrice: 199.99,
    stockQuantity: 50,
    manageStock: true,
    inStock: true,
    isFeatured: false,
    isActive: true,
    brandName: "Sony",
    categoryNames: "Électronique,Audio",
    imageUrls: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    fileUrls: "https://thetestdata.com/samplefiles/text/Thetestdata_Text_35KB.zip",
    fabricationCountryCode: "JP",
    weight: 290,
    dimensions_length: "",
    dimensions_width: "",
    dimensions_height: "",
    warranty: "1 an",
    certifications: "CE"
  },
  {
    name: "Ordinateur Portable GamingXS",
    description: "PC portable gaming 15.6 pouces, RTX 4060, 16GB RAM",
    shortDescription: "Laptop gaming performant",
    longDescription: "Ordinateur portable gaming haute performance avec écran 15.6 pouces, carte graphique RTX 4060, 16GB de RAM et SSD 1TB. Parfait pour les jeux et le travail créatif.",
    features: "Écran 15.6 pouces 144Hz|RTX 4060|16GB RAM|SSD 1TB|Clavier RGB",
    applications: "Gaming|Travail créatif|Streaming|Développement",
    sku: "LAPTOP001",
    price: 1299.99,
    salePrice: 1199.99,
    stockQuantity: 15,
    manageStock: true,
    inStock: true,
    isFeatured: true,
    isActive: true,
    brandName: "ASUS",
    categoryNames: "Informatique,Ordinateurs",
    imageUrls: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
    fileUrls: "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf,https://thetestdata.com/samplefiles/text/Thetestdata_Text_35KB.zip",
    fabricationCountryCode: "TW",
    weight: 2100,
    dimensions_length: 359,
    dimensions_width: 256,
    dimensions_height: 22.9,
    warranty: "3 ans",
    certifications: "CE,FCC,RoHS"
  }
];

// Créer le workbook
const wb = XLSX.utils.book_new();

// Créer la worksheet avec les données
const ws = XLSX.utils.json_to_sheet(data);

// Ajouter la worksheet au workbook
XLSX.utils.book_append_sheet(wb, ws, "Produits");

// Définir le chemin de sortie
const outputPath = path.join(__dirname, '..', 'public', 'exemple_produits.xlsx');

// Écrire le fichier
XLSX.writeFile(wb, outputPath);

console.log(`Fichier Excel généré avec succès : ${outputPath}`);
