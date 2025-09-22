"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  GraduationCap,
  Users,
  Clock,
  CheckCircle,
  BookOpen,
  Award,
  Video,
  FileText,
  Calendar,
  Star,
  MapPin,
  Phone,
  Mail,
  Download,
  PlayCircle,
  Monitor,
  Wrench,
  Zap,
  Building,
  Shield,
  Target,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

export default function FormationServicePage() {
  const [selectedFormation, setSelectedFormation] = useState<string | null>(
    null
  );
  const [inscriptionForm, setInscriptionForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    formation: "",
    message: "",
  });
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const formations = [
    {
      id: "electricite-base",
      name: "Électricité de Base",
      duration: "3 jours (24h)",
      level: "Débutant",
      price: "75 000 FCFA",
      participants: "8-12",
      certification: true,
      popular: false,
      nextDate: "2024-02-15",
      description:
        "Formation complète aux fondamentaux de l'électricité pour les débutants",
      objectives: [
        "Comprendre les bases de l'électricité",
        "Maîtriser les lois fondamentales (Ohm, Kirchhoff)",
        "Utiliser les instruments de mesure",
        "Identifier les composants électriques",
        "Appliquer les règles de sécurité",
      ],
      program: [
        "Introduction à l'électricité",
        "Courant continu et alternatif",
        "Mesures électriques",
        "Composants passifs et actifs",
        "Sécurité électrique",
        "Travaux pratiques",
      ],
      prerequisites: "Aucun prérequis technique",
      materials: "Fournis par KesiMarket",
      instructor: "Ing. Paul NGUEMA",
      location: "Centre de formation Douala",
    },
    {
      id: "installation-industrielle",
      name: "Installation Industrielle",
      duration: "5 jours (40h)",
      level: "Avancé",
      price: "150 000 FCFA",
      participants: "6-10",
      certification: true,
      popular: true,
      nextDate: "2024-02-20",
      description:
        "Formation spécialisée pour les installations électriques industrielles",
      objectives: [
        "Dimensionner une installation industrielle",
        "Choisir les équipements adaptés",
        "Respecter les normes industrielles",
        "Gérer la maintenance préventive",
        "Optimiser la consommation énergétique",
      ],
      program: [
        "Normes et réglementations",
        "Calculs de puissance",
        "Schémas électriques industriels",
        "Automatismes et variateurs",
        "Protection et sécurité",
        "Mise en service et tests",
      ],
      prerequisites: "2 ans d'expérience en électricité",
      materials: "Équipements industriels fournis",
      instructor: "Ing. Marie ATEBA",
      location: "Plateforme technique Yaoundé",
    },
    {
      id: "domotique-smart-home",
      name: "Domotique & Smart Home",
      duration: "2 jours (16h)",
      level: "Intermédiaire",
      price: "90 000 FCFA",
      participants: "8-15",
      certification: true,
      popular: false,
      nextDate: "2024-02-25",
      description: "Maîtrisez les technologies de la maison connectée",
      objectives: [
        "Concevoir une installation domotique",
        "Configurer les protocoles de communication",
        "Installer et paramétrer les équipements",
        "Programmer les scénarios automatiques",
        "Assurer la maintenance des systèmes",
      ],
      program: [
        "Technologies domotiques",
        "Protocoles de communication",
        "Installation des capteurs",
        "Programmation des automatismes",
        "Interface utilisateur",
        "Dépannage et maintenance",
      ],
      prerequisites: "Bases en électricité",
      materials: "Kit domotique complet fourni",
      instructor: "Tech. Jean MVONDO",
      location: "Showroom domotique Douala",
    },
    {
      id: "energie-solaire",
      name: "Énergie Solaire Photovoltaïque",
      duration: "4 jours (32h)",
      level: "Intermédiaire",
      price: "120 000 FCFA",
      participants: "8-12",
      certification: true,
      popular: true,
      nextDate: "2024-03-05",
      description: "Formation complète sur les systèmes photovoltaïques",
      objectives: [
        "Dimensionner une installation solaire",
        "Choisir les composants adaptés",
        "Installer et raccorder les panneaux",
        "Configurer les onduleurs et batteries",
        "Assurer la maintenance des systèmes",
      ],
      program: [
        "Gisement solaire au Cameroun",
        "Technologies photovoltaïques",
        "Dimensionnement des systèmes",
        "Installation et raccordement",
        "Stockage et gestion de l'énergie",
        "Maintenance et monitoring",
      ],
      prerequisites: "Connaissance en électricité",
      materials: "Panneaux et équipements fournis",
      instructor: "Dr. Samuel BIYA",
      location: "Site pilote Garoua",
    },
    {
      id: "securite-electrique",
      name: "Sécurité Électrique",
      duration: "1 jour (8h)",
      level: "Tous niveaux",
      price: "45 000 FCFA",
      participants: "10-20",
      certification: true,
      popular: false,
      nextDate: "2024-02-28",
      description: "Formation obligatoire sur la sécurité électrique",
      objectives: [
        "Identifier les risques électriques",
        "Appliquer les mesures de prévention",
        "Utiliser les EPI adaptés",
        "Intervenir en cas d'accident",
        "Respecter la réglementation",
      ],
      program: [
        "Risques électriques",
        "Équipements de protection",
        "Procédures de sécurité",
        "Premiers secours électriques",
        "Réglementation camerounaise",
        "Cas pratiques",
      ],
      prerequisites: "Aucun",
      materials: "EPI fournis pour la formation",
      instructor: "Formateur CNPS",
      location: "Centres régionaux",
    },
    {
      id: "maintenance-electrique",
      name: "Maintenance Électrique",
      duration: "3 jours (24h)",
      level: "Intermédiaire",
      price: "85 000 FCFA",
      participants: "8-12",
      certification: true,
      popular: false,
      nextDate: "2024-03-10",
      description: "Techniques de maintenance préventive et corrective",
      objectives: [
        "Planifier la maintenance préventive",
        "Diagnostiquer les pannes",
        "Utiliser les outils de diagnostic",
        "Optimiser la disponibilité",
        "Gérer les pièces de rechange",
      ],
      program: [
        "Stratégies de maintenance",
        "Outils de diagnostic",
        "Maintenance préventive",
        "Dépannage et réparation",
        "Gestion des stocks",
        "Indicateurs de performance",
      ],
      prerequisites: "Expérience en électricité",
      materials: "Outils de diagnostic fournis",
      instructor: "Expert maintenance",
      location: "Atelier technique",
    },
  ];

  const formationCategories = [
    { name: "Tous", count: formations.length, filter: "all" },
    {
      name: "Débutant",
      count: formations.filter((f) => f.level === "Débutant").length,
      filter: "Débutant",
    },
    {
      name: "Intermédiaire",
      count: formations.filter((f) => f.level === "Intermédiaire").length,
      filter: "Intermédiaire",
    },
    {
      name: "Avancé",
      count: formations.filter((f) => f.level === "Avancé").length,
      filter: "Avancé",
    },
    {
      name: "Tous niveaux",
      count: formations.filter((f) => f.level === "Tous niveaux").length,
      filter: "Tous niveaux",
    },
  ];

  const instructors = [
    {
      name: "Ing. Paul NGUEMA",
      title: "Ingénieur Électricien Senior",
      experience: "15 ans",
      specialties: ["Électricité générale", "Formation technique", "Normes NF"],
      certifications: ["Ingénieur ENSP", "Formateur certifié"],
      avatar: "/images/instructors/paul-nguema.jpg",
    },
    {
      name: "Ing. Marie ATEBA",
      title: "Experte Installations Industrielles",
      experience: "12 ans",
      specialties: [
        "Automatismes",
        "Haute tension",
        "Maintenance industrielle",
      ],
      certifications: ["Master Automatique", "Habilitation B2V"],
      avatar: "/images/instructors/marie-ateba.jpg",
    },
    {
      name: "Dr. Samuel BIYA",
      title: "Spécialiste Énergies Renouvelables",
      experience: "10 ans",
      specialties: ["Photovoltaïque", "Stockage énergie", "Smart grids"],
      certifications: ["PhD Énergies", "Expert ADEME"],
      avatar: "/images/instructors/samuel-biya.jpg",
    },
  ];

  const testimonials = [
    {
      name: "Ibrahim SANOGO",
      company: "Électricité Générale SARL",
      formation: "Installation Industrielle",
      rating: 5,
      comment:
        "Formation exceptionnelle ! J'ai acquis des compétences que j'utilise quotidiennement. Les formateurs sont très compétents et la pratique est vraiment enrichissante.",
      date: "2024-01-15",
      avatar: "/images/testimonials/ibrahim-sanogo.jpg",
    },
    {
      name: "Marie KOUAM",
      company: "BATEX Entreprise",
      formation: "Domotique & Smart Home",
      rating: 5,
      comment:
        "Excellente formation ! J'ai pu installer mon premier système domotique dès la semaine suivante. Le support pédagogique est de qualité.",
      date: "2024-01-10",
      avatar: "/images/testimonials/marie-kouam.jpg",
    },
    {
      name: "Paul MVOGO",
      company: "Indépendant",
      formation: "Énergie Solaire",
      rating: 5,
      comment:
        "Formation très complète sur le solaire. J'ai maintenant les compétences pour dimensionner et installer des systèmes photovoltaïques.",
      date: "2024-01-08",
      avatar: "/images/testimonials/paul-mvogo.jpg",
    },
  ];

  const faqs = [
    {
      id: "1",
      question: "Comment s'inscrire à une formation ?",
      answer:
        "Vous pouvez vous inscrire en ligne via notre formulaire, par téléphone au +237 6 12 34 56 78, ou en vous rendant dans nos centres. Un acompte de 30% est demandé pour confirmer l'inscription.",
      category: "inscription",
    },
    {
      id: "2",
      question: "Les formations sont-elles certifiantes ?",
      answer:
        "Oui, toutes nos formations délivrent une certification reconnue par l'État du Cameroun et les entreprises du secteur. Un examen final valide l'acquisition des compétences.",
      category: "certification",
    },
    {
      id: "3",
      question: "Proposez-vous des formations en entreprise ?",
      answer:
        "Absolument ! Nous proposons des formations sur mesure dans vos locaux pour les groupes de 8 personnes minimum. Contactez-nous pour un devis personnalisé.",
      category: "entreprise",
    },
    {
      id: "4",
      question: "Que comprend le prix de la formation ?",
      answer:
        "Le prix inclut : la formation, les supports pédagogiques, les équipements pratiques, les pauses café, le déjeuner et la certification. Seul l'hébergement n'est pas inclus.",
      category: "tarif",
    },
    {
      id: "5",
      question: "Quels sont les horaires des formations ?",
      answer:
        "Les formations se déroulent généralement de 8h à 17h avec une pause déjeuner d'1h. Pour les formations du soir, c'est de 18h à 21h.",
      category: "planning",
    },
    {
      id: "6",
      question: "Y a-t-il un suivi après la formation ?",
      answer:
        "Oui, nous proposons un suivi de 3 mois avec support technique gratuit par email et téléphone pour vous accompagner dans l'application des compétences acquises.",
      category: "suivi",
    },
  ];

  const centers = [
    {
      name: "Centre de Formation Douala",
      address: "Akwa, Boulevard de la Liberté",
      city: "Douala",
      phone: "+237 6 12 34 56 78",
      email: "formation.dla@kesimarket.cm",
      capacity: "50 participants",
      equipment: [
        "8 postes de travail",
        "Vidéoprojecteur",
        "Matériel pratique",
        "Connexion WiFi",
      ],
    },
    {
      name: "Plateforme Technique Yaoundé",
      address: "Mfandena, Rue de la Réunification",
      city: "Yaoundé",
      phone: "+237 6 98 76 54 32",
      email: "formation.yde@kesimarket.cm",
      capacity: "40 participants",
      equipment: [
        "10 postes équipés",
        "Laboratoire électrique",
        "Atelier pratique",
        "Parking sécurisé",
      ],
    },
    {
      name: "Site Pilote Garoua",
      address: "Zone industrielle",
      city: "Garoua",
      phone: "+237 6 55 44 33 22",
      email: "formation.gra@kesimarket.cm",
      capacity: "25 participants",
      equipment: [
        "Installation solaire",
        "Équipements industriels",
        "Salle climatisée",
      ],
    },
  ];

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="secondary">Centre Certifié</Badge>
                  <Badge
                    variant="outline"
                    className="border-primary-foreground text-primary-foreground"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    Formations Reconnues
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Centre de Formation Technique
                </h1>
                <p className="text-xl text-primary-foreground/80 mb-8">
                  Développez vos compétences en électricité avec nos formations
                  certifiantes dispensées par des experts reconnus. De
                  l'initiation à la spécialisation avancée.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="secondary" size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Planning 2024
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Catalogue PDF
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-primary-foreground/10 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <GraduationCap className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">500+</div>
                      <div className="text-sm text-primary-foreground/80">
                        Formés/an
                      </div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <Award className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">98%</div>
                      <div className="text-sm text-primary-foreground/80">
                        Taux de réussite
                      </div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <Users className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">15</div>
                      <div className="text-sm text-primary-foreground/80">
                        Formateurs
                      </div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-primary-foreground/80">
                        Centres
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formations disponibles */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Catalogue de Formations
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                6 formations spécialisées pour développer vos compétences
                techniques, du niveau débutant aux technologies avancées
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {formations.map((formation, index) => (
                <Card
                  key={index}
                  className={`relative hover:shadow-xl transition-all duration-300 ${
                    formation.popular ? "ring-2 ring-primary" : ""
                  }`}
                >
                  {formation.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge variant="default" className="bg-primary">
                        <Star className="w-3 h-3 mr-1" />
                        Plus demandée
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {formation.level}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {formation.duration}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">
                          {formation.name}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {formation.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Informations pratiques */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{formation.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{formation.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>
                            Prochaine:{" "}
                            {new Date(formation.nextDate).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{formation.instructor}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Wrench className="w-4 h-4 text-primary" />
                          <span>{formation.materials}</span>
                        </div>
                        {formation.certification && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <Award className="w-4 h-4" />
                            <span>Certification incluse</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Objectifs */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-primary" />
                        Objectifs de la formation
                      </h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {formation.objectives
                          .slice(0, 4)
                          .map((objective, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <span className="text-sm">{objective}</span>
                            </div>
                          ))}
                      </div>
                      {formation.objectives.length > 4 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-primary hover:text-primary"
                          onClick={() =>
                            setSelectedFormation(
                              selectedFormation === formation.id
                                ? null
                                : formation.id
                            )
                          }
                        >
                          {selectedFormation === formation.id ? (
                            <>
                              Voir moins <ChevronUp className="w-4 h-4 ml-1" />
                            </>
                          ) : (
                            <>
                              Voir plus <ChevronDown className="w-4 h-4 ml-1" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Détails étendus */}
                    {selectedFormation === formation.id && (
                      <div className="space-y-4 border-t pt-4">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Programme détaillé
                          </h4>
                          <ul className="text-sm space-y-1">
                            {formation.program.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-center space-x-2"
                              >
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Prérequis</h4>
                          <p className="text-sm text-muted-foreground">
                            {formation.prerequisites}
                          </p>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Prix et inscription */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {formation.price}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          par participant
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                        <Button
                          size="sm"
                          variant={formation.popular ? "default" : "outline"}
                        >
                          S'inscrire
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Formateurs */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Notre Équipe de Formateurs
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Des experts reconnus du secteur avec une expérience terrain et
                pédagogique confirmée
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {instructors.map((instructor, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{instructor.name}</CardTitle>
                    <CardDescription>{instructor.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                          {instructor.experience} d'expérience
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Spécialités</h4>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {instructor.specialties.map((specialty, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Certifications</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {instructor.certifications.map((cert, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-center space-x-1"
                          >
                            <Award className="w-3 h-3" />
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Centres de formation */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Nos Centres de Formation
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                3 centres équipés avec du matériel professionnel pour une
                formation de qualité
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {centers.map((center, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <Building className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{center.name}</CardTitle>
                        <CardDescription>{center.city}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-primary mt-0.5" />
                        <span>{center.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{center.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>{center.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>Capacité: {center.capacity}</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">Équipements</h4>
                      <ul className="text-sm space-y-1">
                        {center.equipment.map((item, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Témoignages de Participants
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez les retours de nos stagiaires et leur progression
                professionnelle
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        )
                      )}
                    </div>
                    <CardTitle className="text-lg">
                      {testimonial.name}
                    </CardTitle>
                    <CardDescription>{testimonial.company}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Badge variant="outline" className="text-xs mb-3">
                        Formation: {testimonial.formation}
                      </Badge>
                      <p className="text-muted-foreground italic">
                        "{testimonial.comment}"
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(testimonial.date).toLocaleDateString("fr-FR")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Questions Fréquentes
                </h2>
                <p className="text-muted-foreground">
                  Tout ce que vous devez savoir sur nos formations
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <Card key={faq.id}>
                    <CardHeader
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleFAQ(faq.id)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {faq.question}
                        </CardTitle>
                        {openFAQ === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                    {openFAQ === faq.id && (
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">
                  Développez Vos Compétences Aujourd'hui
                </h2>
                <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                  Rejoignez plus de 500 professionnels formés chaque année et
                  boostez votre carrière avec nos formations techniques
                  reconnues.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Voir le planning complet
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary"
                    asChild
                  >
                    <Link href="/contact">
                      <Phone className="w-5 h-5 mr-2" />
                      Nous contacter
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
