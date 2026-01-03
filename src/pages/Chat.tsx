import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, Search, Send, UserPlus, Users, Check, X, 
  Loader2, User, Clock, CheckCheck
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import VerifiedBadge from "@/components/VerifiedBadge";
import AdminBadge from "@/components/AdminBadge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Profile {
  user_id: string;
  username: string;
  is_premium: boolean;
}

interface FriendRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: string;
  created_at: string;
  from_profile?: Profile;
  to_profile?: Profile;
}

interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

const Chat = () => {
  const { profile, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [friends, setFriends] = useState<Profile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [selectedChat, setSelectedChat] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadFriends();
      loadPendingRequests();
      loadSentRequests();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat && user) {
      loadMessages();
      
      // Subscribe to new messages
      const channel = supabase
        .channel('messages-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `to_user_id=eq.${user.id}`,
          },
          (payload) => {
            const newMsg = payload.new as Message;
            if (newMsg.from_user_id === selectedChat.user_id) {
              setMessages(prev => [...prev, newMsg]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedChat, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadFriends = async () => {
    if (!user) return;
    
    const { data: accepted } = await supabase
      .from("friend_requests")
      .select(`
        id,
        from_user_id,
        to_user_id
      `)
      .eq("status", "accepted")
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`);

    if (accepted) {
      const friendIds = accepted.map(req => 
        req.from_user_id === user.id ? req.to_user_id : req.from_user_id
      );

      if (friendIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, username, is_premium")
          .in("user_id", friendIds);

        if (profiles) {
          setFriends(profiles);
        }
      }
    }
  };

  const loadPendingRequests = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("friend_requests")
      .select(`
        id,
        from_user_id,
        to_user_id,
        status,
        created_at
      `)
      .eq("to_user_id", user.id)
      .eq("status", "pending");

    if (data) {
      // Fetch from_profiles separately
      const fromUserIds = data.map(req => req.from_user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, is_premium")
        .in("user_id", fromUserIds);

      const requestsWithProfiles = data.map(req => ({
        ...req,
        from_profile: profiles?.find(p => p.user_id === req.from_user_id)
      }));

      setPendingRequests(requestsWithProfiles);
    }
  };

  const loadSentRequests = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("friend_requests")
      .select("to_user_id")
      .eq("from_user_id", user.id)
      .in("status", ["pending", "accepted"]);

    if (data) {
      setSentRequests(data.map(req => req.to_user_id));
    }
  };

  const loadMessages = async () => {
    if (!user || !selectedChat) return;

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(from_user_id.eq.${user.id},to_user_id.eq.${selectedChat.user_id}),and(from_user_id.eq.${selectedChat.user_id},to_user_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    if (data) {
      setMessages(data);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      toast.error("Search query must be at least 3 characters");
      return;
    }

    setIsSearching(true);
    
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, username, is_premium")
      .ilike("username", `%${searchQuery}%`)
      .neq("user_id", user?.id)
      .limit(10);

    if (error) {
      toast.error("Search failed");
    } else {
      setSearchResults(data || []);
      if (data?.length === 0) {
        toast.info("No users found");
      }
    }

    setIsSearching(false);
  };

  const sendFriendRequest = async (toUserId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("friend_requests")
      .insert({
        from_user_id: user.id,
        to_user_id: toUserId,
      });

    if (error) {
      if (error.code === "23505") {
        toast.error("Friend request already sent");
      } else {
        toast.error("Failed to send friend request");
      }
    } else {
      toast.success("Friend request sent!");
      setSentRequests(prev => [...prev, toUserId]);
    }
  };

  const handleFriendRequest = async (requestId: string, accept: boolean) => {
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: accept ? "accepted" : "rejected" })
      .eq("id", requestId);

    if (error) {
      toast.error("Failed to process request");
    } else {
      toast.success(accept ? "Friend request accepted!" : "Friend request rejected");
      loadPendingRequests();
      if (accept) loadFriends();
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    setIsSending(true);

    const { error } = await supabase
      .from("messages")
      .insert({
        from_user_id: user.id,
        to_user_id: selectedChat.user_id,
        content: newMessage.trim(),
      });

    if (error) {
      toast.error("Failed to send message");
    } else {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        from_user_id: user.id,
        to_user_id: selectedChat.user_id,
        content: newMessage.trim(),
        is_read: false,
        created_at: new Date().toISOString(),
      }]);
      setNewMessage("");
    }

    setIsSending(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
        <AppSidebar />
        
        <main className="flex-1 lg:ml-64">
          <div className="container py-8 px-6 h-[calc(100vh-2rem)]">
            <div className="grid lg:grid-cols-3 gap-6 h-full">
              {/* Left Panel - Friends & Search */}
              <Card className="border-border/50 bg-card lg:col-span-1 flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                  <Tabs defaultValue="friends" className="flex-1 flex flex-col">
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="friends" className="flex-1 gap-2">
                        <Users className="w-4 h-4" />
                        Friends
                      </TabsTrigger>
                      <TabsTrigger value="search" className="flex-1 gap-2">
                        <Search className="w-4 h-4" />
                        Find
                      </TabsTrigger>
                      <TabsTrigger value="requests" className="flex-1 gap-2 relative">
                        <UserPlus className="w-4 h-4" />
                        Requests
                        {pendingRequests.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                            {pendingRequests.length}
                          </span>
                        )}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="friends" className="flex-1 overflow-hidden mt-0">
                      <ScrollArea className="h-full">
                        {friends.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No friends yet</p>
                            <p className="text-xs">Search for users to add!</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {friends.map((friend) => (
                              <button
                                key={friend.user_id}
                                onClick={() => setSelectedChat(friend)}
                                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${
                                  selectedChat?.user_id === friend.user_id 
                                    ? "bg-primary/20 border border-primary/30" 
                                    : "bg-secondary/50 hover:bg-secondary"
                                }`}
                              >
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                  {friend.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium">{friend.username}</span>
                                    {friend.username === "samiradmin" ? (
                                      <AdminBadge size="sm" isPremium={true} />
                                    ) : friend.is_premium ? (
                                      <VerifiedBadge size="sm" />
                                    ) : null}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="search" className="flex-1 overflow-hidden mt-0">
                      <div className="flex gap-2 mb-4">
                        <Input
                          placeholder="Search username..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <Button onClick={handleSearch} size="icon" disabled={isSearching}>
                          {isSearching ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <ScrollArea className="h-[calc(100%-60px)]">
                        {searchResults.length > 0 ? (
                          <div className="space-y-2">
                            {searchResults.map((result) => {
                              const hasSentRequest = sentRequests.includes(result.user_id);
                              return (
                                <div
                                  key={result.user_id}
                                  className="p-3 rounded-xl bg-secondary/50 flex items-center gap-3"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                    {result.username.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-1">
                                      <span className="font-medium">{result.username}</span>
                                      {result.username === "samiradmin" ? (
                                        <AdminBadge size="sm" isPremium={true} />
                                      ) : result.is_premium ? (
                                        <VerifiedBadge size="sm" />
                                      ) : null}
                                    </div>
                                  </div>
                                  {hasSentRequest ? (
                                    <div className="flex items-center gap-1 text-success text-sm px-3 py-1.5 rounded-md bg-success/10">
                                      <CheckCheck className="w-4 h-4" />
                                      <span>Sent</span>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => sendFriendRequest(result.user_id)}
                                      className="gap-1"
                                    >
                                      <UserPlus className="w-4 h-4" />
                                      Add
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Search for users</p>
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="requests" className="flex-1 overflow-hidden mt-0">
                      <ScrollArea className="h-full">
                        {pendingRequests.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No pending requests</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {pendingRequests.map((request) => (
                              <div
                                key={request.id}
                                className="p-3 rounded-xl bg-secondary/50 flex items-center gap-3"
                              >
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                  {request.from_profile?.username?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium">{request.from_profile?.username}</span>
                                    {request.from_profile?.username === "samiradmin" ? (
                                      <AdminBadge size="sm" isPremium={true} />
                                    ) : request.from_profile?.is_premium ? (
                                      <VerifiedBadge size="sm" />
                                    ) : null}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    {format(new Date(request.created_at), "MMM d")}
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-success hover:text-success hover:bg-success/20"
                                    onClick={() => handleFriendRequest(request.id, true)}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/20"
                                    onClick={() => handleFriendRequest(request.id, false)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Right Panel - Chat */}
              <Card className="border-border/50 bg-card lg:col-span-2 flex flex-col">
                {selectedChat ? (
                  <>
                    <CardHeader className="pb-3 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-semibold">
                          {selectedChat.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{selectedChat.username}</span>
                            {selectedChat.is_premium && <VerifiedBadge size="sm" />}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messages.map((message) => {
                            const isOwn = message.from_user_id === user?.id;
                            return (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[70%] p-3 rounded-2xl ${
                                    isOwn
                                      ? "bg-primary text-primary-foreground rounded-br-md"
                                      : "bg-secondary rounded-bl-md"
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : ""}`}>
                                    <p className={`text-xs ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                      {format(new Date(message.created_at), "HH:mm")}
                                    </p>
                                    {isOwn && (
                                      <CheckCheck className="w-3.5 h-3.5 text-success" />
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>
                      <div className="p-4 border-t border-border/50">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                          />
                          <Button onClick={sendMessage} disabled={isSending || !newMessage.trim()}>
                            {isSending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">Select a chat</p>
                      <p className="text-sm">Choose a friend to start messaging</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Chat;
