import React from 'react';
import { Story } from '../types';

interface StoryReaderProps {
  story: Story;
  onFinished: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({ story, onFinished }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[90vw] h-[85vh] overflow-hidden flex flex-col">
        
        {/* Header - Fixed */}
        <div className="bg-primary p-4 text-white flex items-center justify-between shrink-0 px-8 shadow-md z-10">
          <div>
            <span className="text-xs opacity-80 uppercase tracking-wider font-bold block">{story.theme} Story</span>
            <h2 className="text-2xl font-bold">{story.title}</h2>
          </div>
          <button
            onClick={onFinished}
            className="bg-secondary hover:bg-teal-400 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 border-b-4 border-teal-600 active:border-b-0 active:translate-y-1"
          >
            Bitirdim! 🚀
          </button>
        </div>

        {/* Content - Flex Row to use width */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Image Column */}
          <div className="lg:w-1/2 bg-slate-100 p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200">
            {story.imageUrl ? (
              <div className="relative w-full h-full max-h-[50vh] lg:max-h-full rounded-2xl overflow-hidden shadow-lg border-4 border-white group">
                <img 
                  src={story.imageUrl} 
                  alt="Story Illustration" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-slate-200 rounded-2xl flex items-center justify-center">
                 <span className="text-4xl">📖</span>
              </div>
            )}
          </div>

          {/* Text Column - Scrollable only if absolutely necessary */}
          <div className="lg:w-1/2 bg-amber-50 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 flex flex-col">
             <div className="bg-white/60 p-6 rounded-2xl shadow-sm border border-amber-100 my-auto">
                <p className="text-xl lg:text-2xl leading-relaxed text-slate-800 font-medium whitespace-pre-wrap font-sans text-justify">
                  {story.content}
                </p>
             </div>
             
             <div className="mt-8 text-center lg:hidden">
               {/* Mobile duplicate button for easy access */}
               <button
                onClick={onFinished}
                className="bg-secondary w-full text-white font-bold py-4 rounded-xl shadow-lg border-b-4 border-teal-600 active:border-b-0 active:translate-y-1"
              >
                Bitirdim! 🚀
              </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};