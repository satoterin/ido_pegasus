import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Market from '../Market/Market';
import Footer from '../components/Footer/Footer';


class MarketLayout extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Market />
                <Footer />
            </div>
        );
    }
}

export default MarketLayout;