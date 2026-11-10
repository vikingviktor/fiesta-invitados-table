/** Capture the rendered official plan, including off-screen seats on mobile. */
export async function seatingImage(element: HTMLElement): Promise<Blob> {
  await document.fonts.ready;
  const { default: html2canvas } = await import('html2canvas-pro');
  const width = Math.max(1200, ...Array.from(element.querySelectorAll<HTMLElement>('.long-table-layout'), table => table.scrollWidth + 40));
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
      ? `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--background').trim()})`
      : getComputedStyle(element).backgroundColor,
    windowWidth: width,
    onclone: (_document, clone) => {
      clone.style.width = `${width}px`;
      clone.style.maxWidth = 'none';
      clone.querySelectorAll<HTMLElement>('.long-table-scroll').forEach(scroll => {
        scroll.style.overflow = 'visible';
        scroll.scrollLeft = 0;
      });
      clone.querySelectorAll('.seating-toolbar').forEach(toolbar => toolbar.remove());
      clone.querySelectorAll<HTMLElement>('.seat-match, .seat-selected').forEach(seat => { seat.style.outline = 'none'; });
      const heading = _document.createElement('h2');
      heading.className = 'text-xl font-normal mb-5';
      heading.textContent = 'Distribucion mesas';
      clone.prepend(heading);
    },
  });
  return new Promise((resolve, reject) => canvas.toBlob(blob => {
    if (blob) resolve(blob);
    else reject(new Error('No se pudo crear la imagen.'));
  }, 'image/png'));
}

/** Called synchronously by the final download click to retain iOS activation. */
export async function deliverSeatingImage(blob: Blob) {
  const filename = 'distribucion-mesas.png';
  const file = new File([blob], filename, { type: 'image/png' });
  if (matchMedia('(pointer: coarse)').matches && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'Distribucion mesas' }); return; }
    catch (error) { if (error instanceof DOMException && error.name === 'AbortError') return; }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}