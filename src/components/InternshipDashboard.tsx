import React, { useState } from "react";
import { Search, MapPin, Briefcase, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface StudentProfile {
  skills: string;
  qualifications: string;
  locations: string;
  sectors: string;
}

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  score: number;
  reason: string;
  sector: string;
}

interface Language {
  code: "en" | "hi";
  name: string;
}

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
];

const translations = {
  en: {
    title: "Internship Recommender",
    subtitle: "Find your perfect internship match",
    profileForm: "Student Profile",
    skills: "Skills",
    skillsPlaceholder: "e.g., Python, React, Marketing, Design",
    qualifications: "Qualifications",
    qualificationsPlaceholder: "Describe your education and certifications",
    locations: "Preferred Locations",
    locationsPlaceholder: "e.g., Delhi, Mumbai, Remote",
    sectors: "Sector Interests",
    sectorsPlaceholder: "e.g., Technology, Healthcare, Finance",
    findInternships: "Find Internships",
    recommendations: "Recommended Internships",
    filterLocation: "Filter by Location",
    filterSector: "Filter by Sector",
    allLocations: "All Locations",
    allSectors: "All Sectors",
    matchScore: "Match",
    company: "Company",
    location: "Location",
    reason: "Why this matches",
    loading: "Finding your perfect matches...",
    noResults: "No internships found. Try adjusting your filters.",
  },
  hi: {
    title: "इंटर्नशिप सिफारिशकर्ता",
    subtitle: "अपना सही इंटर्नशिप मैच खोजें",
    profileForm: "छात्र प्रोफाइल",
    skills: "कौशल",
    skillsPlaceholder: "जैसे, Python, React, Marketing, Design",
    qualifications: "योग्यताएं",
    qualificationsPlaceholder: "अपनी शिक्षा और प्रमाणपत्रों का वर्णन करें",
    locations: "पसंदीदा स्थान",
    locationsPlaceholder: "जैसे, दिल्ली, मुंबई, रिमोट",
    sectors: "क्षेत्र रुचियां",
    sectorsPlaceholder: "जैसे, प्रौद्योगिकी, स्वास्थ्य सेवा, वित्त",
    findInternships: "इंटर्नशिप खोजें",
    recommendations: "सुझाई गई इंटर्नशिप",
    filterLocation: "स्थान के अनुसार फिल्टर",
    filterSector: "क्षेत्र के अनुसार फिल्टर",
    allLocations: "सभी स्थान",
    allSectors: "सभी क्षेत्र",
    matchScore: "मैच",
    company: "कंपनी",
    location: "स्थान",
    reason: "यह क्यों मैच करता है",
    loading: "आपके सही मैच खोजे जा रहे हैं...",
    noResults:
      "कोई इंटर्नशिप नहीं मिली। अपने फिल्टर समायोजित करने का प्रयास करें।",
  },
};

// Mock API function - replace with actual API call
const mockRecommendAPI = async (
  profile: StudentProfile
): Promise<Internship[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const mockInternships: Internship[] = [
    {
      id: "1",
      title: "Frontend Developer Intern",
      company: "TechCorp Solutions",
      location: "Delhi",
      score: 92,
      reason: "Perfect match for your React and JavaScript skills",
      sector: "Technology",
    },
    {
      id: "2",
      title: "Data Analyst Intern",
      company: "DataViz Inc",
      location: "Mumbai",
      score: 87,
      reason: "Your Python skills align well with our data projects",
      sector: "Technology",
    },
    {
      id: "3",
      title: "Marketing Intern",
      company: "Creative Solutions",
      location: "Bangalore",
      score: 78,
      reason: "Great opportunity to apply your marketing knowledge",
      sector: "Marketing",
    },
    {
      id: "4",
      title: "UI/UX Design Intern",
      company: "Design Studio Pro",
      location: "Remote",
      score: 85,
      reason: "Your design skills and creativity are exactly what we need",
      sector: "Design",
    },
    {
      id: "5",
      title: "Financial Analyst Intern",
      company: "FinTech Innovations",
      location: "Gurgaon",
      score: 73,
      reason: "Good match for your analytical and finance background",
      sector: "Finance",
    },
  ];

  return mockInternships.sort((a, b) => b.score - a.score);
};

