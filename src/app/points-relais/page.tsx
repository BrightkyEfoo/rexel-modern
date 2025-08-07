import { MapPin, Clock, Phone, Mail, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { appConfig } from '@/lib/config/app';

export default function PointsRelaisPage() {
  const pointsRelais = appConfig.relayPoints;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Nos Points de Relais</h1>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Retrouvez nos points de relais partout au Cameroun pour un service de proximité et une expertise en matériel énergétique
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="Entrez votre code postal ou ville..."
                  className="pl-10 pr-4 py-3 text-base"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Points de relais</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Satisfaction client</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24h</div>
              <div className="text-muted-foreground">Délai de retrait</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">7j/7</div>
              <div className="text-muted-foreground">Service disponible</div>
            </div>
          </div>
        </div>
      </div>

      {/* Points de relais list */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pointsRelais.map((point) => (
            <Card key={point.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-2">{point.name}</CardTitle>
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{point.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{point.hours}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {point.distance}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium">{point.rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Services disponibles</h4>
                    <div className="flex flex-wrap gap-2">
                      {point.services.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>{point.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4" />
                        <span>{point.email}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Appeler
                      </Button>
                      <Button size="sm">
                        <Navigation className="w-4 h-4 mr-2" />
                        Itinéraire
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Besoin d'aide ?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Notre équipe d'experts en matériel énergétique est là pour vous accompagner
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <Phone className="w-5 h-5 mr-2" />
              Nous contacter
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Mail className="w-5 h-5 mr-2" />
              Demander un devis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 