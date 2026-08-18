// ==========================================
// PENGATURAN DATABASE GAMBAR (Backend Logic)
// ==========================================
// Masukkan nama-nama file gambar yang ada di folder "gambar" ke array ini.
// Karena simulasi, kita siapkan array angka 1-20. 
const availableImages = Array.from({length: 60}, (_, i) => `${i + 1}.jpg`); 
const imagePath = "gambar/"; // Nama folder

// Variables (State Management)
let playersCount = 2;
let pairsCount = 10;
const maxPairs = availableImages.length; // Max berdasarkan jumlah gambar di array

let currentPlayer = 0;
let scores = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairsCount = 0;

// ==========================================
// LOGIC MENU & UX
// ==========================================

// Inisialisasi info max gambar di menu
document.getElementById('max-pair-info').innerText = `Max: ${maxPairs} pasangan`;

function adjustPlayers(change) {
    playersCount += change;
    if (playersCount < 1) playersCount = 1;
    if (playersCount > 4) playersCount = 4;
    document.getElementById('player-count').innerText = playersCount;
}

function adjustPairs(change) {
    pairsCount += change;
    if (pairsCount < 5) pairsCount = 5; // Minimal 5 pasang
    if (pairsCount > maxPairs) pairsCount = Math.floor(maxPairs / 5) * 5; // Dibatasi jumlah gambar tersedia
    document.getElementById('pair-count').innerText = pairsCount;
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
        document.querySelector('#fullscreen-btn i').classList.replace('fa-expand', 'fa-compress');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            document.querySelector('#fullscreen-btn i').classList.replace('fa-compress', 'fa-expand');
        }
    }
}

// ==========================================
// LOGIC PERMAINAN UTAMA
// ==========================================

function startGame() {
    // Reset State Permainan
    scores = new Array(playersCount).fill(0);
    currentPlayer = 0;
    matchedPairsCount = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    // Ganti Layar
    document.getElementById('menu-screen').classList.remove('active');
    document.getElementById('game-screen').classList.active = true;
    document.getElementById('game-screen').style.display = 'flex';

    setupScoreboard();
    generateCards();
}

function returnToMenu() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('menu-screen').classList.add('active');
    document.getElementById('game-board').innerHTML = '';
}

function setupScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = ''; // Bersihkan skor sebelumnya

    for (let i = 0; i < playersCount; i++) {
        const div = document.createElement('div');
        div.className = `player-score ${i === 0 ? 'active' : ''}`;
        div.id = `player-ui-${i}`;
        div.innerHTML = `
            <div class="player-name">Player ${i + 1}</div>
            <div class="score-number" id="score-${i}">0</div>
        `;
        scoreboard.appendChild(div);
    }
}

