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



//delete expired coupons every hour
const cron = require('node-cron');
const Coupon = require('./models/Coupon');

// Run every hour (adjust as needed)
cron.schedule('*/10 * * * *', async () => {
  try {
    const now = new Date();
    const expired = await Coupon.deleteMany({ expiryDate: { $lt: now } });
    console.log(`Deleted ${expired.deletedCount} expired coupons`);
  } catch (error) {
    console.error('Error deleting expired coupons:', error);
  }
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
