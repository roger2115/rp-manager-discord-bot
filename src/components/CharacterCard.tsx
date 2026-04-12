import React from 'react';
import Image from 'next/image';

interface Character {
  id: string;
  name: string;
  avatarUrl: string;
  tag: string;
  brackets: string;
  messageCount: number;
  currentRank?: {
    name: string;
  };
}

interface CharacterCardProps {
  character: Character;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
}

export default function CharacterCard({ character, onEdit, onDelete }: CharacterCardProps) {
  return (
    <div className="bg-dark-800 border border-primary-900/50 rounded-lg p-4 hover:border-primary-600 transition-all">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary-600">
          <Image
            src={character.avatarUrl}
            alt={character.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{character.name}</h3>
          <p className="text-sm text-gray-400">
            Grupa: <span className="text-primary-400">{character.tag}</span>
          </p>
          <p className="text-sm text-gray-400">
            Prefix: <span className="text-secondary-400">{character.brackets}</span>
          </p>
          {character.currentRank && (
            <p className="text-sm text-gray-400">
              Rank: <span className="text-primary-400">{character.currentRank.name}</span>
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {character.messageCount} wiadomości
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onEdit(character)}
            className="px-3 py-1 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white text-sm rounded transition-all"
          >
            Edytuj
          </button>
          <button
            onClick={() => onDelete(character)}
            className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm rounded transition-all"
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
}
