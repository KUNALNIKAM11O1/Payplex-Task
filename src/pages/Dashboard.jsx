import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('flights');
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({});
  const [bookingModal, setBookingModal] = useState({ show: false, item: null, type: '', proposedDate: '' });

  useEffect(() => {
    setSearchQuery({}); 
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${tab}`);
      setAllData(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  };

  const handleSearchClick = () => {
    const filtered = allData.filter(item => {
      return Object.entries(searchQuery).every(([searchKey, searchVal]) => {
        if (!searchVal) return true;
        
        const term = searchVal.toLowerCase();
        let targetValue = '';
        
        if (activeTab === 'flights') {
            if (searchKey === 'origin') targetValue = item.origin;
            if (searchKey === 'destination') targetValue = item.destination;
            if (searchKey === 'date') targetValue = item.departure;
        } else if (activeTab === 'buses') {
            if (searchKey === 'origin') targetValue = item.origin;
            if (searchKey === 'destination') targetValue = item.destination;
            if (searchKey === 'date') targetValue = item.departure_time;
        } else if (activeTab === 'hotels') {
            if (searchKey === 'location') targetValue = item.location || item.name;
            if (searchKey === 'check-in' || searchKey === 'guests') return true; 
        }
        
        return String(targetValue || '').toLowerCase().includes(term);
      });
    });
    
    setData(filtered);
  };

  const handleBookClick = (item, type) => {
    if (!user) {
      alert("Please login to book services!");
      return;
    }
    const proposedDate = type === 'hotels' ? '' : (item.departure || item.departure_time || '').split(' ')[0];
    setBookingModal({ show: true, item, type, proposedDate });
  };

  const handleBookSubmit = async () => {
    const { item, type, proposedDate } = bookingModal;
    if (!proposedDate) {
      alert("Please select a date.");
      return;
    }

    try {
      await axios.post(`${API_URL}/bookings`, {
        userId: user.id || user.email,
        userName: user.name,
        userEmail: user.email,
        serviceId: item.id,
        serviceType: type,
        serviceTitle: getCardTitle(item),
        date: proposedDate,
        bookedAt: new Date().toISOString()
      });
      alert("Success! Your booking has been confirmed.");
      setBookingModal({ show: false, item: null, type: '', proposedDate: '' });
    } catch (error) {
      console.error("Booking error", error);
      alert("Failed to book the service. Try again later.");
    }
  };

  const tabs = [
    { id: 'flights', label: 'Flights', icon: 'bi-airplane' },
    { id: 'hotels', label: 'Hotels', icon: 'bi-building' },
    { id: 'buses', label: 'Buses', icon: 'bi-bus-front' },
  ];

  const getSearchFields = () => {
    switch (activeTab) {
      case 'flights':
        return [
          { label: 'Origin', placeholder: 'From where?', icon: 'bi-geo-alt' },
          { label: 'Destination', placeholder: 'Where to?', icon: 'bi-geo-alt-fill' },
          { label: 'Date', placeholder: 'Departure date', icon: 'bi-calendar3' },
        ];
      case 'hotels':
        return [
          { label: 'Location', placeholder: 'City or hotel', icon: 'bi-geo-alt' },
          { label: 'Check-in', placeholder: 'Check-in date', icon: 'bi-calendar3' },
          { label: 'Guests', placeholder: 'No. of guests', icon: 'bi-people' },
        ];
      case 'buses':
        return [
          { label: 'Origin', placeholder: 'Leaving from?', icon: 'bi-geo-alt' },
          { label: 'Destination', placeholder: 'Going to?', icon: 'bi-geo-alt-fill' },
          { label: 'Date', placeholder: 'Travel date', icon: 'bi-calendar3' },
        ];
      default:
        return [];
    }
  };

  const getCardTitle = (item) => {
    if (activeTab === 'hotels') return item.name;
    if (activeTab === 'flights') return item.airline;
    return item.operator;
  };

  const getCardSubtitle = (item) => {
    if (activeTab === 'hotels') return item.location;
    return `${item.origin} → ${item.destination}`;
  };

  const getCardPrice = (item) => {
    if (activeTab === 'hotels') return `$${item.price_per_night}/night`;
    return `$${item.price}`;
  };

  const getCardExtra = (item) => {
    if (activeTab === 'hotels') return item.rating;
    if (activeTab === 'flights') return item.departure;
    return item.departure_time;
  };

  return (
    <>
      {bookingModal.show && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="search-card" style={{ width: '100%', maxWidth: '400px' }}>
            <h4 className="fw-bold mb-3">Confirm Booking Date</h4>
            <p className="text-muted mb-4">Please select your desired {bookingModal.type === 'hotels' ? 'check-in' : 'departure'} date for <strong>{getCardTitle(bookingModal.item)}</strong>.</p>
            
            <div className="position-relative mb-4">
              <i className="bi bi-calendar3 input-icon"></i>
              <input 
                type="date" 
                className="form-control search-input" 
                value={bookingModal.proposedDate}
                onChange={(e) => setBookingModal({...bookingModal, proposedDate: e.target.value})}
              />
            </div>
            
            <div className="d-flex gap-3">
              <button className="btn btn-search flex-grow-1" onClick={handleBookSubmit}>Confirm</button>
              <button className="btn btn-outline-light flex-grow-1" onClick={() => setBookingModal({...bookingModal, show: false})}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <section className="hero-section pb-4 pt-5" id="hero" style={{minHeight: 'auto'}}>
        <div className="container">
          <div className="search-card mx-auto mt-5 fade-in-up delay-1" style={{ maxWidth: '900px' }} id="search-module">
            <div className="tab-module d-flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <i className={`bi ${tab.icon}`}></i>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="row g-3">
              {getSearchFields().map((field, idx) => (
                <div className="col-12 col-md" key={idx}>
                  <label className="search-label">{field.label}</label>
                  <div className="position-relative">
                    <i className={`bi ${field.icon} input-icon`}></i>
                    <input
                      type={field.label === 'Date' || field.label === 'Check-in' ? 'date' : 'text'}
                      className="form-control search-input"
                      placeholder={field.placeholder}
                      id={`search-${field.label.toLowerCase()}`}
                      name={field.label.toLowerCase()}
                      value={searchQuery[field.label.toLowerCase()] || ''}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              ))}
              <div className="col-12 col-md-auto d-flex align-items-end">
                <button 
                  className="btn btn-search w-100 d-flex align-items-center justify-content-center gap-2" 
                  id="btn-search"
                  onClick={handleSearchClick}
                >
                  <i className="bi bi-search"></i>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" id="recommendations">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">
              Top {activeTab === 'flights' ? 'Flight' : activeTab === 'hotels' ? 'Hotel' : 'Bus'} Deals
            </h2>
          </div>

          {loading ? (
            <div className="row g-4">
              {[1, 2, 3].map((i) => (
                <div className="col-12 col-md-6 col-lg-4" key={i}>
                  <div className="skeleton" style={{ height: '380px' }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-4">
              {data.map((item, idx) => (
                <div className={`col-12 col-md-6 col-lg-4 fade-in-up delay-${idx + 1}`} key={`${activeTab}-${item.id}`}>
                  <div className="deal-card" id={`card-${activeTab}-${item.id}`}>
                    <div className="card-image-wrapper">
                      {activeTab === 'hotels' ? (
                        <img
                          src={`${item.image_url}?w=600&h=400&fit=crop`}
                          alt={item.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="card-placeholder-icon">
                          <i className={`bi ${activeTab === 'flights' ? 'bi-airplane' : 'bi-bus-front'}`}></i>
                        </div>
                      )}
                      <span className="card-price-badge">{getCardPrice(item)}</span>
                    </div>
                    <div className="card-body-custom">
                      <h5 className="card-title-custom">{getCardTitle(item)}</h5>
                      <div className="card-location mb-3">
                        <i className="bi bi-geo-alt"></i>
                        {getCardSubtitle(item)}
                      </div>
                    </div>
                    <div className="card-footer-custom">
                      <div className="card-rating">
                        <i className="bi bi-star-fill"></i>
                        {activeTab === 'hotels'
                          ? item.rating
                          : activeTab === 'flights'
                          ? `Dep: ${item.departure}`
                          : `Dep: ${item.departure_time}`}
                      </div>
                      <button className="btn-book" onClick={() => handleBookClick(item, activeTab)}>
                        Book Now <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
