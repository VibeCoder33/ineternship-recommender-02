import React, { useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Languages,
  Building,
  FileText,
  Map,
  Star,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Chatbox } from "@/components/chatbox";
import { GEMINI_API_KEY } from "@/lib/gemini";

// --- Interfaces and Mock Data ---
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
    subtitle: "AI-Based Smart Allocation Engine",
    profileForm: "Your Profile",
    skills: "Your Skills",
    skillsPlaceholder: "e.g., Python, React, Marketing...",
    qualifications: "Your Qualifications",
    qualificationsPlaceholder: "e.g., B.Tech in CS, MBA...",
    locations: "Preferred Locations",
    locationsPlaceholder: "e.g., Delhi, Mumbai, Remote...",
    sectors: "Interested Sectors",
    sectorsPlaceholder: "e.g., Technology, Healthcare...",
    findInternships: "Find My Internships",
    recommendations: "Your Recommended Internships",
    matchScore: "Match Score",
    reason: "Why it’s a good match:",
    loading: "Analyzing your profile...",
    noResults: "No internships found. Try adjusting your profile details.",
    welcomeTitle: "Unlock Your Career Potential",
    welcomeMessage:
      "Fill in your profile on the left to discover personalized internship opportunities tailored just for you.",
  },
  hi: {
    title: "इंटर्नशिप सिफारिशकर्ता",
    subtitle: "एआई-आधारित स्मार्ट आवंटन इंजन",
    profileForm: "आपकी प्रोफ़ाइल",
    skills: "आपके कौशल",
    skillsPlaceholder: "उदा., Python, React, मार्केटिंग...",
    qualifications: "आपकी योग्यताएं",
    qualificationsPlaceholder: "उदा., B.Tech in CS, MBA...",
    locations: "पसंदीदा स्थान",
    locationsPlaceholder: "उदा., दिल्ली, मुंबई, रिमोट...",
    sectors: "इच्छुक क्षेत्र",
    sectorsPlaceholder: "उदा., प्रौद्योगिकी, स्वास्थ्य सेवा...",
    findInternships: "मेरी इंटर्नशिप खोजें",
    recommendations: "आपके लिए अनुशंसित इंटर्नशिप",
    matchScore: "मिलान स्कोर",
    reason: "यह एक अच्छा मेल क्यों है:",
    loading: "आपकी प्रोफ़ाइल का विश्लेषण किया जा रहा है...",
    noResults:
      "कोई इंटर्नशिप नहीं मिली। अपनी प्रोफ़ाइल विवरण समायोजित करने का प्रयास करें।",
    welcomeTitle: "अपनी करियर क्षमता को अनलॉक करें",
    welcomeMessage:
      "आपके लिए विशेष रूप से तैयार किए गए व्यक्तिगत इंटर्नशिप अवसरों की खोज के लिए बाईं ओर अपनी प्रोफ़ाइल भरें।",
  },
};

const largeSampleInternships: Internship[] = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "TechCorp Solutions",
    location: "Delhi",
    score: 92,
    reason:
      "Excellent match for your React and JavaScript skills, aligning with your interest in the Technology sector.",
    sector: "Technology",
  },
  {
    id: "2",
    title: "Data Analyst Intern",
    company: "DataViz Inc",
    location: "Mumbai",
    score: 87,
    reason:
      "Your Python skills align well with our data projects in the fast-growing tech landscape.",
    sector: "Technology",
  },
  {
    id: "3",
    title: "Marketing Intern",
    company: "Creative Solutions",
    location: "Bangalore",
    score: 78,
    reason:
      "Great opportunity to apply your marketing knowledge in a leading creative agency.",
    sector: "Marketing",
  },
  {
    id: "4",
    title: "UI/UX Design Intern",
    company: "Design Studio Pro",
    location: "Remote",
    score: 85,
    reason:
      "Your design skills are exactly what we need for our upcoming mobile application.",
    sector: "Design",
  },
  {
    id: "5",
    title: "Financial Analyst Intern",
    company: "FinTech Innovations",
    location: "Gurgaon",
    score: 73,
    reason:
      "A solid match for your analytical and finance background in the booming FinTech sector.",
    sector: "Finance",
  },
  {
    id: "6",
    title: "Backend Developer Intern",
    company: "InfraCloud",
    location: "Pune",
    score: 90,
    reason:
      "Strong demand for your Golang and Kubernetes skills for our cloud-native projects.",
    sector: "Technology",
  },
  {
    id: "7",
    title: "Product Management Intern",
    company: "InnovateX",
    location: "Remote",
    score: 88,
    reason:
      "Your business acumen and tech skills make you a great fit for our product team.",
    sector: "Product",
  },
  {
    id: "8",
    title: "Human Resources Intern",
    company: "PeopleFirst",
    location: "Chennai",
    score: 75,
    reason:
      "An opportunity to develop your HR skills in a fast-paced environment.",
    sector: "HR",
  },
  {
    id: "9",
    title: "Content Writer Intern",
    company: "WordWeavers",
    location: "Kolkata",
    score: 82,
    reason:
      "Your creative writing skills are perfect for our content marketing team.",
    sector: "Marketing",
  },
  {
    id: "10",
    title: "Cybersecurity Intern",
    company: "SecureNet",
    location: "Hyderabad",
    score: 95,
    reason:
      "High demand for cybersecurity skills; your qualifications are a perfect match.",
    sector: "Technology",
  },
  {
    id: "11",
    title: "AI/ML Intern",
    company: "Cognitive AI",
    location: "Bangalore",
    score: 98,
    reason:
      "Your machine learning coursework and Python skills are exactly what we are looking for.",
    sector: "Technology",
  },
  {
    id: "12",
    title: "DevOps Intern",
    company: "DeployFast",
    location: "Remote",
    score: 89,
    reason:
      "Experience with CI/CD pipelines and cloud platforms is a strong match.",
    sector: "Technology",
  },
  {
    id: "13",
    title: "Graphic Design Intern",
    company: "PixelPerfect",
    location: "Mumbai",
    score: 84,
    reason:
      "Your portfolio showcases a strong understanding of modern design principles.",
    sector: "Design",
  },
  {
    id: "14",
    title: "Business Development Intern",
    company: "GrowthHackers",
    location: "Delhi",
    score: 77,
    reason:
      "Your communication and analytical skills are well-suited for a business development role.",
    sector: "Business",
  },
  {
    id: "15",
    title: "Legal Intern",
    company: "Law & Order Associates",
    location: "Delhi",
    score: 70,
    reason: "Opportunity to gain practical experience in corporate law.",
    sector: "Legal",
  },
  {
    id: "16",
    title: "Social Media Marketing Intern",
    company: "BuzzFeed India",
    location: "Mumbai",
    score: 81,
    reason:
      "Proven experience in managing social media accounts and creating engaging content.",
    sector: "Marketing",
  },
  {
    id: "17",
    title: "Mobile App Development Intern",
    company: "AppyFactor",
    location: "Remote",
    score: 91,
    reason: "Your experience with Flutter and React Native is highly valuable.",
    sector: "Technology",
  },
  {
    id: "18",
    title: "Operations Intern",
    company: "SupplyChain Co.",
    location: "Chennai",
    score: 72,
    reason:
      "A great chance to learn about logistics and supply chain management.",
    sector: "Operations",
  },
  {
    id: "19",
    title: "Research Intern",
    company: "Pharma Solutions",
    location: "Hyderabad",
    score: 86,
    reason:
      "Your background in biotechnology and research methodologies is a strong fit.",
    sector: "Healthcare",
  },
  {
    id: "20",
    title: "Customer Success Intern",
    company: "ClientJoy",
    location: "Pune",
    score: 79,
    reason:
      "Excellent interpersonal skills and a problem-solving mindset are what we need.",
    sector: "Customer Service",
  },
];

// --- Sub-components ---
const LoadingIndicator: React.FC<{ loadingText: string }> = ({
  loadingText,
}) => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="flex justify-center items-center h-24">
      <div className="animate-bar-wave w-2.5 h-12 bg-primary mx-1.5 [animation-delay:-1.1s]"></div>
      <div className="animate-bar-wave w-2.5 h-12 bg-primary mx-1.5 [animation-delay:-1.0s]"></div>
      <div className="animate-bar-wave w-2.5 h-12 bg-primary mx-1.5 [animation-delay:-0.9s]"></div>
    </div>
    <p className="mt-4 text-sm font-medium text-muted-foreground">
      {loadingText}
    </p>
  </div>
);

const WelcomeMessage: React.FC<{ title: string; message: string }> = ({
  title,
  message,
}) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Star className="w-16 h-16 text-primary mb-4" />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="max-w-md text-muted-foreground">{message}</p>
    </motion.div>
  </div>
);

