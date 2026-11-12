import { useState } from 'react';
import { bookingAPI } from '../../services/api';
import Modal from '../common/Modal';
import { Calendar, Clock, MessageSquare, Video, Home, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const BOOKING_TYPES = [
  { id: 'visit',   label: 'Physical Visit',  icon: <Home size={18} />,         desc: 'Visit the property in person' },
  { id: 'virtual', label: 'Virtual Meeting', icon: <Video size={18} />,        desc: 'Live video tour with seller'  },
  { id: 'inquiry', label: 'General Inquiry', icon: <HelpCircle size={18} />,   desc: 'Ask questions about property' },
];

export default function BookingModal({ property, onClose }) {
  const [type,    setType]    = useState('visit');
  const [date,    setDate]    = useState('');
  const [time,    setTime]    = useState('10:00');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) { toast.error('Please select a date'); return; }
    setLoading(true);
    try {
      await bookingAPI.create({
        property_id:  property.id,
        booking_type: type,
        visit_date:   date,
        visit_time:   time,
        message,
      });
      setDone(true);
      toast.success('Booking request sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen title={done ? 'Booking Confirmed!' : 'Request a Visit'} onClose={onClose} size="sm">
      {done ? (
        <div className="flex flex-col items-center py-6 gap-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Calendar size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Request Sent!</h3>
          <p className="text-gray-500 text-sm max-w-xs">
            Your {type} request for <strong>{property.title}</strong> has been sent.
            The seller will confirm within 24 hours.
          </p>
          <button onClick={onClose} className="btn-primary w-full mt-2">Close</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Property quick info */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <img
              src={property.thumbnail || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=80'}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
              alt={property.title}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{property.title}</p>
              <p className="text-xs text-gray-400">{property.city}, {property.state}</p>
            </div>
          </div>

          {/* Booking type */}
          <div>
            <label className="label">Visit Type</label>
            <div className="grid grid-cols-3 gap-2">
              {BOOKING_TYPES.map((t) => (
                <button key={t.id} type="button" onClick={() => setType(t.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs transition-colors ${
                    type === t.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}>
                  <span className={type === t.id ? 'text-primary-600' : 'text-gray-400'}>{t.icon}</span>
                  <span className="font-medium text-center leading-tight">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Preferred Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" value={date} min={minDateStr}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field pl-9 text-sm py-2.5" required />
              </div>
            </div>
            <div>
              <label className="label">Preferred Time</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="time" value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="input-field pl-9 text-sm py-2.5" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="label">Message to Seller (optional)</label>
            <div className="relative">
              <MessageSquare size={16} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any specific questions or requirements..."
                rows={3}
                className="input-field pl-9 text-sm resize-none"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Sending…' : 'Send Booking Request'}
          </button>
        </form>
      )}
    </Modal>
  );
}
