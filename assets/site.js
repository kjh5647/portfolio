(() => {
  const progress = document.getElementById('reading-progress');
  const updateProgress = () => {
    if (!progress) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const amount = total > 0 ? window.scrollY / total : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, amount))})`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  const waiting = document.querySelectorAll('.reveal-wait');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    waiting.forEach((element) => element.classList.remove('reveal-wait'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove('reveal-wait');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });
  waiting.forEach((element) => observer.observe(element));
})();
