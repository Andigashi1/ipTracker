import { useState, useEffect } from "react";
import bgMobile from "./assets/images/pattern-bg-mobile.png";
import bgDesktop from "./assets/images/pattern-bg-desktop.png";
import arrow from "./assets/images/icon-arrow.svg";
import Map from "./Map";
import PropTypes from "prop-types";

function App() {
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInitialLocation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=at_qFcVo0azNqnneUQGWThT5uhmr7jV3`
        );
        const data = await response.json();
        setLocation(data);
      } catch {
        setError("Failed to fetch initial location data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialLocation();
  }, []);

  const handleChange = (e) => {
    setIpAddress(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_qFcVo0azNqnneUQGWThT5uhmr7jV3&ipAddress=${ipAddress}`
      );

      if (!response.ok) {
        throw new Error('Invalid IP address or network error');
      }

      const data = await response.json();

      if (!data?.location?.lat || !data?.location?.lng) {
        throw new Error('No location data found for this IP');
      }

      // Ensure the data is structured for the Map component
      setLocation({
        location: {
          lat: data?.location?.lat,
          lng: data?.location?.lng,
          city: data?.location?.city,
          country: data?.location?.country,
        },
        ip: data?.ip,
        isp: data?.isp,
      });
    } catch {
      setError("Failed to fetch location data");
    } finally {
      setIsLoading(false);
      setIpAddress("");
    }
  };

  return (
    <div className="flex flex-col mx-8 font-rubik">
      <div className="absolute flex flex-col top-0 left-0 w-full h-screen -z-10">
        <img
          src={bgMobile}
          className="w-full md:hidden min-h-80"
          alt="mobile background"
        />
        <img
          src={bgDesktop}
          className="w-full hidden md:block min-h-64"
          alt="desktop background"
        />

        <Map location={location} />
      </div>

      <div className="space-y-8 mt-8 flex flex-col text-center">
        <h1 className="text-white text-3xl font-bold">IP Address Tracker</h1>

        <span className="flex w-full max-w-96 mx-auto ">
          <input
            type="text"
            name="ipAddress"
            disabled={isLoading}
            value={ipAddress}
            onChange={handleChange}
            placeholder="Search for any IP address or domain"
            className="px-3 w-full rounded-s-xl hover:bg-[#f0f0f0] focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            className="bg-black hover:bg-[#2b2b2b] px-6 py-6 w-18 box-border rounded-e-xl focus:outline-none"
          >
            <img src={arrow} alt="arrow icon" />
          </button>
        </span>

        <div className="bg-white rounded-xl flex flex-col md:flex-row items-center md:space-y-0 
        md:text-left max-w-screen-xl md:mx-auto py-4 shadow-xl space-y-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500 px-4">{error}</p>
          ) : (
            <>
              <div className="max-w-64  space-y-1 md:border-r-2 md:px-8 md:h-20">
                <p className="text-gray-600 font-semibold uppercase text-xs">IP Address</p>
                <p className="font-bold text-xl">{location?.ip}</p>
              </div>
              <div className="max-w-72  space-y-1 md:border-r-2 md:px-8 md:h-20">
                <p className="text-gray-600 font-semibold uppercase text-xs">Location</p>
                <p className="font-bold text-xl">
                  {location?.location?.city}, {location?.location?.country}
                </p>
              </div>
              <div className="max-w-64  space-y-1 md:border-r-2 md:px-8 md:h-20">
                <p className="text-gray-600 font-semibold uppercase text-xs">Timezone</p>
                <p className="font-bold text-xl">
                  UTC {location?.location?.timezone}
                </p>
              </div>
              <div className="max-w-64 space-y-1 md:px-8 md:h-20">
                <p className="text-gray-600 font-semibold uppercase text-xs">ISP</p>
                <p className="font-bold text-xl">{location?.isp}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

App.propTypes = {
  location: PropTypes.shape({
    ip: PropTypes.string,
    location: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
      city: PropTypes.string,
      country: PropTypes.string,
      timezone: PropTypes.string,
    }),
    isp: PropTypes.string,
  }),
};

export default App;
