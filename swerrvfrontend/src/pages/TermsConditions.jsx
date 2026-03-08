import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Legal.css';

const Section = ({ title, children }) => (
    <div className="legal-section">
        <h2 className="legal-h2">{title}</h2>
        {children}
    </div>
);

const TermsConditions = () => {
    const updated = '8 March 2026';

    return (
        <div className="legal-root">
            <div className="legal-container">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                    {/* Header */}
                    <div className="legal-header">
                        <p className="legal-breadcrumb"><Link to="/">Home</Link> / Terms &amp; Conditions</p>
                        <h1 className="legal-title">Terms &amp; Conditions</h1>
                        <p className="legal-meta">Last updated: {updated}</p>
                    </div>

                    <div className="legal-body">

                        <Section title="1. General Information">
                            <p>These Terms &amp; Conditions ("Terms") govern the purchase of goods from SWERRV ("we", "us", "our"), a clothing brand based in Lublin, Poland. By placing an order on our website, you agree to these Terms in full. These Terms are governed by Polish law and comply with:</p>
                            <ul className="legal-list">
                                <li>The Polish Civil Code (Kodeks cywilny) of 23 April 1964.</li>
                                <li>The Act of 30 May 2014 on Consumer Rights (Ustawa o prawach konsumenta), implementing EU Directive 2011/83/EU.</li>
                                <li>The Act of 18 July 2002 on Electronic Services (Ustawa o świadczeniu usług drogą elektroniczną).</li>
                                <li>Regulation (EU) 2016/679 (GDPR).</li>
                            </ul>
                        </Section>

                        <Section title="2. Eligibility">
                            <p>You must be at least 18 years old to place an order. By ordering, you confirm that the information you provide is accurate and complete.</p>
                        </Section>

                        <Section title="3. Products &amp; Availability">
                            <ul className="legal-list">
                                <li>All products are subject to availability. We reserve the right to limit quantities or discontinue products at any time.</li>
                                <li>Colours may appear slightly different due to monitor settings.</li>
                                <li>"Coming Soon" items are not yet available for purchase and serve informational purposes only.</li>
                                <li>We reserve the right to correct any pricing or typographical errors, even after an order has been placed.</li>
                            </ul>
                        </Section>

                        <Section title="4. Pricing &amp; Currency">
                            <ul className="legal-list">
                                <li>All prices are displayed in Polish Zloty (PLN) and are inclusive of applicable VAT.</li>
                                <li>There are <strong>no additional hidden fees or taxes</strong> added at checkout beyond the stated product price and any applicable shipping fee.</li>
                                <li>Prices may be updated at any time without prior notice. The price confirmed at the time of your order is final.</li>
                            </ul>
                        </Section>

                        <Section title="5. Shipping Policy">
                            <ul className="legal-list">
                                <li><strong>Lublin, Poland (local):</strong> Free shipping / local pickup. No shipping fee is charged.</li>
                                <li><strong>Outside Lublin:</strong> A flat-rate postal fee of <strong>8.99 zł</strong> applies, shipped via Poczta Polska or equivalent postal carrier.</li>
                                <li>We currently ship within Poland only. For international enquiries, contact us at <a href="mailto:support@swerrv.com">support@swerrv.com</a>.</li>
                                <li>Estimated delivery times are 2–7 working days after dispatch. SWERRV is not liable for postal delays beyond our control.</li>
                            </ul>
                        </Section>

                        <Section title="6. Payment">
                            <ul className="legal-list">
                                <li>Payments are processed securely via <strong>Stripe, Inc.</strong> We accept major debit and credit cards.</li>
                                <li>Your order is confirmed only after successful payment authorisation.</li>
                                <li>SWERRV does not store your full card details. All card data is handled exclusively by Stripe in accordance with PCI-DSS standards.</li>
                            </ul>
                        </Section>

                        <Section title="7. Right of Withdrawal (Consumer Right — EU Directive 2011/83/EU)">
                            <p>If you are a consumer (i.e. purchasing for personal, non-commercial use), you have the right to withdraw from your purchase <strong>within 14 calendar days</strong> of receiving your order, without giving any reason, in accordance with the Polish Act on Consumer Rights.</p>
                            <p><strong>Exceptions to the right of withdrawal:</strong></p>
                            <ul className="legal-list">
                                <li>Products that have been worn, washed, or had labels removed.</li>
                                <li>Sealed goods which are not suitable for return for hygiene reasons once unsealed.</li>
                                <li>Custom-made or personalised items.</li>
                            </ul>
                            <p>To exercise this right, contact us at <a href="mailto:support@swerrv.com">support@swerrv.com</a> before the 14-day period expires. We will provide return instructions. Return shipping costs are borne by the buyer unless the item is defective.</p>
                        </Section>

                        <Section title="8. Returns &amp; Refunds">
                            <ul className="legal-list">
                                <li>We accept returns within <strong>30 days</strong> of delivery for unworn, unwashed items with all original tags attached.</li>
                                <li>Refunds are processed to the original payment method within <strong>14 days</strong> of receiving the returned item.</li>
                                <li>If an item is defective or incorrect, we will cover return shipping costs and issue a full refund or replacement.</li>
                                <li>Sale or discounted items may be exchanged for store credit only, not cash refunds, unless defective.</li>
                            </ul>
                        </Section>

                        <Section title="9. Warranty &amp; Statutory Rights">
                            <p>Under Polish law (Art. 556 – 576 of the Civil Code), consumer goods carry a statutory 2-year warranty against defects (rękojmia). If your item is defective:</p>
                            <ul className="legal-list">
                                <li>Within the first 12 months of purchase: defects are presumed to have existed at the time of sale unless we prove otherwise.</li>
                                <li>You may request: repair, replacement, price reduction, or a full refund (if the defect is significant).</li>
                            </ul>
                        </Section>

                        <Section title="10. Intellectual Property">
                            <p>All content on this website — including logos, images, text, and designs — is the intellectual property of SWERRV. Unauthorised reproduction, distribution, or commercial use is prohibited. The SWERRV name and logo are protected marks.</p>
                        </Section>

                        <Section title="11. User Accounts">
                            <ul className="legal-list">
                                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                                <li>You must notify us immediately of any unauthorised use of your account.</li>
                                <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                            </ul>
                        </Section>

                        <Section title="12. Limitation of Liability">
                            <p>To the fullest extent permitted by Polish law, SWERRV's liability for any claim arising out of or related to a purchase is limited to the price paid for the relevant product. We are not liable for:</p>
                            <ul className="legal-list">
                                <li>Indirect, incidental, or consequential damages.</li>
                                <li>Delays caused by postal carriers or force majeure events (acts of God, strikes, government restrictions, etc.).</li>
                            </ul>
                            <p>Nothing in these Terms limits your statutory rights as a consumer under Polish or EU law.</p>
                        </Section>

                        <Section title="13. Governing Law &amp; Disputes">
                            <p>These Terms are governed by Polish law. Any disputes that cannot be resolved amicably may be referred to:</p>
                            <ul className="legal-list">
                                <li>The relevant court in Lublin, Poland.</li>
                                <li>The online dispute resolution platform of the European Commission: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.</li>
                                <li>The Trade Inspection authority (Inspekcja Handlowa) for out-of-court resolution.</li>
                            </ul>
                        </Section>

                        <Section title="14. Changes to These Terms">
                            <p>We reserve the right to update these Terms at any time. Changes take effect upon publication on this page. Continued use of our site after changes constitutes acceptance. We recommend reviewing this page periodically.</p>
                        </Section>

                        <Section title="15. Contact">
                            <div className="legal-infobox">
                                <p><strong>SWERRV</strong></p>
                                <p>Lublin, Poland</p>
                                <p>E-mail: <a href="mailto:support@swerrv.com">support@swerrv.com</a></p>
                            </div>
                        </Section>

                    </div>

                    <div className="legal-footer-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/cookie-policy">Cookie Policy</Link>
                        <Link to="/contact">Contact Us</Link>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default TermsConditions;