// --- Main Dashboard Component ---
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
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const t = translations[language];

  const recommendAPI = async (
    profile: StudentProfile
  ): Promise<Internship[]> => {
    if (!GEMINI_API_KEY) {
      console.error("Gemini API key is missing. Falling back to sample data.");
      toast({
        title: "API Key Missing",
        description:
          "Please add your Gemini API key in src/lib/gemini.ts to get real-time recommendations.",
        variant: "destructive",
      });
      return largeSampleInternships.sort((a, b) => b.score - a.score);
    }
    try {
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const userPrompt = `Based on the following student profile, please find 10-20 real, currently available internship opportunities in India. Today's date is ${currentDate}.

          Student's Profile:
          - Skills: ${profile.skills}
          - Qualifications: ${profile.qualifications}
          - Preferred Locations: ${profile.locations}
          - Sector Interests: ${profile.sectors}
          
          Use Google Search to find these internships and ensure they are recent. For each internship, provide a "score" from 60 to 100 indicating the quality of the match, and a "reason" explaining why it's a good fit. Return the results as a clean JSON array of objects, with no extra text before or after the array. Give each internship a unique ID.`;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

      const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        tools: [{ google_search: {} }],
        systemInstruction: {
          parts: [
            {
              text: "You are an expert career counselor AI for a smart internship allocation engine.",
            },
          ],
        },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                title: { type: "STRING" },
                company: { type: "STRING" },
                location: { type: "STRING" },
                score: { type: "NUMBER" },
                reason: { type: "STRING" },
                sector: { type: "STRING" },
              },
              required: [
                "id",
                "title",
                "company",
                "location",
                "score",
                "reason",
                "sector",
              ],
            },
          },
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(
          "API response not OK, falling back to sample data.",
          response
        );
        toast({
          title: "Live Search Failed",
          description: `Could not fetch real-time data (${response.status}). Showing sample results.`,
          variant: "destructive",
        });
        return largeSampleInternships.sort((a, b) => b.score - a.score);
      }

      const result = await response.json();
      const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (jsonText) {
        const parsedInternships = JSON.parse(jsonText);
        if (Array.isArray(parsedInternships) && parsedInternships.length > 0) {
          return parsedInternships.sort((a, b) => b.score - a.score);
        }
      }

      console.warn(
        "API did not return valid internship data, falling back to sample data."
      );
      return largeSampleInternships.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error(
        "Error fetching from Gemini API, falling back to sample data:",
        error
      );
      return largeSampleInternships.sort((a, b) => b.score - a.score);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(true);
    try {
      const recommendations = await recommendAPI(profile);
      setInternships(recommendations);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to fetch recommendations. Showing sample data instead.",
        variant: "destructive",
      });
      setInternships(largeSampleInternships.sort((a, b) => b.score - a.score));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen font-sans">
      {/* Left Panel: Form */}
      <div className="hidden lg:block lg:w-1/3 xl:w-1/4 p-8 border-r border-border sticky top-0 h-screen overflow-y-auto bg-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">{t.title}</h1>
          <Select
            value={language}
            onValueChange={(value: "en" | "hi") => setLanguage(value)}
          >
            <SelectTrigger className="w-32">
              <Languages className="w-4 h-4 mr-2" />
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

        <h2 className="text-lg font-semibold mb-4">{t.profileForm}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="skills">
              <Briefcase className="w-4 h-4 inline mr-2" />
              {t.skills}
            </Label>
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
          <div className="space-y-2">
            <Label htmlFor="qualifications">
              <FileText className="w-4 h-4 inline mr-2" />
              {t.qualifications}
            </Label>
            <Textarea
              id="qualifications"
              placeholder={t.qualificationsPlaceholder}
              value={profile.qualifications}
              onChange={(e) =>
                setProfile({ ...profile, qualifications: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locations">
              <Map className="w-4 h-4 inline mr-2" />
              {t.locations}
            </Label>
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
          <div className="space-y-2">
            <Label htmlFor="sectors">
              <Building className="w-4 h-4 inline mr-2" />
              {t.sectors}
            </Label>
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
          <Button type="submit" className="w-full" disabled={loading}>
            <Search className="w-4 h-4 mr-2" />
            {t.findInternships}
          </Button>
        </form>
      </div>

      {/* Right Panel: Results */}
      <div className="w-full lg:w-2/3 xl:w-3/4 p-8 overflow-y-auto h-screen relative">
        <div className="geometric-background">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape-outline shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape-outline shape-5"></div>
          <div className="shape shape-6"></div>
          <div className="shape-outline shape-7"></div>
          <div className="shape shape-8"></div>
        </div>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingIndicator loadingText={t.loading} />
            </motion.div>
          ) : !submitted ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WelcomeMessage
                title={t.welcomeTitle}
                message={t.welcomeMessage}
              />
            </motion.div>
          ) : (
            <motion.div key="results">
              <h2 className="text-2xl font-bold mb-6">{t.recommendations}</h2>
              <div className="space-y-4">
                <AnimatePresence>
                  {internships.length > 0 ? (
                    internships.map((internship, index) => (
                      <motion.div
                        key={internship.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-primary">
                                  {internship.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {internship.company}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-sm">
                                {internship.score}% {t.matchScore}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground my-3">
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />{" "}
                                {internship.location}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Briefcase className="w-4 h-4" />{" "}
                                {internship.sector}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/80 italic">
                              "{internship.reason}"
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">
                      {t.noResults}
                    </p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {submitted && !loading && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={() => setIsChatOpen(true)}
            size="icon"
            className="rounded-full w-14 h-14 shadow-lg"
          >
            <MessageSquare className="w-6 h-6" />
          </Button>
        </div>
      )}

      <Chatbox
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        studentProfile={profile}
      />
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   MapPin,
//   Briefcase,
//   Languages,
//   ChevronRight,
//   Building,
//   FileText,
//   Map,
//   Star,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { AnimatePresence, motion } from "framer-motion";

// // --- Interfaces and Mock Data ---
// interface StudentProfile {
//   skills: string;
//   qualifications: string;
//   locations: string;
//   sectors: string;
// }

// interface Internship {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   score: number;
//   reason: string;
//   sector: string;
// }

// interface Language {
//   code: "en" | "hi";
//   name: string;
// }

// const languages: Language[] = [
//   { code: "en", name: "English" },
//   { code: "hi", name: "हिंदी" },
// ];

// const translations = {
//   en: {
//     title: "Internship Recommender",
//     subtitle: "AI-Powered Opportunity Matching",
//     profileForm: "Your Profile",
//     skills: "Your Skills",
//     skillsPlaceholder: "e.g., Python, React, Marketing...",
//     qualifications: "Your Qualifications",
//     qualificationsPlaceholder: "e.g., B.Tech in CS, MBA...",
//     locations: "Preferred Locations",
//     locationsPlaceholder: "e.g., Delhi, Mumbai, Remote...",
//     sectors: "Interested Sectors",
//     sectorsPlaceholder: "e.g., Technology, Healthcare...",
//     findInternships: "Find My Internships",
//     recommendations: "Your Recommended Internships",
//     matchScore: "Match Score",
//     reason: "Why it’s a good match:",
//     loading: "Analyzing your profile...",
//     noResults: "No internships found. Try adjusting your profile details.",
//     welcomeTitle: "Unlock Your Career Potential",
//     welcomeMessage:
//       "Fill in your profile on the left to discover personalized internship opportunities tailored just for you.",
//   },
//   hi: {
//     title: "इंटर्नशिप सिफारिशकर्ता",
//     subtitle: "AI-पावर्ड अवसर मिलान",
//     profileForm: "आपकी प्रोफ़ाइल",
//     skills: "आपके कौशल",
//     skillsPlaceholder: "उदा., Python, React, मार्केटिंग...",
//     qualifications: "आपकी योग्यताएं",
//     qualificationsPlaceholder: "उदा., B.Tech in CS, MBA...",
//     locations: "पसंदीदा स्थान",
//     locationsPlaceholder: "उदा., दिल्ली, मुंबई, रिमोट...",
//     sectors: "इच्छुक क्षेत्र",
//     sectorsPlaceholder: "उदा., प्रौद्योगिकी, स्वास्थ्य सेवा...",
//     findInternships: "मेरी इंटर्नशिप खोजें",
//     recommendations: "आपके लिए अनुशंसित इंटर्नशिप",
//     matchScore: "मिलान स्कोर",
//     reason: "यह एक अच्छा मेल क्यों है:",
//     loading: "आपकी प्रोफ़ाइल का विश्लेषण किया जा रहा है...",
//     noResults:
//       "कोई इंटर्नशिप नहीं मिली। अपनी प्रोफ़ाइल विवरण समायोजित करने का प्रयास करें।",
//     welcomeTitle: "अपनी करियर क्षमता को अनलॉक करें",
//     welcomeMessage:
//       "आपके लिए विशेष रूप से तैयार किए गए व्यक्तिगत इंटर्नशिप अवसरों की खोज के लिए बाईं ओर अपनी प्रोफ़ाइल भरें।",
//   },
// };

// const mockRecommendAPI = async (
//   profile: StudentProfile
// ): Promise<Internship[]> => {
//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   const mockInternships = [
//     {
//       id: "1",
//       title: "Frontend Developer Intern",
//       company: "TechCorp Solutions",
//       location: "Delhi",
//       score: 92,
//       reason:
//         "Excellent match for your React and JavaScript skills, aligning with your interest in the Technology sector.",
//       sector: "Technology",
//     },
//     {
//       id: "2",
//       title: "Data Analyst Intern",
//       company: "DataViz Inc",
//       location: "Mumbai",
//       score: 87,
//       reason:
//         "Your Python skills align well with our data projects in the fast-growing tech landscape.",
//       sector: "Technology",
//     },
//     {
//       id: "3",
//       title: "Marketing Intern",
//       company: "Creative Solutions",
//       location: "Bangalore",
//       score: 78,
//       reason:
//         "Great opportunity to apply your marketing knowledge in a leading creative agency.",
//       sector: "Marketing",
//     },
//     {
//       id: "4",
//       title: "UI/UX Design Intern",
//       company: "Design Studio Pro",
//       location: "Remote",
//       score: 85,
//       reason:
//         "Your design skills are exactly what we need for our upcoming mobile application.",
//       sector: "Design",
//     },
//     {
//       id: "5",
//       title: "Financial Analyst Intern",
//       company: "FinTech Innovations",
//       location: "Gurgaon",
//       score: 73,
//       reason:
//         "A solid match for your analytical and finance background in the booming FinTech sector.",
//       sector: "Finance",
//     },
//   ];
//   return mockInternships.sort((a, b) => b.score - a.score);
// };

// // --- Sub-components ---
// const LoadingIndicator: React.FC<{ loadingText: string }> = ({
//   loadingText,
// }) => (
//   <div className="flex flex-col items-center justify-center h-full text-center">
//     <div className="flex justify-center items-center h-24">
//       <div className="animate-bar-wave w-2.5 h-12 bg-primary mx-1.5 [animation-delay:-1.1s]"></div>
//       <div className="animate-bar-wave w-2.5 h-12 bg-primary mx-1.5 [animation-delay:-1.0s]"></div>
//       <div className="animate-bar-wave w-2.5 h-12 bg-primary mx-1.5 [animation-delay:-0.9s]"></div>
//     </div>
//     <p className="mt-4 text-sm font-medium text-muted-foreground">
//       {loadingText}
//     </p>
//   </div>
// );

// const WelcomeMessage: React.FC<{ title: string; message: string }> = ({
//   title,
//   message,
// }) => (
//   <div className="flex flex-col items-center justify-center h-full text-center p-8">
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Star className="w-16 h-16 text-primary mb-4" />
//       <h2 className="text-2xl font-bold mb-2">{title}</h2>
//       <p className="max-w-md text-muted-foreground">{message}</p>
//     </motion.div>
//   </div>
// );

// // --- Main Dashboard Component ---
// export function InternshipDashboard() {
//   const [language, setLanguage] = useState<"en" | "hi">("en");
//   const [profile, setProfile] = useState<StudentProfile>({
//     skills: "",
//     qualifications: "",
//     locations: "",
//     sectors: "",
//   });
//   const [internships, setInternships] = useState<Internship[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const { toast } = useToast();

//   const t = translations[language];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setSubmitted(true);
//     try {
//       const recommendations = await mockRecommendAPI(profile);
//       setInternships(recommendations);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch recommendations. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex w-full min-h-screen font-sans">
//       {/* Left Panel: Form */}
//       <div className="hidden lg:block lg:w-1/3 xl:w-1/4 p-8 border-r border-border sticky top-0 h-screen overflow-y-auto bg-white">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-xl font-bold">{t.title}</h1>
//           <Select
//             value={language}
//             onValueChange={(value: "en" | "hi") => setLanguage(value)}
//           >
//             <SelectTrigger className="w-32">
//               <Languages className="w-4 h-4 mr-2" />
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {languages.map((lang) => (
//                 <SelectItem key={lang.code} value={lang.code}>
//                   {lang.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <h2 className="text-lg font-semibold mb-4">{t.profileForm}</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="skills">
//               <Briefcase className="w-4 h-4 inline mr-2" />
//               {t.skills}
//             </Label>
//             <Input
//               id="skills"
//               placeholder={t.skillsPlaceholder}
//               value={profile.skills}
//               onChange={(e) =>
//                 setProfile({ ...profile, skills: e.target.value })
//               }
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="qualifications">
//               <FileText className="w-4 h-4 inline mr-2" />
//               {t.qualifications}
//             </Label>
//             <Textarea
//               id="qualifications"
//               placeholder={t.qualificationsPlaceholder}
//               value={profile.qualifications}
//               onChange={(e) =>
//                 setProfile({ ...profile, qualifications: e.target.value })
//               }
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="locations">
//               <Map className="w-4 h-4 inline mr-2" />
//               {t.locations}
//             </Label>
//             <Input
//               id="locations"
//               placeholder={t.locationsPlaceholder}
//               value={profile.locations}
//               onChange={(e) =>
//                 setProfile({ ...profile, locations: e.target.value })
//               }
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="sectors">
//               <Building className="w-4 h-4 inline mr-2" />
//               {t.sectors}
//             </Label>
//             <Input
//               id="sectors"
//               placeholder={t.sectorsPlaceholder}
//               value={profile.sectors}
//               onChange={(e) =>
//                 setProfile({ ...profile, sectors: e.target.value })
//               }
//               required
//             />
//           </div>
//           <Button type="submit" className="w-full" disabled={loading}>
//             <Search className="w-4 h-4 mr-2" />
//             {t.findInternships}
//           </Button>
//         </form>
//       </div>

//       {/* Right Panel: Results */}
//       <div className="w-full lg:w-2/3 xl:w-3/4 p-8 overflow-y-auto h-screen relative">
//         <div className="geometric-background">
//           <div className="shape shape-1"></div>
//           <div className="shape shape-2"></div>
//           <div className="shape-outline shape-3"></div>
//           <div className="shape shape-4"></div>
//           <div className="shape-outline shape-5"></div>
//           <div className="shape shape-6"></div>
//           <div className="shape-outline shape-7"></div>
//           <div className="shape shape-8"></div>
//         </div>
//         <AnimatePresence mode="wait">
//           {loading ? (
//             <motion.div
//               key="loader"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <LoadingIndicator loadingText={t.loading} />
//             </motion.div>
//           ) : !submitted ? (
//             <motion.div
//               key="welcome"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <WelcomeMessage
//                 title={t.welcomeTitle}
//                 message={t.welcomeMessage}
//               />
//             </motion.div>
//           ) : (
//             <motion.div key="results">
//               <h2 className="text-2xl font-bold mb-6">{t.recommendations}</h2>
//               <div className="space-y-4">
//                 <AnimatePresence>
//                   {internships.length > 0 ? (
//                     internships.map((internship, index) => (
//                       <motion.div
//                         key={internship.id}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         transition={{ duration: 0.3, delay: index * 0.1 }}
//                       >
//                         <Card className="hover:shadow-lg transition-shadow duration-300">
//                           <CardContent className="p-6">
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <h3 className="text-lg font-semibold text-primary">
//                                   {internship.title}
//                                 </h3>
//                                 <p className="text-sm text-muted-foreground">
//                                   {internship.company}
//                                 </p>
//                               </div>
//                               <Badge variant="outline" className="text-sm">
//                                 {internship.score}% {t.matchScore}
//                               </Badge>
//                             </div>
//                             <div className="flex items-center gap-4 text-sm text-muted-foreground my-3">
//                               <span className="flex items-center gap-1.5">
//                                 <MapPin className="w-4 h-4" />{" "}
//                                 {internship.location}
//                               </span>
//                               <span className="flex items-center gap-1.5">
//                                 <Briefcase className="w-4 h-4" />{" "}
//                                 {internship.sector}
//                               </span>
//                             </div>
//                             <p className="text-sm text-foreground/80 italic">
//                               "{internship.reason}"
//                             </p>
//                           </CardContent>
//                         </Card>
//                       </motion.div>
//                     ))
//                   ) : (
//                     <p className="text-center text-muted-foreground">
//                       {t.noResults}
//                     </p>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   MapPin,
//   Briefcase,
//   Languages,
//   ChevronRight,
//   Building,
//   FileText,
//   Map,
//   Star,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { AnimatePresence, motion } from "framer-motion";

// // --- Interfaces and Mock Data ---
// interface StudentProfile {
//   skills: string;
//   qualifications: string;
//   locations: string;
//   sectors: string;
// }

// interface Internship {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   score: number;
//   reason: string;
//   sector: string;
// }

// interface Language {
//   code: "en" | "hi";
//   name: string;
// }

// const languages: Language[] = [
//   { code: "en", name: "English" },
//   { code: "hi", name: "हिंदी" },
// ];

// const translations = {
//   en: {
//     title: "Internship Recommender",
//     subtitle: "AI-Powered Opportunity Matching",
//     profileForm: "Your Profile",
//     skills: "Your Skills",
//     skillsPlaceholder: "e.g., Python, React, Marketing...",
//     qualifications: "Your Qualifications",
//     qualificationsPlaceholder: "e.g., B.Tech in CS, MBA...",
//     locations: "Preferred Locations",
//     locationsPlaceholder: "e.g., Delhi, Mumbai, Remote...",
//     sectors: "Interested Sectors",
//     sectorsPlaceholder: "e.g., Technology, Healthcare...",
//     findInternships: "Find My Internships",
//     recommendations: "Your Recommended Internships",
//     matchScore: "Match Score",
//     reason: "Why it’s a good match:",
//     loading: "Analyzing your profile...",
//     noResults: "No internships found. Try adjusting your profile details.",
//     welcomeTitle: "Unlock Your Career Potential",
//     welcomeMessage:
//       "Fill in your profile on the left to discover personalized internship opportunities tailored just for you.",
//   },
//   hi: {
//     title: "इंटर्नशिप सिफारिशकर्ता",
//     subtitle: "AI-पावर्ड अवसर मिलान",
//     profileForm: "आपकी प्रोफ़ाइल",
//     skills: "आपके कौशल",
//     skillsPlaceholder: "उदा., Python, React, मार्केटिंग...",
//     qualifications: "आपकी योग्यताएं",
//     qualificationsPlaceholder: "उदा., B.Tech in CS, MBA...",
//     locations: "पसंदीदा स्थान",
//     locationsPlaceholder: "उदा., दिल्ली, मुंबई, रिमोट...",
//     sectors: "इच्छुक क्षेत्र",
//     sectorsPlaceholder: "उदा., प्रौद्योगिकी, स्वास्थ्य सेवा...",
//     findInternships: "मेरी इंटर्नशिप खोजें",
//     recommendations: "आपके लिए अनुशंसित इंटर्नशिप",
//     matchScore: "मिलान स्कोर",
//     reason: "यह एक अच्छा मेल क्यों है:",
//     loading: "आपकी प्रोफ़ाइल का विश्लेषण किया जा रहा है...",
//     noResults:
//       "कोई इंटर्नशिप नहीं मिली। अपनी प्रोफ़ाइल विवरण समायोजित करने का प्रयास करें।",
//     welcomeTitle: "अपनी करियर क्षमता को अनलॉक करें",
//     welcomeMessage:
//       "आपके लिए विशेष रूप से तैयार किए गए व्यक्तिगत इंटर्नशिप अवसरों की खोज के लिए बाईं ओर अपनी प्रोफ़ाइल भरें।",
//   },
// };

// const mockRecommendAPI = async (
//   profile: StudentProfile
// ): Promise<Internship[]> => {
//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   const mockInternships = [
//     {
//       id: "1",
//       title: "Frontend Developer Intern",
//       company: "TechCorp Solutions",
//       location: "Delhi",
//       score: 92,
//       reason:
//         "Excellent match for your React and JavaScript skills, aligning with your interest in the Technology sector.",
//       sector: "Technology",
//     },
//     {
//       id: "2",
//       title: "Data Analyst Intern",
//       company: "DataViz Inc",
//       location: "Mumbai",
//       score: 87,
//       reason:
//         "Your Python skills align well with our data projects in the fast-growing tech landscape.",
//       sector: "Technology",
//     },
//     {
//       id: "3",
//       title: "Marketing Intern",
//       company: "Creative Solutions",
//       location: "Bangalore",
//       score: 78,
//       reason:
//         "Great opportunity to apply your marketing knowledge in a leading creative agency.",
//       sector: "Marketing",
//     },
//     {
//       id: "4",
//       title: "UI/UX Design Intern",
//       company: "Design Studio Pro",
//       location: "Remote",
//       score: 85,
//       reason:
//         "Your design skills are exactly what we need for our upcoming mobile application.",
//       sector: "Design",
//     },
//     {
//       id: "5",
//       title: "Financial Analyst Intern",
//       company: "FinTech Innovations",
//       location: "Gurgaon",
//       score: 73,
//       reason:
//         "A solid match for your analytical and finance background in the booming FinTech sector.",
//       sector: "Finance",
//     },
//   ];
//   return mockInternships.sort((a, b) => b.score - a.score);
// };

// // --- Sub-components ---
// const LoadingIndicator: React.FC<{ loadingText: string }> = ({
//   loadingText,
// }) => (
//   <div className="flex flex-col items-center justify-center h-full text-center">
//     <div className="flex justify-center items-center h-24">
//       <div className="animate-bar-wave w-2.5 h-12 bg-primary mx-1.5 [animation-delay:-1.1s]"></div>
//       <div className="animate-bar-wave w-2.5 h-12 bg-primary mx-1.5 [animation-delay:-1.0s]"></div>
//       <div className="animate-bar-wave w-2.5 h-12 bg-primary mx-1.5 [animation-delay:-0.9s]"></div>
//     </div>
//     <p className="mt-4 text-sm font-medium text-muted-foreground">
//       {loadingText}
//     </p>
//   </div>
// );

// const WelcomeMessage: React.FC<{ title: string; message: string }> = ({
//   title,
//   message,
// }) => (
//   <div className="flex flex-col items-center justify-center h-full text-center p-8">
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Star className="w-16 h-16 text-primary mb-4" />
//       <h2 className="text-2xl font-bold mb-2">{title}</h2>
//       <p className="max-w-md text-muted-foreground">{message}</p>
//     </motion.div>
//   </div>
// );

// // --- Main Dashboard Component ---
// export function InternshipDashboard() {
//   const [language, setLanguage] = useState<"en" | "hi">("en");
//   const [profile, setProfile] = useState<StudentProfile>({
//     skills: "",
//     qualifications: "",
//     locations: "",
//     sectors: "",
//   });
//   const [internships, setInternships] = useState<Internship[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const { toast } = useToast();

//   const t = translations[language];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setSubmitted(true);
//     try {
//       const recommendations = await mockRecommendAPI(profile);
//       setInternships(recommendations);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch recommendations. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex w-full min-h-screen font-sans">
//       {/* Left Panel: Form */}
//       <div className="hidden lg:block lg:w-1/3 xl:w-1/4 p-8 border-r border-border sticky top-0 h-screen overflow-y-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-xl font-bold">{t.title}</h1>
//           <Select
//             value={language}
//             onValueChange={(value: "en" | "hi") => setLanguage(value)}
//           >
//             <SelectTrigger className="w-32">
//               <Languages className="w-4 h-4 mr-2" />
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {languages.map((lang) => (
//                 <SelectItem key={lang.code} value={lang.code}>
//                   {lang.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <h2 className="text-lg font-semibold mb-4">{t.profileForm}</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="skills">
//               <Briefcase className="w-4 h-4 inline mr-2" />
//               {t.skills}
//             </Label>
//             <Input
//               id="skills"
//               placeholder={t.skillsPlaceholder}
//               value={profile.skills}
//               onChange={(e) =>
//                 setProfile({ ...profile, skills: e.target.value })
//               }
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="qualifications">
//               <FileText className="w-4 h-4 inline mr-2" />
//               {t.qualifications}
//             </Label>
//             <Textarea
//               id="qualifications"
//               placeholder={t.qualificationsPlaceholder}
//               value={profile.qualifications}
//               onChange={(e) =>
//                 setProfile({ ...profile, qualifications: e.target.value })
//               }
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="locations">
//               <Map className="w-4 h-4 inline mr-2" />
//               {t.locations}
//             </Label>
//             <Input
//               id="locations"
//               placeholder={t.locationsPlaceholder}
//               value={profile.locations}
//               onChange={(e) =>
//                 setProfile({ ...profile, locations: e.target.value })
//               }
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="sectors">
//               <Building className="w-4 h-4 inline mr-2" />
//               {t.sectors}
//             </Label>
//             <Input
//               id="sectors"
//               placeholder={t.sectorsPlaceholder}
//               value={profile.sectors}
//               onChange={(e) =>
//                 setProfile({ ...profile, sectors: e.target.value })
//               }
//               required
//             />
//           </div>
//           <Button type="submit" className="w-full" disabled={loading}>
//             <Search className="w-4 h-4 mr-2" />
//             {t.findInternships}
//           </Button>
//         </form>
//       </div>

//       {/* Right Panel: Results */}
//       <div className="w-full lg:w-2/3 xl:w-3/4 p-8 overflow-y-auto h-screen">
//         <AnimatePresence mode="wait">
//           {loading ? (
//             <motion.div
//               key="loader"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <LoadingIndicator loadingText={t.loading} />
//             </motion.div>
//           ) : !submitted ? (
//             <motion.div
//               key="welcome"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <WelcomeMessage
//                 title={t.welcomeTitle}
//                 message={t.welcomeMessage}
//               />
//             </motion.div>
//           ) : (
//             <motion.div key="results">
//               <h2 className="text-2xl font-bold mb-6">{t.recommendations}</h2>
//               <div className="space-y-4">
//                 <AnimatePresence>
//                   {internships.length > 0 ? (
//                     internships.map((internship, index) => (
//                       <motion.div
//                         key={internship.id}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         transition={{ duration: 0.3, delay: index * 0.1 }}
//                       >
//                         <Card className="hover:shadow-lg transition-shadow duration-300">
//                           <CardContent className="p-6">
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <h3 className="text-lg font-semibold text-primary">
//                                   {internship.title}
//                                 </h3>
//                                 <p className="text-sm text-muted-foreground">
//                                   {internship.company}
//                                 </p>
//                               </div>
//                               <Badge variant="outline" className="text-sm">
//                                 {internship.score}% {t.matchScore}
//                               </Badge>
//                             </div>
//                             <div className="flex items-center gap-4 text-sm text-muted-foreground my-3">
//                               <span className="flex items-center gap-1.5">
//                                 <MapPin className="w-4 h-4" />{" "}
//                                 {internship.location}
//                               </span>
//                               <span className="flex items-center gap-1.5">
//                                 <Briefcase className="w-4 h-4" />{" "}
//                                 {internship.sector}
//                               </span>
//                             </div>
//                             <p className="text-sm text-foreground/80 italic">
//                               "{internship.reason}"
//                             </p>
//                           </CardContent>
//                         </Card>
//                       </motion.div>
//                     ))
//                   ) : (
//                     <p className="text-center text-muted-foreground">
//                       {t.noResults}
//                     </p>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { Search, MapPin, Briefcase, Languages } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";

// interface StudentProfile {
//   skills: string;
//   qualifications: string;
//   locations: string;
//   sectors: string;
// }

// interface Internship {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   score: number;
//   reason: string;
//   sector: string;
// }

// interface Language {
//   code: "en" | "hi";
//   name: string;
// }

// const languages: Language[] = [
//   { code: "en", name: "English" },
//   { code: "hi", name: "हिंदी" },
// ];

// const translations = {
//   en: {
//     title: "Internship Recommender",
//     subtitle: "Find your perfect internship match",
//     profileForm: "Student Profile",
//     skills: "Skills",
//     skillsPlaceholder: "e.g., Python, React, Marketing, Design",
//     qualifications: "Qualifications",
//     qualificationsPlaceholder: "Describe your education and certifications",
//     locations: "Preferred Locations",
//     locationsPlaceholder: "e.g., Delhi, Mumbai, Remote",
//     sectors: "Sector Interests",
//     sectorsPlaceholder: "e.g., Technology, Healthcare, Finance",
//     findInternships: "Find Internships",
//     recommendations: "Recommended Internships",
//     filterLocation: "Filter by Location",
//     filterSector: "Filter by Sector",
//     allLocations: "All Locations",
//     allSectors: "All Sectors",
//     matchScore: "Match",
//     company: "Company",
//     location: "Location",
//     reason: "Why this matches",
//     loading: "Finding your perfect matches...",
//     noResults: "No internships found. Try adjusting your filters.",
//   },
//   hi: {
//     title: "इंटर्नशिप सिफारिशकर्ता",
//     subtitle: "अपना सही इंटर्नशिप मैच खोजें",
//     profileForm: "छात्र प्रोफाइल",
//     skills: "कौशल",
//     skillsPlaceholder: "जैसे, Python, React, Marketing, Design",
//     qualifications: "योग्यताएं",
//     qualificationsPlaceholder: "अपनी शिक्षा और प्रमाणपत्रों का वर्णन करें",
//     locations: "पसंदीदा स्थान",
//     locationsPlaceholder: "जैसे, दिल्ली, मुंबई, रिमोट",
//     sectors: "क्षेत्र रुचियां",
//     sectorsPlaceholder: "जैसे, प्रौद्योगिकी, स्वास्थ्य सेवा, वित्त",
//     findInternships: "इंटर्नशिप खोजें",
//     recommendations: "सुझाई गई इंटर्नशिप",
//     filterLocation: "स्थान के अनुसार फिल्टर",
//     filterSector: "क्षेत्र के अनुसार फिल्टर",
//     allLocations: "सभी स्थान",
//     allSectors: "सभी क्षेत्र",
//     matchScore: "मैच",
//     company: "कंपनी",
//     location: "स्थान",
//     reason: "यह क्यों मैच करता है",
//     loading: "आपके सही मैच खोजे जा रहे हैं...",
//     noResults:
//       "कोई इंटर्नशिप नहीं मिली। अपने फिल्टर समायोजित करने का प्रयास करें।",
//   },
// };

// // Mock API function - replace with actual API call
// const mockRecommendAPI = async (
//   profile: StudentProfile
// ): Promise<Internship[]> => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1500));

//   const mockInternships: Internship[] = [
//     {
//       id: "1",
//       title: "Frontend Developer Intern",
//       company: "TechCorp Solutions",
//       location: "Delhi",
//       score: 92,
//       reason: "Perfect match for your React and JavaScript skills",
//       sector: "Technology",
//     },
//     {
//       id: "2",
//       title: "Data Analyst Intern",
//       company: "DataViz Inc",
//       location: "Mumbai",
//       score: 87,
//       reason: "Your Python skills align well with our data projects",
//       sector: "Technology",
//     },
//     {
//       id: "3",
//       title: "Marketing Intern",
//       company: "Creative Solutions",
//       location: "Bangalore",
//       score: 78,
//       reason: "Great opportunity to apply your marketing knowledge",
//       sector: "Marketing",
//     },
//     {
//       id: "4",
//       title: "UI/UX Design Intern",
//       company: "Design Studio Pro",
//       location: "Remote",
//       score: 85,
//       reason: "Your design skills and creativity are exactly what we need",
//       sector: "Design",
//     },
//     {
//       id: "5",
//       title: "Financial Analyst Intern",
//       company: "FinTech Innovations",
//       location: "Gurgaon",
//       score: 73,
//       reason: "Good match for your analytical and finance background",
//       sector: "Finance",
//     },
//   ];

//   return mockInternships.sort((a, b) => b.score - a.score);
// };

// export function InternshipDashboard() {
//   const [language, setLanguage] = useState<"en" | "hi">("en");
//   const [profile, setProfile] = useState<StudentProfile>({
//     skills: "",
//     qualifications: "",
//     locations: "",
//     sectors: "",
//   });
//   const [internships, setInternships] = useState<Internship[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [locationFilter, setLocationFilter] = useState<string>("all");
//   const [sectorFilter, setSectorFilter] = useState<string>("all");
//   const { toast } = useToast();

//   const t = translations[language];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const recommendations = await mockRecommendAPI(profile);
//       setInternships(recommendations);
//       toast({
//         title: "Success!",
//         description: `Found ${recommendations.length} internship recommendations`,
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch recommendations. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredInternships = internships.filter((internship) => {
//     const locationMatch =
//       locationFilter === "all" ||
//       internship.location.toLowerCase().includes(locationFilter.toLowerCase());
//     const sectorMatch =
//       sectorFilter === "all" ||
//       internship.sector.toLowerCase().includes(sectorFilter.toLowerCase());
//     return locationMatch && sectorMatch;
//   });

//   const uniqueLocations = Array.from(
//     new Set(internships.map((i) => i.location))
//   );
//   const uniqueSectors = Array.from(new Set(internships.map((i) => i.sector)));

//   return (
//     <div className="min-h-screen bg-background relative overflow-hidden">
//       <div className="hexagon-background">
//         <div className="hexagon hexagon-1"></div>
//         <div className="hexagon hexagon-2"></div>
//         <div className="hexagon-outline hexagon-3"></div>
//         <div className="hexagon hexagon-4"></div>
//         <div className="hexagon-outline hexagon-5"></div>
//         <div className="hexagon hexagon-6"></div>
//         <div className="hexagon-outline hexagon-7"></div>
//         <div className="hexagon hexagon-8"></div>
//         <div className="hexagon-outline hexagon-9"></div>
//         <div className="hexagon hexagon-10"></div>
//       </div>
//       {/* Header */}
//       <header className="bg-gradient-primary shadow-form relative overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-primary-foreground">
//                 {t.title}
//               </h1>
//               <p className="text-primary-foreground/80 mt-1">{t.subtitle}</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Languages className="w-5 h-5 text-primary-foreground" />
//               <Select
//                 value={language}
//                 onValueChange={(value: "en" | "hi") => setLanguage(value)}
//               >
//                 <SelectTrigger className="w-32 bg-white/10 border-white/20 text-primary-foreground">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {languages.map((lang) => (
//                     <SelectItem key={lang.code} value={lang.code}>
//                       {lang.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Profile Form */}
//           <div className="lg:col-span-1">
//             <Card className="shadow-form bg-gradient-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Briefcase className="w-5 h-5" />
//                   {t.profileForm}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <Label htmlFor="skills">{t.skills}</Label>
//                     <Input
//                       id="skills"
//                       placeholder={t.skillsPlaceholder}
//                       value={profile.skills}
//                       onChange={(e) =>
//                         setProfile({ ...profile, skills: e.target.value })
//                       }
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="qualifications">{t.qualifications}</Label>
//                     <Textarea
//                       id="qualifications"
//                       placeholder={t.qualificationsPlaceholder}
//                       value={profile.qualifications}
//                       onChange={(e) =>
//                         setProfile({
//                           ...profile,
//                           qualifications: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="locations">{t.locations}</Label>
//                     <Input
//                       id="locations"
//                       placeholder={t.locationsPlaceholder}
//                       value={profile.locations}
//                       onChange={(e) =>
//                         setProfile({ ...profile, locations: e.target.value })
//                       }
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="sectors">{t.sectors}</Label>
//                     <Input
//                       id="sectors"
//                       placeholder={t.sectorsPlaceholder}
//                       value={profile.sectors}
//                       onChange={(e) =>
//                         setProfile({ ...profile, sectors: e.target.value })
//                       }
//                       required
//                     />
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full bg-gradient-primary"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Search className="w-4 h-4 mr-2 animate-spin" />
//                         {t.loading}
//                       </>
//                     ) : (
//                       <>
//                         <Search className="w-4 h-4 mr-2" />
//                         {t.findInternships}
//                       </>
//                     )}
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Results */}
//           <div className="lg:col-span-2">
//             {internships.length > 0 && (
//               <>
//                 {/* Filters */}
//                 <div className="mb-6 flex flex-col sm:flex-row gap-4">
//                   <div className="flex-1">
//                     <Select
//                       value={locationFilter}
//                       onValueChange={setLocationFilter}
//                     >
//                       <SelectTrigger>
//                         <MapPin className="w-4 h-4 mr-2" />
//                         <SelectValue placeholder={t.filterLocation} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">{t.allLocations}</SelectItem>
//                         {uniqueLocations.map((location) => (
//                           <SelectItem key={location} value={location}>
//                             {location}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex-1">
//                     <Select
//                       value={sectorFilter}
//                       onValueChange={setSectorFilter}
//                     >
//                       <SelectTrigger>
//                         <Briefcase className="w-4 h-4 mr-2" />
//                         <SelectValue placeholder={t.filterSector} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">{t.allSectors}</SelectItem>
//                         {uniqueSectors.map((sector) => (
//                           <SelectItem key={sector} value={sector}>
//                             {sector}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* Recommendations Header */}
//                 <h2 className="text-2xl font-semibold mb-6">
//                   {t.recommendations}
//                 </h2>

//                 {/* Internship Cards */}
//                 {filteredInternships.length > 0 ? (
//                   <div className="space-y-4">
//                     {filteredInternships.map((internship) => (
//                       <Card
//                         key={internship.id}
//                         className="shadow-card hover:shadow-lg transition-smooth bg-gradient-card"
//                       >
//                         <CardContent className="p-6">
//                           <div className="flex justify-between items-start mb-4">
//                             <div>
//                               <h3 className="text-xl font-semibold text-foreground">
//                                 {internship.title}
//                               </h3>
//                               <p className="text-muted-foreground">
//                                 {t.company}: {internship.company}
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <div className="bg-gradient-score text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
//                                 {internship.score}% {t.matchScore}
//                               </div>
//                             </div>
//                           </div>

//                           <div className="flex flex-wrap gap-2 mb-4">
//                             <Badge
//                               variant="secondary"
//                               className="flex items-center gap-1"
//                             >
//                               <MapPin className="w-3 h-3" />
//                               {internship.location}
//                             </Badge>
//                             <Badge variant="outline">{internship.sector}</Badge>
//                           </div>

//                           <div className="bg-secondary/50 p-3 rounded-md">
//                             <p className="text-sm font-medium text-muted-foreground mb-1">
//                               {t.reason}:
//                             </p>
//                             <p className="text-sm">{internship.reason}</p>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 ) : (
//                   <Card className="shadow-card">
//                     <CardContent className="p-6 text-center">
//                       <p className="text-muted-foreground">{t.noResults}</p>
//                     </CardContent>
//                   </Card>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { Search, MapPin, Briefcase, Languages } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";

// interface StudentProfile {
//   skills: string;
//   qualifications: string;
//   locations: string;
//   sectors: string;
// }

// interface Internship {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   score: number;
//   reason: string;
//   sector: string;
// }

// interface Language {
//   code: "en" | "hi";
//   name: string;
// }

// const languages: Language[] = [
//   { code: "en", name: "English" },
//   { code: "hi", name: "हिंदी" },
// ];

// const translations = {
//   en: {
//     title: "Internship Recommender",
//     subtitle: "Find your perfect internship match",
//     profileForm: "Student Profile",
//     skills: "Skills",
//     skillsPlaceholder: "e.g., Python, React, Marketing, Design",
//     qualifications: "Qualifications",
//     qualificationsPlaceholder: "Describe your education and certifications",
//     locations: "Preferred Locations",
//     locationsPlaceholder: "e.g., Delhi, Mumbai, Remote",
//     sectors: "Sector Interests",
//     sectorsPlaceholder: "e.g., Technology, Healthcare, Finance",
//     findInternships: "Find Internships",
//     recommendations: "Recommended Internships",
//     filterLocation: "Filter by Location",
//     filterSector: "Filter by Sector",
//     allLocations: "All Locations",
//     allSectors: "All Sectors",
//     matchScore: "Match",
//     company: "Company",
//     location: "Location",
//     reason: "Why this matches",
//     loading: "Finding your perfect matches...",
//     noResults: "No internships found. Try adjusting your filters.",
//   },
//   hi: {
//     title: "इंटर्नशिप सिफारिशकर्ता",
//     subtitle: "अपना सही इंटर्नशिप मैच खोजें",
//     profileForm: "छात्र प्रोफाइल",
//     skills: "कौशल",
//     skillsPlaceholder: "जैसे, Python, React, Marketing, Design",
//     qualifications: "योग्यताएं",
//     qualificationsPlaceholder: "अपनी शिक्षा और प्रमाणपत्रों का वर्णन करें",
//     locations: "पसंदीदा स्थान",
//     locationsPlaceholder: "जैसे, दिल्ली, मुंबई, रिमोट",
//     sectors: "क्षेत्र रुचियां",
//     sectorsPlaceholder: "जैसे, प्रौद्योगिकी, स्वास्थ्य सेवा, वित्त",
//     findInternships: "इंटर्नशिप खोजें",
//     recommendations: "सुझाई गई इंटर्नशिप",
//     filterLocation: "स्थान के अनुसार फिल्टर",
//     filterSector: "क्षेत्र के अनुसार फिल्टर",
//     allLocations: "सभी स्थान",
//     allSectors: "सभी क्षेत्र",
//     matchScore: "मैच",
//     company: "कंपनी",
//     location: "स्थान",
//     reason: "यह क्यों मैच करता है",
//     loading: "आपके सही मैच खोजे जा रहे हैं...",
//     noResults:
//       "कोई इंटर्नशिप नहीं मिली। अपने फिल्टर समायोजित करने का प्रयास करें।",
//   },
// };

// // Mock API function - replace with actual API call
// const mockRecommendAPI = async (
//   profile: StudentProfile
// ): Promise<Internship[]> => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1500));

//   const mockInternships: Internship[] = [
//     {
//       id: "1",
//       title: "Frontend Developer Intern",
//       company: "TechCorp Solutions",
//       location: "Delhi",
//       score: 92,
//       reason: "Perfect match for your React and JavaScript skills",
//       sector: "Technology",
//     },
//     {
//       id: "2",
//       title: "Data Analyst Intern",
//       company: "DataViz Inc",
//       location: "Mumbai",
//       score: 87,
//       reason: "Your Python skills align well with our data projects",
//       sector: "Technology",
//     },
//     {
//       id: "3",
//       title: "Marketing Intern",
//       company: "Creative Solutions",
//       location: "Bangalore",
//       score: 78,
//       reason: "Great opportunity to apply your marketing knowledge",
//       sector: "Marketing",
//     },
//     {
//       id: "4",
//       title: "UI/UX Design Intern",
//       company: "Design Studio Pro",
//       location: "Remote",
//       score: 85,
//       reason: "Your design skills and creativity are exactly what we need",
//       sector: "Design",
//     },
//     {
//       id: "5",
//       title: "Financial Analyst Intern",
//       company: "FinTech Innovations",
//       location: "Gurgaon",
//       score: 73,
//       reason: "Good match for your analytical and finance background",
//       sector: "Finance",
//     },
//   ];

//   return mockInternships.sort((a, b) => b.score - a.score);
// };

// export function InternshipDashboard() {
//   const [language, setLanguage] = useState<"en" | "hi">("en");
//   const [profile, setProfile] = useState<StudentProfile>({
//     skills: "",
//     qualifications: "",
//     locations: "",
//     sectors: "",
//   });
//   const [internships, setInternships] = useState<Internship[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [locationFilter, setLocationFilter] = useState<string>("all");
//   const [sectorFilter, setSectorFilter] = useState<string>("all");
//   const { toast } = useToast();

//   const t = translations[language];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const recommendations = await mockRecommendAPI(profile);
//       setInternships(recommendations);
//       toast({
//         title: "Success!",
//         description: `Found ${recommendations.length} internship recommendations`,
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch recommendations. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredInternships = internships.filter((internship) => {
//     const locationMatch =
//       locationFilter === "all" ||
//       internship.location.toLowerCase().includes(locationFilter.toLowerCase());
//     const sectorMatch =
//       sectorFilter === "all" ||
//       internship.sector.toLowerCase().includes(sectorFilter.toLowerCase());
//     return locationMatch && sectorMatch;
//   });

//   const uniqueLocations = Array.from(
//     new Set(internships.map((i) => i.location))
//   );
//   const uniqueSectors = Array.from(new Set(internships.map((i) => i.sector)));

//   return (
//     <div className="min-h-screen bg-background relative overflow-hidden">
//       <div className="geometric-background">
//         <div className="shape shape-1"></div>
//         <div className="shape shape-2"></div>
//         <div className="shape shape-3"></div>
//         <div className="shape shape-4"></div>
//         <div className="shape shape-5"></div>
//         <div className="shape shape-6"></div>
//         <div className="shape shape-7"></div>
//         <div className="shape shape-8"></div>
//         <div className="shape shape-9"></div>
//         <div className="shape shape-10"></div>
//       </div>
//       {/* Header */}
//       <header className="bg-gradient-primary shadow-form">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-primary-foreground">
//                 {t.title}
//               </h1>
//               <p className="text-primary-foreground/80 mt-1">{t.subtitle}</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Languages className="w-5 h-5 text-primary-foreground" />
//               <Select
//                 value={language}
//                 onValueChange={(value: "en" | "hi") => setLanguage(value)}
//               >
//                 <SelectTrigger className="w-32 bg-white/10 border-white/20 text-primary-foreground">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {languages.map((lang) => (
//                     <SelectItem key={lang.code} value={lang.code}>
//                       {lang.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Profile Form */}
//           <div className="lg:col-span-1">
//             <Card className="shadow-form bg-gradient-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Briefcase className="w-5 h-5" />
//                   {t.profileForm}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <Label htmlFor="skills">{t.skills}</Label>
//                     <Input
//                       id="skills"
//                       placeholder={t.skillsPlaceholder}
//                       value={profile.skills}
//                       onChange={(e) =>
//                         setProfile({ ...profile, skills: e.target.value })
//                       }
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="qualifications">{t.qualifications}</Label>
//                     <Textarea
//                       id="qualifications"
//                       placeholder={t.qualificationsPlaceholder}
//                       value={profile.qualifications}
//                       onChange={(e) =>
//                         setProfile({
//                           ...profile,
//                           qualifications: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="locations">{t.locations}</Label>
//                     <Input
//                       id="locations"
//                       placeholder={t.locationsPlaceholder}
//                       value={profile.locations}
//                       onChange={(e) =>
//                         setProfile({ ...profile, locations: e.target.value })
//                       }
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="sectors">{t.sectors}</Label>
//                     <Input
//                       id="sectors"
//                       placeholder={t.sectorsPlaceholder}
//                       value={profile.sectors}
//                       onChange={(e) =>
//                         setProfile({ ...profile, sectors: e.target.value })
//                       }
//                       required
//                     />
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full bg-gradient-primary"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Search className="w-4 h-4 mr-2 animate-spin" />
//                         {t.loading}
//                       </>
//                     ) : (
//                       <>
//                         <Search className="w-4 h-4 mr-2" />
//                         {t.findInternships}
//                       </>
//                     )}
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Results */}
//           <div className="lg:col-span-2">
//             {internships.length > 0 && (
//               <>
//                 {/* Filters */}
//                 <div className="mb-6 flex flex-col sm:flex-row gap-4">
//                   <div className="flex-1">
//                     <Select
//                       value={locationFilter}
//                       onValueChange={setLocationFilter}
//                     >
//                       <SelectTrigger>
//                         <MapPin className="w-4 h-4 mr-2" />
//                         <SelectValue placeholder={t.filterLocation} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">{t.allLocations}</SelectItem>
//                         {uniqueLocations.map((location) => (
//                           <SelectItem key={location} value={location}>
//                             {location}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex-1">
//                     <Select
//                       value={sectorFilter}
//                       onValueChange={setSectorFilter}
//                     >
//                       <SelectTrigger>
//                         <Briefcase className="w-4 h-4 mr-2" />
//                         <SelectValue placeholder={t.filterSector} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">{t.allSectors}</SelectItem>
//                         {uniqueSectors.map((sector) => (
//                           <SelectItem key={sector} value={sector}>
//                             {sector}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* Recommendations Header */}
//                 <h2 className="text-2xl font-semibold mb-6">
//                   {t.recommendations}
//                 </h2>

//                 {/* Internship Cards */}
//                 {filteredInternships.length > 0 ? (
//                   <div className="space-y-4">
//                     {filteredInternships.map((internship) => (
//                       <Card
//                         key={internship.id}
//                         className="shadow-card hover:shadow-lg transition-smooth bg-gradient-card"
//                       >
//                         <CardContent className="p-6">
//                           <div className="flex justify-between items-start mb-4">
//                             <div>
//                               <h3 className="text-xl font-semibold text-foreground">
//                                 {internship.title}
//                               </h3>
//                               <p className="text-muted-foreground">
//                                 {t.company}: {internship.company}
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <div className="bg-gradient-score text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
//                                 {internship.score}% {t.matchScore}
//                               </div>
//                             </div>
//                           </div>

//                           <div className="flex flex-wrap gap-2 mb-4">
//                             <Badge
//                               variant="secondary"
//                               className="flex items-center gap-1"
//                             >
//                               <MapPin className="w-3 h-3" />
//                               {internship.location}
//                             </Badge>
//                             <Badge variant="outline">{internship.sector}</Badge>
//                           </div>

//                           <div className="bg-secondary/50 p-3 rounded-md">
//                             <p className="text-sm font-medium text-muted-foreground mb-1">
//                               {t.reason}:
//                             </p>
//                             <p className="text-sm">{internship.reason}</p>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 ) : (
//                   <Card className="shadow-card">
//                     <CardContent className="p-6 text-center">
//                       <p className="text-muted-foreground">{t.noResults}</p>
//                     </CardContent>
//                   </Card>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from 'react';
// import { Search, MapPin, Briefcase, Languages } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useToast } from '@/hooks/use-toast';

// interface StudentProfile {
//   skills: string;
//   qualifications: string;
//   locations: string;
//   sectors: string;
// }

// interface Internship {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   score: number;
//   reason: string;
//   sector: string;
// }

// interface Language {
//   code: 'en' | 'hi';
//   name: string;
// }

// const languages: Language[] = [
//   { code: 'en', name: 'English' },
//   { code: 'hi', name: 'हिंदी' }
// ];

// const translations = {
//   en: {
//     title: 'Internship Recommender',
//     subtitle: 'Find your perfect internship match',
//     profileForm: 'Student Profile',
//     skills: 'Skills',
//     skillsPlaceholder: 'e.g., Python, React, Marketing, Design',
//     qualifications: 'Qualifications',
//     qualificationsPlaceholder: 'Describe your education and certifications',
//     locations: 'Preferred Locations',
//     locationsPlaceholder: 'e.g., Delhi, Mumbai, Remote',
//     sectors: 'Sector Interests',
//     sectorsPlaceholder: 'e.g., Technology, Healthcare, Finance',
//     findInternships: 'Find Internships',
//     recommendations: 'Recommended Internships',
//     filterLocation: 'Filter by Location',
//     filterSector: 'Filter by Sector',
//     allLocations: 'All Locations',
//     allSectors: 'All Sectors',
//     matchScore: 'Match',
//     company: 'Company',
//     location: 'Location',
//     reason: 'Why this matches',
//     loading: 'Finding your perfect matches...',
//     noResults: 'No internships found. Try adjusting your filters.',
//   },
//   hi: {
//     title: 'इंटर्नशिप सिफारिशकर्ता',
//     subtitle: 'अपना सही इंटर्नशिप मैच खोजें',
//     profileForm: 'छात्र प्रोफाइल',
//     skills: 'कौशल',
//     skillsPlaceholder: 'जैसे, Python, React, Marketing, Design',
//     qualifications: 'योग्यताएं',
//     qualificationsPlaceholder: 'अपनी शिक्षा और प्रमाणपत्रों का वर्णन करें',
//     locations: 'पसंदीदा स्थान',
//     locationsPlaceholder: 'जैसे, दिल्ली, मुंबई, रिमोट',
//     sectors: 'क्षेत्र रुचियां',
//     sectorsPlaceholder: 'जैसे, प्रौद्योगिकी, स्वास्थ्य सेवा, वित्त',
//     findInternships: 'इंटर्नशिप खोजें',
//     recommendations: 'सुझाई गई इंटर्नशिप',
//     filterLocation: 'स्थान के अनुसार फिल्टर',
//     filterSector: 'क्षेत्र के अनुसार फिल्टर',
//     allLocations: 'सभी स्थान',
//     allSectors: 'सभी क्षेत्र',
//     matchScore: 'मैच',
//     company: 'कंपनी',
//     location: 'स्थान',
//     reason: 'यह क्यों मैच करता है',
//     loading: 'आपके सही मैच खोजे जा रहे हैं...',
//     noResults: 'कोई इंटर्नशिप नहीं मिली। अपने फिल्टर समायोजित करने का प्रयास करें।',
//   }
// };

// // Mock API function - replace with actual API call
// const mockRecommendAPI = async (profile: StudentProfile): Promise<Internship[]> => {
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 1500));

//   const mockInternships: Internship[] = [
//     {
//       id: '1',
//       title: 'Frontend Developer Intern',
//       company: 'TechCorp Solutions',
//       location: 'Delhi',
//       score: 92,
//       reason: 'Perfect match for your React and JavaScript skills',
//       sector: 'Technology'
//     },
//     {
//       id: '2',
//       title: 'Data Analyst Intern',
//       company: 'DataViz Inc',
//       location: 'Mumbai',
//       score: 87,
//       reason: 'Your Python skills align well with our data projects',
//       sector: 'Technology'
//     },
//     {
//       id: '3',
//       title: 'Marketing Intern',
//       company: 'Creative Solutions',
//       location: 'Bangalore',
//       score: 78,
//       reason: 'Great opportunity to apply your marketing knowledge',
//       sector: 'Marketing'
//     },
//     {
//       id: '4',
//       title: 'UI/UX Design Intern',
//       company: 'Design Studio Pro',
//       location: 'Remote',
//       score: 85,
//       reason: 'Your design skills and creativity are exactly what we need',
//       sector: 'Design'
//     },
//     {
//       id: '5',
//       title: 'Financial Analyst Intern',
//       company: 'FinTech Innovations',
//       location: 'Gurgaon',
//       score: 73,
//       reason: 'Good match for your analytical and finance background',
//       sector: 'Finance'
//     }
//   ];

//   return mockInternships.sort((a, b) => b.score - a.score);
// };

// export function InternshipDashboard() {
//   const [language, setLanguage] = useState<'en' | 'hi'>('en');
//   const [profile, setProfile] = useState<StudentProfile>({
//     skills: '',
//     qualifications: '',
//     locations: '',
//     sectors: ''
//   });
//   const [internships, setInternships] = useState<Internship[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [locationFilter, setLocationFilter] = useState<string>('all');
//   const [sectorFilter, setSectorFilter] = useState<string>('all');
//   const { toast } = useToast();

//   const t = translations[language];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const recommendations = await mockRecommendAPI(profile);
//       setInternships(recommendations);
//       toast({
//         title: "Success!",
//         description: `Found ${recommendations.length} internship recommendations`,
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch recommendations. Please try again.",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredInternships = internships.filter(internship => {
//     const locationMatch = locationFilter === 'all' || internship.location.toLowerCase().includes(locationFilter.toLowerCase());
//     const sectorMatch = sectorFilter === 'all' || internship.sector.toLowerCase().includes(sectorFilter.toLowerCase());
//     return locationMatch && sectorMatch;
//   });

//   const uniqueLocations = Array.from(new Set(internships.map(i => i.location)));
//   const uniqueSectors = Array.from(new Set(internships.map(i => i.sector)));

//   return (
//     <div className="min-h-screen bg-background relative overflow-hidden">
//       <div className="area">
//         <ul className="circles">
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//         </ul>
//       </div>
//       {/* Header */}
//       <header className="bg-gradient-primary shadow-form">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-primary-foreground">{t.title}</h1>
//               <p className="text-primary-foreground/80 mt-1">{t.subtitle}</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Languages className="w-5 h-5 text-primary-foreground" />
//               <Select value={language} onValueChange={(value: 'en' | 'hi') => setLanguage(value)}>
//                 <SelectTrigger className="w-32 bg-white/10 border-white/20 text-primary-foreground">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {languages.map((lang) => (
//                     <SelectItem key={lang.code} value={lang.code}>
//                       {lang.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Profile Form */}
//           <div className="lg:col-span-1">
//             <Card className="shadow-form bg-gradient-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Briefcase className="w-5 h-5" />
//                   {t.profileForm}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <Label htmlFor="skills">{t.skills}</Label>
//                     <Input
//                       id="skills"
//                       placeholder={t.skillsPlaceholder}
//                       value={profile.skills}
//                       onChange={(e) => setProfile({...profile, skills: e.target.value})}
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="qualifications">{t.qualifications}</Label>
//                     <Textarea
//                       id="qualifications"
//                       placeholder={t.qualificationsPlaceholder}
//                       value={profile.qualifications}
//                       onChange={(e) => setProfile({...profile, qualifications: e.target.value})}
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="locations">{t.locations}</Label>
//                     <Input
//                       id="locations"
//                       placeholder={t.locationsPlaceholder}
//                       value={profile.locations}
//                       onChange={(e) => setProfile({...profile, locations: e.target.value})}
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="sectors">{t.sectors}</Label>
//                     <Input
//                       id="sectors"
//                       placeholder={t.sectorsPlaceholder}
//                       value={profile.sectors}
//                       onChange={(e) => setProfile({...profile, sectors: e.target.value})}
//                       required
//                     />
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full bg-gradient-primary"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Search className="w-4 h-4 mr-2 animate-spin" />
//                         {t.loading}
//                       </>
//                     ) : (
//                       <>
//                         <Search className="w-4 h-4 mr-2" />
//                         {t.findInternships}
//                       </>
//                     )}
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Results */}
//           <div className="lg:col-span-2">
//             {internships.length > 0 && (
//               <>
//                 {/* Filters */}
//                 <div className="mb-6 flex flex-col sm:flex-row gap-4">
//                   <div className="flex-1">
//                     <Select value={locationFilter} onValueChange={setLocationFilter}>
//                       <SelectTrigger>
//                         <MapPin className="w-4 h-4 mr-2" />
//                         <SelectValue placeholder={t.filterLocation} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">{t.allLocations}</SelectItem>
//                         {uniqueLocations.map((location) => (
//                           <SelectItem key={location} value={location}>
//                             {location}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex-1">
//                     <Select value={sectorFilter} onValueChange={setSectorFilter}>
//                       <SelectTrigger>
//                         <Briefcase className="w-4 h-4 mr-2" />
//                         <SelectValue placeholder={t.filterSector} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">{t.allSectors}</SelectItem>
//                         {uniqueSectors.map((sector) => (
//                           <SelectItem key={sector} value={sector}>
//                             {sector}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* Recommendations Header */}
//                 <h2 className="text-2xl font-semibold mb-6">{t.recommendations}</h2>

//                 {/* Internship Cards */}
//                 {filteredInternships.length > 0 ? (
//                   <div className="space-y-4">
//                     {filteredInternships.map((internship) => (
//                       <Card key={internship.id} className="shadow-card hover:shadow-lg transition-smooth bg-gradient-card">
//                         <CardContent className="p-6">
//                           <div className="flex justify-between items-start mb-4">
//                             <div>
//                               <h3 className="text-xl font-semibold text-foreground">{internship.title}</h3>
//                               <p className="text-muted-foreground">{t.company}: {internship.company}</p>
//                             </div>
//                             <div className="text-right">
//                               <div className="bg-gradient-score text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
//                                 {internship.score}% {t.matchScore}
//                               </div>
//                             </div>
//                           </div>

//                           <div className="flex flex-wrap gap-2 mb-4">
//                             <Badge variant="secondary" className="flex items-center gap-1">
//                               <MapPin className="w-3 h-3" />
//                               {internship.location}
//                             </Badge>
//                             <Badge variant="outline">{internship.sector}</Badge>
//                           </div>

//                           <div className="bg-secondary/50 p-3 rounded-md">
//                             <p className="text-sm font-medium text-muted-foreground mb-1">{t.reason}:</p>
//                             <p className="text-sm">{internship.reason}</p>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 ) : (
//                   <Card className="shadow-card">
//                     <CardContent className="p-6 text-center">
//                       <p className="text-muted-foreground">{t.noResults}</p>
//                     </CardContent>
//                   </Card>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { Search, MapPin, Briefcase, Languages } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";

// interface StudentProfile {
//   skills: string;
//   qualifications: string;
//   locations: string;
//   sectors: string;
// }

// interface Internship {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   score: number;
//   reason: string;
//   sector: string;
// }

// interface Language {
//   code: "en" | "hi";
//   name: string;
// }

// const languages: Language[] = [
//   { code: "en", name: "English" },
//   { code: "hi", name: "हिंदी" },
// ];

// const translations = {
//   en: {
//     title: "Internship Recommender",
//     subtitle: "Find your perfect internship match",
//     profileForm: "Student Profile",
//     skills: "Skills",
//     skillsPlaceholder: "e.g., Python, React, Marketing, Design",
//     qualifications: "Qualifications",
//     qualificationsPlaceholder: "Describe your education and certifications",
//     locations: "Preferred Locations",
//     locationsPlaceholder: "e.g., Delhi, Mumbai, Remote",
//     sectors: "Sector Interests",
//     sectorsPlaceholder: "e.g., Technology, Healthcare, Finance",
//     findInternships: "Find Internships",
//     recommendations: "Recommended Internships",
//     filterLocation: "Filter by Location",
//     filterSector: "Filter by Sector",
//     allLocations: "All Locations",
//     allSectors: "All Sectors",
//     matchScore: "Match",
//     company: "Company",
//     location: "Location",
//     reason: "Why this matches",
//     loading: "Finding your perfect matches...",
//     noResults: "No internships found. Try adjusting your filters.",
//   },
//   hi: {
//     title: "इंटर्नशिप सिफारिशकर्ता",
//     subtitle: "अपना सही इंटर्नशिप मैच खोजें",
//     profileForm: "छात्र प्रोफाइल",
//     skills: "कौशल",
//     skillsPlaceholder: "जैसे, Python, React, Marketing, Design",
//     qualifications: "योग्यताएं",
//     qualificationsPlaceholder: "अपनी शिक्षा और प्रमाणपत्रों का वर्णन करें",
//     locations: "पसंदीदा स्थान",
//     locationsPlaceholder: "जैसे, दिल्ली, मुंबई, रिमोट",
//     sectors: "क्षेत्र रुचियां",
//     sectorsPlaceholder: "जैसे, प्रौद्योगिकी, स्वास्थ्य सेवा, वित्त",
//     findInternships: "इंटर्नशिप खोजें",
//     recommendations: "सुझाई गई इंटर्नशिप",
//     filterLocation: "स्थान के अनुसार फिल्टर",
//     filterSector: "क्षेत्र के अनुसार फिल्टर",
//     allLocations: "सभी स्थान",
//     allSectors: "सभी क्षेत्र",
//     matchScore: "मैच",
//     company: "कंपनी",
//     location: "स्थान",
//     reason: "यह क्यों मैच करता है",
//     loading: "आपके सही मैच खोजे जा रहे हैं...",
//     noResults:
//       "कोई इंटर्नशिप नहीं मिली। अपने फिल्टर समायोजित करने का प्रयास करें।",
//   },
// };

// // Mock API function - replace with actual API call
// const mockRecommendAPI = async (
//   profile: StudentProfile
// ): Promise<Internship[]> => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1500));

//   const mockInternships: Internship[] = [
//     {
//       id: "1",
//       title: "Frontend Developer Intern",
//       company: "TechCorp Solutions",
//       location: "Delhi",
//       score: 92,
//       reason: "Perfect match for your React and JavaScript skills",
//       sector: "Technology",
//     },
//     {
//       id: "2",
//       title: "Data Analyst Intern",
//       company: "DataViz Inc",
//       location: "Mumbai",
//       score: 87,
//       reason: "Your Python skills align well with our data projects",
//       sector: "Technology",
//     },
//     {
//       id: "3",
//       title: "Marketing Intern",
//       company: "Creative Solutions",
//       location: "Bangalore",
//       score: 78,
//       reason: "Great opportunity to apply your marketing knowledge",
//       sector: "Marketing",
//     },
//     {
//       id: "4",
//       title: "UI/UX Design Intern",
//       company: "Design Studio Pro",
//       location: "Remote",
//       score: 85,
//       reason: "Your design skills and creativity are exactly what we need",
//       sector: "Design",
//     },
//     {
//       id: "5",
//       title: "Financial Analyst Intern",
//       company: "FinTech Innovations",
//       location: "Gurgaon",
//       score: 73,
//       reason: "Good match for your analytical and finance background",
//       sector: "Finance",
//     },
//   ];

//   return mockInternships.sort((a, b) => b.score - a.score);
// };

// export function InternshipDashboard() {
//   const [language, setLanguage] = useState<"en" | "hi">("en");
//   const [profile, setProfile] = useState<StudentProfile>({
//     skills: "",
//     qualifications: "",
//     locations: "",
//     sectors: "",
//   });
//   const [internships, setInternships] = useState<Internship[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [locationFilter, setLocationFilter] = useState<string>("all");
//   const [sectorFilter, setSectorFilter] = useState<string>("all");
//   const { toast } = useToast();

//   const t = translations[language];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const recommendations = await mockRecommendAPI(profile);
//       setInternships(recommendations);
//       toast({
//         title: "Success!",
//         description: `Found ${recommendations.length} internship recommendations`,
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch recommendations. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredInternships = internships.filter((internship) => {
//     const locationMatch =
//       locationFilter === "all" ||
//       internship.location.toLowerCase().includes(locationFilter.toLowerCase());
//     const sectorMatch =
//       sectorFilter === "all" ||
//       internship.sector.toLowerCase().includes(sectorFilter.toLowerCase());
//     return locationMatch && sectorMatch;
//   });

//   const uniqueLocations = Array.from(
//     new Set(internships.map((i) => i.location))
//   );
//   const uniqueSectors = Array.from(new Set(internships.map((i) => i.sector)));

//   return (
//     <div className="min-h-screen bg-background relative overflow-hidden">
//       <div className="area">
//         <ul className="circles">
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//           <li></li>
//         </ul>
//       </div>
//       {/* Header */}
//       <header className="bg-gradient-primary shadow-form">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-primary-foreground">
//                 {t.title}
//               </h1>
//               <p className="text-primary-foreground/80 mt-1">{t.subtitle}</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Languages className="w-5 h-5 text-primary-foreground" />
//               <Select
//                 value={language}
//                 onValueChange={(value: "en" | "hi") => setLanguage(value)}
//               >
//                 <SelectTrigger className="w-32 bg-white/10 border-white/20 text-primary-foreground">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {languages.map((lang) => (
//                     <SelectItem key={lang.code} value={lang.code}>
//                       {lang.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Profile Form */}
//           <div className="lg:col-span-1">
//             <Card className="shadow-form bg-gradient-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Briefcase className="w-5 h-5" />
//                   {t.profileForm}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <Label htmlFor="skills">{t.skills}</Label>
//                     <Input
//                       id="skills"
//                       placeholder={t.skillsPlaceholder}
//                       value={profile.skills}
//                       onChange={(e) =>
//                         setProfile({ ...profile, skills: e.target.value })
//                       }
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="qualifications">{t.qualifications}</Label>
//                     <Textarea
//                       id="qualifications"
//                       placeholder={t.qualificationsPlaceholder}
//                       value={profile.qualifications}
//                       onChange={(e) =>
//                         setProfile({
//                           ...profile,
//                           qualifications: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="locations">{t.locations}</Label>
//                     <Input
//                       id="locations"
//                       placeholder={t.locationsPlaceholder}
//                       value={profile.locations}
//                       onChange={(e) =>
//                         setProfile({ ...profile, locations: e.target.value })
//                       }
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="sectors">{t.sectors}</Label>
//                     <Input
//                       id="sectors"
//                       placeholder={t.sectorsPlaceholder}
//                       value={profile.sectors}
//                       onChange={(e) =>
//                         setProfile({ ...profile, sectors: e.target.value })
//                       }
//                       required
//                     />
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full bg-gradient-primary"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Search className="w-4 h-4 mr-2 animate-spin" />
//                         {t.loading}
//                       </>
//                     ) : (
//                       <>
//                         <Search className="w-4 h-4 mr-2" />
//                         {t.findInternships}
//                       </>
//                     )}
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Results */}
//           <div className="lg:col-span-2">
//             {internships.length > 0 && (
//               <>
//                 {/* Filters */}
//                 <div className="mb-6 flex flex-col sm:flex-row gap-4">
//                   <div className="flex-1">
//                     <Select
//                       value={locationFilter}
//                       onValueChange={setLocationFilter}
//                     >
//                       <SelectTrigger>
//                         <MapPin className="w-4 h-4 mr-2" />
//                         <SelectValue placeholder={t.filterLocation} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">{t.allLocations}</SelectItem>
//                         {uniqueLocations.map((location) => (
//                           <SelectItem key={location} value={location}>
//                             {location}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex-1">
//                     <Select
//                       value={sectorFilter}
//                       onValueChange={setSectorFilter}
//                     >
//                       <SelectTrigger>
//                         <Briefcase className="w-4 h-4 mr-2" />
//                         <SelectValue placeholder={t.filterSector} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">{t.allSectors}</SelectItem>
//                         {uniqueSectors.map((sector) => (
//                           <SelectItem key={sector} value={sector}>
//                             {sector}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* Recommendations Header */}
//                 <h2 className="text-2xl font-semibold mb-6">
//                   {t.recommendations}
//                 </h2>

//                 {/* Internship Cards */}
//                 {filteredInternships.length > 0 ? (
//                   <div className="space-y-4">
//                     {filteredInternships.map((internship) => (
//                       <Card
//                         key={internship.id}
//                         className="shadow-card hover:shadow-lg transition-smooth bg-gradient-card"
//                       >
//                         <CardContent className="p-6">
//                           <div className="flex justify-between items-start mb-4">
//                             <div>
//                               <h3 className="text-xl font-semibold text-foreground">
//                                 {internship.title}
//                               </h3>
//                               <p className="text-muted-foreground">
//                                 {t.company}: {internship.company}
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <div className="bg-gradient-score text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
//                                 {internship.score}% {t.matchScore}
//                               </div>
//                             </div>
//                           </div>

//                           <div className="flex flex-wrap gap-2 mb-4">
//                             <Badge
//                               variant="secondary"
//                               className="flex items-center gap-1"
//                             >
//                               <MapPin className="w-3 h-3" />
//                               {internship.location}
//                             </Badge>
//                             <Badge variant="outline">{internship.sector}</Badge>
//                           </div>

//                           <div className="bg-secondary/50 p-3 rounded-md">
//                             <p className="text-sm font-medium text-muted-foreground mb-1">
//                               {t.reason}:
//                             </p>
//                             <p className="text-sm">{internship.reason}</p>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 ) : (
//                   <Card className="shadow-card">
//                     <CardContent className="p-6 text-center">
//                       <p className="text-muted-foreground">{t.noResults}</p>
//                     </CardContent>
//                   </Card>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { Search, MapPin, Briefcase, Languages } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";

// interface StudentProfile {
//   skills: string;
//   qualifications: string;
//   locations: string;
//   sectors: string;
// }

// interface Internship {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   score: number;
//   reason: string;
//   sector: string;
// }

// interface Language {
//   code: "en" | "hi";
//   name: string;
// }

// const languages: Language[] = [
//   { code: "en", name: "English" },
//   { code: "hi", name: "हिंदी" },
// ];

// const translations = {
//   en: {
//     title: "Internship Recommender",
//     subtitle: "Find your perfect internship match",
//     profileForm: "Student Profile",
//     skills: "Skills",
//     skillsPlaceholder: "e.g., Python, React, Marketing, Design",
//     qualifications: "Qualifications",
//     qualificationsPlaceholder: "Describe your education and certifications",
//     locations: "Preferred Locations",
//     locationsPlaceholder: "e.g., Delhi, Mumbai, Remote",
//     sectors: "Sector Interests",
//     sectorsPlaceholder: "e.g., Technology, Healthcare, Finance",
//     findInternships: "Find Internships",
//     recommendations: "Recommended Internships",
//     filterLocation: "Filter by Location",
//     filterSector: "Filter by Sector",
//     allLocations: "All Locations",
//     allSectors: "All Sectors",
//     matchScore: "Match",
//     company: "Company",
//     location: "Location",
//     reason: "Why this matches",
//     loading: "Finding your perfect matches...",
//     noResults: "No internships found. Try adjusting your filters.",
//   },
//   hi: {
//     title: "इंटर्नशिप सिफारिशकर्ता",
//     subtitle: "अपना सही इंटर्नशिप मैच खोजें",
//     profileForm: "छात्र प्रोफाइल",
//     skills: "कौशल",
//     skillsPlaceholder: "जैसे, Python, React, Marketing, Design",
//     qualifications: "योग्यताएं",
//     qualificationsPlaceholder: "अपनी शिक्षा और प्रमाणपत्रों का वर्णन करें",
//     locations: "पसंदीदा स्थान",
//     locationsPlaceholder: "जैसे, दिल्ली, मुंबई, रिमोट",
//     sectors: "क्षेत्र रुचियां",
//     sectorsPlaceholder: "जैसे, प्रौद्योगिकी, स्वास्थ्य सेवा, वित्त",
//     findInternships: "इंटर्नशिप खोजें",
//     recommendations: "सुझाई गई इंटर्नशिप",
//     filterLocation: "स्थान के अनुसार फिल्टर",
//     filterSector: "क्षेत्र के अनुसार फिल्टर",
//     allLocations: "सभी स्थान",
//     allSectors: "सभी क्षेत्र",
//     matchScore: "मैच",
//     company: "कंपनी",
//     location: "स्थान",
//     reason: "यह क्यों मैच करता है",
//     loading: "आपके सही मैच खोजे जा रहे हैं...",
//     noResults:
//       "कोई इंटर्नशिप नहीं मिली। अपने फिल्टर समायोजित करने का प्रयास करें।",
//   },
// };

// // Mock API function - replace with actual API call
// const mockRecommendAPI = async (
//   profile: StudentProfile
// ): Promise<Internship[]> => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1500));

//   const mockInternships: Internship[] = [
//     {
//       id: "1",
//       title: "Frontend Developer Intern",
//       company: "TechCorp Solutions",
//       location: "Delhi",
//       score: 92,
//       reason: "Perfect match for your React and JavaScript skills",
//       sector: "Technology",
//     },
//     {
//       id: "2",
//       title: "Data Analyst Intern",
//       company: "DataViz Inc",
//       location: "Mumbai",
//       score: 87,
//       reason: "Your Python skills align well with our data projects",
//       sector: "Technology",
//     },
//     {
//       id: "3",
//       title: "Marketing Intern",
//       company: "Creative Solutions",
//       location: "Bangalore",
//       score: 78,
//       reason: "Great opportunity to apply your marketing knowledge",
//       sector: "Marketing",
//     },
//     {
//       id: "4",
//       title: "UI/UX Design Intern",
//       company: "Design Studio Pro",
//       location: "Remote",
//       score: 85,
//       reason: "Your design skills and creativity are exactly what we need",
//       sector: "Design",
//     },
//     {
//       id: "5",
//       title: "Financial Analyst Intern",
//       company: "FinTech Innovations",
//       location: "Gurgaon",
//       score: 73,
//       reason: "Good match for your analytical and finance background",
//       sector: "Finance",
//     },
//   ];

//   return mockInternships.sort((a, b) => b.score - a.score);
// };

// export function InternshipDashboard() {
//   const [language, setLanguage] = useState<"en" | "hi">("en");
//   const [profile, setProfile] = useState<StudentProfile>({
//     skills: "",
//     qualifications: "",
//     locations: "",
//     sectors: "",
//   });
//   const [internships, setInternships] = useState<Internship[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [locationFilter, setLocationFilter] = useState<string>("all");
//   const [sectorFilter, setSectorFilter] = useState<string>("all");
//   const { toast } = useToast();

//   const t = translations[language];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const recommendations = await mockRecommendAPI(profile);
//       setInternships(recommendations);
//       toast({
//         title: "Success!",
//         description: `Found ${recommendations.length} internship recommendations`,
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch recommendations. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredInternships = internships.filter((internship) => {
//     const locationMatch =
//       locationFilter === "all" ||
//       internship.location.toLowerCase().includes(locationFilter.toLowerCase());
//     const sectorMatch =
//       sectorFilter === "all" ||
//       internship.sector.toLowerCase().includes(sectorFilter.toLowerCase());
//     return locationMatch && sectorMatch;
//   });

//   const uniqueLocations = Array.from(
//     new Set(internships.map((i) => i.location))
//   );
//   const uniqueSectors = Array.from(new Set(internships.map((i) => i.sector)));

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="bg-gradient-primary shadow-form">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-primary-foreground">
//                 {t.title}
//               </h1>
//               <p className="text-primary-foreground/80 mt-1">{t.subtitle}</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Languages className="w-5 h-5 text-primary-foreground" />
//               <Select
//                 value={language}
//                 onValueChange={(value: "en" | "hi") => setLanguage(value)}
//               >
//                 <SelectTrigger className="w-32 bg-white/10 border-white/20 text-primary-foreground">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {languages.map((lang) => (
//                     <SelectItem key={lang.code} value={lang.code}>
//                       {lang.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Profile Form */}
//           <div className="lg:col-span-1">
//             <Card className="shadow-form bg-gradient-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Briefcase className="w-5 h-5" />
//                   {t.profileForm}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <Label htmlFor="skills">{t.skills}</Label>
//                     <Input
//                       id="skills"
//                       placeholder={t.skillsPlaceholder}
//                       value={profile.skills}
//                       onChange={(e) =>
//                         setProfile({ ...profile, skills: e.target.value })
//                       }
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="qualifications">{t.qualifications}</Label>
//                     <Textarea
//                       id="qualifications"
//                       placeholder={t.qualificationsPlaceholder}
//                       value={profile.qualifications}
//                       onChange={(e) =>
//                         setProfile({
//                           ...profile,
//                           qualifications: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="locations">{t.locations}</Label>
//                     <Input
//                       id="locations"
//                       placeholder={t.locationsPlaceholder}
//                       value={profile.locations}
//                       onChange={(e) =>
//                         setProfile({ ...profile, locations: e.target.value })
//                       }
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="sectors">{t.sectors}</Label>
//                     <Input
//                       id="sectors"
//                       placeholder={t.sectorsPlaceholder}
//                       value={profile.sectors}
//                       onChange={(e) =>
//                         setProfile({ ...profile, sectors: e.target.value })
//                       }
//                       required
//                     />
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full bg-gradient-primary"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Search className="w-4 h-4 mr-2 animate-spin" />
//                         {t.loading}
//                       </>
//                     ) : (
//                       <>
//                         <Search className="w-4 h-4 mr-2" />
//                         {t.findInternships}
//                       </>
//                     )}
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Results */}
//           <div className="lg:col-span-2">
//             {internships.length > 0 && (
//               <>
//                 {/* Filters */}
//                 <div className="mb-6 flex flex-col sm:flex-row gap-4">
//                   <div className="flex-1">
//                     <Select
//                       value={locationFilter}
//                       onValueChange={setLocationFilter}
//                     >
//                       <SelectTrigger>
//                         <MapPin className="w-4 h-4 mr-2" />
//                         <SelectValue placeholder={t.filterLocation} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">{t.allLocations}</SelectItem>
//                         {uniqueLocations.map((location) => (
//                           <SelectItem key={location} value={location}>
//                             {location}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex-1">
//                     <Select
//                       value={sectorFilter}
//                       onValueChange={setSectorFilter}
//                     >
//                       <SelectTrigger>
//                         <Briefcase className="w-4 h-4 mr-2" />
//                         <SelectValue placeholder={t.filterSector} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">{t.allSectors}</SelectItem>
//                         {uniqueSectors.map((sector) => (
//                           <SelectItem key={sector} value={sector}>
//                             {sector}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* Recommendations Header */}
//                 <h2 className="text-2xl font-semibold mb-6">
//                   {t.recommendations}
//                 </h2>

//                 {/* Internship Cards */}
//                 {filteredInternships.length > 0 ? (
//                   <div className="space-y-4">
//                     {filteredInternships.map((internship) => (
//                       <Card
//                         key={internship.id}
//                         className="shadow-card hover:shadow-lg transition-smooth bg-gradient-card"
//                       >
//                         <CardContent className="p-6">
//                           <div className="flex justify-between items-start mb-4">
//                             <div>
//                               <h3 className="text-xl font-semibold text-foreground">
//                                 {internship.title}
//                               </h3>
//                               <p className="text-muted-foreground">
//                                 {t.company}: {internship.company}
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <div className="bg-gradient-score text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
//                                 {internship.score}% {t.matchScore}
//                               </div>
//                             </div>
//                           </div>

//                           <div className="flex flex-wrap gap-2 mb-4">
//                             <Badge
//                               variant="secondary"
//                               className="flex items-center gap-1"
//                             >
//                               <MapPin className="w-3 h-3" />
//                               {internship.location}
//                             </Badge>
//                             <Badge variant="outline">{internship.sector}</Badge>
//                           </div>

//                           <div className="bg-secondary/50 p-3 rounded-md">
//                             <p className="text-sm font-medium text-muted-foreground mb-1">
//                               {t.reason}:
//                             </p>
//                             <p className="text-sm">{internship.reason}</p>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 ) : (
//                   <Card className="shadow-card">
//                     <CardContent className="p-6 text-center">
//                       <p className="text-muted-foreground">{t.noResults}</p>
//                     </CardContent>
//                   </Card>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
