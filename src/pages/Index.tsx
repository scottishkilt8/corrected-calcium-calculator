
import { useState, useEffect } from "react";
import Calculator from "@/components/Calculator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Check local storage for user preference on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const isDark = savedTheme === "dark";
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      // Check system preference if no saved preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(systemPrefersDark);
      document.documentElement.classList.toggle("dark", systemPrefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-medical-blue/10 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center space-x-2">
        <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Switch 
          id="theme-toggle" 
          checked={isDarkMode} 
          onCheckedChange={toggleTheme}
        />
        <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Label htmlFor="theme-toggle" className="sr-only">
          Toggle dark mode
        </Label>
      </div>

      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-300">
          Corrected Calcium Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto transition-colors duration-300">
          A tool for healthcare professionals to adjust calcium levels based on albumin concentration.
        </p>
      </header>
      
      <main className="w-full max-w-md">
        <Calculator />
      </main>
      
      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
        <p>For medical professional use only. Results should be verified by a healthcare provider.</p>
      </footer>
    </div>
  );
};

export default Index;