function generateCards() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';

    // 1. Ambil gambar sesuai jumlah pasang yang diminta
    // Shuffle array gambar dulu agar gambar yang dipakai acak tiap main
    let shuffledImages = [...availableImages].sort(() => 0.5 - Math.random());
    let selectedImages = shuffledImages.slice(0, pairsCount);

    // 2. Duplikasi array (karena butuh pasangan)
    let cardPairs = [...selectedImages, ...selectedImages];

    // 3. Shuffle (Kocok) kartu
    cardPairs.sort(() => 0.5 - Math.random());

    // 4. Render ke HTML
    cardPairs.forEach(imgName => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = imgName; // Simpan nama unik untuk validasi
        
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-back"></div>
                <div class="card-front">
                    <!-- Gunakan error handler jika gambar belum dibuat oleh user -->
                    <img src="${imagePath}${imgName}" onerror="this.src='https://via.placeholder.com/150/FFFFFF/000000?text=${imgName.split('.')[0]}'">
                </div>
            </div>
        `;

        cardElement.addEventListener('click', flipCard);
        board.appendChild(cardElement);
    });
    // TAMBAHKAN KODE INI DI BARIS PALING BAWAH DALAM FUNGSI generateCards:
    // Tunggu 100 milidetik agar CSS selesai menyusun kotak, baru hitung posisinya
    setTimeout(updateGridVisuals, 100);

    // Sesuaikan ukuran grid CSS secara dinamis jika jumlah kartu sangat banyak
    // if (pairsCount > 20) {
    //     board.style.gridTemplateColumns = "repeat(auto-fit, minmax(100px, 1fr))";
    // } else {
    //     board.style.gridTemplateColumns = "repeat(auto-fit, minmax(125px, 1fr))";
    // }
}

function flipCard() {
    if (lockBoard) return; // Mencegah klik saat animasi pengecekan
    if (this === firstCard) return; // Mencegah klik kartu yang sama 2x
    if (this.classList.contains('matched')) return; // Mencegah klik kartu yang sudah selesai

    this.classList.add('flipped');

    if (!firstCard) {
        // Klik Pertama
        firstCard = this;
        return;
    }

    // Klik Kedua
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    // KARTU COCOK!
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    // Tambah Poin
    scores[currentPlayer]++;
    document.getElementById(`score-${currentPlayer}`).innerText = scores[currentPlayer];
    matchedPairsCount++;

    resetBoard();

    // Cek Game Over
    if (matchedPairsCount === pairsCount) {
        setTimeout(declareWinner, 500);
    }
    // Catatan Aturan: Jika cocok, giliran TETAP di pemain yang sama.
}

function unflipCards() {
    // KARTU TIDAK COCOK
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        
        resetBoard();
        nextPlayerTurn(); // Pindah giliran
    }, 1000); // Tunggu 1 detik biar pemain bisa ingat posisi
}

function nextPlayerTurn() {
    // Hilangkan highlight player sebelumnya
    document.getElementById(`player-ui-${currentPlayer}`).classList.remove('active');
    
    // Pindah indeks player
    currentPlayer = (currentPlayer + 1) % playersCount;
    
    // Tambahkan highlight ke player sekarang
    document.getElementById(`player-ui-${currentPlayer}`).classList.add('active');
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function declareWinner() {
    let maxScore = Math.max(...scores);
    let winners = [];
    
    scores.forEach((score, index) => {
        if (score === maxScore) winners.push(`Player ${index + 1}`);
    });

    let msg = winners.length > 1 ? `Seri! ${winners.join(' & ')} menang!` : `${winners[0]} Menang!`;
    alert(`Game Selesai!\n${msg}`);
}
// ==========================================
// KODE TAMBAHAN UNTUK WARNA GRID & KOORDINAT
// ==========================================
function updateGridVisuals() {
    const cards = document.querySelectorAll('.card');
    if (cards.length === 0) return;
    
    // Kumpulkan posisi jarak dari atas (Baris) dan jarak dari kiri (Kolom)
    let rows = new Set();
    let cols = new Set();
    
    cards.forEach(card => {
        rows.add(card.offsetTop);
        cols.add(card.offsetLeft);
    });
    
    // Urutkan posisi dari yang terkecil ke terbesar
    const rowArray = Array.from(rows).sort((a,b) => a - b);
    const colArray = Array.from(cols).sort((a,b) => a - b);
    
    // Terapkan warna dan label ke masing-masing kartu
    cards.forEach(card => {
        const rIndex = rowArray.indexOf(card.offsetTop); // Baris ke-berapa
        const cIndex = colArray.indexOf(card.offsetLeft); // Kolom ke-berapa
        
        const cardBack = card.querySelector('.card-back');
        
        // 1. Buat Pola Warna Selang-Seling (Baris + Kolom)
        if ((rIndex + cIndex) % 2 === 0) {
            // Warna Default (Merah/Pink)
            cardBack.style.background = 'linear-gradient(45deg, #ff6b81, #ff4757)';
        } else {
            // Warna Selingan (Biru/Ungu)
            cardBack.style.background = 'linear-gradient(45deg, #3742fa, #5352ed)';
        }
        
        // 2. Buat Label Koordinat (Baris = Huruf A, B, C | Kolom = Angka 1, 2, 3)
        const rowChar = String.fromCharCode(65 + rIndex); // 65 adalah kode untuk huruf 'A'
        const colNum = cIndex + 1;
        
        // Masukkan label ke dalam kartu (tanda tanya besar di tengah tidak akan hilang)
        cardBack.innerHTML = `<span class="coord">${rowChar}${colNum}</span>`;
    });
}

// Pastikan koordinat dihitung ulang jika pemain memutar HP (resize layar)
window.addEventListener('resize', () => {
    setTimeout(updateGridVisuals, 100);
});
