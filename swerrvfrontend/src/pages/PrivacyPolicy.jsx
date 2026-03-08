import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Legal.css';

const Section = ({ title, children }) => (
    <div className="legal-section">
        <h2 className="legal-h2">{title}</h2>
        {children}
    </div>
);

const PrivacyPolicy = () => {
    const updated = '8 March 2026';

    return (
        <div className="legal-root">
            <div className="legal-container">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                    {/* Header */}
                    <div className="legal-header">
                        <p className="legal-breadcrumb"><Link to="/">Home</Link> / Privacy Policy</p>
                        <h1 className="legal-title">Privacy Policy</h1>
                        <p className="legal-meta">Last updated: {updated}</p>
                    </div>

                    <div className="legal-body">

                        <Section title="1. Data Controller">
                            <p>The controller of your personal data within the meaning of Regulation (EU) 2016/679 (GDPR) is:</p>
                            <div className="legal-infobox">
                                <p><strong>SWERRV</strong></p>
                                <p>Lublin, Poland</p>
                                <p>E-mail: <a href="mailto:support@swerrv.com">support@swerrv.com</a></p>
                            </div>
                        </Section>

                        <Section title="2. Data We Collect">
                            <p>We collect and process the following categories of personal data:</p>
                            <ul className="legal-list">
                                <li><strong>Account data</strong> – name, e-mail address, password (hashed), account preferences.</li>
                                <li><strong>Order &amp; transaction data</strong> – shipping address, order history, payment confirmation records (we do <em>not</em> store full card numbers; payments are handled by Stripe).</li>
                                <li><strong>Communication data</strong> – messages you send us via our contact form.</li>
                                <li><strong>Technical data</strong> – IP address, browser type, device information, cookies and similar tracking technologies (see Section 7).</li>
                                <li><strong>Marketing data</strong> – e-mail address and preferences if you sign up for our newsletter (opt-in only).</li>
                            </ul>
                        </Section>

                        <Section title="3. Legal Bases for Processing (GDPR Art. 6)">
                            <ul className="legal-list">
                                <li><strong>Contract performance (Art. 6(1)(b))</strong> – processing necessary to fulfil your order and provide our services.</li>
                                <li><strong>Legal obligation (Art. 6(1)(c))</strong> – processing required by Polish and EU law (e.g. tax and accounting records).</li>
                                <li><strong>Legitimate interests (Art. 6(1)(f))</strong> – fraud prevention, security, and improving our store.</li>
                                <li><strong>Consent (Art. 6(1)(a))</strong> – newsletter subscriptions and optional cookies. You may withdraw consent at any time.</li>
                            </ul>
                        </Section>

                        <Section title="4. How We Use Your Data">
                            <ul className="legal-list">
                                <li>Processing and fulfilling your orders (including postal shipping).</li>
                                <li>Sending order confirmations and shipping notifications.</li>
                                <li>Customer support and responding to enquiries.</li>
                                <li>Preventing fraud and ensuring account security.</li>
                                <li>Sending marketing communications (only with your consent; unsubscribe at any time).</li>
                                <li>Complying with legal/regulatory obligations under Polish law and EU directives.</li>
                            </ul>
                        </Section>

                        <Section title="5. Data Sharing &amp; Third-Party Processors">
                            <p>We do not sell your data. We share it only with trusted processors under GDPR-compliant Data Processing Agreements:</p>
                            <ul className="legal-list">
                                <li><strong>Stripe, Inc.</strong> – payment processing. Stripe may transfer data internationally under Standard Contractual Clauses. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>.</li>
                                <li><strong>Poczta Polska / postal carriers</strong> – your name and delivery address are shared for order fulfilment.</li>
                                <li><strong>Vercel / Railway</strong> – our hosting and infrastructure providers located in the EU where possible.</li>
                                <li><strong>Legal authorities</strong> – if required by Polish law or a valid court order.</li>
                            </ul>
                        </Section>

                        <Section title="6. Data Retention">
                            <ul className="legal-list">
                                <li><strong>Order &amp; accounting records</strong> – retained for 5 years as required by the Polish Accounting Act (Ustawa o rachunkowości).</li>
                                <li><strong>Account data</strong> – retained while your account is active; deleted within 30 days of account closure upon request.</li>
                                <li><strong>Marketing data</strong> – retained until you withdraw consent.</li>
                                <li><strong>Technical / log data</strong> – retained for up to 12 months.</li>
                            </ul>
                        </Section>

                        <Section title="7. Cookies">
                            <p>We use strictly necessary cookies to operate the site (e.g. session tokens) and, with your consent, analytical cookies to improve user experience. You can manage cookie preferences via your browser settings. Full cookie details are available in our <Link to="/cookie-policy">Cookie Policy</Link>.</p>
                        </Section>

                        <Section title="8. Your Rights Under GDPR">
                            <p>As a data subject you have the right to:</p>
                            <ul className="legal-list">
                                <li><strong>Access</strong> – obtain a copy of your personal data (Art. 15).</li>
                                <li><strong>Rectification</strong> – correct inaccurate data (Art. 16).</li>
                                <li><strong>Erasure ("right to be forgotten")</strong> – have your data deleted, subject to legal retention requirements (Art. 17).</li>
                                <li><strong>Restriction</strong> – limit how we process your data (Art. 18).</li>
                                <li><strong>Data portability</strong> – receive your data in a machine-readable format (Art. 20).</li>
                                <li><strong>Objection</strong> – object to processing based on legitimate interests (Art. 21).</li>
                                <li><strong>Withdraw consent</strong> – at any time, without affecting the lawfulness of prior processing.</li>
                            </ul>
                            <p>To exercise any right, contact us at <a href="mailto:support@swerrv.com">support@swerrv.com</a>. We will respond within 30 days.</p>
                            <p>You also have the right to lodge a complaint with the Polish supervisory authority: <strong>Urząd Ochrony Danych Osobowych (UODO)</strong>, ul. Stawki 2, 00-193 Warsaw — <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer">uodo.gov.pl</a>.</p>
                        </Section>

                        <Section title="9. Data Security">
                            <p>We implement appropriate technical and organisational measures to protect your data, including HTTPS encryption, hashed password storage, and access controls. In the event of a data breach affecting your rights, we will notify you and the UODO as required by GDPR Art. 33–34.</p>
                        </Section>

                        <Section title="10. Changes to This Policy">
                            <p>We may update this policy to reflect changes in our practices or applicable law. Material changes will be communicated via e-mail or a prominent notice on our site. The date at the top of this page indicates when the policy was last revised.</p>
                        </Section>

                    </div>

                    <div className="legal-footer-links">
                        <Link to="/terms">Terms &amp; Conditions</Link>
                        <Link to="/cookie-policy">Cookie Policy</Link>
                        <Link to="/contact">Contact Us</Link>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
