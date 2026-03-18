const { Product, Brand, Category, CMS } = require('../models/EnterpriseDB');
const csv = require('csvtojson'); // For Bulk Uploads

// 1. ADD NEW WATCH (Single)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. BULK CSV UPLOAD (Advanced Feature)
exports.bulkUploadProducts = async (req, res) => {
  try {
    const jsonArray = await csv().fromFile(req.file.path);
    // Insert 1000s of products instantly
    await Product.insertMany(jsonArray); 
    res.status(200).json({ success: true, message: `${jsonArray.length} Watches Added to Vault!` });
  } catch (error) {
    res.status(500).json({ success: false, error: "CSV Format Error" });
  }
};

// 3. ADVANCED ANALYTICS (Revenue & Sales Graph)
exports.getAnalytics = async (req, res) => {
  try {
    // Aggregation pipeline for real-time sales calculation
    const salesData = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    const outOfStockCount = await Product.countDocuments({ stock: { $lte: 0 } });
    
    res.status(200).json({ success: true, salesData, outOfStockCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. UPDATE HOMEPAGE CMS (Frontend Control)
exports.updateHomepageCMS = async (req, res) => {
  try {
    const cms = await CMS.findOneAndUpdate(
      { page: 'Homepage' }, 
      req.body, 
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: cms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};