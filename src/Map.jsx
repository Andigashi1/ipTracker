import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';  // CSS import
import { useEffect, useState } from 'react';
import icon from './assets/images/icon-location.svg';
import PropTypes from 'prop-types'

// Import marker icons to prevent the missing marker icon issue
import L from 'leaflet';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Set up the default icon
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [35, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function Map({location}) {

    const [position, setPosition] = useState([51.505, -0.09]);

    useEffect(() => {
        if (location?.location) {
            setPosition([location.location.lat, location.location.lng])
        }
    },[location])

    function UpdateMapCenter({ center }) {
        const map = useMap();
    
        useEffect(() => {
            if (center) {
                map.setView(center, map.getZoom());
            }
        }, [center, map]);
    
        return null;
    }

    return (
        <div className="w-full h-full rounded-lg overflow-hidden">
        <MapContainer 
            center={position} 
            zoom={13} 
            zoomControl={false}
            scrollWheelZoom={false}
            className="h-full w-full"
        >
            <UpdateMapCenter center={position} />

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {location?.location && (
                <Marker position={[location.location.lat, location.location.lng]}>
                    <Popup>
                        {location.location.city}, {location.location.country}
                    </Popup>
                </Marker>
            )}
        </MapContainer>

    </div>
    )
}


    Map.propTypes = {
        center: PropTypes.arrayOf(PropTypes.number),
        location: PropTypes.shape({
        location: PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
            city: PropTypes.string.isRequired,
            country: PropTypes.string.isRequired,
        }).isRequired,
        }).isRequired,
    }

export default Map