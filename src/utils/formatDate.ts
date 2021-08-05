import { format } from 'date-fns';
import brasilianLocale from 'date-fns/locale/pt-BR'

export function formatDate(date: string) {
  return format(new Date(date), "dd MMM yyyy", {
    locale: brasilianLocale
  });
}


