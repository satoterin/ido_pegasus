import React, { Component } from 'react';

import Header from '../components/Header/Header';
import MyPage from '../Market/MyPage';
import Footer from '../components/Footer/Footer';


class Activity extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <MyPage />
                <Footer />
            </div>
        );
    }
}

export default Activity;