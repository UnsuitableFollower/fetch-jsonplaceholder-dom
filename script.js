const fetchBtn = document.getElementById('fetchBtn');
const apiUrlInput = document.getElementById('apiUrl');
const tableHeader = document.getElementById('tableHeader');
const tableBody = document.getElementById('tableBody');
const loadingMsg = document.getElementById('loading');
const errorMsg = document.getElementById('errorMsg');

// Event listener untuk tombol Fetch
fetchBtn.addEventListener('click', () => {
  const apiUrl = apiUrlInput.value.trim();

  // Validasi jika URL kosong atau tidak valid
  if (!isValidUrl(apiUrl)) {
    showError('URL tidak valid. Mohon masukkan URL yang benar.');
    return;
  }

  showLoading(); // Tampilkan loading
  fetchData(apiUrl);
});

// Function untuk memeriksa validitas URL
function isValidUrl(url) {
  try {
    new URL(url); // Jika URL valid, tidak ada error
    return true;
  } catch {
    return false; // Jika URL tidak valid, return false
  }
}

// Function untuk mengambil data menggunakan async/await
async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Jika respons berupa array atau objek tunggal
    if (Array.isArray(data)) {
      displayArrayData(data);
    } else {
      displayObjectData(data);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    showError('Gagal mengambil data. Cek URL atau koneksi internet Anda.');
  } finally {
    hideLoading(); // Sembunyikan loading
  }
}

// Function untuk menampilkan data dalam tabel (array)
function displayArrayData(dataArray) {
  if (dataArray.length === 0) return;

  generateTableHeader(Object.keys(dataArray[0]));

  tableBody.innerHTML = '';
  dataArray.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = Object.values(item)
      .map(value => `<td>${value}</td>`)
      .join('');
    tableBody.appendChild(row);
  });

  errorMsg.classList.add('d-none'); // Sembunyikan pesan error
}

// Function untuk menampilkan data dalam tabel (objek tunggal)
function displayObjectData(dataObject) {
  generateTableHeader(Object.keys(dataObject));

  tableBody.innerHTML = '';
  const row = document.createElement('tr');
  row.innerHTML = Object.values(dataObject)
    .map(value => `<td>${value}</td>`)
    .join('');
  tableBody.appendChild(row);

  errorMsg.classList.add('d-none'); // Sembunyikan pesan error
}

// Function untuk membuat header tabel
function generateTableHeader(keys) {
  tableHeader.innerHTML = `
    <tr>
      ${keys.map(key => `<th>${key}</th>`).join('')}
    </tr>
  `;
}

// Function untuk menampilkan pesan error
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove('d-none'); // Tampilkan pesan error
}

// Function untuk menampilkan loading spinner
function showLoading() {
  loadingMsg.classList.remove('d-none'); // Tampilkan loading
  errorMsg.classList.add('d-none'); // Sembunyikan pesan error
  tableHeader.innerHTML = ''; // Reset header tabel
  tableBody.innerHTML = ''; // Reset body tabel
}

// Function untuk menyembunyikan loading spinner
function hideLoading() {
  loadingMsg.classList.add('d-none'); // Sembunyikan loading
}
