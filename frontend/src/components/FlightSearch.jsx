import React, { useState } from 'react';
import travelService from '../services/travelService';
import Button from './Button';
import './Card.css'; // Reusing card styles for results

const FlightSearch = () => {
    const [query, setQuery] = useState({
        origin: '',
        destination: '',
        date: ''
    });
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        const results = await travelService.getFlights(query.origin, query.destination, query.date);
        setFlights(results || []);
        setLoading(false);
    };

    return (
        <div className="flight-search">
            <h1>✈️ Flight Search</h1>
            <p>Search for real-time flights powered by Amadeus</p>

            <form className="search-form" onSubmit={handleSearch} style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                marginBottom: '32px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                alignItems: 'end'
            }}>
                <div className="form-group">
                    <label>Origin (IATA)</label>
                    <input
                        type="text"
                        placeholder="e.g. DEL"
                        value={query.origin}
                        onChange={(e) => setQuery({ ...query, origin: e.target.value.toUpperCase() })}
                        required
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }}
                    />
                </div>
                <div className="form-group">
                    <label>Destination (IATA)</label>
                    <input
                        type="text"
                        placeholder="e.g. BOM"
                        value={query.destination}
                        onChange={(e) => setQuery({ ...query, destination: e.target.value.toUpperCase() })}
                        required
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }}
                    />
                </div>
                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        value={query.date}
                        onChange={(e) => setQuery({ ...query, date: e.target.value })}
                        required
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }}
                    />
                </div>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search Flights'}
                </Button>
            </form>

            <div className="flights-results">
                {loading ? (
                    <div className="loading">Searching for best offers...</div>
                ) : (
                    <div className="results-list" style={{ display: 'grid', gap: '16px' }}>
                        {flights.length > 0 ? (
                            flights.map(flight => (
                                <div key={flight.id} className="flight-card" style={{
                                    background: 'white',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    <div className="airline-info">
                                        <h3 style={{ margin: 0 }}>{flight.airline} {flight.flightNumber}</h3>
                                        <p style={{ color: '#6b7280', margin: '4px 0 0' }}>Duration: {flight.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm')}</p>
                                    </div>
                                    <div className="flight-times" style={{ textAlign: 'center' }}>
                                        <div style={{ fontWeight: 600 }}>{new Date(flight.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>➔</div>
                                        <div style={{ fontWeight: 600 }}>{new Date(flight.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                    <div className="flight-price" style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 700 }}>{flight.currency} {flight.price}</div>
                                        <Button variant="secondary" size="small">Book Now</Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#6b7280' }}>No flights found. Try DEL to BOM with a future date.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightSearch;
