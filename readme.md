# Psycho Admin & Mobile App - Installation & Run Guide

## Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn
- MongoDB database (local or Atlas)

## 1. Clone the Repository
```bash
git clone https://github.com/CodeBytes0101/physco.git
cd physco
```

## 2. Backend Setup
Navigate to the backend folder (if your backend is in a subfolder, e.g., `backend/`).

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following (edit values as needed):

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:
```bash
npm run dev
# or
npm start
```

## 3. Frontend (Admin Panel) Setup
Navigate to the admin frontend folder:

```bash
cd ../ADMIN
npm install
```




Start the frontend:
```bash
npm run dev
```

---

## Using ngrok for Mobile API Access

If you are running the mobile app on a device that is NOT on the same WiFi as your backend, or using Expo Go with mobile data, you must use a public URL for your backend API. You can use [ngrok](https://ngrok.com/) to expose your local backend:

1. Start your backend server (see above).
2. In a new terminal, run:
	```bash
	ngrok http 5000
	```
3. Copy the HTTPS forwarding URL shown by ngrok (e.g., `https://17656eaa7fcf.ngrok-free.app`).
4. In your mobile app's `src/config/api.js`, set:
	```js
	let API_BASE_URL = "https://17656eaa7fcf.ngrok-free.app/api";
	```
5. Save and restart your Expo Go app.

Now your mobile app can access your backend from anywhere.


## 4. Mobile App Setup
If you have a mobile app (e.g., React Native):

1. Navigate to the mobile app folder:
	```bash
	cd ../mobile-app
	# or the correct path to your mobile app directory
	```

2. Install dependencies:
	```bash
	npm install
	```

3. Start the mobile app:
	- For Android:
	  ```bash
	  npx expo start
	  ```
	- For iOS (on Mac):
	  ```bash
	  npx react-native run-ios
	  ```

