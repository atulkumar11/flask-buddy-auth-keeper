
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to Auth Demo</h1>
        <p className="text-xl text-muted-foreground mb-8">
          A simple authentication system that can be integrated with Flask
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate("/auth")}
          className="px-8"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
