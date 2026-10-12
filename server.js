const express = require('express');
const http = http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

const usersDatabase = {}; 
const userWallets = {};
const pendingDeposits = []; 
const withdrawalRequests = []; 
const otpStore = {}; 

const MERCHANT_UPI_ID = "7795224221-e486-3@axl";
const MERCHANT_NAME = "Shivaraj";

const LIMITS = {
    minDeposit: 10,
    maxDeposit: 50000,
    minWithdrawal: 100,
    maxWithdrawal: 10000,
    referralBonus: 20 
};

app.get('/', (req, res) => {
    res.status(200).send("Shivaraj Secure Admin-Controlled Gaming Server is Live!");
});

app.post('/api/auth/send-otp', (req, res) => {
    const { mobileNumber } = req.body;
    if (!mobileNumber || mobileNumber.length !== 10) {
        return res.status(400).json({ success: false, message: "Valid 10-digit mobile number enter karo!" });
    }

    const otp = "1234"; 
    otpStore[mobileNumber] = otp;

    res.json({ success: true, message: `OTP sent to ${mobileNumber}`, otp: otp });
});

app.post('/api/auth/verify-otp', (req, res) => {
    const { mobileNumber, otp, referralCode } = req.body;

    if (otpStore[mobileNumber] !== otp) {
        return res.status(400).json({ success: false, message: "Wrong OTP!" });
    }

    if (!usersDatabase[mobileNumber]) {
        const myReferralCode = "SHIV" + Math.floor(1000 + Math.random() * 9000);
        usersDatabase[mobileNumber] = {
            mobileNumber,
            referralCode: myReferralCode,
            joinedDate: new Date().toLocaleString()
        };
        userWallets[mobileNumber] = 0;

        if (referralCode) {
            const referrer = Object.values(usersDatabase).find(u => u.referralCode === referralCode);
            if (referrer && referrer.mobileNumber !== mobileNumber) {
                if (!userWallets[referrer.mobileNumber]) userWallets[referrer.mobileNumber] = 0;
                userWallets[referrer.mobileNumber] += LIMITS.referralBonus;
            }
        }
    }

    res.json({
        success: true,
        message: "Login successful!",
        userId: mobileNumber,
        referralCode: usersDatabase[mobileNumber].referralCode,
        balance: userWallets[mobileNumber]
    });
});

app.get('/api/wallet/balance/:userId', (req, res) => {
    const userId = req.params.userId;
    res.json({ success: true, userId, balance: userWallets[userId] || 0 });
});

app.post('/api/wallet/request-deposit', (req, res) => {
    const { userId, amount, utrNumber } = req.body;
    const numAmount = Number(amount);

    if (numAmount < LIMITS.minDeposit || numAmount > LIMITS.maxDeposit) {
        return res.status(400).json({ success: false, message: `Deposit limit ₹${LIMITS.minDeposit} - ₹${LIMITS.maxDeposit}` });
    }

    if (!utrNumber || utrNumber.length < 5) {
        return res.status(400).json({ success: false, message: "Valid UTR number enter karo!" });
    }

    const depositId = "DEP_" + Date.now();
    pendingDeposits.push({
        depositId,
        userId,
        amount: numAmount,
        utrNumber,
        status: "PENDING_ADMIN_APPROVAL",
        time: new Date().toLocaleString()
    });

    res.json({ 
        success: true, 
        message: "Deposit request submitted! Admin will verify your UTR and add money soon." 
    });
});

app.post('/api/wallet/withdraw', (req, res) => {
    const { userId, amount, userUpiId } = req.body;
    const numAmount = Number(amount);

    if (numAmount < LIMITS.minWithdrawal || numAmount > LIMITS.maxWithdrawal) {
        return res.status(400).json({ success: false, message: `Withdrawal limit ₹${LIMITS.minWithdrawal} - ₹${LIMITS.maxWithdrawal}` });
    }

    const currentBalance = userWallets[userId] || 0;
    if (currentBalance < numAmount) {
        return res.status(400).json({ success: false, message: "Insufficient wallet balance!" });
    }

    userWallets[userId] -= numAmount;

    const withdrawalId = "WD_" + Date.now();
    withdrawalRequests.push({
        withdrawalId,
        userId,
        amount: numAmount,
        userUpiId,
        status: "PENDING_ADMIN_PAYMENT",
        time: new Date().toLocaleString()
    });

    res.json({ 
        success: true, 
        message: `Withdrawal of ₹${numAmount} requested. Admin will transfer money to your UPI soon.`, 
        remainingBalance: userWallets[userId] 
    });
});

app.get('/api/admin/all-records', (req, res) => {
    res.json({ 
        success: true, 
        pendingDeposits,
        withdrawalRequests,
        users: usersDatabase
    });
});

app.post('/api/admin/approve-deposit', (req, res) => {
    const { depositId } = req.body;
    const deposit = pendingDeposits.find(d => d.depositId === depositId && d.status === "PENDING_ADMIN_APPROVAL");

    if (!deposit) {
        return res.status(400).json({ success: false, message: "Invalid or already approved Deposit ID!" });
    }

    if (!userWallets[deposit.userId]) userWallets[deposit.userId] = 0;
    userWallets[deposit.userId] += deposit.amount;
    deposit.status = "APPROVED";

    res.json({ success: true, message: `Deposit of ₹${deposit.amount} approved for ${deposit.userId}!` });
});

app.post('/api/admin/complete-withdrawal', (req, res) => {
    const { withdrawalId } = req.body;
    const withdrawal = withdrawalRequests.find(w => w.withdrawalId === withdrawalId && w.status === "PENDING_ADMIN_PAYMENT");

    if (!withdrawal) {
        return res.status(400).json({ success: false, message: "Invalid or already paid Withdrawal ID!" });
    }

    withdrawal.status = "COMPLETED_PAID";

    res.json({ success: true, message: `Withdrawal of ₹${withdrawal.amount} marked as Paid!` });
});

const ludoGame = [
    { gameId: "ludo_classic", gameName: "Ludo King Pro", minEntry: 10, maxTimeMinutes: 10 }
];

app.get('/api/games/list', (req, res) => {
    res.json({ success: true, games: ludoGame, limits: LIMITS });
});

app.post('/api/games/join-table', (req, res) => {
    const { userId, gameId, entryAmount } = req.body;
    const numEntry = Number(entryAmount);

    const balance = userWallets[userId] || 0;
    if (balance < numEntry) {
        return res.status(400).json({ success: false, message: "Insufficient balance!" });
    }

    userWallets[userId] -= numEntry;
    const adminCommission = numEntry * 0.02; 
    const prizePool = numEntry - adminCommission;

    res.json({
        success: true,
        message: "Joined table successfully!",
        remainingWallet: userWallets[userId],
        prizePool: prizePool,
        adminCommissionEarned: adminCommission
    });
});

io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        const { roomCode, userId } = data;
        socket.join(roomCode);

        setTimeout(() => {
            const currentRoomSize = io.sockets.adapter.rooms.get(roomCode)?.size || 0;
            if (currentRoomSize < 2) {
                io.to(roomCode).emit('match_started', { 
                    message: "Opponent not found. Pro Bot activated!", 
                    opponent: "Pro_Bot_Shivaraj",
                    durationMinutes: 10 
                });
            } else {
                io.to(roomCode).emit('match_started', { 
                    message: "Live players found! Match started.", 
                    durationMinutes: 10 
                });
            }
        }, 5000);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Shivaraj Secure Admin Gaming Server running on port ${PORT}`);
});
