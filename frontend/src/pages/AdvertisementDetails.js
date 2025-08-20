import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Wifi,
  Car,
  Dumbbell,
  Star,
  ArrowLeft,
  Heart,
  Share2,
  Home,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const AdvertisementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch advertisement details from API
  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        setLoading(true);
        console.log(`Fetching advertisement with ID: ${id}`);
        const response = await fetch(
          `http://localhost:1629/api/advertisements/${id}`
        );
        const data = await response.json();

        if (data.success) {
          setProperty(data.data);
        } else {
          setError("Failed to fetch advertisement details");
        }
      } catch (err) {
        setError("Error connecting to server");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAdvertisement();
    }
  }, [id]);

  const getAmenityIcon = (amenity) => {
    if (amenity.toLowerCase() === "wifi") return <Wifi className="w-5 h-5" />;
    if (amenity.toLowerCase() === "parking") return <Car className="w-5 h-5" />;
    if (amenity.toLowerCase() === "gym")
      return <Dumbbell className="w-5 h-5" />;
    return <Star className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Property Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error
              ? "There was an issue loading this property."
              : "The property you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/advertisements")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/advertisements")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Properties</span>
            </button>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-500 hover:text-red-500 rounded-full">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-blue-500 rounded-full">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Header */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              {/* Property Image */}
              <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    className="h-full w-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    display:
                      property.images && property.images.length > 0
                        ? "none"
                        : "flex",
                  }}
                >
                  <Home className="w-16 h-16 text-white" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                <div className="flex-1">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {property.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="break-words">{property.location}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">
                    ${property.price}
                  </div>
                  <div className="text-gray-500">per month</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-blue-600 flex-shrink-0">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="font-medium text-gray-900 capitalize break-words">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 lg:sticky lg:top-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
                Contact Information
              </h3>

              {/* Contact Person */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-white">
                    {property.contactInfo?.name?.charAt(0)?.toUpperCase() ||
                      "P"}
                  </span>
                </div>
                <h4 className="font-bold text-lg text-gray-900 break-words">
                  {property.contactInfo?.name || "Property Manager"}
                </h4>
                <p className="text-sm text-gray-600">Property Manager</p>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3 mb-6">
                {property.contactInfo?.phone && (
                  <a
                    href={`tel:${property.contactInfo.phone}`}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                  >
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <span>Call Now</span>
                  </a>
                )}
                {property.contactInfo?.email && (
                  <a
                    href={`mailto:${property.contactInfo.email}`}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold break-all"
                  >
                    <Mail className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">Send Email</span>
                  </a>
                )}
              </div>

              {/* Quick Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium capitalize">
                    {property.category}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-600">Price</span>
                  <span className="font-bold text-green-600">
                    ${property.price}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-medium ${
                      property.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {property.isActive ? "Available" : "Not Available"}
                  </span>
                </div>
                {property.views && property.views > 0 && (
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-600">Views</span>
                    <span className="font-medium text-purple-800">
                      {property.views}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementDetails;
