import { useMemo } from 'react';
import type { AnyLayer, GlyphPlacement } from '@/esoteric/types';
import { CANVAS_SIZE } from '@/esoteric/types';
import { buildSvgInner, type RenderOptions } from '@/esoteric/svgUtils';

interface Props {
  layers: AnyLayer[];
  placements: GlyphPlacement[];
  renderOptions?: RenderOptions;
}

export default function SigilCanvas({ layers, placements, renderOptions }: Props) {
  const inner = useMemo(
    () => buildSvgInner(layers, placements, renderOptions),
    [layers, placements, renderOptions]
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <svg
        viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
        className="w-full h-full max-w-[min(100%,calc(100dvh-160px))] max-h-[min(100%,calc(100dvh-160px))] drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    </div>
  );
}
