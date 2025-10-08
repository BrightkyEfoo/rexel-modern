"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import {
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  Copy,
  ExternalLink,
  Table,
  Upload,
  FileSpreadsheet,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CSVField {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example: string;
  notes?: string;
}

export default function FormatCSVImportPage() {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const csvFields: CSVField[] = [
    {
      name: "name",
      type: "Texte",
      required: true,
      description: "Nom du produit",
      example: "Smartphone Galaxy Pro",
      notes: "Doit être unique dans votre catalogue",
    },
    {
      name: "description",
      type: "Texte",
      required: false,
      description: "Description générale du produit",
      example: "Smartphone haut de gamme avec écran OLED 6.7 pouces",
    },
    {
      name: "shortDescription",
      type: "Texte",
      required: false,
      description: "Description courte pour les listes de produits",
      example: "Smartphone premium",
    },
    {
      name: "longDescription",
      type: "Texte",
      required: false,
      description: "Description détaillée du produit",
      example:
        "Smartphone haut de gamme avec écran OLED 6.7 pouces, processeur octa-core...",
    },
    {
      name: "features",
      type: "Texte",
      required: false,
      description: "Caractéristiques principales (séparées par |)",
      example: "Écran OLED 6.7 pouces|Processeur octa-core|Triple caméra 108MP",
    },
    {
      name: "applications",
      type: "Texte",
      required: false,
      description: "Applications d'usage (séparées par |)",
      example: "Photographie professionnelle|Gaming|Usage quotidien",
    },
    {
      name: "sku",
      type: "Texte",
      required: false,
      description: "Référence unique du produit",
      example: "SMART001",
      notes: "Doit être unique si fourni",
    },
    {
      name: "price",
      type: "Nombre",
      required: true,
      description: "Prix de vente en FCFA",
      example: "899.99",
    },
    {
      name: "salePrice",
      type: "Nombre",
      required: false,
      description: "Prix promotionnel en FCFA",
      example: "799.99",
      notes: "Laissez vide si pas de promotion",
    },
    {
      name: "stockQuantity",
      type: "Nombre",
      required: true,
      description: "Quantité en stock",
      example: "25",
    },
    {
      name: "manageStock",
      type: "Booléen",
      required: false,
      description: "Gérer automatiquement le stock",
      example: "true",
      notes: "true ou false, défaut: true",
    },
    {
      name: "inStock",
      type: "Booléen",
      required: false,
      description: "Produit disponible",
      example: "true",
      notes: "true ou false, défaut: true",
    },
    {
      name: "isFeatured",
      type: "Booléen",
      required: false,
      description: "Produit mis en avant",
      example: "true",
      notes: "true ou false, défaut: false",
    },
    {
      name: "isActive",
      type: "Booléen",
      required: false,
      description: "Produit actif sur le site",
      example: "true",
      notes: "true ou false, défaut: true",
    },
    {
      name: "brandName",
      type: "Texte",
      required: false,
      description: "Nom de la marque",
      example: "Samsung",
      notes: "La marque sera créée si elle n'existe pas",
    },
    {
      name: "categoryNames",
      type: "Texte",
      required: false,
      description: "Noms des catégories (séparées par ,)",
      example: "Électronique,Smartphones",
      notes: "Les catégories seront créées si elles n'existent pas",
    },
    // {
    //   name: "imageUrls",
    //   type: "URLs",
    //   required: false,
    //   description: "URLs des images (séparées par ,)",
    //   example: "https://example.com/image1.jpg,https://example.com/image2.jpg",
    //   notes: "Maximum 5 images",
    // },
    // {
    //   name: "fileUrls",
    //   type: "URLs",
    //   required: false,
    //   description: "URLs des fichiers/documents (séparées par ,)",
    //   example: "https://example.com/manual.pdf,https://example.com/specs.zip",
    //   notes: "Manuels, fiches techniques, etc.",
    // },
    {
      name: "fabricationCountryCode",
      type: "Code pays",
      required: false,
      description: "Code ISO du pays de fabrication (2 lettres)",
      example: "FR",
      notes: "FR, DE, US, CN, etc.",
    },
    {
      name: "weight",
      type: "Nombre",
      required: false,
      description: "Poids en grammes",
      example: "180",
    },
    {
      name: "dimensions_length",
      type: "Nombre",
      required: false,
      description: "Longueur en cm",
      example: "158.2",
    },
    {
      name: "dimensions_width",
      type: "Nombre",
      required: false,
      description: "Largeur en cm",
      example: "75.8",
    },
    {
      name: "dimensions_height",
      type: "Nombre",
      required: false,
      description: "Hauteur en cm",
      example: "8.9",
    },
    {
      name: "warranty",
      type: "Texte",
      required: false,
      description: "Durée de garantie",
      example: "2 ans",
    },
    {
      name: "certifications",
      type: "Texte",
      required: false,
      description: "Certifications (séparées par ,)",
      example: "CE,FCC,RoHS",
    },
  ];

  // Fonctions utilitaires pour calculer dynamiquement les informations
  const getRequiredFields = () => csvFields.filter((field) => field.required);
  const getOptionalFields = () => csvFields.filter((field) => !field.required);
  const getRequiredFieldNames = () =>
    getRequiredFields()
      .map((field) => `"${field.name}"`)
      .join(", ");
  const getCSVHeader = () => csvFields.map((field) => field.name).join(",");

  const getExampleCSVContent = () => {
    const header = getCSVHeader();
    const exampleRows = [
      `"Smartphone Galaxy ProXS","Smartphone haut de gamme avec écran OLED 6.7 pouces","Smartphone premium","Smartphone haut de gamme avec écran OLED 6.7 pouces, processeur octa-core et triple caméra 108MP. Idéal pour la photographie professionnelle.","Écran OLED 6.7 pouces|Processeur octa-core|Triple caméra 108MP|Batterie 5000mAh","Photographie professionnelle|Gaming|Usage quotidien","SMART001",899.99,799.99,25,true,true,true,true,"Samsung","Électronique,Smartphones","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500,https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500","https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf,https://thetestdata.com/samplefiles/text/Thetestdata_Text_35KB.zip","KR",180,158.2,75.8,8.9,"2 ans","CE,FCC"`,
      `"Casque Audio BluetoothXS","Casque sans fil avec réduction de bruit active","Casque Bluetooth premium","Casque sans fil haute qualité avec réduction de bruit active, autonomie 30h et son haute fidélité. Parfait pour les audiophiles.","Réduction de bruit active|Autonomie 30h|Son haute fidélité|Bluetooth 5.0","Musique|Appels|Voyage","AUDIO001",249.99,,50,true,true,false,true,"Sony","Électronique,Audio","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500","https://thetestdata.com/samplefiles/text/Thetestdata_Text_35KB.zip","JP",290,,,,"1 an","CE"`,
    ];
    return `${header}\n${exampleRows.join("\n")}`;
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      toast({
        title: "Copié !",
        description: `L'exemple pour "${fieldName}" a été copié dans le presse-papiers.`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const downloadExampleCSV = () => {
    const csvContent = getExampleCSVContent();

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "exemple_produits.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Téléchargement démarré",
      description: "Le fichier d'exemple CSV a été téléchargé.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Format d'importation Excel/CSV
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Guide complet pour préparer vos fichiers Excel ou CSV
                d'importation de produits
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <a href="/exemple_produits.xlsx" download>
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger le template Excel
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary"
                  onClick={downloadExampleCSV}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Télécharger l'exemple CSV
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary"
                  asChild
                >
                  <a href="/admin" target="_blank">
                    <Upload className="w-5 h-5 mr-2" />
                    Aller à l'import
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Section Excel recommandé */}
          <div className="mb-12">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 w-fit mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-green-800 flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6" />
                  Format Excel Recommandé
                </CardTitle>
                <CardDescription className="text-green-700">
                  Pour une expérience optimale, nous recommandons fortement
                  d'utiliser le template Excel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3">
                      Avantages d'Excel :
                    </h4>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>
                        <strong>Formatage automatique</strong> - Pas de
                        problèmes d'encodage
                      </li>
                      <li>
                        <strong>Validation intégrée</strong> - Excel détecte les
                        erreurs
                      </li>
                      <li>
                        <strong>Interface familière</strong> - Plus facile à
                        utiliser
                      </li>
                      <li>
                        <strong>Formules possibles</strong> - Calculez
                        automatiquement les prix
                      </li>
                      <li>
                        <strong>Aperçu visuel</strong> - Voir le contenu formaté
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white mb-4 w-fit mx-auto"
                    asChild
                  >
                    <a href="/exemple_produits.xlsx" download>
                      <Download className="w-5 h-5 mr-2" />
                      Télécharger le template Excel
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations importantes */}
          <div className="mb-12 space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Formats acceptés :</strong> Excel (XLSX, XLS -
                recommandé) ou CSV avec encodage UTF-8 et séparateur virgule
                (,).
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Champs obligatoires :</strong> Seuls les champs{" "}
                {getRequiredFieldNames()} sont obligatoires. Tous les autres
                sont optionnels.
              </AlertDescription>
            </Alert>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Validation :</strong> Le système vérifiera
                automatiquement l'unicité des noms de produits et des SKU avant
                l'importation.
              </AlertDescription>
            </Alert>
          </div>

          {/* Structure du fichier CSV */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              Structure du fichier CSV
            </h2>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="w-5 h-5" />
                  En-tête du fichier
                </CardTitle>
                <CardDescription>
                  La première ligne de votre fichier CSV doit contenir
                  exactement ces noms de colonnes :
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <code>{getCSVHeader()}</code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => copyToClipboard(getCSVHeader(), "header")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedField === "header" ? "Copié !" : "Copier l'en-tête"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Description des champs */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Description des champs</h2>

            <div className="grid gap-6">
              {csvFields.map((field, index) => (
                <Card
                  key={field.name}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg font-mono">
                          {field.name}
                        </CardTitle>
                        <Badge
                          variant={field.required ? "default" : "secondary"}
                        >
                          {field.required ? "Obligatoire" : "Optionnel"}
                        </Badge>
                        <Badge variant="outline">{field.type}</Badge>
                      </div>
                    </div>
                    <CardDescription>{field.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Exemple :</p>
                        <div className="bg-muted p-3 rounded-lg font-mono text-sm flex items-center justify-between">
                          <code>{field.example}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(field.example, field.name)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {field.notes && (
                        <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Note :</strong> {field.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Règles spéciales */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Règles spéciales</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Séparateurs multiples
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Certains champs acceptent plusieurs valeurs séparées par des
                    caractères spéciaux :
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>features, applications :</strong> séparées par{" "}
                      <code>|</code>
                    </li>
                    <li>
                      <strong>
                        categoryNames,{/* imageUrls, fileUrls, */}{" "}
                        certifications :
                      </strong>{" "}
                      séparées par <code>,</code>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Valeurs booléennes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Les champs booléens acceptent :
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Vrai :</strong> <code>true</code>, <code>1</code>,{" "}
                      <code>oui</code>
                    </li>
                    <li>
                      <strong>Faux :</strong> <code>false</code>, <code>0</code>
                      , <code>non</code>
                    </li>
                    <li>
                      <strong>Vide :</strong> utilise la valeur par défaut
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prix promotionnel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Le champ <code>salePrice</code> est optionnel :
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>Laissez vide si pas de promotion</li>
                    <li>Doit être inférieur au prix normal</li>
                    <li>Ne pas mettre 0 (laisser vide à la place)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Création automatique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Le système crée automatiquement :
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>Les marques qui n'existent pas</li>
                    <li>Les catégories qui n'existent pas</li>
                    <li>Les associations produit-catégorie</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Exemple complet */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Exemple complet</h2>

            <Card>
              <CardHeader>
                <CardTitle>Fichier CSV d'exemple</CardTitle>
                <CardDescription>
                  Voici un exemple de fichier CSV avec 2 produits complets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {getExampleCSVContent()}
                  </pre>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={downloadExampleCSV}>
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger cet exemple
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      copyToClipboard(getExampleCSVContent(), "full-example")
                    }
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedField === "full-example" ? "Copié !" : "Copier"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conseils et bonnes pratiques */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              Conseils et bonnes pratiques
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />À faire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>
                      ✓ Utilisez l'encodage UTF-8 pour les caractères spéciaux
                    </li>
                    <li>
                      ✓ Entourez les textes contenant des virgules par des
                      guillemets
                    </li>
                    <li>
                      ✓ Testez avec un petit fichier avant l'import complet
                    </li>
                    <li>✓ Vérifiez que vos URLs d'images sont accessibles</li>
                    <li>✓ Utilisez des SKU uniques et significatifs</li>
                    <li>✓ Laissez le salePrice vide si pas de promotion</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />À éviter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✗ Ne pas utiliser de point-virgule comme séparateur</li>
                    <li>✗ Ne pas mettre 0 pour les prix promotionnels vides</li>
                    <li>
                      ✗ Ne pas oublier les guillemets pour les textes longs
                    </li>
                    <li>
                      ✗ Ne pas utiliser de caractères spéciaux dans les SKU
                    </li>
                    {/* <li>✗ Ne pas dépasser 5 images par produit</li> */}
                    {/* <li>✗ Ne pas utiliser des URLs d'images temporaires</li> */}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  Prêt à importer vos produits ?
                </h2>
                <p className="text-primary-foreground/80 mb-6">
                  Téléchargez le fichier d'exemple, préparez vos données et
                  lancez votre import !
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg" asChild>
                    <a href="/exemple_produits.xlsx" download>
                      <Download className="w-5 h-5 mr-2" />
                      Télécharger le template Excel
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary"
                    onClick={downloadExampleCSV}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger l'exemple CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary"
                    asChild
                  >
                    <a href="/admin" target="_blank">
                      <Upload className="w-5 h-5 mr-2" />
                      Commencer l'import
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
