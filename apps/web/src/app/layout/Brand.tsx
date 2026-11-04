import { Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sticker } from '@/components/decor/Sticker';
import { useT } from '@/lib/i18n';

export function Brand() {
  const t = useT();
  return (
    <Link to="/" className="flex items-center gap-3 rounded-full">
      <Sticker tone="orange" className="h-10 w-10">
        <Gamepad2 size={20} />
      </Sticker>
      <span className="font-display text-xl leading-tight">{t('app.name')}</span>
    </Link>
  );
}
