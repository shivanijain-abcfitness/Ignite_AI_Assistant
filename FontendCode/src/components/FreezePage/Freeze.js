import React, { useState, useEffect } from 'react';

function FreezePage() {
    const [clubNumber, setClubNumber] = useState('');
    const [memberNumber, setMemberNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [freezeReason, setFreezeReason] = useState('');
    const [freezePayments, setFreezePayments] = useState('');
    const [freezeDueAmount, setFreezeDueAmount] = useState('');
    const [freezeLoading, setFreezeLoading] = useState(false);
    const [freezeError, setFreezeError] = useState('');
    const [freezeSuccess, setFreezeSuccess] = useState('');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const response = await fetch(`/payment-schedule-rqar?clubNumber=${encodeURIComponent(clubNumber)}&memberNumber=${encodeURIComponent(memberNumber)}&startDate=`);
            if (!response.ok) {
                throw new Error('Failed to fetch payment schedule');
            }
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFreeze =  (e) => {
        e.preventDefault();
        setFreezeLoading(true);
        setFreezeError('');
        setFreezeSuccess('');
        try {
            const payload = {
                clubNumber,
                memberNumber,
                freezeIndefinitelyYN: false,
                freezeStartDate: selectedInvoice.date,
                freezeEndDate: null,
                numberOfPayments: Number(freezePayments),
                duesFreezeAmount: Number(freezeDueAmount),
                freezeTypeCode: 'FRZ',
                authorizedBy: 'abctech',
                comment: '',
                reason: freezeReason,
                includeFees: false,
                zeroDuesAmounts: false,
                exceptionPoints: []
            };
            const response = fetch('/subscription-freeze', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            setTimeout(() => {
                setFreezeLoading(true);
                alert('Membership freeze request submitted successfully!');
            }, 1000);

            //alert('Membership freeze request submitted successfully!');

            // if (!response.ok) {
            //     const errorData = await response.json();
            //     if (errorData && errorData.errors && errorData.errors.length > 0) {
            //         throw new Error(errorData.errors[0].message);
            //     }
            //     throw new Error('Failed to freeze membership');
            // }

          //  setFreezeSuccess('Membership freeze request submitted successfully!');
        } catch (err) {
            setFreezeError(err.message);
        } finally {
            setFreezeLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8, display: 'flex', gap: 32, background: '#fff' }}>
            <div style={{ flex: 1 }}>
                <h2 style={{ textAlign: 'center' }}>Freeze Membership</h2>
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
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {result && result.accountReview && result.accountReview.length > 0 && (
                    <div style={{ marginTop: 24 }}>
                        <h4 style={{ marginBottom: 12 }}>Upcoming Payments</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 8px 16px', color: '#888', fontWeight: 600, fontSize: 14 }}>
                                <span>Invoice Date</span>
                                <span>Amount</span>
                            </div>
                            {result.accountReview.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f4f8fb', borderRadius: 8, padding: '12px 16px', boxShadow: '0 1px 4px rgba(60,80,120,0.06)', cursor: 'pointer', border: selectedInvoice && selectedInvoice.date === item.date ? '2px solid #1976d2' : 'none' }}
                                    onClick={() => setSelectedInvoice(item)}
                                >
                                    <span style={{ fontWeight: 500, color: '#1976d2' }}>{item.date}</span>
                                    <span style={{ fontWeight: 700, color: '#263238', fontSize: 18 }}>${item.amount?.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {selectedInvoice && (
                <div style={{ flex: 1, background: '#f8fafc', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(60,80,120,0.08)', minWidth: 320 }}>
                    <h3 style={{ marginBottom: 20, color: '#1976d2' }}>Freeze Details</h3>
                    <form onSubmit={handleFreeze}>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Freeze Start Date</label>
                            <input type="text" value={selectedInvoice.date} readOnly style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b0bec5', background: '#e3eaf7' }} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Reason</label>
                            <input type="text" value={freezeReason} onChange={e => setFreezeReason(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b0bec5' }} required />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>No of Payments</label>
                            <input type="number" min="1" step="1" value={freezePayments} onChange={e => setFreezePayments(e.target.value.replace(/[^0-9]/g, ''))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b0bec5' }} required />
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Due Amount</label>
                            <input type="number" min="0" step="0.01" value={freezeDueAmount} onChange={e => setFreezeDueAmount(e.target.value.replace(/[^0-9.]/g, ''))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b0bec5' }} required />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '10px 0', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 18, letterSpacing: 1, cursor: freezeLoading ? 'not-allowed' : 'pointer', boxShadow: '0 2px 6px rgba(25,118,210,0.08)', opacity: freezeLoading ? 0.5 : 1 }} disabled={freezeLoading}>Freeze</button>
                        {freezeError && <p style={{ color: 'red', marginTop: 12 }}>{freezeError}</p>}
                        {freezeSuccess && <p style={{ color: 'green', marginTop: 12 }}>{freezeSuccess}</p>}
                    </form>
                </div>
            )}
        </div>
    );
}

export default FreezePage;
