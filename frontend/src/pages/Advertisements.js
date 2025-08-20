import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Wifi, Car, Dumbbell, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Advertisements = () => {
  const navigate = useNavigate();
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch advertisements from API
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:1629/api/advertisements"
        );
        const data = await response.json();

        if (data.success) {
          setAdvertisements(data.data);
        } else {
          setError("Failed to fetch advertisements");
        }
      } catch (err) {
        setError("Error connecting to server");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  const amenityIcon = (amenity) => {
    if (amenity.toLowerCase() === "wifi") {
      return <Wifi className="w-4 h-4" />;
    } else if (amenity.toLowerCase() === "parking") {
      return <Car className="w-4 h-4" />;
    } else if (amenity.toLowerCase() === "gym") {
      return <Dumbbell className="w-4 h-4" />;
    } else {
      return <Star className="w-4 h-4" />;
    }
  };

  const categoryColor = (category) => {
    if (category.toLowerCase() === "apartment") {
      return "bg-blue-100 text-blue-800 border-blue-200";
    } else if (category.toLowerCase() === "house") {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (category.toLowerCase() === "studio") {
      return "bg-purple-100 text-purple-800 border-purple-200";
    } else {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600">
              There are currently no properties listed. Check back later!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Property Listings
          </h1>
          <p className="text-lg text-gray-600">
            Discover your perfect home from our curated collection of premium
            properties
          </p>
        </div>

        {advertisements.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600">
                There are currently no properties listed. Check back later!
              </p>
            </div>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisements.map((ad, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 flex flex-col h-full"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryColor(
                      ad.category
                    )}`}
                  >
                    {ad.category.charAt(0).toUpperCase() + ad.category.slice(1)}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-black">
                      ${ad.price}
                    </div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                </div>

                {/* Title and Description */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {ad.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {ad.description}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 font-bold text-purple-500" />
                  <span className="text-sm">{ad.location}</span>
                </div>

                {/* Amenities */}
                {ad.amenities && ad.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ad.amenities.map((amenity, amenityIndex) => (
                      <div
                        key={amenityIndex}
                        className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700"
                      >
                        {amenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Contact Info */}
                <div className="border-t border-gray-200 pt-4 mt-auto">
                  <div className="text-sm font-medium text-gray-900 mb-3">
                    Contact: {ad.contactInfo?.name || "Not provided"}
                  </div>
                  <div className="flex gap-2 mb-3">
                    {ad.contactInfo?.phone && (
                      <a
                        href={`tel:${ad.contactInfo.phone}`}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 text-sm font-medium"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </a>
                    )}
                    {ad.contactInfo?.email && (
                      <a
                        href={`mailto:${ad.contactInfo.email}`}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </a>
                    )}
                  </div>

                  {/* View Property Details Button */}
                  <button
                    onClick={() =>
                      navigate(`/${ad._id}`)
                    }
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-md hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    View Property Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Advertisements;