import React, { useState, useEffect } from 'react';
import { SpaceType, UserProfile, AvatarConfig, Gender } from '../types';
import { Avatar } from './Avatar';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const INITIAL_AVATAR: AvatarConfig = {
  skinColor: '#FFD1AA',
  hairColor: '#4A3627',
  shirtColor: '#FF6B6B',
  style: 0,
};

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('Erkek');
  const [friend1, setFriend1] = useState('');
  const [friend2, setFriend2] = useState('');
  const [age, setAge] = useState<number>(7);
  const [avatar, setAvatar] = useState<AvatarConfig>(INITIAL_AVATAR);
  const [space, setSpace] = useState<SpaceType>('ROOM');

  // Update default avatar style when gender changes to ensure it's valid
  useEffect(() => {
    if (gender === 'Erkek' && (avatar.style === 2 || avatar.style === 3)) {
      setAvatar(prev => ({ ...prev, style: 0 }));
    } else if (gender === 'Kız' && (avatar.style === 0 || avatar.style === 1)) {
      setAvatar(prev => ({ ...prev, style: 2 }));
    }
  }, [gender]);

  const handleNext = () => {
    if (step === 1 && name && friend1 && friend2) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) {
      onComplete({
        name,
        gender,
        friends: [friend1, friend2],
        age,
        avatar,
        space,
        inventory: [],
        coins: 0,
      });
    }
  };

  const getAvailableStyles = () => {
    return gender === 'Erkek' ? [0, 1] : [2, 3];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-purple-300 to-pink-300 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-[3rem] shadow-2xl p-8 w-full max-w-lg border-8 border-white">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2 drop-shadow-sm">StoryQuest</h1>
          <div className="flex justify-center gap-3 mt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-3 w-10 rounded-full transition-all duration-500 ${step >= i ? 'bg-gradient-to-r from-accent to-orange-400 scale-110 shadow' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>

        {/* Step 1: Profile */}
        {step === 1 && (
          <div className="space-y-5 animate-float">
            <div>
              <label className="block text-indigo-600 font-black mb-2 text-lg">Adın ne? (What's your name?)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 text-xl rounded-2xl border-4 border-indigo-100 focus:border-indigo-400 focus:outline-none bg-indigo-50"
                placeholder="Senin Adın"
              />
            </div>
            
            <div>
              <label className="block text-indigo-600 font-black mb-2 text-lg">Cinsiyet (Gender)</label>
              <div className="flex gap-4">
                {(['Erkek', 'Kız'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                      gender === g 
                      ? 'bg-indigo-500 text-white border-indigo-700 shadow-lg' 
                      : 'bg-white text-indigo-400 border-slate-200 hover:bg-indigo-50'
                    }`}
                  >
                    {g === 'Erkek' ? '👦' : '👧'} {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-indigo-600 font-black mb-2 text-sm">En iyi arkadaşın 1</label>
                <input
                  type="text"
                  value={friend1}
                  onChange={(e) => setFriend1(e.target.value)}
                  className="w-full p-3 rounded-xl border-4 border-purple-100 focus:border-purple-400 focus:outline-none bg-purple-50"
                  placeholder="İsim"
                />
              </div>
              <div>
                <label className="block text-indigo-600 font-black mb-2 text-sm">En iyi arkadaşın 2</label>
                <input
                  type="text"
                  value={friend2}
                  onChange={(e) => setFriend2(e.target.value)}
                  className="w-full p-3 rounded-xl border-4 border-purple-100 focus:border-purple-400 focus:outline-none bg-purple-50"
                  placeholder="İsim"
                />
              </div>
            </div>

            <div>
              <label className="block text-indigo-600 font-black mb-2 text-lg">Kaç yaşındasın? ({age})</label>
              <input
                type="range"
                min="4"
                max="12"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-primary h-6 rounded-lg appearance-none bg-slate-200 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Step 2: Avatar */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex justify-center mb-4">
              <div className="w-48 h-48 border-8 border-white rounded-full bg-gradient-to-b from-blue-100 to-white shadow-xl p-2 transform hover:scale-105 transition-transform duration-300">
                <Avatar config={avatar} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-3 rounded-2xl">
                <label className="block text-xs font-black text-orange-400 mb-2 uppercase">Saç Modeli (Hair)</label>
                <div className="flex gap-2">
                  {getAvailableStyles().map(s => (
                    <button
                      key={s}
                      onClick={() => setAvatar({...avatar, style: s})}
                      className={`flex-1 h-10 rounded-lg border-2 transition-all ${avatar.style === s ? 'border-orange-400 bg-orange-200 scale-110' : 'border-orange-100 bg-white'}`}
                    >
                       {s + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-orange-50 p-3 rounded-2xl">
                 <label className="block text-xs font-black text-orange-400 mb-2 uppercase">Ten Rengi (Skin)</label>
                 <div className="flex gap-2 justify-center">
                   {['#FFD1AA', '#E0AC69', '#8D5524'].map(c => (
                     <button key={c} onClick={() => setAvatar({...avatar, skinColor: c})} className={`w-8 h-8 rounded-full border-2 border-white shadow-sm transform transition-transform hover:scale-125 ${avatar.skinColor === c ? 'ring-2 ring-orange-400' : ''}`} style={{backgroundColor: c}} />
                   ))}
                 </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-2xl">
                 <label className="block text-xs font-black text-yellow-500 mb-2 uppercase">Saç Rengi (Color)</label>
                 <div className="flex gap-2 justify-center">
                   {['#4A3627', '#E6BC2F', '#000000', '#A52A2A'].map(c => (
                     <button key={c} onClick={() => setAvatar({...avatar, hairColor: c})} className={`w-8 h-8 rounded-full border-2 border-white shadow-sm transform transition-transform hover:scale-125 ${avatar.hairColor === c ? 'ring-2 ring-yellow-400' : ''}`} style={{backgroundColor: c}} />
                   ))}
                 </div>
              </div>
              <div className="bg-red-50 p-3 rounded-2xl">
                 <label className="block text-xs font-black text-red-400 mb-2 uppercase">Tişört Rengi (Shirt)</label>
                 <div className="flex gap-2 justify-center">
                   {['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'].map(c => (
                     <button key={c} onClick={() => setAvatar({...avatar, shirtColor: c})} className={`w-8 h-8 rounded-full border-2 border-white shadow-sm transform transition-transform hover:scale-125 ${avatar.shirtColor === c ? 'ring-2 ring-red-400' : ''}`} style={{backgroundColor: c}} />
                   ))}
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Space */}
        {step === 3 && (
          <div className="space-y-4">
             <h3 className="text-center text-2xl font-black text-indigo-800 mb-6">Nerede yaşıyorsun?</h3>
             <div className="grid grid-cols-1 gap-4">
               {(['ROOM', 'ISLAND', 'SPACESHIP'] as SpaceType[]).map(type => (
                 <button
                   key={type}
                   onClick={() => setSpace(type)}
                   className={`p-4 rounded-2xl border-4 text-left transition-all flex items-center gap-6 group relative overflow-hidden ${
                     space === type 
                     ? 'border-primary bg-primary/10 scale-105 shadow-xl' 
                     : 'border-slate-100 hover:border-primary/30 bg-white'
                   }`}
                 >
                   <span className="text-5xl transform group-hover:scale-125 transition-transform duration-500">
                     {type === 'ROOM' ? '🏠' : type === 'ISLAND' ? '🏝️' : '🚀'}
                   </span>
                   <div className="z-10">
                     <div className="font-black text-xl text-slate-700 group-hover:text-primary transition-colors">{type === 'ROOM' ? 'Oda' : type === 'ISLAND' ? 'Ada' : 'Uzay Gemisi'}</div>
                     <div className="text-sm text-slate-400 font-bold">Özel Alanın</div>
                   </div>
                 </button>
               ))}
             </div>
          </div>
        )}

        {/* Footer Nav */}
        <div className="mt-10 flex justify-between items-center">
          {step > 1 ? (
             <button onClick={() => setStep(s => s-1)} className="text-slate-400 font-bold hover:text-slate-600 px-4">Geri</button>
          ) : <div></div>}
          <button
            onClick={handleNext}
            disabled={step === 1 && (!name || !friend1 || !friend2)}
            className={`bg-gradient-to-r from-secondary to-teal-400 text-white px-10 py-4 rounded-full font-black text-xl shadow-lg border-b-4 border-teal-600 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 ${
               step === 1 && (!name || !friend1 || !friend2) ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 hover:shadow-teal-300/50'
            }`}
          >
            {step === 3 ? 'Maceraya Başla! 🚀' : 'İleri ➡️'}
          </button>
        </div>

      </div>
    </div>
  );
};