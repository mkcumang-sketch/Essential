"use client";

import React from 'react';

// 🌟 PHANTOM HONEYPOT: Trap for automated bots
export const PhantomGuard = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    return (
        <div style={{ position: 'absolute', opacity: 0, zIndex: -1, height: 0, overflow: 'hidden' }} aria-hidden="true">
            <label htmlFor="bot_id">Do not fill this field</label>
            <input 
                id="bot_id"
                type="text" 
                name="bot_id" 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                tabIndex={-1} 
                autoComplete="off"
            />
        </div>
    );
};