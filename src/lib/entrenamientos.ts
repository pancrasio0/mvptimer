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
  const rawLines = text.split('\n');
  const merged: string[] = [];
  let ignored = 0;

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim().replace(/^>\s*/, '');
    if (!trimmed) {
      ignored++;
      continue;
    }

    const continuation = /^\(\d+\/\d+\)$/.test(trimmed);
    if (continuation && merged.length > 0) {
      merged[merged.length - 1] += ' ' + trimmed;
    } else {
      merged.push(trimmed);
    }
  }

  const seen = new Set<string>();
  const items: ParsedEntrenamiento[] = [];

  for (const line of merged) {
    const match = line.match(/^(.+?)\s*\((\d+)\/(\d+)\)\s*$/);
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
