const postsContainer = document.getElementById('posts-container');
const createPostBtn = document.getElementById('create-post-btn');
const textarea = document.querySelector('.post-create textarea');

const API_URL = "http://localhost:3000"; // ou URL do seu deploy

// Função para buscar feed real do backend
async function loadFeed() {
  try {
    const res = await fetch(`${API_URL}/posts`, {
      credentials: "include" // envia cookies de sessão
    });
    if (!res.ok) throw new Error("Erro ao carregar feed");
    const data = await res.json();
    renderPosts(data);
  } catch (err) {
    console.error(err);
    postsContainer.innerHTML = '<p>Não foi possível carregar o feed.</p>';
  }
}

// Renderizar posts recebidos do backend
function renderPosts(posts) {
  postsContainer.innerHTML = '';
  posts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    
    const likesCount = post.likes?.length || 0;
    const commentsCount = post.comments?.length || 0;

    postDiv.innerHTML = `
      <div class="author">${post.author.username}</div>
      <div class="content">${post.content}</div>
      <div class="actions">
        <button onclick="likePost(${post.id})">Curtir (${likesCount})</button>
        <button onclick="commentPost(${post.id})">Comentar (${commentsCount})</button>
      </div>
    `;

    postsContainer.appendChild(postDiv);
  });
}

// Criar post
createPostBtn.addEventListener('click', async () => {
  const content = textarea.value.trim();
  if (!content) return;

  try {
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error("Erro ao criar post");
    textarea.value = '';
    loadFeed(); // atualiza feed
  } catch (err) {
    console.error(err);
    alert("Não foi possível criar o post.");
  }
});

// Curtir post
async function likePost(postId) {
  try {
    const res = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      credentials: "include"
    });
    if (!res.ok) {
      const errData = await res.json();
      return alert(errData.message || "Erro ao curtir post");
    }
    loadFeed();
  } catch (err) {
    console.error(err);
  }
}

// Comentar post
async function commentPost(postId) {
  const comment = prompt("Digite seu comentário:");
  if (!comment) return;

  try {
    const res = await fetch(`${API_URL}/posts/${postId}/comment`, {
      method: 'POST',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: comment })
    });
    if (!res.ok) throw new Error("Erro ao comentar");
    loadFeed();
  } catch (err) {
    console.error(err);
    alert("Não foi possível comentar.");
  }
}

// Carregar feed ao abrir a página
loadFeed();