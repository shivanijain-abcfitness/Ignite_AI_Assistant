// src/components/HelpLandingPage.js
import React, { useState } from 'react';
import './HelpLandingPage.css';
import { useNavigate } from 'react-router-dom';
import ChatApp from "../ChatBot/ChatBot";

const topics = [
    { title: 'Getting Started', description: 'Learn how to begin using our platform.' },
    { title: 'Account Management', description: 'Manage your account settings and preferences.' },
    { title: 'Billing', description: 'Find answers to billing and payment questions.' },
    { title: 'Technical Support', description: 'Get help with technical issues.' },
    // Add more topics as needed
];

function HelpLandingPage() {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);


    const handleCancelClick = () => {
        navigate('/cancel-membership');
    };
    const handleFreezeClick = () => {
        navigate('/freeze');
    };

    return (
        <div className="foundation-wrap off-canvas-wrapper">
            <div className="off-canvas-wrapper-inner" data-off-canvas-wrapper="">
                <aside className="off-canvas position-right" role="navigation" id="offCanvas" data-off-canvas="3ipkwx-off-canvas" data-position="right" data-mc-ignore="true"
                       aria-hidden="true">
                </aside>
                <div className="floating-chat-container">
                    <button
                        className="floating-chat-btn"
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        aria-label="Open chat"
                    >
                        <img src="/abcignite_LOGO.svg" alt="Chat bot" style={{ width: '50px', height: '50px' }} />
                    </button>
                    <div className="floating-chat-label">Ignite AI assistant</div>
                </div>

                {isChatOpen && (
                    <div className="chat-window">
                        <ChatApp onClose={() => setIsChatOpen(false)} />
                    </div>
                )}
                <div className="off-canvas-content inner-wrap" data-off-canvas-content="">
                    <div>
                        <nav className="title-bar tab-bar" role="banner" data-mc-ignore="true"><a className="skip-to-content fluid-skip showOnFocus" href="#mc-main-content">Skip
                            To Main Content</a>
                            <div className="middle title-bar-section outer-row clearfix">
                                <div className="menu-icon-container relative clearfix">

                                </div>
                            </div>
                            <div className="title-bar-layout outer-row">
                                <div className="logo-wrapper"><a className="logo selected" href="#"><img src="Skins/Default/Stylesheets/Images/transparent.gif" alt="Home"
                                                                                                         className="invisible-label"/></a>
                                </div>

                                <div className="central-account-wrapper">
                                    <div className="central-dropdown"><a className="central-account-drop"><span className="central-account-image"></span><span
                                        className="central-account-text">Account</span></a>
                                        <div className="central-dropdown-content"><a className="MCCentralLink central-dropdown-content-settings">Settings</a>
                                            <hr className="central-separator"/>
                                            <a className="MCCentralLink central-dropdown-content-logout">Logout</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="nav-search-wrapper">
                                    <div className="nav-search row">
                                        <form className="search" action="#">
                                            <div className="search-bar search-bar-container needs-pie">
                                                <input className="search-field needs-pie" type="search" aria-label="Search Field" placeholder="Search"/>
                                                <div className="search-filter-wrapper"><span className="invisible-label" id="search-filters-label">Filter: </span>
                                                    <div className="search-filter" aria-haspopup="true" aria-controls="sf-content" aria-expanded="false"
                                                         aria-label="Search Filter" title="All Files" role="button" tabIndex="0">
                                                    </div>
                                                    <div className="search-filter-content" id="sf-content">
                                                        <ul>
                                                            <li>
                                                                <button className="mc-dropdown-item" aria-labelledby="search-filters-label filterSelectorLabel-00001"><span
                                                                    id="filterSelectorLabel-00001">All Files</span>
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="search-submit-wrapper" dir="ltr">
                                                    <div className="search-submit" title="Search" role="button" tabIndex="0"><span
                                                        className="invisible-label">Submit Search</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                    <div className="main-section">
                        <div className="row outer-row sidenav-layout">

                            <div className="body-container">
                                <div data-mc-content-body="True" className="height-container" >
                                    <div id="contentBody" className="off-canvas-main">
                                        <div role="main" id="mc-main-content">
                                            <div className="topichero topichero-external">
                                                <div className="title-text">
                                                    <div className="small-12 small-centered columns centered-text">
                                                        <h1 className="whiteheader" style={{textAlign: "center"}}>Need Answers?</h1>
                                                        <h3 className="abcgray" style={{textAlign: "center"}}>Let us help!</h3>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="content-section" className="mc-blurb">
                                                <div className="row outer-row">
                                                    <div className="left-section small-12 medium-7 columns">
                                                        <div className="left-content">
                                                            <p className="title">Learn at Your Own Pace</p>
                                                            <p>At ABC Fitness, we create help documentation and videos with you and your club in mind. You need quick and easy
                                                                answers, allowing our software to work for you. </p>
                                                            <p>To begin, select a product from the top menu. All the answers you need are right here in one place!</p>
                                                            <h3>IGNITE Help</h3>
                                                            <p>For <a href="https://help.abcfitness.com/ignite/home.htm" target="_blank">IGNITE help</a>, go to the menu at the
                                                                top of this page and select <strong>IGNITE</strong>.</p>
                                                        </div>
                                                    </div>
                                                    <div className="right-section small-12 medium-5 end columns">
                                                        <div className="right-content">
                                                            <div>
                                                                <h3>Need Assistance?</h3>
                                                                <p><strong>Technical Support:</strong>
                                                                    <br/>877-222-5767<br/><a href="mailto:help@abcfitness.com?subject=Technical Support Inquiry"
                                                                                             xmlns="http://www.w3.org/1999/xhtml">help@abcfitness.com</a>.</p>
                                                                <p>&nbsp;</p>
                                                                <p><strong>Client Services:</strong>
                                                                    <br/>888-622-6290<br/><a href="mailto:clientservices@abcfitness.com">clientservices@abcfitness.com</a></p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="right-section small-12 medium-5 end columns">
                                                        <div className="right-content">
                                                            <div>
                                                                <h3>Self Assistance?</h3>

                                                                <button style={{ marginRight: '5px' }} onClick={handleCancelClick}>
                                                                    Cancel Membership
                                                                </button>
                                                                <button onClick={handleFreezeClick}>Freeze Membership</button>

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="footer">
                                            <div className="footer-logo">
                                                <img src="Resources/Images/abc-corporate-white.png" alt=""/>
                                            </div>
                                            <div className="footer">© <span className="mc-variable _2017DocT-GeneralAndProduct.2017DocT-CurrentYearVariable variable">2023</span>
                                                <span className="mc-variable _2017DocT-GeneralAndProduct.2017DocT-CompanyName variable">ABC Fitness Solutions</span>. To learn
                                                more about ABC Fitness, visit <a href="http://www.abcfinancial.com/" target="_blank" style={{color:"white"}}
                                                                                 alt="Open the ABC Fitness website in a new window or tab."
                                                                                 title="Open the ABC Fitness website in a new window or tab.">abcfitness.com</a>.
                                            </div>
                                        </div>
                                    </div>

                                    <script src="https://help.abcfitness.com/js/masthead-menu/2topmenu-external.js">
                                    </script>

                                    <script async="async" src="https://www.googletagmanager.com/gtag/js?id=UA-39436504-1">
                                    </script>

                                </div>
                            </div>
                        </div>
                    </div>
                    <a data-close="true"></a>
                    <div className="js-off-canvas-exit"></div>
                </div>
            </div>


        </div>

    );
}

export default HelpLandingPage;