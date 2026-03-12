import React from 'react';
import { FiShield, FiLock, FiCheckCircle, FiDollarSign, FiClock, FiAward } from 'react-icons/fi';

const TrustIndicators = () => {
  const indicators = [
    {
      icon: <FiShield size={24}/>,
      title: 'Payment Protection',
      desc: 'Secure escrow system protects your funds',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: <FiLock size={24}/>,
      title: 'SSL Encrypted',
      desc: '256-bit bank-level encryption',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <FiCheckCircle size={24}/>,
      title: 'Verified Users',
      desc: 'All profiles verified manually',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: <FiDollarSign size={24}/>,
      title: 'Money-Back Guarantee',
      desc: '100% refund if not satisfied',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: <FiClock size={24}/>,
      title: '24/7 Support',
      desc: 'Round the clock customer service',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: <FiAward size={24}/>,
      title: 'Quality Guaranteed',
      desc: 'Top 5% talent marketplace',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-3">Your Security is Our Priority</h2>
          <p className="text-lg text-gray-600">Multiple layers of protection to keep you safe</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {indicators.map((item, index) => (
            <div key={index} className="group bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
              <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust Badges Row */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6">
          {[
            { text: 'SSL Secured', subtext: '256-bit Encryption' },
            { text: 'Payment Protected', subtext: 'Escrow System' },
            { text: 'GDPR Compliant', subtext: 'Data Privacy' },
            { text: '100% Verified', subtext: 'Manual Review' }
          ].map((badge, i) => (
            <div key={i} className="flex items-center space-x-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-green-500 transition-all group cursor-default">
              <FiShield className="text-green-600 group-hover:scale-110 transition-transform" size={24}/>
              <div>
                <p className="text-sm font-bold text-gray-900">{badge.text}</p>
                <p className="text-xs text-gray-500">{badge.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
