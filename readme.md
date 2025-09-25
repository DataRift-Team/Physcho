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