export function InternshipDashboard() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [profile, setProfile] = useState<StudentProfile>({
    skills: "",
    qualifications: "",
    locations: "",
    sectors: "",
  });
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const { toast } = useToast();

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recommendations = await mockRecommendAPI(profile);
      setInternships(recommendations);
      toast({
        title: "Success!",
        description: `Found ${recommendations.length} internship recommendations`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredInternships = internships.filter((internship) => {
    const locationMatch =
      locationFilter === "all" ||
      internship.location.toLowerCase().includes(locationFilter.toLowerCase());
    const sectorMatch =
      sectorFilter === "all" ||
      internship.sector.toLowerCase().includes(sectorFilter.toLowerCase());
    return locationMatch && sectorMatch;
  });

  const uniqueLocations = Array.from(
    new Set(internships.map((i) => i.location))
  );
  const uniqueSectors = Array.from(new Set(internships.map((i) => i.sector)));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">
                {t.title}
              </h1>
              <p className="text-primary-foreground/80 mt-1">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary-foreground" />
              <Select
                value={language}
                onValueChange={(value: "en" | "hi") => setLanguage(value)}
              >
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-primary-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-form bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  {t.profileForm}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="skills">{t.skills}</Label>
                    <Input
                      id="skills"
                      placeholder={t.skillsPlaceholder}
                      value={profile.skills}
                      onChange={(e) =>
                        setProfile({ ...profile, skills: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="qualifications">{t.qualifications}</Label>
                    <Textarea
                      id="qualifications"
                      placeholder={t.qualificationsPlaceholder}
                      value={profile.qualifications}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          qualifications: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="locations">{t.locations}</Label>
                    <Input
                      id="locations"
                      placeholder={t.locationsPlaceholder}
                      value={profile.locations}
                      onChange={(e) =>
                        setProfile({ ...profile, locations: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sectors">{t.sectors}</Label>
                    <Input
                      id="sectors"
                      placeholder={t.sectorsPlaceholder}
                      value={profile.sectors}
                      onChange={(e) =>
                        setProfile({ ...profile, sectors: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Search className="w-4 h-4 mr-2 animate-spin" />
                        {t.loading}
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        {t.findInternships}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {internships.length > 0 && (
              <>
                {/* Filters */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Select
                      value={locationFilter}
                      onValueChange={setLocationFilter}
                    >
                      <SelectTrigger>
                        <MapPin className="w-4 h-4 mr-2" />
                        <SelectValue placeholder={t.filterLocation} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t.allLocations}</SelectItem>
                        {uniqueLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Select
                      value={sectorFilter}
                      onValueChange={setSectorFilter}
                    >
                      <SelectTrigger>
                        <Briefcase className="w-4 h-4 mr-2" />
                        <SelectValue placeholder={t.filterSector} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t.allSectors}</SelectItem>
                        {uniqueSectors.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Recommendations Header */}
                <h2 className="text-2xl font-semibold mb-6">
                  {t.recommendations}
                </h2>

                {/* Internship Cards */}
                {filteredInternships.length > 0 ? (
                  <div className="space-y-4">
                    {filteredInternships.map((internship) => (
                      <Card
                        key={internship.id}
                        className="shadow-card hover:shadow-lg transition-smooth bg-gradient-card"
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">
                                {internship.title}
                              </h3>
                              <p className="text-muted-foreground">
                                {t.company}: {internship.company}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="bg-gradient-score text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                                {internship.score}% {t.matchScore}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <MapPin className="w-3 h-3" />
                              {internship.location}
                            </Badge>
                            <Badge variant="outline">{internship.sector}</Badge>
                          </div>

                          <div className="bg-secondary/50 p-3 rounded-md">
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              {t.reason}:
                            </p>
                            <p className="text-sm">{internship.reason}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="shadow-card">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">{t.noResults}</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
