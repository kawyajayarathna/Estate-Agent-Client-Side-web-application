import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import 'react-tabs/style/react-tabs.css';
import './PropertyDetails.css';

const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('/data/properties.json')
      .then(response => response.json())
      .then(data => {
        const foundProperty = data.properties.find(p => p.id === id);
        if (foundProperty) {
          setProperty(foundProperty);
          const galleryImages = foundProperty.pictures.map(pic => ({
            original: pic.startsWith('/') ? pic : `/${pic}`,
            thumbnail: pic.startsWith('/') ? pic : `/${pic}`,
            loading: 'lazy'
          }));
          setImages(galleryImages);
        }
      })
      .catch(error => console.error('Error loading property:', error));
  }, [id]);

  if (!property) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="property-details">
      {/* Back Arrow Button */}
      <button
        className="back-arrow"
        onClick={() => navigate('/#properties')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '2rem',
          marginBottom: '1rem'
        }}
        aria-label="Back to Properties"
      >
        &#8592; Back to Properties
      </button>

      <div className="property-gallery">
        <ImageGallery
          items={images}
          showPlayButton={false}
          showFullscreenButton={true}
          showNav={true}
        />
      </div>

      <div className="key-details">
        <div className="detail-item">
          <span className="label">Price</span>
          <span className="value">£{property.price.toLocaleString()}</span>
        </div>
        <div className="detail-item">
          <span className="label">Bedrooms</span>
          <span className="value">{property.bedrooms}</span>
        </div>
        <div className="detail-item">
          <span className="label">Tenure</span>
          <span className="value">{property.tenure}</span>
        </div>
        <div className="detail-item">
          <span className="label">Added</span>
          <span className="value">{`${property.added.day} ${property.added.month} ${property.added.year}`}</span>
        </div>
      </div>

      <Tabs>
        <TabList>
          <Tab style={{ color: 'var(--color-primary)' }}>Description</Tab>
          <Tab style={{ color: 'var(--color-primary)' }}>Floor Plan</Tab>
          <Tab style={{ color: 'var(--color-primary)' }}>Location</Tab>
        </TabList>

        <TabPanel>
          <div className="description-content">
            <p>{property.longDescription || property.description}</p>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="floorplan-content">
            <img src={property.floorPlan} alt="Floor Plan" />
          </div>
        </TabPanel>

        <TabPanel>
          <div className="map-content">
            <iframe
              title="Property Location"
              width="100%"
              height="450"
              frameBorder="0"
              src={`https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${encodeURIComponent(property.location)}`}
              allowFullScreen
            />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default PropertyDetails;