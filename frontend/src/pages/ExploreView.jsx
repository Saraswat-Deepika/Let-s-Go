import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import travelService from '../services/travelService';
import Card from '../components/Card';
import './Dashboard.css';

const ExploreView = () => {
    const { category } = useParams();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryPlaces = async () => {
            setLoading(true);
            const query = category === 'cities' ? 'tourist cities' : category;
            const data = await travelService.getPlaces('Mathura', query);
            setPlaces(data || []);
            setLoading(false);
        };
        fetchCategoryPlaces();
    }, [category]);

    return (
        <div className="dashboard-home explore-view">
            <div className="dashboard-content-header">
                <h1 style={{ textTransform: 'capitalize' }}>Explore {category}</h1>
                <p>Discovering the best {category} in Mathura region.</p>
            </div>

            {loading ? (
                <div className="loading">Searching for the best {category}...</div>
            ) : (
                <div className="recommended-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {places.length > 0 ? (
                        places.map(place => (
                            <Card
                                key={place.id}
                                title={place.name}
                                description={place.description}
                                image={place.image}
                                rating={place.rating}
                                price={place.price || 0}
                                category={place.category}
                                location={place.location}
                            />
                        ))
                    ) : (
                        <p>No results found for {category} in Mathura.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExploreView;
