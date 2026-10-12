const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
        <body style="background:#0f172a; color:#fff; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">
            <div style="background:#1e293b; padding:25px; border-radius:10px; text-align:center; width:300px;">
                <h3 style="color:#f59e0b; margin-bottom:15px;">Login</h3>
                <input type="tel" id="mobile" placeholder="Mobile Number" style="width:100%; padding:10px; margin-bottom:10px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:5px; box-sizing:border-box;">
                <input type="text" id="otp" placeholder="Enter OTP (1234)" style="width:100%; padding:10px; margin-bottom:15px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:5px; box-sizing:border-box;">
                <button onclick="checkLogin()" style="width:100%; padding:10px; background:#f59e0b; border:none; color:#fff; font-weight:bold; border-radius:5px; cursor:pointer;">Submit</button>
            </div>
            <script>
                function checkLogin() {
                    const m = document.getElementById('mobile').value;
                    const o = document.getElementById('otp').value;
                    if(m.length === 10 && o === '1234') {
                        alert('Login Success! Pehla step chal gaya.');
                    } else {
                        alert('Sahi number aur OTP (1234) dalo!');
                    }
                }
            </script>
        </body>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0');
