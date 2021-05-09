import React, { useState, useEffect } from 'react';
import '../Styles/Home.css';
import logo from '../Styles/SimpleHouseLogo.png';
/*import 'bootstrap/dist/css/bootstrap.min.css';*/

export default function Home() {

    const [cycle, setCycle] = useState(0);

    // Rotate the home page picture every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCycle(cycle + 1);
        }, 10000);
        return () => clearInterval(interval);
    });

    return (
        <>
        <header className={`showcase${cycle % 3}`}>
            <div className="content">
                <img src={logo} className="logo" alt="SmartMove"/>
                    <div className="title">
                        SmartMove
                    </div>
                    <div className="text">
                        Moving Made for You
                    </div>
            </div>
        </header>

        </>
    )
}