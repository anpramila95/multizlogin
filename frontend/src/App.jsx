import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [proxy, setProxy] = useState('');
  const [qrImage, setQrImage] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [ownId, setOwnId] = useState('');
  const [threadId, setThreadId] = useState('');
  const [message, setMessage] = useState('');
  const [friendId, setFriendId] = useState('');
  const [response, setResponse] = useState('');

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/accounts', { headers: { Accept: 'application/json' } });
      const data = await res.json();
      if (data.accounts) {
        setAccounts(data.accounts);
        if (data.accounts.length > 0) {
          setOwnId(data.accounts[0].ownId);
        }
      }
    } catch (err) {
      console.error('Failed to fetch accounts', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const generateQR = async () => {
    setQrImage(null);
    try {
      const res = await fetch('/zalo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proxy }),
      });
      const data = await res.json();
      if (data.qrCodeImage) {
        setQrImage(data.qrCodeImage);
      }
    } catch (err) {
      console.error('QR login error', err);
    }
  };

  const sendMessage = async () => {
    try {
      const res = await fetch('/api/sendmessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownId, threadId, message }),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Send message error', err);
    }
  };

  const addFriend = async () => {
    try {
      const res = await fetch('/api/sendFriendRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownId, userId: friendId }),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Add friend error', err);
    }
  };

  return (
    <div className="container">
      <h1>Zalo Bot UI</h1>

      <section>
        <h2>Đăng nhập Zalo</h2>
        <input
          type="text"
          placeholder="Proxy (tuỳ chọn)"
          value={proxy}
          onChange={(e) => setProxy(e.target.value)}
        />
        <button onClick={generateQR}>Tạo mã QR</button>
        {qrImage && <img src={qrImage} alt="QR Code" style={{ width: 200, height: 200 }} />}
      </section>

      <section>
        <h2>Tài khoản đã đăng nhập</h2>
        <button onClick={fetchAccounts}>Làm mới</button>
        <ul>
          {accounts.map((acc) => (
            <li key={acc.ownId} onClick={() => setOwnId(acc.ownId)}>
              {acc.ownId} - {acc.phoneNumber}
            </li>
          ))}
        </ul>
        <p>Own ID hiện tại: {ownId || 'Chưa chọn'}</p>
      </section>

      <section>
        <h2>Gửi tin nhắn</h2>
        <input
          type="text"
          placeholder="Thread ID"
          value={threadId}
          onChange={(e) => setThreadId(e.target.value)}
        />
        <textarea
          placeholder="Nội dung"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Gửi</button>
      </section>

      <section>
        <h2>Kết bạn</h2>
        <input
          type="text"
          placeholder="User ID"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
        />
        <button onClick={addFriend}>Gửi lời mời</button>
      </section>

      {response && (
        <section>
          <h2>Kết quả</h2>
          <pre>{response}</pre>
        </section>
      )}
    </div>
  );
}

export default App;
