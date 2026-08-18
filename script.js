// Database Game Kamu
// Tambahkan game baru di sini seiring berjalannya waktu!
const gamesData = [
    {
        title: "Memory Game",
        description: "Latih daya ingatmu dengan mencocokkan kartu bergambar yang seru!",
        thumbnail: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=500&q=80", 
        path: "./MemoryGame/index.html" // Path menuju folder game-mu
    },
    {
        title: "Tebak Kata",
        description: "Uji kosakatamu dan tebak kata rahasia sebelum waktunya habis!",
        thumbnail: "https://images.unsplash.com/photo-1633526543814-9718c8922b7a?auto=format&fit=crop&w=500&q=80",
        path: "./TebakKata/index.html" 
    },
    {
        title: "Math Ninja",
        description: "Jadilah ninja matematika dengan menebas jawaban berhitung yang benar!",
        thumbnail: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=500&q=80",
        path: "./MathNinja/index.html"
    },
    // Contoh dummy agar terlihat grid 3x3
    {
        title: "Balap Mobil 2D",
        description: "Kendalikan mobilmu dan hindari rintangan di jalan raya!",
        thumbnail: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=500&q=80",
        path: "#"
    },
    {
        title: "Petualangan Luar Angkasa",
        description: "Jelajahi galaksi dan selamatkan bumi dari serangan alien lucuuu.",
        thumbnail: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=500&q=80",
        path: "#"
    }
];

// Fungsi untuk me-render kartu game ke dalam HTML
function loadGames() {
    const gridContainer = document.getElementById('game-grid');
    
    // Bersihkan kontainer (berjaga-jaga)
    gridContainer.innerHTML = '';

    // Looping data game dan buat elemen HTML-nya
    gamesData.forEach(game => {
        // Kita menggunakan tag <a> agar seluruh kartu bisa diklik dan SEO friendly
        const cardHTML = `
            <a href="${game.path}" class="game-card">
                <img src="${game.thumbnail}" alt="${game.title}" class="game-thumb">
                <div class="game-info">
                    <h2 class="game-title">${game.title}</h2>
                    <p class="game-desc">${game.description}</p>
                    <div class="play-btn">▶ Mainkan Sekarang</div>
                </div>
            </a>
        `;
        
        // Masukkan ke dalam grid
        gridContainer.innerHTML += cardHTML;
    });
}

// Jalankan fungsi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', loadGames);
