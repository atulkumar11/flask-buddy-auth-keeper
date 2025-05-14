
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { saveUserNameToFlask } from "@/lib/api";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileSaved, setFileSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const handleSaveToFlask = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    try {
      const success = await saveUserNameToFlask(user.name);
      if (success) {
        toast.success("User name saved to Flask backend");
        setFileSaved(true);
      } else {
        toast.error("Failed to save user name to Flask");
      }
    } catch (error) {
      console.error("Error saving to Flask:", error);
      toast.error("Failed to save user name to Flask");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome, {user.name}!</CardTitle>
          <CardDescription>You are now signed in with {user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-secondary rounded-md">
              <h3 className="font-medium mb-2">Flask Integration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click the button below to save your name to the Flask backend.
              </p>
              {fileSaved ? (
                <div className="bg-green-100 border border-green-200 text-green-800 p-3 rounded-md text-sm">
                  ✅ Success! A file with your name has been created on the Flask backend.
                </div>
              ) : (
                <Button 
                  onClick={handleSaveToFlask} 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Save Name to Flask"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleLogout} 
            variant="outline"
            className="w-full"
          >
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
