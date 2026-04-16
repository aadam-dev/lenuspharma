import type { Branch } from "@/lib/api";
import { getWhatsAppUrl } from "@/lib/constants";
import { Card, CardContent } from "./ui/Card";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { Button } from "./ui/Button";

interface BranchCardProps {
  branch: Branch;
}

export function BranchCard({ branch }: BranchCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <MapPin className="h-6 w-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-foreground mb-1">{branch.name}</h3>
            <p className="text-muted-foreground text-sm mb-2">{branch.address}</p>
            <p className="text-xs text-muted-foreground bg-secondary/50 inline-block px-2 py-1 rounded">
              GPS: {branch.ghanaPostGps}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button asChild variant="outline" size="sm" className="gap-2 h-9">
                <a href={`tel:${branch.phone}`}>
                  <Phone className="w-3.5 h-3.5" />
                  {branch.phone}
                </a>
              </Button>
              <Button asChild variant="secondary" size="sm" className="gap-2 h-9 text-green-700 bg-green-50 hover:bg-green-100 border border-green-200">
                <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

