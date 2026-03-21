import mongoose from 'mongoose';

const CMSSchema = new mongoose.Schema({
  type: { type: String, default: 'global' },
  uiConfig: { type: Object, default: {} },
  aboutConfig: { type: Object, default: {} },
  heroSlides: { type: Array, default: [] },
  galleryImages: { type: Array, default: [] },
  faqs: { type: Array, default: [] },
  visionaries: { type: Array, default: [] },
  categories: { type: Array, default: [] }
}, { strict: false, timestamps: true });

const CMS = mongoose.models.CMS || mongoose.model('CMS', CMSSchema);
export { CMS };