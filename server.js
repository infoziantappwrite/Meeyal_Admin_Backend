const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const authRoutes = require('./routes/auth');
const deleteSingleImageRoutes = require('./routes/deleteSingleImages');
const offerRoutes = require('./routes/offerRoutes');
const couponRoutes = require('./routes/couponRoutes');
const orderRoutes = require('./routes/Order'); // Assuming you have an Order route set up


const app = express();
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "https://meeyal-admin-frontend.vercel.app", "https://meeyal-frontend-react.vercel.app"],
  credentials: true,
}));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/deletesingleimage', deleteSingleImageRoutes)
app.use('/api/offer', offerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes); // Assuming you have an Order route set up



//delete expired coupons every hour
const cron = require('node-cron');
const Coupon = require('./models/Coupon');

// Run every hour (adjust as needed)
cron.schedule('0 * * * *', async () => {  // Runs at the top of every hour
  try {
    const now = new Date();
    const expired = await Coupon.deleteMany({ expiryDate: { $lt: now } });

    if (expired.deletedCount > 0) {
      console.log(`🗑️ Deleted ${expired.deletedCount} expired coupons`);
    } else {
      console.log('✅ No expired coupons to delete at this time');
    }
  } catch (error) {
    console.error('❌ Error deleting expired coupons:', error.message);
  }
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
