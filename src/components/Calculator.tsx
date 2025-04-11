
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { 
  Calculator as CalculatorIcon, 
  HelpCircle, 
  RotateCcw, 
  Clipboard, 
  ClipboardCheck 
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Unit conversion constants
const MG_DL_TO_MMOL_L = 0.25; // 1 mg/dL = 0.25 mmol/L for calcium
const MMOL_L_TO_MG_DL = 4.0; // 1 mmol/L = 4.0 mg/dL for calcium

const Calculator = () => {
  const [calcium, setCalcium] = useState<string>("");
  const [albumin, setAlbumin] = useState<string>("");
  const [correctedCalcium, setCorrectedCalcium] = useState<string | null>(null);
  const [calciumWarning, setCalciumWarning] = useState<string | null>(null);
  const [albuminWarning, setAlbuminWarning] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [unit, setUnit] = useState<"mg/dL" | "mmol/L">("mg/dL");
  const resultRef = useRef<HTMLDivElement>(null);

  // Calculate corrected calcium in real-time as user types
  useEffect(() => {
    if (calcium === "" || albumin === "") {
      setCorrectedCalcium(null);
      return;
    }

    const calciumValue = parseFloat(calcium);
    const albuminValue = parseFloat(albumin);

    // Only calculate if both inputs are valid numbers
    if (!isNaN(calciumValue) && !isNaN(albuminValue)) {
      // Standardize calculation in mg/dL
      const calciumInMgDl = unit === "mmol/L" ? calciumValue * MMOL_L_TO_MG_DL : calciumValue;
      
      // Standard formula using mg/dL
      const result = calciumInMgDl + 0.8 * (4.0 - albuminValue);
      
      // Convert result back to selected unit if needed
      const finalResult = unit === "mmol/L" ? result * MG_DL_TO_MMOL_L : result;
      
      const roundedResult = Math.round(finalResult * 100) / 100;
      setCorrectedCalcium(roundedResult.toFixed(2));
    } else {
      setCorrectedCalcium(null);
    }
  }, [calcium, albumin, unit]);

  // Validate calcium input based on selected unit
  useEffect(() => {
    if (calcium === "") {
      setCalciumWarning(null);
      return;
    }

    const calciumValue = parseFloat(calcium);
    if (isNaN(calciumValue)) {
      setCalciumWarning("Please enter a valid number");
    } else if (unit === "mg/dL" && (calciumValue < 5 || calciumValue > 15)) {
      setCalciumWarning("Calcium values typically range from 5–15 mg/dL. Please verify your input.");
    } else if (unit === "mmol/L" && (calciumValue < 1.25 || calciumValue > 3.75)) {
      setCalciumWarning("Calcium values typically range from 1.25–3.75 mmol/L. Please verify your input.");
    } else {
      setCalciumWarning(null);
    }
  }, [calcium, unit]);

  // Validate albumin input and show warning if needed
  useEffect(() => {
    if (albumin === "") {
      setAlbuminWarning(null);
      return;
    }

    const albuminValue = parseFloat(albumin);
    if (isNaN(albuminValue)) {
      setAlbuminWarning("Please enter a valid number");
    } else if (albuminValue < 1 || albuminValue > 7) {
      setAlbuminWarning("Albumin values typically range from 1-7 g/dL. Please verify your input.");
    } else {
      setAlbuminWarning(null);
    }
  }, [albumin]);

  const resetForm = () => {
    setCalcium("");
    setAlbumin("");
    setCorrectedCalcium(null);
    setCalciumWarning(null);
    setAlbuminWarning(null);
    toast("Form has been reset");
  };

  const copyToClipboard = () => {
    if (correctedCalcium) {
      navigator.clipboard.writeText(`Corrected Calcium: ${correctedCalcium} ${unit}`);
      setCopied(true);
      toast.success("Result copied to clipboard!");
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // Handle unit change
  const handleUnitChange = (value: string) => {
    if (value === "mg/dL" || value === "mmol/L") {
      const newUnit = value as "mg/dL" | "mmol/L";
      
      // If there are values, convert them when changing units
      if (calcium !== "") {
        const calciumValue = parseFloat(calcium);
        if (!isNaN(calciumValue)) {
          if (newUnit === "mmol/L" && unit === "mg/dL") {
            // Convert from mg/dL to mmol/L
            setCalcium((calciumValue * MG_DL_TO_MMOL_L).toFixed(2));
          } else if (newUnit === "mg/dL" && unit === "mmol/L") {
            // Convert from mmol/L to mg/dL
            setCalcium((calciumValue * MMOL_L_TO_MG_DL).toFixed(2));
          }
        }
      }
      
      setUnit(newUnit);
      toast.info(`Units changed to ${newUnit}`);
    }
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
        <div className="space-y-5">
          {/* Unit toggle group */}
          <div className="flex justify-center mb-4">
            <ToggleGroup 
              type="single" 
              value={unit} 
              onValueChange={handleUnitChange}
              className="border rounded-lg"
            >
              <ToggleGroupItem value="mg/dL" aria-label="Set units to mg/dL" className="px-3 text-sm rounded-l-md data-[state=on]:bg-medical-blue data-[state=on]:text-white">
                mg/dL
              </ToggleGroupItem>
              <ToggleGroupItem value="mmol/L" aria-label="Set units to mmol/L" className="px-3 text-sm rounded-r-md data-[state=on]:bg-medical-blue data-[state=on]:text-white">
                mmol/L
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="calcium" className="text-sm font-medium">
                Serum Calcium ({unit})
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
                      Normal range is typically {unit === "mg/dL" ? "8.5-10.5 mg/dL" : "2.1-2.6 mmol/L"}.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="calcium"
              placeholder={`Enter value (e.g., ${unit === "mg/dL" ? "9.5" : "2.4"})`}
              value={calcium}
              onChange={(e) => setCalcium(e.target.value)}
              className="focus:border-medical-blue-bright"
              type="number"
              step="0.1"
            />
            {calciumWarning && (
              <p className="text-sm text-amber-500 flex items-center mt-1">
                ⚠️ {calciumWarning}
              </p>
            )}
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
            {albuminWarning && (
              <p className="text-sm text-amber-500 flex items-center mt-1">
                ⚠️ {albuminWarning}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
              className="flex items-center"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>

          {correctedCalcium && (
            <div 
              ref={resultRef}
              className="mt-4 p-4 bg-medical-green rounded-lg text-center transition-all duration-300 ease-in-out"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Corrected Calcium:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-8"
                >
                  {copied ? (
                    <ClipboardCheck className="h-4 w-4 mr-1 text-green-600" />
                  ) : (
                    <Clipboard className="h-4 w-4 mr-1" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-2xl font-bold">{correctedCalcium} {unit}</p>
              <p className="text-sm text-gray-600 mt-2">
                🧪 Average corrected calcium: ~{unit === "mg/dL" ? "9.4 mg/dL" : "2.35 mmol/L"} (may vary by lab)
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="mt-2">
                      <HelpCircle className="h-4 w-4 mr-1" /> What does this mean?
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p>
                      Corrected calcium adjusts for the effect of albumin on total calcium levels.
                      Normal range is typically {unit === "mg/dL" ? "8.5-10.5 mg/dL" : "2.1-2.6 mmol/L"}. Values outside this range may
                      indicate various medical conditions and should be discussed with a healthcare provider.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calculator;
