'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_TOPICS = [
  { label: '2025 tax brackets', prompt: 'What are the 2025 federal income tax brackets?' },
  { label: 'Roth vs Traditional IRA', prompt: 'Should I choose a Roth IRA or a Traditional IRA? What are the key differences and which is better for me?' },
  { label: 'Emergency fund size', prompt: 'How much should I have in my emergency fund, and where should I keep it?' },
  { label: 'Capital gains tax', prompt: 'How does capital gains tax work? What are the short-term vs long-term rates for 2025?' },
  { label: 'Maximize my 401(k)', prompt: 'What is the 401(k) contribution limit for 2025 and what is the best strategy to maximize it?' },
  { label: 'Pay off debt vs invest', prompt: 'Should I pay off my debt first or start investing? How do I decide?' },
  { label: 'Standard vs itemized deductions', prompt: 'Should I take the standard deduction or itemize? What can I deduct and when does itemizing make sense?' },
  { label: 'Home office deduction', prompt: 'Can I deduct a home office on my taxes? What are the requirements and how do I calculate it?' },
];

function renderMessage(content: string) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    // Bold (**text**)
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    return (
      <span key={i}>
        {parts}
        {i < lines.length - 1 && '\n'}
      </span>
    );
  });
}

export function FinancialAdvisor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || streaming) return;

    const outgoing: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages([...outgoing, { role: 'assistant', content: '' }]);
    setInput('');
    setStreaming(true);

    try {
      const res = await fetch('/api/financial-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: outgoing }),
      });

      if (!res.ok || !res.body) throw new Error('Request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const evt = JSON.parse(data);
            if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: updated[updated.length - 1].content + evt.delta.text,
                };
                return updated;
              });
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Something went wrong. Please check your API key and try again.',
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }, [messages, streaming]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function autoResize(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm select-none">
              FA
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Financial Advisor</h1>
              <p className="text-xs text-gray-500">Personal finance · Investing · Taxes</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              New chat
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-5">

          {messages.length === 0 && (
            <div className="space-y-6">
              {/* Welcome */}
              <div className="text-center pt-8 pb-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold select-none">
                  $
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your AI Financial Advisor</h2>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Ask me anything about budgeting, investing, retirement, or taxes — I'll give you clear, specific guidance with real numbers.
                </p>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed">
                <strong>Disclaimer:</strong> This AI provides general financial education only and is not a licensed financial advisor, CPA, or attorney. For advice tailored to your situation, consult a qualified professional.
              </div>

              {/* Quick topic grid */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Common questions</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_TOPICS.map(t => (
                    <button
                      key={t.label}
                      onClick={() => send(t.prompt)}
                      disabled={streaming}
                      className="text-left text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-gray-700 disabled:opacity-50"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5 select-none">
                  FA
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-sm'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                }`}
              >
                {msg.role === 'assistant' ? renderMessage(msg.content) : msg.content}
                {streaming && i === messages.length - 1 && msg.role === 'assistant' && msg.content === '' && (
                  <span className="inline-flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                  </span>
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={autoResize}
              onKeyDown={handleKeyDown}
              placeholder="Ask about taxes, budgeting, investing, retirement..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent overflow-y-auto"
              style={{ minHeight: '44px', maxHeight: '128px' }}
            />
            <Button
              onClick={() => send(input)}
              disabled={streaming || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl px-5 h-11 flex-shrink-0"
            >
              {streaming ? '...' : 'Send'}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
