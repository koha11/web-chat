import renderChatlist from './renderChatlist.js';

renderChatlist()
  .then((response) => response.json()) // Chuyển đổi response thành JSON
  .then((data) => console.log(data)) // Hiển thị dữ liệu
  .catch((error) => console.error('Lỗi:', error));
