import { useState } from 'react';
import { ArrowLeft, Send, Phone, MoreVertical } from 'lucide-react';
import { mockChats } from '../context/AppContext';

const initialMessages = [
  {
    id: 1,
    from: 'them',
    text: "Hey, the ride is at 5:30 PM. I'll pick you from Gate 1.",
    time: '5:10 PM',
  },
  {
    id: 2,
    from: 'me',
    text: "Perfect! I'll be there 5 mins early.",
    time: '5:12 PM',
  },
  {
    id: 3,
    from: 'them',
    text: "I'll be at Gate 1 in 5 mins 🚗",
    time: '5:24 PM',
  },
];

function ChatWindow({ contact, onBack }) {
  const [msgs, setMsgs] = useState(initialMessages);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;

    setMsgs([
      ...msgs,
      {
        id: Date.now(),
        from: 'me',
        text: input.trim(),
        time: 'Now',
      },
    ]);

    setInput('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        background: 'var(--bg)',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'var(--bg2)',
          borderBottom: '1px solid var(--border)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text2)',
            display: 'flex',
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <div
          className={`avatar ${contact.avatar}`}
          style={{
            width: 36,
            height: 36,
            fontSize: 12,
          }}
        >
          {contact.initials}
        </div>

        <div style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            {contact.name}
          </p>

          <p
            style={{
              fontSize: 11,
              color: 'var(--green)',
            }}
          >
            ● Online
          </p>
        </div>

        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text2)',
          }}
        >
          <Phone size={18} />
        </button>

        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text2)',
          }}
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          <span
            className="pill pill-gray"
            style={{
              fontSize: 11,
            }}
          >
            Today · Ride to {contact.ride || 'Sector 18'}
          </span>
        </div>

        {msgs.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              justifyContent:
                m.from === 'me' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '72%',
                background:
                  m.from === 'me'
                    ? 'var(--accent)'
                    : 'var(--surface)',
                borderRadius:
                  m.from === 'me'
                    ? '14px 14px 4px 14px'
                    : '14px 14px 14px 4px',
                padding: '10px 13px',
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color:
                    m.from === 'me'
                      ? '#fff'
                      : 'var(--text)',
                  lineHeight: 1.4,
                }}
              >
                {m.text}
              </p>

              <p
                style={{
                  fontSize: 10,
                  color:
                    m.from === 'me'
                      ? 'rgba(255,255,255,0.6)'
                      : 'var(--text3)',
                  marginTop: 4,
                  textAlign: 'right',
                }}
              >
                {m.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick replies */}
      <div
        style={{
          padding: '0 14px 8px',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {[
          "I'm at Gate 1 🙋",
          'Running 5 mins late',
          'On my way!',
          'Thanks! Safe trip ✌️',
        ].map((r) => (
          <button
            key={r}
            onClick={() => setInput(r)}
            style={{
              flexShrink: 0,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '6px 12px',
              fontSize: 12,
              color: 'var(--text2)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              whiteSpace: 'nowrap',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          padding: '8px 14px 24px',
          background: 'var(--bg2)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <input
          className="input-field"
          style={{
            flex: 1,
          }}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              send();
            }
          }}
        />

        <button
          onClick={send}
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: input.trim()
              ? 'var(--accent)'
              : 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
        >
          <Send
            size={16}
            color={
              input.trim()
                ? '#fff'
                : 'var(--text3)'
            }
          />
        </button>
      </div>
    </div>
  );
}

export default function Chat({ openContact, onBack }) {
  const [activeChat, setActiveChat] = useState(
    openContact || null
  );

  if (activeChat) {
    return (
      <ChatWindow
        contact={activeChat}
        onBack={() => {
          setActiveChat(null);

          if (openContact) {
            onBack();
          }
        }}
      />
    );
  }

  return (
    <div className="page">
      <div
        style={{
          padding: '20px 20px 16px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: '-0.5px',
          }}
        >
          Messages
        </h1>
      </div>

      <div
        style={{
          padding: '0 20px',
        }}
      >
        {mockChats.map((chat, i) => (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat)}
            className={`fade-up-${Math.min(i + 1, 4)}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '13px 0',
              borderBottom:
                '1px solid var(--border)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                position: 'relative',
              }}
            >
              <div
                className={`avatar ${chat.avatar}`}
              >
                {chat.initials}
              </div>

              {chat.online && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 1,
                    right: 1,
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: 'var(--green)',
                    border:
                      '2px solid var(--bg)',
                  }}
                />
              )}
            </div>

            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  marginBottom: 3,
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {chat.name}
                </span>

                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--text3)',
                  }}
                >
                  {chat.time}
                </span>
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: 'var(--text2)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {chat.lastMsg}
              </p>
            </div>

            {chat.unread > 0 && (
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {chat.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}