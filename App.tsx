import React, { useState } from 'react';
import { AppState, UserProfile, Story, QuizData, Item } from './types';
import { Onboarding } from './components/Onboarding';
import { SpaceView } from './components/SpaceView';
import { StoryReader } from './components/StoryReader';
import { Quiz } from './components/Quiz';
import { Avatar } from './components/Avatar';
import { generateStory, generateQuiz, generateRewardOptions } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Game State
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [rewardOptions, setRewardOptions] = useState<Omit<Item, 'x'|'y'|'id'>[]>([]);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile({ ...profile, coins: 50 }); // Start with 50 coins
    setAppState(AppState.DASHBOARD);
  };

  const handleItemUpdate = (updatedItems: Item[]) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, inventory: updatedItems });
    }
  };

  const startReading = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    setLoadingMessage("Tam sana göre bir hikaye yazıyorum...");
    
    try {
      const story = await generateStory(
        userProfile.age, 
        userProfile.name, 
        userProfile.gender,
        userProfile.friends
      );
      setCurrentStory(story);
      setAppState(AppState.READING);
    } catch (error) {
      console.error(error);
      alert("Oops! The story machine is taking a nap. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const finishReading = async () => {
    if (!currentStory || !userProfile) return;

    setLoading(true);
    setLoadingMessage("Sana muhteşem sorular hazırlıyorum...");

    try {
      const quiz = await generateQuiz(currentStory, userProfile.age);
      setCurrentQuiz(quiz);
      setAppState(AppState.QUIZ);
    } catch (error) {
      console.error(error);
      alert("Could not create quiz. Skipping to dashboard.");
      setAppState(AppState.DASHBOARD);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (success: boolean) => {
    if (success && currentStory && userProfile) {
      setLoading(true);
      setLoadingMessage("Harika iş çıkardın! Ödüller aranıyor...");
      
      try {
        const existingNames = userProfile.inventory.map(i => i.name);
        const options = await generateRewardOptions(currentStory.theme, existingNames);
        setRewardOptions(options);
        setAppState(AppState.REWARD_SELECTION);
      } catch (error) {
        console.error(error);
        // Fallback rewards
        setRewardOptions([
          { name: "Gizemli Kutu", emoji: "🎁", description: "Sürpriz bir hediye!" },
          { name: "Yıldız", emoji: "⭐", description: "Parlak bir yıldız." },
          { name: "Çiçek", emoji: "🌸", description: "Güzel bir çiçek." }
        ]);
        setAppState(AppState.REWARD_SELECTION);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Tekrar deneyelim! Yeni bir hikaye okumaya ne dersin?");
      setAppState(AppState.DASHBOARD);
    }
  };

  const claimReward = (selectedReward: Omit<Item, 'x'|'y'|'id'>) => {
    if (!userProfile) return;

    // Random position for the item, centralized
    const newItem: Item = {
      ...selectedReward,
      id: Date.now().toString(),
      x: 50, 
      y: 50, 
    };

    setUserProfile({
      ...userProfile,
      inventory: [...userProfile.inventory, newItem],
      coins: userProfile.coins + 20 // Award coins
    });
    
    setRewardOptions([]);
    setCurrentStory(null);
    setCurrentQuiz(null);
    setAppState(AppState.DASHBOARD);
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-200 to-purple-200">
        {userProfile ? (
          <div className="w-32 h-64 animate-bounce mb-8 drop-shadow-2xl">
            <Avatar config={userProfile.avatar} />
          </div>
        ) : (
          <div className="text-8xl animate-bounce mb-8 drop-shadow-xl">🦊</div>
        )}
        <h2 className="text-4xl font-black text-white drop-shadow-md animate-pulse text-center px-4 max-w-2xl leading-tight">{loadingMessage}</h2>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative bg-slate-100">
      {appState === AppState.ONBOARDING && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {appState === AppState.DASHBOARD && userProfile && (
        <SpaceView 
          spaceType={userProfile.space} 
          items={userProfile.inventory} 
          avatarConfig={userProfile.avatar}
          coins={userProfile.coins}
          onReadClick={startReading}
          onItemUpdate={handleItemUpdate}
        />
      )}

      {appState === AppState.READING && currentStory && (
        <StoryReader story={currentStory} onFinished={finishReading} />
      )}

      {appState === AppState.QUIZ && currentQuiz && (
        <Quiz quiz={currentQuiz} onComplete={handleQuizComplete} />
      )}

      {appState === AppState.REWARD_SELECTION && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/20 p-8 rounded-[3rem] w-full max-w-5xl text-center animate-float border-4 border-white/30">
            <h2 className="text-5xl font-black text-white mb-4 drop-shadow-lg">Harika İş! 🎉</h2>
            <p className="text-2xl text-white/90 mb-12 font-bold">Ödülünü seç!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rewardOptions.map((option, idx) => (
                <button 
                  key={idx}
                  onClick={() => claimReward(option)}
                  className="bg-white rounded-3xl p-6 shadow-2xl transform hover:scale-110 transition-all duration-300 group border-b-8 border-slate-200 hover:border-secondary active:border-b-0 active:translate-y-2"
                >
                  <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner ring-4 ring-white">
                    <span className="text-7xl filter drop-shadow-md group-hover:scale-125 transition-transform">{option.emoji}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-secondary">{option.name}</h3>
                  <p className="text-slate-500 font-medium">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;