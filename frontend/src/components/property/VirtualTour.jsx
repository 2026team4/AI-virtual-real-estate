import { X, RotateCcw, ExternalLink } from 'lucide-react';

// Renders an iframe-based 360° viewer.
// Supports: Matterport, Kuula, Google Street View, or any iframe-embeddable URL.
// Falls back to a demo Pannellum equirectangular embed when no URL is provided.

const DEMO_TOUR = 'https://pannellum.org/images/alma.jpg'; // demo equirectangular image

export default function VirtualTour({ url, title, fullscreen = false, onClose }) {
  const embedUrl = url || null;

  const content = (
    <div className={fullscreen ? 'fixed inset-0 z-50 bg-black flex flex-col' : ''}>
      {fullscreen && (
        <div className="flex items-center justify-between px-6 py-3 bg-black/80 text-white">
          <div className="flex items-center gap-2">
            <RotateCcw size={18} className="text-primary-400" />
            <span className="font-medium text-sm">{title} — 360° Virtual Tour</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20">
            <X size={20} />
          </button>
        </div>
      )}

      {embedUrl ? (
        <iframe
          src={embedUrl}
          title="360° Virtual Tour"
          className={fullscreen ? 'flex-1 w-full' : 'w-full rounded-2xl border border-gray-200'}
          style={fullscreen ? {} : { height: 420 }}
          allowFullScreen
          allow="xr-spatial-tracking"
        />
      ) : (
        <div className={`flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-dark-900 to-primary-900 text-white ${
          fullscreen ? 'flex-1' : 'rounded-2xl p-16'
        }`}>
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center animate-bounce-slow">
            <RotateCcw size={36} className="text-primary-300" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Virtual Tour Coming Soon</h3>
            <p className="text-white/60 text-sm max-w-sm">
              The seller hasn't uploaded a 360° tour yet. You can request one by booking a virtual meeting.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40 mt-2">
            <RotateCcw size={12} />
            <span>Supports Matterport, Kuula, and Google Street View links</span>
          </div>
        </div>
      )}
    </div>
  );

  return content;
}
