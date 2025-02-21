
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import { CalendarIcon, Loader2, MessageSquare, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Child, Profile } from "@/types/database.types";

const interests = [
  "Sports",
  "Arts",
  "STEM",
  "Music",
  "Dance",
  "Languages",
  "Cooking",
  "Nature",
];

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [newChild, setNewChild] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: new Date(),
    interests: [] as string[],
  });
  const [showAddChild, setShowAddChild] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchProfileAndChildren();
  }, [user, navigate]);

  const fetchProfileAndChildren = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (profileError) throw profileError;

      if (profileData) {
        const typedProfile: Profile = {
          ...profileData,
          role: profileData.role as 'parent' | 'provider',
          full_name: profileData.full_name || null,
          avatar_url: profileData.avatar_url || null,
          phone: profileData.phone || null
        };
        setProfile(typedProfile);
      }

      const { data: childrenData, error: childrenError } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", user?.id);

      if (childrenError) throw childrenError;
      setChildren(childrenData || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from("children").insert({
        parent_id: user.id,
        first_name: newChild.first_name,
        last_name: "", // Optional in this context
        date_of_birth: format(newChild.date_of_birth, "yyyy-MM-dd"),
        interests: newChild.interests,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Child added successfully",
      });
      
      setShowAddChild(false);
      setNewChild({
        first_name: "",
        last_name: "",
        date_of_birth: new Date(),
        interests: [],
      });
      fetchProfileAndChildren();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const toggleInterest = (interest: string) => {
    setNewChild(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label>Full Name</Label>
                <p className="text-lg">{profile?.full_name}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-lg">{profile?.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="children" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="children">Children</TabsTrigger>
            <TabsTrigger value="activities">Booked Activities</TabsTrigger>
            <TabsTrigger value="messages">Provider Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="children">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Children</CardTitle>
                <Button onClick={() => setShowAddChild(true)} variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Child
                </Button>
              </CardHeader>
              <CardContent>
                {children.length === 0 ? (
                  <p className="text-muted-foreground">No children added yet.</p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {children.map((child) => (
                      <Card key={child.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-2">
                            <h3 className="font-medium">
                              {child.first_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Birth Date: {format(new Date(child.date_of_birth), "PP")}
                            </p>
                            {child.interests && child.interests.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {child.interests.map((interest) => (
                                  <span
                                    key={interest}
                                    className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                                  >
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {showAddChild && (
                  <form onSubmit={handleAddChild} className="mt-6 space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">Child's First Name</Label>
                        <Input
                          id="first_name"
                          value={newChild.first_name}
                          onChange={(e) =>
                            setNewChild((prev) => ({
                              ...prev,
                              first_name: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(newChild.date_of_birth, "PPP")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newChild.date_of_birth}
                              onSelect={(date) =>
                                setNewChild((prev) => ({
                                  ...prev,
                                  date_of_birth: date || new Date(),
                                }))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label>Interests</Label>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest) => (
                            <Button
                              key={interest}
                              type="button"
                              variant={newChild.interests.includes(interest) ? "default" : "outline"}
                              className="text-sm"
                              onClick={() => toggleInterest(interest)}
                            >
                              {interest}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddChild(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Child</Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Booked Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No activities booked yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Provider Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">
                    No messages yet. Book an activity to start chatting with providers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
