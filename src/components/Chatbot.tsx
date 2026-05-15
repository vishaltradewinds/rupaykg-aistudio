import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Mic, MapPin, Volume2, Loader2, StopCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ai } from "../lib/gemini";
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  chunks?: any[];
  isAudioPlaying?: boolean;
}

export const Chatbot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', text: t('Hello! I am RupayKg AI. How can I help you with waste management, CCCs, or finding nearby facilities?') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (useMaps && !location) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          console.error("Geolocation error:", err);
          setUseMaps(false);
        }
      );
    }
  }, [useMaps, location]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const systemInstruction = `You are RupayKg AI, an expert in waste management, CCC Certificates (CCCs), and environmental sustainability. You assist users with the RupayKg Circular Economy OS, which is powered by Google CircularNet for AI-assisted waste sorting, contamination detection, and weight estimation. Provide concise and helpful answers. The user's preferred language is ${i18n.language || 'en'}. Respond in that language if possible.`;
      
      let response;
      if (useMaps && location) {
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: userMsg.text,
          config: {
            systemInstruction,
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: { latLng: { latitude: location.lat, longitude: location.lng } }
            }
          }
        });
      } else {
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: userMsg.text,
          config: { systemInstruction }
        });
      }
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        text: response.text || t('Sorry, I could not generate a response.'),
        chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: t('Sorry, I encountered an error.') }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64data = reader.result as string;
            const [mimeInfo, base64Audio] = base64data.split(';base64,');
            
            setIsLoading(true);
            try {
              const response = await ai.models.generateContent({
                model: "gemini-3.1-flash-lite",
                contents: [
                  {
                    parts: [
                      { inlineData: { data: base64Audio, mimeType: mimeInfo.split(':')[1] } },
                      { text: "Transcribe the following audio accurately." }
                    ]
                  }
                ]
              });
              if (response.text) {
                setInput(prev => prev + (prev ? ' ' : '') + response.text);
              }
            } catch (err) {
              console.error(err);
            } finally {
              setIsLoading(false);
            }
          };
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    }
  };

  const playTTS = async (messageId: string, text: string) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setMessages(prev => prev.map(m => ({ ...m, isAudioPlaying: false })));
    }

    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isAudioPlaying: true } : m));

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
        }
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (base64Audio) {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        currentAudioRef.current = audio;
        audio.onended = () => {
          setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isAudioPlaying: false } : m));
        };
        audio.play();
      }
    } catch (err) {
      console.error("TTS Error:", err);
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isAudioPlaying: false } : m));
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-emerald-500 text-black rounded-full shadow-lg hover:bg-emerald-400 transition-colors z-50"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-[#1A1A1B] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <h3 className="font-bold text-white">{t('RupayKg AI')}</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.role === 'user' ? 'bg-emerald-500 text-black rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'
                  }`}>
                    <div className="text-sm prose prose-invert max-w-none">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    
                    {msg.chunks && msg.chunks.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1">
                        <span className="text-[10px] uppercase text-white/40 font-bold">{t('Sources:')}</span>
                        {msg.chunks.map((chunk, i) => {
                          if (chunk.web?.uri) {
                            return <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-400 hover:underline truncate block">{chunk.web.title || chunk.web.uri}</a>;
                          }
                          if (chunk.maps?.uri) {
                            return <a key={i} href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline truncate block flex items-center gap-1"><MapPin size={10}/> {chunk.maps.title || t('Map Location')}</a>;
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                  
                  {msg.role === 'ai' && (
                    <button 
                      onClick={() => playTTS(msg.id, msg.text)}
                      className={`mt-1 text-[10px] flex items-center gap-1 px-2 py-1 rounded-full border ${msg.isAudioPlaying ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'text-white/40 border-white/10 hover:bg-white/5'}`}
                    >
                      {msg.isAudioPlaying ? <Volume2 size={10} className="animate-pulse" /> : <Volume2 size={10} />}
                      {msg.isAudioPlaying ? t('Playing...') : t('Read Aloud')}
                    </button>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-white/10 text-white p-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-emerald-500" />
                    <span className="text-xs text-white/60">{t('Thinking...')}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white/5 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2 px-1">
                <button 
                  onClick={() => setUseMaps(!useMaps)}
                  className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1 transition-colors ${useMaps ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'}`}
                >
                  <MapPin size={10} />
                  {useMaps ? t('Maps Grounding On') : t('Use Maps')}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleRecording}
                  className={`p-2 rounded-xl transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
                >
                  {isRecording ? <StopCircle size={18} /> : <Mic size={18} />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('Ask RupayKg AI...')}
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
