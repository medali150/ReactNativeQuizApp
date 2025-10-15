# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 🖥️ Backend Issues

#### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
1. Start MongoDB service:
   - Windows: Services → MongoDB → Start
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

2. Check MongoDB is running:
   ```bash
   mongo
   # or
   mongosh
   ```

3. Use MongoDB Atlas:
   - Create free cluster at mongodb.com/cloud/atlas
   - Get connection string
   - Update MONGODB_URI in .env

#### Issue: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. Change port in backend/.env:
   ```env
   PORT=5001
   ```

2. Kill process using port 5000:
   - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
   - Mac/Linux: `lsof -i :5000` then `kill -9 <PID>`

3. Update API_URL in mobile app if you change port

#### Issue: JWT Secret Not Set
```
Error: secretOrPrivateKey must have a value
```

**Solution:**
Add to backend/.env:
```env
JWT_SECRET=my_super_secret_jwt_key_12345
```

#### Issue: Module Not Found
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

#### Issue: TypeScript Compilation Errors

**Solution:**
```bash
cd backend
npm run build
# Check for errors
# Fix TypeScript errors in src files
```

### 📱 Mobile App Issues

#### Issue: Cannot Connect to Backend
```
Network request failed
```

**Solutions:**

1. **For Android Emulator:**
   Update `mobile/src/services/api.ts`:
   ```typescript
   const API_URL = 'http://10.0.2.2:5000/api';
   ```

2. **For iOS Simulator:**
   ```typescript
   const API_URL = 'http://localhost:5000/api';
   ```

3. **For Physical Device:**
   - Find your computer's IP:
     ```bash
     # Windows
     ipconfig
     
     # Mac/Linux
     ifconfig | grep inet
     ```
   - Update API_URL:
   ```typescript
   const API_URL = 'http://192.168.1.XXX:5000/api';
   ```

4. **Check backend is running:**
   - Open http://localhost:5000/api/health in browser
   - Should show: `{"success":true,"message":"Server is running"}`

5. **Same WiFi network:**
   - Both devices must be on same network
   - Check firewall settings

#### Issue: AsyncStorage Error
```
Cannot read property 'getItem' of undefined
```

**Solution:**
```bash
cd mobile
npx expo install @react-native-async-storage/async-storage
```

#### Issue: Navigation Error
```
Unable to resolve module '@react-navigation/native'
```

**Solution:**
```bash
cd mobile
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

#### Issue: Expo Metro Bundler Error

**Solution:**
```bash
cd mobile
# Clear cache
npx expo start -c

# Or reset
rm -rf node_modules
npm install
npx expo start -c
```

#### Issue: App Crashes on Startup

**Solutions:**
1. Clear AsyncStorage:
   - Add temporary code to clear:
   ```typescript
   import AsyncStorage from '@react-native-async-storage/async-storage';
   AsyncStorage.clear();
   ```

2. Check console for errors:
   - Press Ctrl+M (Android) or Cmd+D (iOS)
   - Enable "Debug" mode

3. Rebuild app:
   ```bash
   npx expo start -c
   ```

#### Issue: White Screen / Blank Screen

**Solutions:**
1. Check API_URL is correct
2. Check backend is running
3. Clear cache: `npx expo start -c`
4. Check for JavaScript errors in console
5. Verify all dependencies installed

### 🔐 Authentication Issues

#### Issue: Login Fails with Correct Credentials

**Solutions:**
1. Check backend console for errors
2. Verify database seeded: `npm run seed`
3. Check JWT_SECRET in .env
4. Test with Postman:
   ```
   POST http://localhost:5000/api/auth/login
   Body: {"email":"admin@quizapp.com","password":"admin123"}
   ```

#### Issue: Token Invalid / Expired

**Solutions:**
1. Clear AsyncStorage in mobile app
2. Login again
3. Check JWT_EXPIRE in .env (default: 7d)
4. Verify backend time is correct

#### Issue: Cannot Register New User

**Solutions:**
1. Check if user already exists
2. Verify email format
3. Check password length (min 6 characters)
4. Check backend console for validation errors

### 🎮 Quiz Issues

#### Issue: Quiz List Empty

**Solutions:**
1. Seed database: `npm run seed`
2. Create quiz as admin
3. Check backend console for errors
4. Pull to refresh in app

#### Issue: Cannot Submit Quiz

**Solutions:**
1. Answer all questions
2. Check backend is running
3. Check console for errors
4. Verify token is valid

#### Issue: Score Not Calculating

**Solutions:**
1. Check quiz has correct answers set
2. Verify backend quiz controller logic
3. Check submission endpoint works

### 🛠️ Development Issues

#### Issue: Changes Not Reflecting

**Backend:**
```bash
# Restart server
# Ctrl+C to stop
npm run dev
```

**Mobile:**
```bash
# Reload app
# Press 'r' in Expo terminal
# Or shake device and press "Reload"
```

#### Issue: TypeScript Errors

**Solutions:**
1. Check tsconfig.json
2. Install type definitions:
   ```bash
   npm install --save-dev @types/node @types/express
   ```
3. Restart IDE/Editor

#### Issue: Git Issues

**Solutions:**
1. Check .gitignore includes:
   - node_modules/
   - .env
   - dist/

2. If .env tracked accidentally:
   ```bash
   git rm --cached .env
   git commit -m "Remove .env from tracking"
   ```

### 📦 Dependency Issues

#### Issue: npm install Fails

**Solutions:**
1. Delete lock files and node_modules:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```

