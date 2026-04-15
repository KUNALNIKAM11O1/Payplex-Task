import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://payplex-task.onrender.com';

const AdminDashboard = () => (
    <div className="container mt-5">
        <h2>Admin Dashboard</h2>
        <p>Manage all your plans from here.</p>
        <div className="row mt-4">
            <div className="col-md-4 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Manage Flights</h5>
                        <Link to="/admin/flights" className="btn btn-primary mt-2">Go to Flights</Link>
                    </div>
                </div>
            </div>
             <div className="col-md-4 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Manage Hotels</h5>
                         <Link to="/admin/hotels" className="btn btn-primary mt-2">Go to Hotels</Link>
                    </div>
                </div>
            </div>
             <div className="col-md-4 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Manage Buses</h5>
                         <Link to="/admin/buses" className="btn btn-primary mt-2">Go to Buses</Link>
                    </div>
                </div>
            </div>
             <div className="col-md-4 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Support Tickets</h5>
                         <Link to="/admin/support" className="btn btn-primary mt-2">View Tickets</Link>
                    </div>
                </div>
            </div>
             <div className="col-md-4 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Manage Users</h5>
                         <Link to="/admin/users" className="btn btn-primary mt-2">Go to Users</Link>
                    </div>
                </div>
            </div>
             <div className="col-md-4 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Manage Bookings</h5>
                         <Link to="/admin/bookings" className="btn btn-primary mt-2">Go to Bookings</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ManageList = ({ type }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [type]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/${type}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this item?')) {
             try {
                await axios.delete(`${API_URL}/${type}/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting data:', error);
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                     <Link to="/admin" className="btn btn-outline-secondary"><i className="bi bi-arrow-left"></i> Back</Link>
                    <h2 className="mb-0 text-capitalize">{type}</h2>
                </div>
                {type !== 'support' && type !== 'users' && type !== 'bookings' && (
                  <Link to={`/admin/${type}/new`} className="btn btn-success">Add New <i className="bi bi-plus-lg"></i></Link>
                )}
            </div>
            
            {loading ? (
                 <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-dark table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                {type === 'flights' && <><th>Airline</th><th>Origin</th><th>Destination</th><th>Price</th><th>Departure</th></>}
                                {type === 'hotels' && <><th>Name</th><th>Location</th><th>Price/Night</th><th>Rating</th></>}
                                {type === 'buses' && <><th>Operator</th><th>Origin</th><th>Destination</th><th>Price</th><th>Departure</th></>}
                                {type === 'support' && <><th>Date</th><th>Name</th><th>Email</th><th>Subject</th><th>Message</th></>}
                                {type === 'users' && <><th>Name</th><th>Email</th><th>Role</th></>}
                                {type === 'bookings' && <><th>User</th><th>Service</th><th>Title</th><th>Date</th><th>Booked At</th></>}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                     {type === 'flights' && <><td>{item.airline}</td><td>{item.origin}</td><td>{item.destination}</td><td>${item.price}</td><td>{item.departure}</td></>}
                                     {type === 'hotels' && <><td>{item.name}</td><td>{item.location}</td><td>${item.price_per_night}</td><td>{item.rating}</td></>}
                                     {type === 'buses' && <><td>{item.operator}</td><td>{item.origin}</td><td>{item.destination}</td><td>${item.price}</td><td>{item.departure_time}</td></>}
                                     {type === 'support' && <><td>{item.date ? new Date(item.date).toLocaleDateString() : ''}</td><td>{item.name}</td><td>{item.email}</td><td>{item.subject}</td><td style={{maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{item.message}</td></>}
                                     {type === 'users' && <><td>{item.name}</td><td>{item.email}</td><td>{item.role}</td></>}
                                     {type === 'bookings' && <><td>{item.userEmail}</td><td className="text-capitalize">{item.serviceType}</td><td>{item.serviceTitle}</td><td>{item.date}</td><td>{item.bookedAt ? new Date(item.bookedAt).toLocaleDateString() : ''}</td></>}
                                    <td>
                                        <div className="d-flex gap-2">
                                            {type !== 'support' && type !== 'users' && type !== 'bookings' && <Link to={`/admin/${type}/edit/${item.id}`} className="btn btn-sm btn-primary">Edit</Link>}
                                            <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-danger">{type === 'support' || type === 'bookings' ? 'Clear' : 'Delete'}</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">No data found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const ManageForm = ({ type, mode }) => {
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const id = window.location.pathname.split('/').pop();

    useEffect(() => {
        if (mode === 'edit' && id !== 'new') {
            fetchItem();
        } else {
             let initialData = {};
             if(type === 'flights') setFormData({airline: '', origin: '', destination: '', price: '', departure: ''});
             if(type === 'hotels') setFormData({name: '', location: '', price_per_night: '', rating: '', image_url: ''});
             if(type === 'buses') setFormData({operator: '', origin: '', destination: '', price: '', departure_time: ''});
        }
    }, [type, mode]);

    const fetchItem = async () => {
         try {
            const response = await axios.get(`${API_URL}/${type}/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching item:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
             const payload = {...formData};
             if(payload.price) payload.price = parseFloat(payload.price);
             if(payload.price_per_night) payload.price_per_night = parseFloat(payload.price_per_night);
             if(payload.rating) payload.rating = parseFloat(payload.rating);

            if (mode === 'edit') {
                await axios.put(`${API_URL}/${type}/${id}`, payload);
            } else {
                 await axios.post(`${API_URL}/${type}`, payload);
            }
            navigate(`/admin/${type}`);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <div className="d-flex align-items-center gap-3 mb-4">
                 <Link to={`/admin/${type}`} className="btn btn-outline-secondary"><i className="bi bi-arrow-left"></i> Back</Link>
                 <h2 className="mb-0 text-capitalize">{mode === 'edit' ? 'Edit' : 'Add New'} {type.slice(0,-1)}</h2>
            </div>
            
            <div className="card bg-dark border-secondary">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {Object.keys(formData).filter(key => key !== 'id').map(key => (
                            <div className="mb-3" key={key}>
                                <label className="form-label text-capitalize">{key.replace('_', ' ')}</label>
                                <input
                                    type={key === 'departure' || key === 'departure_time' ? 'datetime-local' : key === 'price' || key === 'price_per_night' || key === 'rating' ? 'number' : 'text'}
                                    step="any"
                                    className="form-control bg-dark text-white border-secondary"
                                    name={key}
                                    value={formData[key] || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                        <div className="d-flex gap-2">
                             <button type="submit" className="btn btn-primary">Save Changes</button>
                             <Link to={`/admin/${type}`} className="btn btn-outline-light">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


function Admin() {
    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-dark)'}}>
           <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/flights" element={<ManageList type="flights" />} />
                <Route path="/flights/new" element={<ManageForm type="flights" mode="create" />} />
                <Route path="/flights/edit/:id" element={<ManageForm type="flights" mode="edit" />} />
                
                <Route path="/hotels" element={<ManageList type="hotels" />} />
                <Route path="/hotels/new" element={<ManageForm type="hotels" mode="create" />} />
                <Route path="/hotels/edit/:id" element={<ManageForm type="hotels" mode="edit" />} />
                
                <Route path="/buses" element={<ManageList type="buses" />} />
                <Route path="/buses/new" element={<ManageForm type="buses" mode="create" />} />
                <Route path="/buses/edit/:id" element={<ManageForm type="buses" mode="edit" />} />
                
                <Route path="/support" element={<ManageList type="support" />} />
                <Route path="/users" element={<ManageList type="users" />} />
                <Route path="/bookings" element={<ManageList type="bookings" />} />
            </Routes>
        </div>
    );
}

export default Admin;
