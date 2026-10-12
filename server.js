const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WinClub - Gaming Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
            background: #0f172a;
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            width: 100%;
            max-width: 420px;
            background: #1e293b;
            min-height: 100vh;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
        }
        @media(min-width: 420px) {
            .container {
                min-height: 800px;
                border-radius: 20px;
            }
        }
        .screen {
            display: none;
            flex-direction: column;
            flex: 1;
            padding: 20px;
            animation: fadeIn 0.3s ease-in-out;
        }
        .screen.active {
            display: flex;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .login-header {
            text-align: center;
            margin-top: 60px;
            margin-bottom: 40px;
        }
        .login-header h1 {
            color: #f59e0b;
            font-size: 32px;
            margin-bottom: 10px;
        }
        .login-header p {
            color: #94a3b8;
            font-size: 14px;
        }
        .input-group {
            margin-bottom: 20px;
        }
        .input-group label {
            display: block;
            margin-bottom: 8px;
            color: #cbd5e1;
            font-size: 14px;
        }
        .input-group input {
            width: 100%;
            padding: 14px;
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 10px;
            color: #fff;
            font-size: 16px;
            outline: none;
        }
        .input-group input:focus {
            border-color: #f59e0b;
        }
        .btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            border: none;
            border-radius: 10px;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.2s;
            margin-top: 10px;
        }
        .btn:active {
            transform: scale(0.98);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 15px;
            border-bottom: 1px solid #334155;
            margin-bottom: 20px;
        }
        .logo {
            font-size: 22px;
            font-weight: bold;
            color: #f59e0b;
        }
        .wallet-badge {
            background: #0f172a;
            padding: 8px 14px;
            border-radius: 20px;
            border: 1px solid #334155;
            font-size: 14px;
            font-weight: bold;
            color: #10b981;
        }
        .wallet-card {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
            text-align: center;
        }
        .wallet-card h3 {
            font-size: 14px;
            color: #e0e7ff;
            margin-bottom: 5px;
        }
        .wallet-card .balance {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .wallet-actions {
            display: flex;
            gap: 10px;
        }
        .wallet-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            font-size: 14px;
        }
        .btn-deposit {
            background: #10b981;
            color: #fff;
        }
        .btn-withdraw {
            background: #ef4444;
            color: #fff;
        }
        .section-title {
            font-size: 18px;
            margin-bottom: 15px;
            color: #f1f5f9;
        }
        .games-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        .game-card {
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
            cursor: pointer;
            transition: 0.2s;
        }
        .game-card:hover {
            border-color: #f59e0b;
            transform: translateY(-2px);
        }
        .game-icon {
            font-size: 36px;
            margin-bottom: 10px;
        }
        .game-card h4 {
            font-size: 16px;
            margin-bottom: 5px;
        }
        .game-card p {
            font-size: 12px;
            color: #94a3b8;
        }
        .modal {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7);
            justify-content: center;
            align-items: center;
            z-index: 100;
        }
        .modal-content {
            background: #1e293b;
            padding: 25px;
            border-radius: 15px;
            width: 90%;
            max-width: 320px;
            text-align: center;
            border: 1px solid #334155;
        }
        .modal-content h3 {
            margin-bottom: 15px;
            color: #f59e0b;
        }
        .modal-content input {
            width: 100%;
            padding: 10px;
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 8px;
            color: #fff;
            margin-bottom: 15px;
            text-align: center;
            font-size: 16px;
            outline: none;
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- 1. LOGIN SCREEN -->
        <div id="loginScreen" class="screen active">
            <div class="login-header">
                <h1>WinClub</h1>
                <p>India's Ultimate Gaming Destination</p>
            </div>
            <div class="input-group">
                <label>Mobile Number</label>
                <input type="tel" id="mobileNumber" placeholder="Enter 10-digit mobile number" maxlength="10">
            </div>
            <button class="btn" onclick="sendOTP()">Get OTP</button>
        </div>

        <!-- 2. OTP SCREEN -->
        <div id="otpScreen" class="screen">
            <div class="login-header">
                <h1>Verify OTP</h1>
                <p>Enter the 4-digit code sent to your number</p>
            </div>
            <div class="input-group">
                <label>Enter OTP (Hint: 1234)</label>
                <input type="text" id="otpInput" placeholder="----" maxlength="4">
            </div>
            <button class="btn" onclick="verifyOTP()">Verify & Login</button>
        </div>

        <!-- 3. MAIN DASHBOARD -->
        <div id="dashboardScreen" class="screen">
            <div class="header">
                <div class="logo">WinClub</div>
                <div class="wallet-badge" id="headerBalance">₹ 500.00</div>
            </div>

            <!-- Wallet Card -->
            <div class="wallet-card">
                <h3>Total Balance</h3>
                <div class="balance" id="walletBalance">₹ 500.00</div>
                <div class="wallet-actions">
                    <button class="wallet-btn btn-deposit" onclick="openModal('deposit')">Deposit</button>
                    <button class="wallet-btn btn-withdraw" onclick="openModal('withdraw')">Withdraw</button>
                </div>
            </div>

            <!-- Game Lobby -->
            <div class="section-title">Play & Earn</div>
            <div class="games-grid">
                <div class="game-card" onclick="playGame('Ludo King')">
                    <div class="game-icon">🎲</div>
                    <h4>Ludo Win</h4>
                    <p>Classic Board Game</p>
                </div>
                <div class="game-card" onclick="playGame('Fruit Cutter')">
                    <div class="game-icon">⚔️</div>
                    <h4>Fruit Slash</h4>
                    <p>Action Game</p>
                </div>
                <div class="game-card" onclick="playGame('Color Prediction')">
                    <div class="game-icon">🎯</div>
                    <h4>Color Win</h4>
                    <p>Fast Earning</p>
                </div>
                <div class="game-card" onclick="playGame('Card Battle')">
                    <div class="game-icon">🃏</div>
                    <h4>Card War</h4>
                    <p>Strategy Game</p>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL POPUP -->
    <div id="actionModal" class="modal">
        <div class="modal-content">
            <h3 id="modalTitle">Add Money</h3>
            <input type="number" id="modalAmount" placeholder="Enter amount">
            <button class="btn" onclick="submitModal()">Confirm</button>
            <button class="btn" style="background: #334155; margin-top: 8px;" onclick="closeModal()">Cancel</button>
        </div>
    </div>

    <script>
        let userBalance = 500.00;
        let currentAction = '';

        function sendOTP() {
            const mobile = document.getElementById('mobileNumber').value;
            if(mobile.length < 10) {
                alert('Please enter a valid 10-digit mobile number');
                return;
            }
            document.getElementById('loginScreen').classList.remove('active');
            document.getElementById('otpScreen').classList.add('active');
        }

        function verifyOTP() {
            const otp = document.getElementById('otpInput').value;
            if(otp !== '1234' && otp.length !== 4) {
                alert('Please enter valid OTP (Hint: 1234)');
                return;
            }
            document.getElementById('otpScreen').classList.remove('active');
            document.getElementById('dashboardScreen').classList.add('active');
        }

        function openModal(action) {
            currentAction = action;
            document.getElementById('modalTitle').innerText = action === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds';
            document.getElementById('modalAmount').value = '';
            document.getElementById('actionModal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('actionModal').style.display = 'none';
        }

        function submitModal() {
            const amount = parseFloat(document.getElementById('modalAmount').value);
            if(isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }

            if(currentAction === 'deposit') {
                userBalance += amount;
                alert('Successfully deposited ₹' + amount);
            } else {
                if(amount > userBalance) {
                    alert('Insufficient balance!');
                    return;
                }
                userBalance -= amount;
                alert('Successfully withdrawn ₹' + amount);
            }

            document.getElementById('walletBalance').innerText = '₹ ' + userBalance.toFixed(2);
            document.getElementById('headerBalance').innerText = '₹ ' + userBalance.toFixed(2);
            closeModal();
        }

        function playGame(gameName) {
            alert('Starting ' + gameName + '! Get ready to win rewards.');
        }
    </script>
</body>
</html>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
