type SavedStyle = {
  el: HTMLElement;
  overflow: string;
  overflowY: string;
  height: string;
  maxHeight: string;
  scrollTop: number;
};

function unlockOverflow(root: HTMLElement): () => void {
  const saved: SavedStyle[] = [];

  function unlock(el: HTMLElement) {
    const cs = getComputedStyle(el);
    if (
      cs.overflow === "auto" ||
      cs.overflow === "hidden" ||
      cs.overflowY === "auto" ||
      cs.overflowY === "hidden"
    ) {
      saved.push({
        el,
        overflow: el.style.overflow,
        overflowY: el.style.overflowY,
        height: el.style.height,
        maxHeight: el.style.maxHeight,
        scrollTop: el.scrollTop,
      });
      el.style.overflow = "visible";
      el.style.overflowY = "visible";
      el.style.height = "auto";
      el.style.maxHeight = "none";
      el.scrollTop = 0;
    }
  }

  // Unlock all scroll-constraining ancestors
  let ancestor: HTMLElement | null = root.parentElement;
  while (ancestor && ancestor !== document.body) {
    unlock(ancestor);
    ancestor = ancestor.parentElement;
  }

  // Unlock all scrollable descendants
  root.querySelectorAll("*").forEach((child) => {
    const cs = getComputedStyle(child as HTMLElement);
    if (
      cs.overflowY === "auto" ||
      cs.overflowY === "hidden" ||
      cs.overflow === "auto" ||
      cs.overflow === "hidden"
    ) {
      unlock(child as HTMLElement);
    }
  });

  return () => {
    for (const s of saved) {
      s.el.style.overflow = s.overflow;
      s.el.style.overflowY = s.overflowY;
      s.el.style.height = s.height;
      s.el.style.maxHeight = s.maxHeight;
      s.el.scrollTop = s.scrollTop;
    }
  };
}

export async function captureElement(target: HTMLElement): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas");
  const isDark = document.documentElement.classList.contains("dark");

  const restore = unlockOverflow(target);
  await new Promise((r) => setTimeout(r, 250));

  try {
    return await html2canvas(target, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
      logging: false,
    });
  } finally {
    restore();
  }
}

export function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}
