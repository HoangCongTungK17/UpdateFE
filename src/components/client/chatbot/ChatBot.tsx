import { useState, useRef, useEffect } from 'react';
import './chatbot.scss';
import { callFetchChat } from '@/config/api'; // Giả sử em sẽ tạo hàm này, hoặc dùng axios trực tiếp

// Nếu em chưa có hàm callFetchChat trong api.ts, dùng tạm axios ở đây:
import axios from 'axios'; 

interface IMessage {
    text: string;
    sender: 'user' | 'bot';
}

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<IMessage[]>([
        { text: "Xin chào! Tôi là AI hỗ trợ tìm việc. Bạn cần tìm công việc gì?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Tự động cuộn xuống cuối khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        // 1. Thêm tin nhắn User
        const userMsg = inputValue;
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInputValue("");
        setIsLoading(true);

        try {
            // 2. Gọi API Backend (URL phải chuẩn)
            // Lưu ý: Nếu em đã cấu hình axios-customize, hãy dùng instance đó. 
            // Ở đây thầy dùng fetch đơn giản để demo chắc chắn chạy.
            const response = await axios.get(`http://localhost:8080/api/v1/ai/chat?message=${encodeURIComponent(userMsg)}`);
            
            // 3. Thêm tin nhắn Bot trả lời
            const botMsg = response.data; // Vì Backend trả về String trực tiếp hoặc JSON
            // Nếu Backend trả về object JSON { data: "..." } thì sửa thành response.data.data
            
            setMessages(prev => [...prev, { text: typeof botMsg === 'string' ? botMsg : JSON.stringify(botMsg), sender: 'bot' }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "⚠️ Lỗi kết nối Server AI. Vui lòng thử lại!", sender: 'bot' }]);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {!isOpen && (
                <button className="toggle-btn" onClick={() => setIsOpen(true)}>
                    🤖
                </button>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="header">
                        <span>JobFind AI Assistant</span>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                    </div>
                    
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div className="message bot">Đang suy nghĩ...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="input-area">
                        <input
                            type="text"
                            placeholder="Nhập câu hỏi..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={isLoading}
                        />
                        <button onClick={handleSendMessage} disabled={isLoading}>
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;