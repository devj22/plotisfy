import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Message } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useState } from "react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeader, useAuthStore } from "@/lib/auth";
import { getQueryFn } from "@/lib/queryClient";
import React from "react";

const MessageList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  
  // Debug log for auth state
  console.log('Auth state:', { isAuthenticated, isHydrated });
  
  const { data: messages, isLoading, error } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
    queryFn: async () => {
      try {
        console.log('MessageList - Starting to fetch messages');
        if (!isAuthenticated) {
          console.error('MessageList - Not authenticated');
          throw new Error('Not authenticated. Please log in.');
        }
        
        const headers = getAuthHeader();
        if (!headers.Authorization) {
          console.error('MessageList - No auth header available');
          throw new Error('Authentication token not available');
        }
        
        console.log('MessageList - Making API request');
        const response = await apiRequest("GET", "/api/messages", undefined, headers);
        
        if (!Array.isArray(response)) {
          console.error('MessageList - Invalid response format:', response);
          throw new Error('Invalid response format: expected an array of messages');
        }
        
        return response;
      } catch (error) {
        console.error('MessageList - Failed to fetch messages:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    },
    enabled: isHydrated && isAuthenticated,
    retry: 1,
    retryDelay: 1000
  });

  // Add error toast notification
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch messages",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const markAsReadMutation = useMutation({
    mutationFn: async ({ id, isRead }: { id: number; isRead: boolean }) => {
      return await apiRequest(
        "PUT", 
        `/api/messages/${id}/read`, 
        { isRead }, 
        getAuthHeader()
      );
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message status updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update message status",
        variant: "destructive",
      });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(
        "DELETE", 
        `/api/messages/${id}`, 
        undefined, 
        getAuthHeader()
      );
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      setSelectedMessage(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete message",
        variant: "destructive",
      });
    },
  });

  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
    
    // If message is not read, mark it as read
    if (!message.isRead) {
      markAsReadMutation.mutate({ id: message.id, isRead: true });
    }
  };

  const closeDialog = () => {
    setSelectedMessage(null);
  };

  const handleDeleteMessage = (id: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessageMutation.mutate(id);
    }
  };

  const toggleReadStatus = (message: Message) => {
    markAsReadMutation.mutate({ 
      id: message.id, 
      isRead: !message.isRead 
    });
  };

  // Format date to readable string
  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Messages</CardTitle>
          <CardDescription>Loading messages...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Show authentication error
  if (!isHydrated || !isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Messages</CardTitle>
          <CardDescription>Please log in to view messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">Authentication required</p>
            <Button 
              variant="default" 
              onClick={() => window.location.href = '/admin/login'}
            >
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Messages</CardTitle>
        <CardDescription>View and manage inquiries from potential customers.</CardDescription>
      </CardHeader>
      <CardContent>
        {messages && messages.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id} className={!message.isRead ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.location}</TableCell>
                  <TableCell>{formatDate(message.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={message.isRead ? "secondary" : "default"}>
                      {message.isRead ? "Read" : "Unread"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => viewMessage(message)}>
                        View
                      </Button>
                      <Button 
                        variant={message.isRead ? "outline" : "secondary"} 
                        size="sm"
                        onClick={() => toggleReadStatus(message)}
                      >
                        {message.isRead ? "Mark Unread" : "Mark Read"}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No messages found
          </div>
        )}

        {/* Message Details Dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={closeDialog}>
          <DialogContent className="max-w-3xl">
            {selectedMessage && (
              <>
                <DialogHeader>
                  <DialogTitle>Message from {selectedMessage.name}</DialogTitle>
                  <DialogDescription>
                    Received on {formatDate(selectedMessage.createdAt)}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div>
                    <h4 className="text-sm font-medium">Contact Information</h4>
                    <p className="text-sm">Email: {selectedMessage.email}</p>
                    <p className="text-sm">Phone: {selectedMessage.phone}</p>
                    <p className="text-sm">Location: {selectedMessage.location}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Message</h4>
                    <p className="text-sm whitespace-pre-wrap mt-1">{selectedMessage.message}</p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                  >
                    Delete
                  </Button>
                  <Button variant="outline" onClick={closeDialog}>
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MessageList;
