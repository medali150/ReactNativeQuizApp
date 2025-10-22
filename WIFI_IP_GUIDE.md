# 📱 How to Fix WiFi/IP Address Changes

## Problem
When you change WiFi networks, your computer gets a new IP address, and the mobile app can't connect to the backend server anymore, showing **"Request failed with status code 500"** or connection errors.

---

## ✅ Solution

I've added a **Settings Screen** where you can easily change the server IP address without editing code!

---

## 🚀 How to Use

### **Option 1: From Login Screen (Easiest)**

1. Open the app
2. On the **Login screen**, tap **"⚙️ Server Settings"** button at the bottom
3. You'll see the Settings screen

### **Option 2: From Inside the App**

If you're already logged in:
- Navigate to **Settings** from the menu (available in both User and Admin modes)

---

## 📝 Steps to Update IP Address

### 1. **Find Your Computer's IP Address**

**On Windows:**
```bash
ipconfig
```
Look for **"IPv4 Address"** under your WiFi adapter
Example: `192.168.1.194`

**On Mac/Linux:**
```bash
ifconfig
```
Look for **"inet"** under your WiFi interface

### 2. **Enter the Server URL**

In the Settings screen:
- Enter: `http://YOUR_IP:5000`
- Example: `http://192.168.1.194:5000`

### 3. **Test Connection**

- Tap **"🔍 Test Connection"** button
- Wait for the result
- ✅ **Success:** Connection working!
- ❌ **Failed:** Check if:
  - Backend server is running (`npm run dev`)
  - IP address is correct
  - Phone and computer are on **same WiFi**

### 4. **Save the URL**

- Tap **"💾 Save & Apply"**
- The app will test the connection first
- If successful, it will save and ask you to restart
- If failed, you can choose to save anyway

### 5. **Restart the App**

- Close the app completely
- Reopen it
- Try to login - it should work now!

---

## 🔄 When to Update the IP

You need to update the IP address when:

1. **You change WiFi networks**
   - Moving from home WiFi to mobile hotspot
   - Switching between different WiFi routers
   
2. **Your router assigns a new IP**
   - Some routers change IPs periodically
   - After router restart

3. **You connect to a different network**
   - At work vs at home
   - Different locations

---

## 💡 Pro Tips

### **Use Your Phone as Hotspot (Most Reliable)**

This is the **easiest way** to avoid IP issues:

1. Turn on **Personal Hotspot** on your iPhone
2. Connect your computer to your phone's hotspot
3. Run `ipconfig` on your computer
4. Look for the IP (usually starts with `172.` or `192.`)
5. Update the app with this IP
6. Both devices are now on the same network!

### **Keep Backend Running**

Always make sure your backend server is running:
```bash
cd C:\Users\pc\reactNativeQuizApp\backend
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: ...
```

---

## 🛠️ Technical Details

### **What Changed**

1. **Dynamic API URL** - The app now stores and loads the API URL from AsyncStorage
2. **Settings Screen** - New screen to change the IP address
3. **Connection Testing** - Test button to verify connection before saving
4. **Better Error Messages** - Clear messages when connection fails

### **Files Modified**

- `mobile/src/services/api.ts` - Added dynamic URL management
- `mobile/src/screens/SettingsScreen.tsx` - New settings screen
- `mobile/src/screens/LoginScreen.tsx` - Added settings button
- `mobile/App.tsx` - Added settings route to navigation

---

## 🐛 Troubleshooting

### **"Cannot reach server" Error**

**Check:**
1. ✅ Backend is running (`npm run dev`)
2. ✅ IP address is correct (run `ipconfig`)
3. ✅ Phone and computer on **same WiFi**
4. ✅ Windows Firewall allows Node.js
5. ✅ Port 5000 is not blocked

### **"Connection timeout" Error**

**Solutions:**
1. Check if backend server crashed
2. Try restarting the backend server
3. Check Windows Firewall settings
4. Try using your phone as hotspot instead

### **"Invalid credentials" After Changing IP**

This is **normal** - it means the connection works!
- The IP change was successful
- Just login with your account

### **Settings Button Not Showing**

- Make sure you've reloaded the app
- Try shaking your phone → Reload
- Or stop and restart Expo

---

## 📖 Example Scenarios

### **Scenario 1: Working from Home**

```
Home WiFi → Computer IP: 192.168.1.194
Enter in Settings: http://192.168.1.194:5000
Test → Success ✅
Save → Works!
```

### **Scenario 2: Using Mobile Hotspot**

```
iPhone Hotspot → Computer IP: 172.20.10.2
Enter in Settings: http://172.20.10.2:5000
Test → Success ✅
Save → Works!
```

### **Scenario 3: Different WiFi Network**

```
Work WiFi → Computer IP: 10.0.0.156
Enter in Settings: http://10.0.0.156:5000
Test → Success ✅
Save → Works!
```

---

## 🎯 Quick Reference

| Action | Command/Steps |
|--------|--------------|
| Find IP (Windows) | `ipconfig` |
| Find IP (Mac) | `ifconfig` |
| Start Backend | `cd backend && npm run dev` |
| Test Backend | `curl http://localhost:5000/api/health` |
| Open Settings | Login Screen → "⚙️ Server Settings" |
| Format | `http://YOUR_IP:5000` |

---

## ✨ Benefits

✅ **No Code Changes** - Change IP from the app
✅ **Test Before Save** - Verify connection works
✅ **Persistent** - Saved across app restarts
✅ **User Friendly** - Clear instructions and examples
✅ **Flexible** - Works with any WiFi network

---

**Now you can easily switch between WiFi networks without any coding!** 🎉
