import mongoose from 'mongoose';

const celebritySchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  watch: { type: String, required: true },
  img: { type: String, required: true }
}, { timestamps: true });
export const Celebrity = mongoose.models.Celebrity || mongoose.model('Celebrity', celebritySchema);

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  text: { type: String, required: true }
}, { timestamps: true });
export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

const faqSchema = new mongoose.Schema({
  q: { type: String, required: true },
  a: { type: String, required: true }
}, { timestamps: true });
export const Faq = mongoose.models.Faq || mongoose.model('Faq', faqSchema);