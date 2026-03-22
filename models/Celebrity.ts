import mongoose from 'mongoose';

const celebritySchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, default: "Global Ambassador" }, // e.g., "Ambassador of Elegance"
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: String, // To manage deletion easily
    linkedWatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // Optional: watches they wear
}, { timestamps: true });

const Celebrity = mongoose.models.Celebrity || mongoose.model('Celebrity', celebritySchema);

export default Celebrity;