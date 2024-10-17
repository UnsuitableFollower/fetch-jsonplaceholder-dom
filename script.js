const tableHeader = document.getElementById('tableHeader');
const tableBody = document.getElementById('tableBody');
const loadingMsg = document.getElementById('loading');
const errorMsg = document.getElementById('errorMsg');
const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
const modalBody = document.getElementById('modalBody');

// Automatically fetch data from the API when the page loads
window.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts/';
  fetchData(apiUrl);
});

// Fetch data from the API
async function fetchData(url) {
  try {
    showLoading();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    await displayData(data);
  } catch (error) {
    showError('Gagal mengambil data. Cek URL atau koneksi internet Anda.');
  } finally {
    hideLoading();
  }
}

// Display users and their posts in the table
async function displayData(dataArray) {
  const userMap = new Map();

  for (const post of dataArray) {
    const user = await fetchUser(post.userId);
    if (!userMap.has(post.userId)) {
      userMap.set(post.userId, { user, posts: [] });
    }
    userMap.get(post.userId).posts.push(post);
  }

  generateTableHeader(['Nama', 'Nomor', 'Email', 'Actions']);
  tableBody.innerHTML = '';

  userMap.forEach(({ user }) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.name || 'N/A'}</td>
      <td>${user.phone || 'N/A'}</td>
      <td>${user.email || 'N/A'}</td>
      <td>
        <button class="btn btn-info btn-sm me-1" onclick="fetchUserPosts(${user.id})">Post</button>
        <button class="btn btn-warning btn-sm me-1" onclick="fetchUserAlbums(${user.id})">Album</button>
        <button class="btn btn-success btn-sm me-1" onclick="fetchUserTodos(${user.id})">Todo List</button>
        <button class="btn btn-secondary btn-sm" onclick="fetchUserDetail(${user.id})">Detail</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  errorMsg.classList.add('d-none');
}

// Fetch user data by userId
async function fetchUser(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return { name: 'N/A', phone: 'N/A', email: 'N/A' };
  }
}

// Fetch and display user posts in the modal
async function fetchUserPosts(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const posts = await response.json();
    modalBody.innerHTML = formatPostData(posts);
    detailModal.show();
  } catch (error) {
    modalBody.innerHTML = '<p>Error fetching posts.</p>';
  }
}

// Fetch and display user albums in the modal
async function fetchUserAlbums(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const albums = await response.json();
    modalBody.innerHTML = formatAlbumData(albums);
    detailModal.show();
  } catch (error) {
    modalBody.innerHTML = '<p>Error fetching albums.</p>';
  }
}

// Fetch and display user todos in the modal
async function fetchUserTodos(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const todos = await response.json();
    modalBody.innerHTML = formatTodoData(todos);
    detailModal.show();
  } catch (error) {
    modalBody.innerHTML = '<p>Error fetching todos.</p>';
  }
}

// Format post data for the modal
function formatPostData(posts) {
  if (posts.length === 0) return '<p>No posts found.</p>';
  return `
    <h5>Posts:</h5>
    <ul class="list-group">
      ${posts.map(post => `<li class="list-group-item"><strong>${post.title}</strong>: ${post.body}</li>`).join('')}
    </ul>
  `;
}

// Format album data for the modal
function formatAlbumData(albums) {
  if (albums.length === 0) return '<p>No albums found.</p>';
  return `
    <h5>Albums:</h5>
    <ul class="list-group">
      ${albums.map(album => `
        <li class="list-group-item">
          <strong>${album.title}</strong>
          <button class="btn btn-primary btn-sm float-end" onclick="fetchAlbumPhotos(${album.id})">View Photos</button>
        </li>`).join('')}
    </ul>
  `;
}

// Fetch and display album photos
async function fetchAlbumPhotos(albumId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const photos = await response.json();
    modalBody.innerHTML = formatPhotoData(photos);
    detailModal.show();
  } catch (error) {
    modalBody.innerHTML = '<p>Error fetching photos.</p>';
  }
}

// Fetch and display user details in the modal
async function fetchUserDetail(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const user = await response.json();
    modalBody.innerHTML = formatUserDetail(user);
    detailModal.show();
  } catch (error) {
    modalBody.innerHTML = '<p>Error fetching user details.</p>';
  }
}

// Format user detail data for the modal
function formatUserDetail(user) {
  return `
    <h5>User Detail:</h5>
    <ul class="list-group">
      <li class="list-group-item"><strong>Name:</strong> ${user.name}</li>
      <li class="list-group-item"><strong>Email:</strong> ${user.email}</li>
      <li class="list-group-item"><strong>Phone:</strong> ${user.phone}</li>
      <li class="list-group-item"><strong>Website:</strong> ${user.website}</li>
      <li class="list-group-item"><strong>Company:</strong> ${user.company.name}</li>
      <li class="list-group-item"><strong>Address:</strong> 
        ${user.address.suite}, ${user.address.street}, ${user.address.city}, ${user.address.zipcode}
      </li>
    </ul>
  `;
}


// Format photo data for the modal
function formatPhotoData(photos) {
  if (photos.length === 0) return '<p>No photos found.</p>';
  return `
    <h5>Photos:</h5>
    <div class="row">
      ${photos.map(photo => `
        <div class="col-6 col-md-4">
          <div class="card mb-3">
            <img src="${photo.thumbnailUrl}" class="card-img-top" alt="${photo.title}">
            <div class="card-body">
              <h5 class="card-title">${photo.title}</h5>
              <a href="${photo.url}" class="btn btn-primary" target="_blank">View Full Image</a>
            </div>
          </div>
        </div>`).join('')}
    </div>
  `;
}

// Format todo data for the modal
function formatTodoData(todos) {
  if (todos.length === 0) return '<p>No todos found.</p>';
  return `
    <h5>Todo List:</h5>
    <ul class="list-group">
      ${todos.map(todo => `
        <li class="list-group-item">
          <strong>${todo.title}</strong>
          <span class="badge bg-${todo.completed ? 'success' : 'danger'} float-end">
            ${todo.completed ? 'Completed' : 'Incomplete'}
          </span>
        </li>`).join('')}
    </ul>
  `;
}

// Generate table header
function generateTableHeader(keys) {
  tableHeader.innerHTML = `<tr>${keys.map(key => `<th>${key}</th>`).join('')}</tr>`;
}

// Show error message
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove('d-none');
}

// Show loading spinner
function showLoading() {
  loadingMsg.classList.remove('d-none');
  errorMsg.classList.add('d-none');
  tableHeader.innerHTML = '';
  tableBody.innerHTML = '';
}

// Hide loading spinner
function hideLoading() {
  loadingMsg.classList.add('d-none');
}
