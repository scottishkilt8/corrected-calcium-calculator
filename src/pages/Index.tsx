
import Calculator from "@/components/Calculator";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-medical-blue/10 p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Corrected Calcium Calculator
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          A tool for healthcare professionals to adjust calcium levels based on albumin concentration.
        </p>
      </header>
      
      <main className="w-full max-w-md">
        <Calculator />
      </main>
      
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>For medical professional use only. Results should be verified by a healthcare provider.</p>
      </footer>
    </div>
  );
};

export default Index;
