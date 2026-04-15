import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://payplex-task.onrender.com';

const Deals = ({ user }) => {
  const [deals, setDeals] = useState({ flights: [], hotels: [], buses: [] });
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState({ show: false, item: null, type: '', proposedDate: '' });

  useEffect(() => {
    const fetchAllDeals = async () => {
      try {
        const [flightsRes, hotelsRes, busesRes] = await Promise.all([
          axios.get(`${API_URL}/flights`),
          axios.get(`${API_URL}/hotels`),
          axios.get(`${API_URL}/buses`)
        ]);
        setDeals({
          flights: flightsRes.data.slice(0, 3),
          hotels: hotelsRes.data.slice(0, 3),
          buses: busesRes.data.slice(0, 3)
        });
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDeals();
  }, []);

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
        serviceTitle: type === 'hotels' ? item.name : (type === 'flights' ? item.airline : item.operator),
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

  const renderDealCard = (item, type) => {
    const isHotel = type === 'hotels';
    const isFlight = type === 'flights';
    
    const image = isHotel ? item.image_url : null;
    const title = isHotel ? item.name : isFlight ? item.airline : item.operator;
    const subtitle = isHotel ? item.location : `${item.origin} → ${item.destination}`;
    const price = isHotel ? `$${item.price_per_night}/night` : `$${item.price}`;
    const extra = isHotel ? item.rating : isFlight ? `Dep: ${item.departure}` : `Dep: ${item.departure_time}`;
    const icon = isFlight ? 'bi-airplane' : 'bi-bus-front';

    return (
      <div className="col-12 col-md-6 col-lg-4 fade-in-up" key={`${type}-${item.id}`}>
        <div className="deal-card">
          <div className="card-image-wrapper">
            {isHotel ? (
              <img src={`${image}?w=600&h=400&fit=crop`} alt={title} loading="lazy" />
            ) : (
              <div className="card-placeholder-icon">
                <i className={`bi ${icon}`}></i>
              </div>
            )}
            <span className="card-price-badge">{price}</span>
          </div>
          <div className="card-body-custom">
            <h5 className="card-title-custom">{title}</h5>
            <div className="card-location mb-3">
              <i className="bi bi-geo-alt"></i> {subtitle}
            </div>
          </div>
          <div className="card-footer-custom">
            <div className="card-rating">
              <i className="bi bi-star-fill"></i> {extra}
            </div>
            <button className="btn-book" onClick={() => handleBookClick(item, type)}>
              Book Now <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-5" id="recommendations" style={{ minHeight: '100vh', paddingTop: '100px' }}>
      {bookingModal.show && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="search-card" style={{ width: '100%', maxWidth: '400px' }}>
            <h4 className="fw-bold mb-3">Confirm Booking Date</h4>
            <p className="text-muted mb-4">Please select your desired {bookingModal.type === 'hotels' ? 'check-in' : 'departure'} date for <strong>{bookingModal.type === 'hotels' ? bookingModal.item.name : (bookingModal.type === 'flights' ? bookingModal.item.airline : bookingModal.item.operator)}</strong>.</p>
            
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

      <div className="container mt-5">
        <div className="text-center mb-5">
          <h2 className="section-title">Exclusive Travel Deals</h2>
          <p className="text-muted">Hand-picked offers on flights, hotels, and buses around the world.</p>
        </div>

        {loading ? (
          <div className="row g-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div className="col-12 col-md-6 col-lg-4" key={i}>
                <div className="skeleton" style={{ height: '380px' }}></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <h4 className="mb-4 text-white"><i className="bi bi-airplane text-primary me-2"></i> Top Flights</h4>
            <div className="row g-4 mb-5">
              {deals.flights.map(item => renderDealCard(item, 'flights'))}
            </div>

            <h4 className="mb-4 text-white"><i className="bi bi-building text-primary me-2"></i> Featured Hotels</h4>
            <div className="row g-4 mb-5">
              {deals.hotels.map(item => renderDealCard(item, 'hotels'))}
            </div>

            <h4 className="mb-4 text-white"><i className="bi bi-bus-front text-primary me-2"></i> Bus Routes</h4>
            <div className="row g-4">
              {deals.buses.map(item => renderDealCard(item, 'buses'))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Deals;
