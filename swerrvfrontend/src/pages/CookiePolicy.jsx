import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Legal.css';

const Section = ({ title, children }) => (
    <div className="legal-section">
        <h2 className="legal-h2">{title}</h2>
        {children}
    </div>
);

const CookiePolicy = () => {
    const updated = '8 March 2026';
    return (
        <div className="legal-root">
            <div className="legal-container">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                    <div className="legal-header">
                        <p className="legal-breadcrumb"><Link to="/">Home</Link> / Cookie Policy</p>
                        <h1 className="legal-title">Cookie Policy</h1>
                        <p className="legal-meta">Last updated: {updated}</p>
                    </div>

                    <div className="legal-body">

                        <Section title="1. What Are Cookies?">
                            <p>Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences and improve your experience. This policy explains what cookies SWERRV uses and how you can control them.</p>
                        </Section>

                        <Section title="2. Types of Cookies We Use">
                            <ul className="legal-list">
                                <li>
                                    <strong>Strictly Necessary Cookies</strong> — These are essential for the site to function. They include session tokens for authentication and shopping cart data. These cookies cannot be disabled. Legal basis: contract performance (GDPR Art. 6(1)(b)) and legitimate interest (Art. 6(1)(f)).
                                </li>
                                <li>
                                    <strong>Analytics Cookies</strong> — With your consent, we may use analytics tools (e.g. aggregated page-view data) to understand how visitors use our site and improve its performance. Legal basis: consent (GDPR Art. 6(1)(a)).
                                </li>
                                <li>
                                    <strong>Marketing / Preference Cookies</strong> — With your consent, these cookies remember your colour, size, and language preferences and may assist with personalised experiences. Legal basis: consent (GDPR Art. 6(1)(a)).
                                </li>
                            </ul>
                        </Section>

                        <Section title="3. Specific Cookies Used">
                            <table className="cookie-table">
                                <thead>
                                    <tr>
                                        <th>Cookie Name</th>
                                        <th>Purpose</th>
                                        <th>Duration</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>swerrv_cookie_consent</td><td>Stores your cookie preferences</td><td>1 year</td><td>Necessary</td></tr>
                                    <tr><td>access_token (localStorage)</td><td>Keeps you logged in</td><td>Session</td><td>Necessary</td></tr>
                                    <tr><td>swerrv_cart (localStorage)</td><td>Saves your shopping bag</td><td>Session</td><td>Necessary</td></tr>
                                    <tr><td>swerrv_currency</td><td>Remembers your currency preference</td><td>30 days</td><td>Preference</td></tr>
                                </tbody>
                            </table>
                        </Section>

                        <Section title="4. Third-Party Cookies">
                            <p>Our payment provider, <strong>Stripe</strong>, may set cookies or use local storage on the payment page for fraud prevention and security purposes. These are governed by Stripe's own <a href="https://stripe.com/cookies-policy/legal" target="_blank" rel="noopener noreferrer">Cookie Policy</a>.</p>
                            <p>We also load Google Fonts for typography purposes. This may result in a connection to Google's servers but does not set tracking cookies on your behalf.</p>
                        </Section>

                        <Section title="5. How to Control Cookies">
                            <p>You can manage your cookie preferences at any time by clicking <strong>"Manage preferences"</strong> on the cookie banner. Additionally, most browsers allow you to block or delete cookies via their settings:</p>
                            <ul className="legal-list">
                                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                                <li><a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
                                <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                            </ul>
                            <p>Note: disabling strictly necessary cookies may prevent the site from functioning correctly.</p>
                        </Section>

                        <Section title="6. Legal Basis &amp; Your Rights">
                            <p>We only use optional cookies with your freely given, specific, informed consent, as required by GDPR Art. 6(1)(a) and the Polish Telecommunications Act (Prawo telekomunikacyjne) which implements the EU ePrivacy Directive.</p>
                            <p>You may withdraw consent at any time by revisiting the cookie banner or deleting the <code>swerrv_cookie_consent</code> item from your browser's local storage.</p>
                        </Section>

                        <Section title="7. Changes to This Policy">
                            <p>We may update this Cookie Policy when we add or remove cookies. The date above indicates the latest revision. Continued use of the site after changes constitutes acceptance.</p>
                        </Section>

                        <Section title="8. Contact">
                            <div className="legal-infobox">
                                <p><strong>SWERRV</strong> — Lublin, Poland</p>
                                <p>E-mail: <a href="mailto:support@swerrv.com">support@swerrv.com</a></p>
                            </div>
                        </Section>

                    </div>

                    <div className="legal-footer-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms &amp; Conditions</Link>
                        <Link to="/contact">Contact Us</Link>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default CookiePolicy;
