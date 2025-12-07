import { useState } from 'react';
import { Headphones, Palette, Pen, Scissors, Mic, Video, Smile, Music, Code, Users, Shield } from 'lucide-react';

const creatorTypes = [
  { name: 'Animal Rescue & Shelters', icon: Headphones, highlighted: false },
  { name: 'Wildlife Protection', icon: Palette, highlighted: false },
  { name: 'Farm Animal Sanctuaries', icon: Pen, highlighted: false },
  { name: 'Ocean & Water Protection', icon: Scissors, highlighted: false },
  { name: 'Nonprofits', icon: Mic, highlighted: false },
  { name: 'Emergency Causes', icon: Video, highlighted: false },
  { name: 'Education & Awareness', icon: Smile, highlighted: false },
  { name: 'Volunteers & Field Workers', icon: Music, highlighted: false },
  { name: 'Kind Acts', icon: Code, highlighted: false },
  { name: 'Veterans', icon: Shield, highlighted: false },
  { name: 'Community Care', icon: Users, highlighted: true }
];

const creatorExamples: { [key: string]: { image: string; alt: string; username: string }[] } = {
  'Animal Rescue & Shelters': [
    {
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Animal Rescue',
      username: 'animalrescue'
    }
  ],
  'Wildlife Protection': [
    {
      image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Wildlife Conservation',
      username: 'wildlifeconservation'
    },
    {
      image: 'https://images.pexels.com/photos/3551227/pexels-photo-3551227.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Wildlife Protection',
      username: 'wildprotect'
    },
    {
      image: 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Nature Conservation',
      username: 'naturecare'
    }
  ],
  'Farm Animal Sanctuaries': [
    {
      image: 'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Farm Sanctuary',
      username: 'farmsanctuary'
    },
    {
      image: 'https://images.pexels.com/photos/1202086/pexels-photo-1202086.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Animal Sanctuary',
      username: 'animalsanctuary'
    },
    {
      image: 'https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Farm Care',
      username: 'farmcare'
    }
  ],
  'Ocean & Water Protection': [
    {
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Ocean Conservation',
      username: 'oceanconservation'
    },
    {
      image: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Water Protection',
      username: 'waterprotect'
    },
    {
      image: 'https://images.pexels.com/photos/3188502/pexels-photo-3188502.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Marine Conservation',
      username: 'marinecare'
    }
  ],
  'Nonprofits': [
    {
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Nonprofit Organization',
      username: 'nonprofitorg'
    },
    {
      image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Charity Work',
      username: 'charitywork'
    },
    {
      image: 'https://images.pexels.com/photos/6647034/pexels-photo-6647034.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Community Service',
      username: 'communityservice'
    }
  ],
  'Emergency Causes': [
    {
      image: 'https://images.pexels.com/photos/6647119/pexels-photo-6647119.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Emergency Relief',
      username: 'emergencyrelief'
    },
    {
      image: 'https://images.pexels.com/photos/6647112/pexels-photo-6647112.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Crisis Response',
      username: 'crisisresponse'
    },
    {
      image: 'https://images.pexels.com/photos/6646914/pexels-photo-6646914.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Emergency Aid',
      username: 'emergencyaid'
    }
  ],
  'Education & Awareness': [
    {
      image: 'https://images.pexels.com/photos/1516440/pexels-photo-1516440.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Education Programs',
      username: 'educationprograms'
    },
    {
      image: 'https://images.pexels.com/photos/8923243/pexels-photo-8923243.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Awareness Campaigns',
      username: 'awarenesscampaigns'
    },
    {
      image: 'https://images.pexels.com/photos/8923173/pexels-photo-8923173.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Community Education',
      username: 'communityeducation'
    }
  ],
  'Volunteers & Field Workers': [
    {
      image: 'https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Volunteer Work',
      username: 'volunteerwork'
    },
    {
      image: 'https://images.pexels.com/photos/6647028/pexels-photo-6647028.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Field Workers',
      username: 'fieldworkers'
    },
    {
      image: 'https://images.pexels.com/photos/6646915/pexels-photo-6646915.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Community Volunteers',
      username: 'communityvolunteers'
    }
  ],
  'Kind Acts': [
    {
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Acts of Kindness',
      username: 'kindacts'
    },
    {
      image: 'https://images.pexels.com/photos/6646916/pexels-photo-6646916.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Helping Others',
      username: 'helpingothers'
    },
    {
      image: 'https://images.pexels.com/photos/6647029/pexels-photo-6647029.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Kind Gestures',
      username: 'kindgestures'
    }
  ],
  'Veterans': [
    {
      image: 'https://images.pexels.com/photos/5417270/pexels-photo-5417270.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Veterans Support',
      username: 'veteranssupport'
    },
    {
      image: 'https://images.pexels.com/photos/2855761/pexels-photo-2855761.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Military Veterans',
      username: 'militaryveterans'
    },
    {
      image: 'https://images.pexels.com/photos/6966/abstract-music-rock-bw.jpg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Veterans Care',
      username: 'veteranscare'
    }
  ],
  'Community Care': [
    {
      image: 'https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Community Care',
      username: 'communitycare'
    },
    {
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Community Support',
      username: 'communitysupport'
    },
    {
      image: 'https://images.pexels.com/photos/6646975/pexels-photo-6646975.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Community Building',
      username: 'communitybuilding'
    }
  ]
};

interface CreatorTypesProps {
  onNavigateToCreator: (creatorId: string) => void;
}

export default function CreatorTypes({ onNavigateToCreator }: CreatorTypesProps) {
  const [selectedCategory, setSelectedCategory] = useState('Community Care');
  return (
    <section className="py-20 bg-[#E8E3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            People of all kinds, all kind!
          </h2>
          <p className="text-xl text-gray-700">
            People making a difference. Support these amazing individuals doing good in the world
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {creatorTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedCategory === type.name;
            return (
              <button
                key={type.name}
                onClick={() => setSelectedCategory(type.name)}
                className={`px-6 py-3 rounded-full text-lg font-semibold transition-all ${
                  isSelected
                    ? 'bg-white border-3 border-blue-600 text-gray-900 shadow-md hover:shadow-lg'
                    : 'bg-white text-gray-900 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {type.name}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-center text-gray-600 italic mb-8">
          People using Very Kind
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {creatorExamples[selectedCategory].map((creator, index) => (
            <div
              key={index}
              onClick={() => onNavigateToCreator(creator.username)}
              className="aspect-square rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <img
                src={creator.image}
                alt={creator.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
