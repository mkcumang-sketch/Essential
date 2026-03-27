import { redirect } from 'next/navigation';

export default function PrivacyRedirect() {
    // Ye line automatically user ko sahi lambe link par bhej degi
    redirect('/policies/privacy-policy');
}