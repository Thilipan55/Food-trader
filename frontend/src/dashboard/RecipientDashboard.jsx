import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import DonationCard from './DonationCard';
import './Dashboard.css';

const RecipientDashboard = () => {
    const { user } = useAuth0();
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/donations');
                if (!response.ok) {
                    throw new Error('Failed to fetch donations');
                }
                const data = await response.json();
                setDonations(data);
            } catch (error) {
                setMessage('Error fetching donations. Please try again.');
                console.error('Donation fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDonations();
    }, []);

    const handleOrder = async (donationId) => {
        setMessage('');
        try {
            const response = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipientId: user.sub, donationId }),
            });

            if (!response.ok) {
                throw new Error('Failed to order item');
            }

            // Optimistically remove the item from the UI after a successful order
            setDonations(prevDonations => prevDonations.filter(d => d.id !== donationId));
            setMessage('Item ordered successfully!');
        } catch (error) {
            setMessage('Error ordering item. Please try again.');
            console.error('Order error:', error);
        }
    };

    if (isLoading) {
        return <div className="dashboard-container">Loading donations...</div>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Recipient Dashboard</h1>
            </header>

            {message && <p style={{ textAlign: 'center', margin: '1rem', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}

            {donations.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>No food donations available at the moment.</p>
            ) : (
                <div className="donations-grid">
                    {donations.map(donation => (
                        <div className="donation-card" key={donation.id}>
                            <div className="card-info">
                                <h3>{donation.foodName}</h3>
                                <p>Category: <span>{donation.category}</span></p>
                                <p>Quantity: <span>{donation.quantity}</span></p>
                                <p>Pickup: <span>{donation.location}</span></p> 
                                <button className="order-button" onClick={() => handleOrder(donation.id)}>
                                    Order Item
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipientDashboard;