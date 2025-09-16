import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Home.css';

function Home() {
    const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth0();
    const [randomMeal, setRandomMeal] = useState(null);
    const [isMealLoading, setIsMealLoading] = useState(true);
    useEffect(() => {
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(response => response.json())
            .then(data => {
                setRandomMeal(data.meals[0]);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setIsMealLoading(false);
            });
    }, []);
    return (
        <div className="home-container">
            <header className="home-header">
                {isAuthLoading ? (
                    <div className="login-button">Loading...</div>
                ) : isAuthenticated ? (
                    <div className="user-info">
                        <span style={{ marginRight: '15px', color: '#333' }}>
                            Welcome, {user.name}!
                        </span>
                        <button 
                            className="login-button" 
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                        >
                            Log Out
                        </button>
                    </div>
                ) : (
                    <Link to='/login' className="login-button">
                        Login / Register
                    </Link>
                )}
            </header>

            <main className="home-content">
                <h1 className="platform-title">
                    Food Donation <br /> Platform
                </h1>
            </main>

            <div className="food-fact-container">
                <h3>Food for Thought</h3>
                
                {isMealLoading ? ( 
                    <p>Fetching inspiration...</p>
                ) : randomMeal ? (
                    <div className="meal-item">
                        <img src={randomMeal.strMealThumb} alt={randomMeal.strMeal} />
                        <h4>{randomMeal.strMeal}</h4>
                        <p>Category: <span>{randomMeal.strCategory}</span></p>
                    </div>
                ) : (
                    <p>Could not load inspiration. Please try again later.</p>
                )}
            </div>
        </div>
    );
}

export default Home;