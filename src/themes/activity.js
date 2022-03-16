import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';

import Activities from '../components/Activity/Activity';
import ModalMenu from '../components/Modal/ModalMenu';


import Auctions from '../components/Auctions/AuctionsOne';
import TopSeller from '../components/TopSeller/TopSellerOne';
import Collections from '../components/Collections/Collections';
import Explore from '../components/Explore/ExploreOne';
import Footer from '../components/Footer/Footer';
import ModalSearch from '../components/Modal/ModalSearch';
import Scrollup from '../components/Scrollup/Scrollup';
import Card from '../Market/Card'


class Activity extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Card />
            </div>
        );
    }
}

export default Activity;