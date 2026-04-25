"use client";

import React from 'react';
import { motion } from 'framer-motion';
import SeoAnalyticsDashboard from '@/components/godmode/SeoAnalyticsDashboard';
import RedirectManager from '@/components/godmode/RedirectManager';

export default function SeoEngineTab() {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} key="seo" className="space-y-8 w-full max-w-[100vw] overflow-x-hidden">
        <SeoAnalyticsDashboard />
        <RedirectManager /> 
    </motion.div>
  );
}