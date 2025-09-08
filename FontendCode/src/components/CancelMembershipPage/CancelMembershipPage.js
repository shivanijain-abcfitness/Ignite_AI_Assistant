import React, { useState, useEffect } from 'react';

function CancelMembershipPage() {
    const [clubNumber, setClubNumber] = useState('');
    const [memberNumber, setMemberNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const response = await fetch(`/member/cancellation-info?clubNumber=${encodeURIComponent(clubNumber)}&memberNumber=${encodeURIComponent(memberNumber)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cancellation info');
            }
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelMembership = async () => {
        if (!result) return;
        const today = new Date();
        const cancelDate = today.toISOString().slice(0, 10);
        // Set cancelFeeDate to one day before cancelDate
        const cancelFeeDateObj = new Date(today);
        cancelFeeDateObj.setDate(cancelFeeDateObj.getDate() - 1);
        const cancelFeeDate = cancelFeeDateObj.toISOString().slice(0, 10);
        const payload = {
            clubNumber: clubNumber,
            memberNumber: memberNumber,
            subscription: result.subscriptions?.map(sub => ({
                numberOfPayments: String(sub.numberOfPaymentsLeft),
                subscriptionId: sub.subscriptionId,
                subscriptionItemName: sub.subscriptionItemName
            })) || [],
            cancelDate: cancelDate,
            cancelCode: 'AAA',
            cancellationCodeId: '11eb8885-b8cc-b47c-459fa717199e',
            adjustmentAmount: '0',
            cancelFeeYN: 'N',
            cancelFeeAmount: '5',
            cancelFeeDate: cancelDate,
            authorizedBy: 'testLocal',
            comment: 'request from local'
        };
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/member/rcm-cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData && errorData.errors && errorData.errors.length > 0) {
                    throw new Error(errorData.errors[0].message);
                }
                throw new Error('Failed to cancel membership');
            }
            alert('Membership cancelled successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: '40px auto', padding: 32, border: '1px solid #b0bec5', borderRadius: 16, background: 'linear-gradient(135deg, #f8fafc 60%, #e3f0ff 100%)', boxShadow: '0 4px 24px rgba(80,120,200,0.08)' }}>
            <h2 style={{ textAlign: 'center', color: '#1a237e', marginBottom: 32, letterSpacing: 1 }}>Cancel Membership</h2>
            <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto 32px', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(60,80,120,0.06)' }}>
                <div style={{ marginBottom: 20 }}>
                    <label htmlFor="clubNumber" style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#374151' }}>Club Number</label>
                    <input
                        id="clubNumber"
                        type="text"
                        value={clubNumber}
                        onChange={e => setClubNumber(e.target.value)}
                        style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #b0bec5', fontSize: 16, background: '#f7fafc' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: 20 }}>
                    <label htmlFor="memberNumber" style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#374151' }}>Member Number</label>
                    <input
                        id="memberNumber"
                        type="text"
                        value={memberNumber}
                        onChange={e => setMemberNumber(e.target.value)}
                        style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #b0bec5', fontSize: 16, background: '#f7fafc' }}
                        required
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px 0', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 18, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 2px 6px rgba(25,118,210,0.08)' }}>Get info</button>
            </form>
            {loading && <p style={{ textAlign: 'center', color: '#1976d2', fontWeight: 500 }}>Loading...</p>}
            {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 500 }}>{error}</p>}
            {result && (
                <div style={{ marginTop: 32 }}>
                    <h3 style={{ marginBottom: 16, color: '#263238', letterSpacing: 1 }}>Account Summary</h3>
                    <div style={{ display: 'flex', gap: 32, marginBottom: 24, flexWrap: 'wrap' }}>
                        <div style={{ background: '#e3f7e3', padding: 24, borderRadius: 12, flex: '1 1 220px', minWidth: 220, boxShadow: '0 1px 4px rgba(46,125,50,0.06)' }}>
                            <div style={{ fontWeight: 600, color: '#2e7d32', marginBottom: 6 }}>Amount Due</div>
                            <div style={{ fontSize: 28, fontWeight: 700 }}>${result.amountDue?.toFixed(2) ?? '0.00'}</div>
                        </div>
                        <div style={{ background: '#e3eaf7', padding: 24, borderRadius: 12, flex: '1 1 220px', minWidth: 220, boxShadow: '0 1px 4px rgba(21,101,192,0.06)' }}>
                            <div style={{ fontWeight: 600, color: '#1565c0', marginBottom: 6 }}>Status</div>
                            <div style={{ fontSize: 24, fontWeight: 700 }}>{result.status}</div>
                        </div>
                    </div>
                    <h4 style={{ margin: '24px 0 12px', color: '#1a237e' }}>Subscriptions</h4>
                    <div style={{ overflowX: 'auto', borderRadius: 10, boxShadow: '0 1px 6px rgba(60,80,120,0.06)' }}>
                        <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden' }}>
                            <thead>
                                <tr style={{ background: '#f0f4f8' }}>
                                    <th style={{ padding: 12, border: '1px solid #e0e0e0', fontWeight: 600, color: '#374151' }}>Name</th>
                                    <th style={{ padding: 12, border: '1px solid #e0e0e0', fontWeight: 600, color: '#374151' }}>Type</th>
                                    <th style={{ padding: 12, border: '1px solid #e0e0e0', fontWeight: 600, color: '#374151' }}>Status</th>
                                    <th style={{ padding: 12, border: '1px solid #e0e0e0', fontWeight: 600, color: '#374151' }}>Price</th>
                                    <th style={{ padding: 12, border: '1px solid #e0e0e0', fontWeight: 600, color: '#374151' }}>Payments Left</th>
                                    <th style={{ padding: 12, border: '1px solid #e0e0e0', fontWeight: 600, color: '#374151' }}>Most Recent Invoice</th>
                                    <th style={{ padding: 12, border: '1px solid #e0e0e0', fontWeight: 600, color: '#374151' }}>Final Invoice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.subscriptions?.length ? result.subscriptions.map((sub) => (
                                    <tr key={sub.subscriptionId} style={{ background: '#f9fafb', transition: 'background 0.2s' }}>
                                        <td style={{ padding: 12, border: '1px solid #e0e0e0' }}>{sub.subscriptionItemName}</td>
                                        <td style={{ padding: 12, border: '1px solid #e0e0e0' }}>{sub.subType}</td>
                                        <td style={{ padding: 12, border: '1px solid #e0e0e0' }}>{sub.status}</td>
                                        <td style={{ padding: 12, border: '1px solid #e0e0e0' }}>${sub.itemPrice?.toFixed(2)}</td>
                                        <td style={{ padding: 12, border: '1px solid #e0e0e0' }}>{sub.numberOfPaymentsLeft}</td>
                                        <td style={{ padding: 12, border: '1px solid #e0e0e0' }}>{sub.mostRecentInvoiceDate}</td>
                                        <td style={{ padding: 12, border: '1px solid #e0e0e0' }}>{sub.finalInvoiceDate ?? '-'}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: 16 }}>No subscriptions found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 36 }}>
                        <button
                            style={{
                                padding: '12px 40px',
                                background: '#d32f2f',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                fontWeight: 700,
                                fontSize: 20,
                                letterSpacing: 1,
                                cursor: loading || !(result && result.subscriptions && result.subscriptions.length > 0) ? 'not-allowed' : 'pointer',
                                boxShadow: '0 2px 8px rgba(211,47,47,0.08)',
                                opacity: loading || !(result && result.subscriptions && result.subscriptions.length > 0) ? 0.5 : 1
                            }}
                            onClick={handleCancelMembership}
                            type="button"
                            disabled={loading || !(result && result.subscriptions && result.subscriptions.length > 0)}
                        >
                            Cancel Membership
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CancelMembershipPage;
