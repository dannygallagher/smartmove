import React, { useState } from 'react';
import '../Styles/Home.css';
import logo from '../Styles/SimpleHouseLogo.png';
/*import 'bootstrap/dist/css/bootstrap.min.css';*/

export default function Home() {

    return (
        <>
        <header className="showcase">
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