'use client';

import { useState } from 'react';
import { Mail, Send, Sparkles, Copy, Check } from 'lucide-react';

export default function Home() {
  const [originalEmail, setOriginalEmail] = useState('');
  const [tone, setTone] = useState('professional');
  const [replyType, setReplyType] = useState('reply');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateReply = async () => {
    if (!originalEmail.trim()) return;

    setLoading(true);
    setGeneratedReply('');

    try {
      const response = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: originalEmail,
          tone,
          replyType,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate reply');

      const data = await response.json();
      setGeneratedReply(data.reply);
    } catch (error) {
      console.error('Error:', error);
      setGeneratedReply('Error generating reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">AI Email Reply Agent</h1>
          </div>
          <p className="text-gray-600">Generate professional email replies instantly with AI</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              Original Email
            </h2>

            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Paste the email you want to reply to here..."
              value={originalEmail}
              onChange={(e) => setOriginalEmail(e.target.value)}
            />

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply Type
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={replyType}
                  onChange={(e) => setReplyType(e.target.value)}
                >
                  <option value="reply">Reply</option>
                  <option value="accept">Accept</option>
                  <option value="decline">Politely Decline</option>
                  <option value="followup">Follow Up</option>
                  <option value="thank">Thank You</option>
                </select>
              </div>

              <button
                onClick={generateReply}
                disabled={loading || !originalEmail.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Reply
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-600" />
              Generated Reply
            </h2>

            <div className="relative">
              <textarea
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-gray-50"
                placeholder="Your AI-generated reply will appear here..."
                value={generatedReply}
                readOnly
              />

              {generatedReply && (
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 bg-white hover:bg-gray-100 border border-gray-300 p-2 rounded-lg transition duration-200"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              )}
            </div>

            {generatedReply && (
              <div className="mt-4 space-y-2">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h3 className="font-semibold text-indigo-800 mb-2">Tips:</h3>
                  <ul className="text-sm text-indigo-700 space-y-1">
                    <li>• Review and personalize the reply before sending</li>
                    <li>• Add specific details relevant to your situation</li>
                    <li>• Check spelling and formatting</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3">How it works:</h3>
          <ol className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="font-bold text-indigo-600">1.</span>
              <span>Paste the email you received into the left box</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-indigo-600">2.</span>
              <span>Select your preferred tone and reply type</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-indigo-600">3.</span>
              <span>Click "Generate Reply" and the AI will craft a professional response</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-indigo-600">4.</span>
              <span>Review, customize if needed, and copy to send</span>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
