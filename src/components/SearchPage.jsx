import { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import PropertyDetails from './PropertyDetails';
import 'react-datepicker/dist/react-datepicker.css';
import './SearchPage.css';

// PropertyCard component
const PropertyCard = ({ property, onAddToFavorites, isFavorite, onViewDetails }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'property',
    item: { id: property.id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`property-card ${isDragging ? 'dragging' : ''}`}
    >
      <img src={property.picture} alt={property.description} />
      <div className="property-info">
        <h4>{property.type} - {property.location}</h4>
        <div className="price">£{property.price.toLocaleString()}</div>
        <div className="description">{property.description}</div>
        <div className="card-actions">
          <button className="view-details" onClick={() => onViewDetails(property)}>
            View Details
          </button>
          <button
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={() => onAddToFavorites(property)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FontAwesomeIcon 
              icon={isFavorite ? faStarSolid : faStarRegular} 
              className="star-icon"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

// FavoritesList component (unchanged)
const FavoritesList = ({ favorites, onRemoveFromFavorites, onClearFavorites, onAddToFavorites, properties }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'property',
    drop: (item) => {
      const property = properties.find(p => p.id === item.id);
      if (property) onAddToFavorites(property);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`favorites-sidebar ${isOver ? 'drop-target' : ''} ${canDrop ? 'can-drop' : ''}`}
    >
      <div className="favorites-header">
        <h3>Favorites</h3>
        {favorites.length > 0 && (
          <button
            className="clear-favorites"
            onClick={onClearFavorites}
            aria-label="Clear all favorites"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="favorites-list">
        {favorites.map(property => (
          <div key={property.id} className="favorite-item">
            <img src={property.picture} alt={property.description} />
            <div className="favorite-info">
              <h4>{property.type}</h4>
              <p>£{property.price.toLocaleString()}</p>
            </div>
            <button
              className="remove-favorite"
              onClick={() => onRemoveFromFavorites(property.id)}
              aria-label="Remove from favorites"
            >
              <FontAwesomeIcon icon={faStarRegular} className="star-icon" />
            </button>
          </div>
        ))}
        {favorites.length === 0 && (
          <p className="no-favorites">Drag properties here or click the star icon to add to favorites</p>
        )}
      </div>
    </div>
  );
};

// SearchPage component
const SearchPage = ({ favorites, addToFavorites, removeFromFavorites, clearFavorites }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    maxBedrooms: '',
    dateAddedAfter: null,
    dateAddedBefore: null,
    postcode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const typeOptions = [
    { value: 'Any', label: 'Any Type' },
    { value: 'House', label: 'House' },
    { value: 'Flat', label: 'Flat' }
  ];

  const handleTypeChange = (selectedOption) => {
    setSearchCriteria({
      ...searchCriteria,
      type: selectedOption.value
    });
    let filtered = properties;
    if (selectedOption.value !== 'Any') {
      filtered = properties.filter(property => property.type === selectedOption.value);
    }
    setFilteredProperties(filtered);
  };

  useEffect(() => {
    setLoading(true);
    fetch('/data/properties.json')
      .then(response => response.json())
      .then(data => {
        setProperties(data.properties);
        setFilteredProperties(data.properties);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    let filtered = properties;
    if (searchCriteria.type && searchCriteria.type !== 'Any') {
      filtered = filtered.filter(property => property.type === searchCriteria.type);
    }
    if (searchCriteria.minPrice) {
      filtered = filtered.filter(property => property.price >= parseInt(searchCriteria.minPrice));
    }
    if (searchCriteria.maxPrice) {
      filtered = filtered.filter(property => property.price <= parseInt(searchCriteria.maxPrice));
    }
    if (searchCriteria.minBedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(searchCriteria.minBedrooms));
    }
    if (searchCriteria.maxBedrooms) {
      filtered = filtered.filter(property => property.bedrooms <= parseInt(searchCriteria.maxBedrooms));
    }
    if (searchCriteria.dateAddedAfter) {
      filtered = filtered.filter(property => {
        const propDate = new Date(property.added.year, getMonthNumber(property.added.month), property.added.day);
        return propDate >= searchCriteria.dateAddedAfter;
      });
    }
    if (searchCriteria.dateAddedBefore) {
      filtered = filtered.filter(property => {
        const propDate = new Date(property.added.year, getMonthNumber(property.added.month), property.added.day);
        return propDate <= searchCriteria.dateAddedBefore;
      });
    }
    if (searchCriteria.postcode) {
      const postcodeRegex = new RegExp(searchCriteria.postcode.toUpperCase());
      filtered = filtered.filter(prop => postcodeRegex.test(prop.location.toUpperCase()));
    }
    setFilteredProperties(filtered);
  };

  const getMonthNumber = (monthName) => {
    const months = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3,
      'May': 4, 'June': 5, 'July': 6, 'August': 7,
      'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    return months[monthName];
  };

  const handleToggleFavorite = (property) => {
    if (favorites.some(fav => fav.id === property.id)) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites(property);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="search-page">
        <div className="search-form">
          <h2 style={{ color: 'var(--color-primary)' }}>Find Your Dream Property</h2>
          <div className="form-grid">
            <div className="form-group">
              <label style={{ color: 'black' }}>Property Type</label>
              <Select
                options={typeOptions}
                value={typeOptions.find(option => option.value === searchCriteria.type)}
                onChange={handleTypeChange}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'black',
                    boxshadow: 'none',
                    '&:hover': {
                      borderColor: 'gold'
                    }
                  }),
                  singleValue: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'black'
                  }),
                  input: (base) => ({
                    ...base,
                    color: 'black'
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: 'rgba(255, 255, 255, 0.6)'
                  })
                }}
              />
            </div>

            <div className="form-group">
              <label style={{ color: 'black' }}>Price Range</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={searchCriteria.minPrice}
                  onChange={(e) => setSearchCriteria({...searchCriteria, minPrice: e.target.value})}
                  style={{ color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
                <span style={{ color: 'black' }}>-</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={searchCriteria.maxPrice}
                  onChange={(e) => setSearchCriteria({...searchCriteria, maxPrice: e.target.value})}
                  style={{ color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ color: 'black' }}>Bedrooms</label>
              <div className="bedroom-inputs">
                <input
                  type="number"
                  placeholder="Min Bedrooms"
                  value={searchCriteria.minBedrooms}
                  onChange={(e) => setSearchCriteria({...searchCriteria, minBedrooms: e.target.value})}
                  style={{ color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
                <span style={{ color: 'black' }}>-</span>
                <input
                  type="number"
                  placeholder="Max Bedrooms"
                  value={searchCriteria.maxBedrooms}
                  onChange={(e) => setSearchCriteria({...searchCriteria, maxBedrooms: e.target.value})}
                  style={{ color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ color: 'black' }}>Date Added</label>
              <div className="date-range">
                <DatePicker
                  selected={searchCriteria.dateAddedAfter}
                  onChange={(date) => setSearchCriteria({...searchCriteria, dateAddedAfter: date})}
                  className="datepicker"
                  placeholderText="After"
                  dateFormat="dd/MM/yyyy"
                  isClearable
                  popperPlacement="bottom-start"
                  popperModifiers={[
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 8]
                      }
                    }
                  ]}
                  style={{ color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
                <span style={{ color: 'black' }}>-</span>
                <DatePicker
                  selected={searchCriteria.dateAddedBefore}
                  onChange={(date) => setSearchCriteria({...searchCriteria, dateAddedBefore: date})}
                  className="datepicker"
                  placeholderText="Before"
                  dateFormat="dd/MM/yyyy"
                  isClearable
                  popperPlacement="bottom-start"
                  popperModifiers={[
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 8]
                      }
                    }
                  ]}
                  style={{ color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ color: 'black' }}>Postcode Area</label>
              <input
                type="text"
                placeholder="e.g. BR1, NW1"
                value={searchCriteria.postcode}
                onChange={(e) => setSearchCriteria({...searchCriteria, postcode: e.target.value})}
                style={{ color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              />
            </div>
          </div>

          <button 
            className="luxury-button search-button" 
            onClick={handleSearch}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'black',
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '1rem'
            }}
          >
            Search Properties
          </button>
        </div>

        <div className="results-container">
          {loading ? (
            <div className="loading">Loading properties...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              <div className="property-results">
                <h3 style={{ color: 'black' }}>Properties</h3>
                {selectedProperty && (
                  <div style={{ marginBottom: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1.5rem' }}>
                    <button
                      style={{
                        float: 'right',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#888'
                      }}
                      onClick={() => setSelectedProperty(null)}
                      aria-label="Close details"
                    >
                      &times;
                    </button>
                    <PropertyDetails property={selectedProperty} />
                  </div>
                )}
                <div className="property-grid">
                  {filteredProperties.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      isFavorite={favorites.some(fav => fav.id === property.id)}
                      onAddToFavorites={() => handleToggleFavorite(property)}
                      onViewDetails={setSelectedProperty}
                    />
                  ))}
                </div>
              </div>

              <div className="favorites-section">
                <FavoritesList
                  favorites={favorites}
                  onRemoveFromFavorites={removeFromFavorites}
                  onClearFavorites={clearFavorites}
                  onAddToFavorites={addToFavorites}
                  properties={properties}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default SearchPage;