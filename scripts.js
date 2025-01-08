// Fungsi untuk memeriksa status login
function checkLogin() {
    const loggedIn = sessionStorage.getItem('loggedIn');

    if (!loggedIn) {
        // Jika tidak login, arahkan ke halaman login
        window.location.href = 'login.html';
    }
}

// Fungsi untuk login
function login(username, password) {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    if (username === storedUsername && password === storedPassword) {
        sessionStorage.setItem('loggedIn', 'true');
        return true;
    }
    return false;
}

// Fungsi untuk logout
function logout() {
    sessionStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
}

// Event listener saat DOM telah dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Cek login status pada setiap halaman
    if (window.location.pathname.endsWith('index.html')) {
        checkLogin();
    }

    // Handler untuk form login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (login(username, password)) {
                window.location.href = 'index.html';
            } else {
                alert('Username atau password salah.');
            }
        });
    }

    // Handler untuk tombol logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// Cek login setiap kali tab mendapat fokus
window.addEventListener('focus', () => {
    if (window.location.pathname.endsWith('index.html')) {
        checkLogin();
    }
});
// Fungsi untuk registrasi
function register(username, email, password) {
    if (!username || !email || !password) {
        throw new Error('Semua field harus diisi');
    }
    if (password.length < 8) {
        throw new Error('Password harus minimal 8 karakter');
    }
    // Dalam praktik nyata, gunakan API backend untuk menyimpan data pengguna
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('password', password); // Jangan simpan password seperti ini di produksi
}

// Fungsi untuk mencari buku
function searchBook(query) {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    return books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
}

// Fungsi untuk menampilkan hasil pencarian
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
    if (results.length > 0) {
        results.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.textContent = `${book.title} - ${book.author}`;
            resultsContainer.appendChild(bookItem);
        });
    } else {
        resultsContainer.textContent = 'Tidak ada buku yang ditemukan.';
    }
}
// ... (kode sebelumnya tetap sama)

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (login(username, password)) {
                alert(`Login berhasil! Selamat datang, ${username}!`);
                window.location.href = 'index.html';
            } else {
                alert('Username atau password salah. Silakan coba lagi.');
            }
        });
    }

    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            try {
                register(username, email, password);
                alert('Pendaftaran berhasil! Silakan login.');
                window.location.href = 'login.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }

    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('searchInput').value;
            const results = searchBook(query);
            displaySearchResults(results);
        });
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout();
        });
    }
});

// Daftar buku
const books = [
    { title: "Belajar JavaScript", author: "John Doe", description: "Panduan lengkap untuk belajar JavaScript." },
    { title: "Pemrograman Web dengan HTML & CSS", author: "Jane Smith", description: "Dasar-dasar pemrograman web dengan HTML dan CSS." },
    { title: "Dasar-Dasar Python", author: "Alice Johnson", description: "Belajar Python dari nol." },
    { title: "Pengantar Database", author: "Bob Brown", description: "Memahami konsep dasar database." },
    { title: "Algoritma dan Struktur Data", author: "Charlie White", description: "Panduan algoritma dan struktur data." }
];

// Fungsi untuk menampilkan daftar buku
function displayBooks(booksToDisplay) {
    const bookList = document.getElementById('books');
    bookList.innerHTML = ''; // Kosongkan daftar sebelumnya

    booksToDisplay.forEach(book => {
        const listItem = document.createElement('li');
        listItem.textContent = `${book.title} - ${book.author}`;

        // Tambahkan tombol "Pinjam"
        const borrowButton = document.createElement('button');
        borrowButton.textContent = 'Pinjam';
        borrowButton.onclick = () => borrowBook(book); // Menambahkan event click untuk pinjam

        listItem.appendChild(borrowButton);
        bookList.appendChild(listItem);
    });
}

// Fungsi untuk meminjam buku
function borrowBook(book) {
    const borrowerName = prompt("Masukkan nama Anda:");
    if (!borrowerName) {
        alert("Nama peminjam harus diisi.");
        return;
    }

    const borrowDate = new Date().toLocaleDateString(); // Ambil tanggal hari ini
    const confirmation = confirm(`Apakah Anda yakin ingin meminjam buku "${book.title}"?`);

    if (confirmation) {
        // Simpan data peminjaman ke localStorage
        const borrowingData = {
            borrowerName: borrowerName,
            bookTitle: book.title,
            borrowDate: borrowDate
        };
        saveBorrowingData(borrowingData); // Simpan data peminjaman
        alert(`Buku "${book.title}" berhasil dipinjam oleh ${borrowerName} pada ${borrowDate}.`);
        displayBorrowingHistory(); // Perbarui tampilan riwayat peminjaman
    } else {
        alert('Peminjaman dibatalkan.');
    }
}

// Fungsi untuk menyimpan data peminjaman ke localStorage
function saveBorrowingData(data) {
    let borrowingHistory = JSON.parse(localStorage.getItem('borrowingHistory')) || []; // Ambil data yang sudah ada
    borrowingHistory.push(data); // Tambahkan data baru
    localStorage.setItem('borrowingHistory', JSON.stringify(borrowingHistory)); // Simpan kembali ke localStorage
}

// Fungsi untuk menampilkan riwayat peminjaman
function displayBorrowingHistory() {
    const historyList = document.getElementById('historyList');
    const borrowingHistory = JSON.parse(localStorage.getItem('borrowingHistory')) || [];

    historyList.innerHTML = ''; // Kosongkan daftar sebelumnya
    borrowingHistory.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `Peminjam: ${entry.borrowerName}, Buku: "${entry.bookTitle}", Tanggal: ${entry.borrowDate}`;
        historyList.appendChild(listItem);
    });
}

// Pencarian buku
document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query)
    );
    displayBooks(filteredBooks);
});

// Tampilkan semua buku dan riwayat peminjaman saat halaman dimuat
displayBooks(books);
displayBorrowingHistory();