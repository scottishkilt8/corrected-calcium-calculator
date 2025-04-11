
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Calculator as CalculatorIcon, HelpCircle, RotateCcw } from "lucide-react";

const Calculator = () => {
  const [calcium, setCalcium] = useState<string>("");
  const [albumin, setAlbumin] = useState<string>("");
  const [correctedCalcium, setCorrectedCalcium] = useState<string | null>(null);

  const calculateCorrectedCalcium = () => {
    // Convert inputs to numbers and validate
    const calciumValue = parseFloat(calcium);
    const albuminValue = parseFloat(albumin);

    if (isNaN(calciumValue) || isNaN(albuminValue)) {
      toast.error("Please enter valid numbers for both fields");
      return;
    }

    // Validate ranges (typical clinical ranges)
    if (calciumValue < 5 || calciumValue > 15) {
      toast.warning("Calcium values typically range from 5-15 mg/dL. Please verify your input.");
      return;
    }

    if (albuminValue < 1 || albuminValue > 7) {
      toast.warning("Albumin values typically range from 1-7 g/dL. Please verify your input.");
      return;
    }

    // Calculate corrected calcium using the formula
    const result = calciumValue + 0.8 * (4.0 - albuminValue);
    
    // Round to 2 decimal places
    const roundedResult = Math.round(result * 100) / 100;
    
    setCorrectedCalcium(roundedResult.toFixed(2));
    
    // Show success toast
    toast.success("Calculation complete!");
  };

  const resetForm = () => {
    setCalcium("");
    setAlbumin("");
    setCorrectedCalcium(null);
    toast("Form has been reset");
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="bg-medical-blue rounded-t-lg">
        <CardTitle className="text-2xl text-center">Corrected Calcium Calculator</CardTitle>
        <CardDescription className="text-center">
          Quickly calculate corrected calcium based on serum albumin.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-4 px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculateCorrectedCalcium();
          }}
          className="space-y-5"
        >
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="calcium" className="text-sm font-medium">
                Serum Calcium (mg/dL)
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Calcium Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Serum calcium is the measured calcium level in your blood. 
                      Normal range is typically 8.5-10.5 mg/dL.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="calcium"
              placeholder="Enter value (e.g., 9.5)"
              value={calcium}
              onChange={(e) => setCalcium(e.target.value)}
              className="focus:border-medical-blue-bright"
              type="number"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="albumin" className="text-sm font-medium">
                Albumin (g/dL)
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Albumin Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Serum albumin is a protein made by the liver. 
                      Normal range is typically 3.5-5.0 g/dL. Low albumin can affect calcium readings.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="albumin"
              placeholder="Enter value (e.g., 4.0)"
              value={albumin}
              onChange={(e) => setAlbumin(e.target.value)}
              className="focus:border-medical-blue-bright"
              type="number"
              step="0.1"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <Button 
              type="submit" 
              className="w-full bg-medical-blue-bright hover:opacity-90 transition-opacity"
            >
              <CalculatorIcon className="mr-2 h-4 w-4" /> Calculate
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
              className="w-1/3"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>

          {correctedCalcium && (
            <div className="mt-5 p-3 bg-medical-green rounded-lg text-center">
              <p className="text-sm font-medium">Corrected Calcium:</p>
              <p className="text-2xl font-bold">{correctedCalcium} mg/dL</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="mt-1">
                      <HelpCircle className="h-4 w-4 mr-1" /> What does this mean?
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p>
                      Corrected calcium adjusts for the effect of albumin on total calcium levels.
                      Normal range is typically 8.5-10.5 mg/dL. Values outside this range may
                      indicate various medical conditions and should be discussed with a healthcare provider.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default Calculator;
