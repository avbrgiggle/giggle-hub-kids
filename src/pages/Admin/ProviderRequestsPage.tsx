
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ProviderSignupRequest } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { 
  Check, 
  X, 
  Globe, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Send, 
  MapPin,
  Calendar,
  Tag
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateProviderSignupCode } from "@/services/providerService";

export default function ProviderRequestsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<ProviderSignupRequest[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ProviderSignupRequest | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("provider_signup_requests")
        .select("*")
        .eq("status", activeTab)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Type cast the data to match our ProviderSignupRequest type
      setRequests((data || []) as ProviderSignupRequest[]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load provider requests",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (request: ProviderSignupRequest) => {
    setSelectedRequest(request);
    setApprovalDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    setProcessingAction(true);
    try {
      // Generate a unique signup code for the provider
      const signupCode = await generateProviderSignupCode(selectedRequest.email);
      
      // Update the request status
      const { error } = await supabase
        .from("provider_signup_requests")
        .update({ status: "approved" })
        .eq("id", selectedRequest.id);

      if (error) throw error;

      // If this was successful, we'd typically send an email here with the signup code
      
      toast({
        title: "Provider approved",
        description: `A signup code has been generated for ${selectedRequest.name}`,
      });
      
      // Close dialog and refresh list
      setApprovalDialogOpen(false);
      fetchRequests();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to approve provider",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async (request: ProviderSignupRequest) => {
    try {
      const { error } = await supabase
        .from("provider_signup_requests")
        .update({ status: "rejected" })
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Provider rejected",
        description: `${request.name}'s request has been rejected`,
      });
      
      fetchRequests();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reject provider",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Provider Signup Requests</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                {loading ? "Loading..." : "No requests found"}
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{request.name}</CardTitle>
                      <CardDescription>{request.email}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeTab === "pending" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => handleReject(request)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleApproveClick(request)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                          Location
                        </h3>
                        <p className="text-sm">{request.location}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Age Range</h3>
                        <p className="text-sm">{request.age_range}</p>
                      </div>
                      {request.contact_info && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                          <p className="text-sm">{request.contact_info}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <Tag className="h-4 w-4 mr-1 text-gray-500" />
                          Activity Types
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {request.activity_types.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          Duration Types
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {request.duration_types.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Online Presence</h3>
                        <div className="flex gap-2 mt-2">
                          {request.website_url && (
                            <a 
                              href={request.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                              <Globe className="h-4 w-4" />
                            </a>
                          )}
                          {request.facebook_url && (
                            <a 
                              href={request.facebook_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                              <Facebook className="h-4 w-4" />
                            </a>
                          )}
                          {request.instagram_url && (
                            <a 
                              href={request.instagram_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                              <Instagram className="h-4 w-4" />
                            </a>
                          )}
                          {request.linkedin_url && (
                            <a 
                              href={request.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                              <Linkedin className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {request.logo_url && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">Company Logo</h3>
                          <img 
                            src={request.logo_url} 
                            alt={`${request.name} logo`} 
                            className="w-24 h-24 object-contain border rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Provider Request</DialogTitle>
            <DialogDescription>
              This will generate a signup code and mark the request as approved. 
              The provider will be able to use this code to create an account.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="py-4">
              <p className="mb-2"><strong>Provider:</strong> {selectedRequest.name}</p>
              <p><strong>Email:</strong> {selectedRequest.email}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setApprovalDialogOpen(false)} 
              disabled={processingAction}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApprove} 
              disabled={processingAction}
            >
              {processingAction ? "Processing..." : "Approve & Generate Code"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
