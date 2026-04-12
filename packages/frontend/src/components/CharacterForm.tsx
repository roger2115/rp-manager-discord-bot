'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from './Input';
import Button from './Button';

const characterSchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana').max(80, 'Nazwa może mieć maksymalnie 80 znaków'),
  avatarUrl: z.string().url('Musi być prawidłowym URL'),
  tag: z.string().min(1, 'Tag jest wymagany').max(20, 'Tag może mieć maksymalnie 20 znaków'),
  brackets: z.string().min(1, 'Nawiasy są wymagane').max(10, 'Nawiasy mogą mieć maksymalnie 10 znaków'),
});

type CharacterFormData = z.infer<typeof characterSchema>;

interface CharacterFormProps {
  initialData?: Partial<CharacterFormData>;
  onSubmit: (data: CharacterFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CharacterForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: CharacterFormProps) {
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(initialData?.avatarUrl || null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: initialData,
  });

  const avatarUrl = watch('avatarUrl');

  React.useEffect(() => {
    if (avatarUrl) {
      setAvatarPreview(avatarUrl);
    }
  }, [avatarUrl]);

  const handleFormSubmit = async (data: CharacterFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Błąd wysyłania formularza:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Nazwa Postaci"
        placeholder="Jan Kowalski"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Avatar</label>
        
        {avatarPreview && (
          <div className="flex justify-center mb-3">
            <img 
              src={avatarPreview} 
              alt="Podgląd avatara" 
              className="w-24 h-24 rounded-full object-cover border-2 border-primary-500"
            />
          </div>
        )}
        
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mb-3">
          <p className="text-sm text-yellow-400">
            ⚠️ Użyj zewnętrznego URL (np. Discord CDN, Imgur). Przesłane pliki nie będą działać jako avatar na Discordzie.
          </p>
        </div>
        
        <Input
          placeholder="https://cdn.discordapp.com/avatars/..."
          error={errors.avatarUrl?.message}
          {...register('avatarUrl')}
        />
      </div>

      <Input
        label="Grupa"
        placeholder="APL"
        error={errors.tag?.message}
        {...register('tag')}
      />

      <Input
        label="Prefix/Nawias"
        placeholder="Sven. lub [] (dla nawiasów)"
        error={errors.brackets?.message}
        {...register('brackets')}
      />

      <div className="bg-dark-700/50 border border-primary-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-primary-400 mb-2">Jak używać:</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• <strong>Prefix:</strong> Wpisz "Sven." i na Discordzie: <code className="text-secondary-400">Sven. Witaj!</code></li>
          <li>• <strong>Nawiasy:</strong> Wpisz "[]" i na Discordzie: <code className="text-secondary-400">[Sven.] Witaj!</code></li>
          <li>• Twoja wiadomość pojawi się z nazwą i avatarem postaci</li>
        </ul>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Zapisywanie...' : initialData ? 'Zaktualizuj Postać' : 'Utwórz Postać'}
        </Button>
        <Button type="button" variant="danger" onClick={onCancel} disabled={isLoading}>
          Anuluj
        </Button>
      </div>
    </form>
  );
}
