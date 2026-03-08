import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './CookieBanner.css';

const COOKIE_KEY = 'swerrv_cookie_consent';

const CookieBanner = () => {
    const [visible, setVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

    useEffect(() => {
        const saved = localStorage.getItem(COOKIE_KEY);
        if (!saved) setVisible(true);
    }, []);

    const save = (consent) => {
        localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...consent, timestamp: Date.now() }));
        setVisible(false);
    };

    const acceptAll = () => save({ necessary: true, analytics: true, marketing: true });
    const rejectOptional = () => save({ necessary: true, analytics: false, marketing: false });
    const savePrefs = () => save({ necessary: true, ...prefs });

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="cookie-banner"
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '110%', opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    role="dialog"
                    aria-label="Cookie consent"
                    aria-modal="true"
                >
                    <div className="cookie-banner__inner">
                        <div className="cookie-banner__text">
                            <p className="cookie-banner__title"> We use cookies</p>
                            <p className="cookie-banner__desc">
                                We use strictly necessary cookies to operate this site. With your consent, we also use analytics cookies to improve your experience.
                                No data is sold to third parties.{' '}
                                <Link to="/privacy" className="cookie-banner__link">Privacy Policy</Link>
                                {' '}·{' '}
                                <Link to="/cookie-policy" className="cookie-banner__link">Cookie Policy</Link>
                            </p>
                        </div>

                        {/* Preference toggles */}
                        <AnimatePresence>
                            {showDetails && (
                                <motion.div
                                    className="cookie-banner__prefs"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {[
                                        { key: 'necessary', label: 'Strictly Necessary', desc: 'Required for the site to function. Cannot be disabled.', locked: true },
                                        { key: 'analytics', label: 'Analytics', desc: 'Help us understand how visitors use the site.', locked: false },
                                        { key: 'marketing', label: 'Marketing', desc: 'Used to personalise ads and content.', locked: false },
                                    ].map(({ key, label, desc, locked }) => (
                                        <div key={key} className="cookie-banner__pref-row">
                                            <div className="cookie-banner__pref-info">
                                                <p className="cookie-banner__pref-label">{label}</p>
                                                <p className="cookie-banner__pref-desc">{desc}</p>
                                            </div>
                                            <label className={`cookie-toggle ${locked ? 'cookie-toggle--locked' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={locked || prefs[key]}
                                                    disabled={locked}
                                                    onChange={() => !locked && setPrefs(p => ({ ...p, [key]: !p[key] }))}
                                                />
                                                <span className="cookie-toggle__track" />
                                            </label>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="cookie-banner__actions">
                            <button className="cookie-btn cookie-btn--ghost" onClick={() => setShowDetails(d => !d)}>
                                {showDetails ? 'Hide options' : 'Manage preferences'}
                            </button>
                            {showDetails ? (
                                <button className="cookie-btn cookie-btn--secondary" onClick={savePrefs}>Save my choices</button>
                            ) : (
                                <button className="cookie-btn cookie-btn--secondary" onClick={rejectOptional}>Reject optional</button>
                            )}
                            <button className="cookie-btn cookie-btn--primary" onClick={acceptAll}>Accept all</button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
