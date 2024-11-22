import nodemailer from 'nodemailer';
import Stripe from 'stripe';
import razorpay from 'razorpay';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';

// Global Variables
const currency = 'inr';
const deliveryCharge = 10;

// Payment Gateway Initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Helper: Send Email Notifications
const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
};

// Helper: Send Order Emails
const sendOrderEmails = async (user, order) => {
    try {
        const adminEmail = process.env.EMAIL_ADMIN;
        const logoUrl = 'https://xchangetechs.s3.ap-south-1.amazonaws.com/xchange-tech-v9/assets/img/xchange-techs.png'; // Replace with actual logo URL

        const formatAddress = (address) => `
            ${address.firstName} ${address.lastName}<br>
            ${address.street},<br>
            ${address.city}, ${address.state}, ${address.zipcode},<br>
            ${address.country}<br>
            Phone: ${address.phone}<br>
            Email: ${address.email}
        `;

        const generateEmailHTML = (name, order, recipientType) => {
            const greeting = recipientType === 'user' ? `Hello ${name},` : 'Hello Admin,';
            const intro = recipientType === 'user'
                ? 'Thank you for shopping with us! Below are your order details.'
                : 'A new order has been placed. Here are the details.';

            return `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>XCHANGETECHS Order Confirmation</title>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0 auto; padding: 20px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                            <td align="center" style="padding: 20px 0;">
                                <img src="${logoUrl}" alt="XCHANGETECHS Logo" style="max-width: 200px; height: auto;">
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f8f8f8; padding: 10px; border-radius: 8px;">
                                <h2 style="color: #4CAF50; text-align: center; margin-bottom: 20px;">Order Confirmation</h2>
                                <p>${greeting}</p>
                                <p>${intro}</p>
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                    <thead>
                                        <tr>
                                            <th style="text-align: left; border-bottom: 2px solid #ddd; padding: 10px; background-color: #e9e9e9;">Item</th>
                                            <th style="text-align: center; border-bottom: 2px solid #ddd; padding: 10px; background-color: #e9e9e9;">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${order.items.map((item) => `
                                            <tr>
                                                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
                                                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                    <h3 style="color: #4CAF50; margin-top: 0;">Delivery Address:</h3>
                                    <p>${formatAddress(order.address)}</p>
                                </div>
                                <p style="margin-top: 20px; text-align: center;">Thank you for choosing XCHANGETECHS!</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center; padding-top: 20px; color: #888; font-size: 12px;">
                                <p>This is an automated email. Please do not reply to this message.</p>
                                <p>&copy; ${new Date().getFullYear()} XCHANGETECHS. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `;
        };

        const userHTML = generateEmailHTML(user.firstName, order, 'user');
        await sendMail(user.email, 'Order Confirmation', userHTML);

        const adminHTML = generateEmailHTML('Admin', order, 'admin');
        await sendMail(adminEmail, 'New Order Received', adminHTML);
    } catch (error) {
        console.error('Error sending order emails:', error.message);
    }
};

// Add the remaining functions here...

export {
    verifyRazorpay,
    verifyStripe,
    deleteOrder,
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
};
