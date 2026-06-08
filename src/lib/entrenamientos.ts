import { supabase } from './supabase';

export type ParsedEntrenamiento = {
  nombre: string;
  total: number;
};

export type UpsertSummary = {
  inserted: number;
  updated: number;
  ignored: number;
  totalLines: number;
};

export function parseOCRLines(text: string): {
  items: ParsedEntrenamiento[];
  ignored: number;
} {
  const lines = text.split('\n');
  const seen = new Set<string>();
  const items: ParsedEntrenamiento[] = [];
  let ignored = 0;

  for (const line of lines) {
    const trimmed = line.trim().replace(/^>\s*/, '');
    if (!trimmed) {
      ignored++;
      continue;
    }

    const match = trimmed.match(/^(.+?)\s*\((\d+)\/(\d+)\)\s*$/);
    if (!match) {
      ignored++;
      continue;
    }

    const nombre = match[1].trim();
    const total = parseInt(match[3], 10);

    if (seen.has(nombre)) {
      ignored++;
      continue;
    }
    seen.add(nombre);

    items.push({ nombre, total });
  }

  return { items, ignored };
}

export async function upsertEntrenamientos(
  items: ParsedEntrenamiento[]
): Promise<{ inserted: number; updated: number }> {
  let inserted = 0;
  let updated = 0;

  for (const item of items) {
    const { data: existing } = await supabase
      .from('entrenamientos')
      .select('cantidad_minima, cantidad_maxima, cantidad_apariciones')
      .eq('nombre', item.nombre)
      .maybeSingle();

    if (existing) {
      const newMin = Math.min(existing.cantidad_minima, item.total);
      const newMax = Math.max(existing.cantidad_maxima, item.total);

      await supabase
        .from('entrenamientos')
        .update({
          cantidad_minima: newMin,
          cantidad_maxima: newMax,
          cantidad_apariciones: existing.cantidad_apariciones + 1,
        })
        .eq('nombre', item.nombre);

      updated++;
    } else {
      await supabase
        .from('entrenamientos')
        .insert({
          nombre: item.nombre,
          cantidad_minima: item.total,
          cantidad_maxima: item.total,
          cantidad_apariciones: 1,
        });

      inserted++;
    }
  }

  return { inserted, updated };
}
