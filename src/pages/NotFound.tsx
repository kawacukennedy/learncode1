import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Layout from "@/components/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Page Not Found
            </h2>
            <p className="text-gray-400 text-lg">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full"
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 w-full"
            >
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="mt-8 text-gray-500 text-sm">
            <p>If you think this is an error, please contact support.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