3. Use different registry:
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

#### Issue: Version Conflicts

**Solutions:**
1. Update packages:
   ```bash
   npm update
   ```

2. Check package.json for version issues
3. Install specific versions if needed

## 🧪 Testing & Debugging

### Backend Debugging

**Enable detailed logging:**
Add to backend code:
```typescript
console.log('Request:', req.body);
console.log('User:', req.user);
```

**Test endpoints with curl:**
```bash
# Test health
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@quizapp.com","password":"admin123"}'
```

### Mobile Debugging

**Enable Remote Debugging:**
1. Shake device or press Ctrl+M (Android) / Cmd+D (iOS)
2. Select "Debug" or "Debug Remote JS"
3. Opens Chrome DevTools

**Console Logs:**
Add to code:
```typescript
console.log('API Response:', response.data);
console.log('Error:', error);
```

**React Native Debugger:**
Install: https://github.com/jhen0409/react-native-debugger

## 🔍 Diagnostic Commands

**Backend:**
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check MongoDB status
mongo --version

# Test MongoDB connection
mongo mongodb://localhost:27017

# View running processes
netstat -ano | findstr :5000  # Windows
lsof -i :5000  # Mac/Linux
```

**Mobile:**
```bash
# Check Expo CLI
npx expo --version

# Check React Native version
npx react-native --version

# View Expo diagnostics
npx expo-doctor

# Clear all caches
npx expo start -c
```

## 📞 Getting Help

### Before Asking for Help:

1. ✅ Read error message carefully
2. ✅ Check this troubleshooting guide
3. ✅ Search error message online
4. ✅ Check official documentation
5. ✅ Try suggested solutions
6. ✅ Check all configuration files

### When Asking for Help, Include:

1. **Error message** (full text)
2. **What you tried** (steps to reproduce)
3. **Environment:**
   - OS (Windows/Mac/Linux)
   - Node version
   - npm version
   - MongoDB version
4. **Relevant code** (if applicable)
5. **Console output** (backend and mobile)

## 🎯 Prevention Tips

1. **Always run backend first** before mobile app
2. **Keep dependencies updated** regularly
3. **Use environment variables** for config
4. **Clear caches** when things break
5. **Commit working code** frequently
6. **Test after each change**
7. **Read error messages** carefully
8. **Check file paths** are correct
9. **Verify API URLs** match your setup
10. **Keep documentation** up to date

## ✅ Health Check Script

Create `backend/health-check.js`:
```javascript
const axios = require('axios');

async function healthCheck() {
  try {
    const res = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend is healthy:', res.data);
  } catch (error) {
    console.log('❌ Backend is down:', error.message);
  }
}

healthCheck();
```

Run: `node health-check.js`

---

**Still having issues? Review the SETUP_INSTRUCTIONS.md for detailed setup steps! 🔍**
