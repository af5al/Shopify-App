Shopify Admin App – Setup Instructions

Prerequisites:

Node.js v18 or higher
Shopify CLI
Shopify Partner account
MongoDB Atlas

Setup Steps:

1. Clone the repository
   git clone <repository-url>
   cd <project-folder>

2. Install dependencies
   npm install

3. Create Shopify app and store from https://dev.shopify.com/dashboard

4. Copy Client ID, App Name, and Application URL
   Update .shopify.app.toml file

client_id = "<YOUR_CLIENT_ID>"
name = "Admin-app"
application_url = "https://<your-app-url>"
embedded = true

5. Add environment variables
   Create a .env file inside the web folder and add:
   MONGO_URI=<your_mongodb_connection_string>

6. Start the app
   shopify app dev

7. Enable the app block
   Go to Online Store → Themes → Customize
   Open a Product Page
   Enable the Countdown Timer App Block

App is now running inside Shopify Admin.

# store access to view product page with timer

-you can check my shopify shop on link 'products-store-9717.myshopify.com'
-password: 'shopifystore@afsal'
-there you can see the timer widget i have given on every single product view

# Project Structure

.
├── web/
│ ├── index.js # Express server entry
│ ├── routes/ # Admin & storefront routes
│ ├── models/ # MongoDB models
| |\_\_ .env.sample/ # .env.sample
│ └── frontend/ # React admin UI
│
├── extensions/
│ └── countdown-timer-widget/
│ ├── blocks/
│ │ └── countdown-timer.liquid
│ └── assets/
│ └── countdown-timer-widget.js
│
├── shopify.app.toml
└── README.md
