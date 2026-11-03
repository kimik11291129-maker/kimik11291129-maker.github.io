'use strict';

// 실제 화면을 확대하고 닫으면 원래 위치로 초점을 돌려줍니다.
const imageDialog = document.querySelector('.image-dialog');
if (imageDialog) {
  const image = imageDialog.querySelector('#expanded-image');
  const caption = imageDialog.querySelector('#image-caption');
  let trigger;
  let previousOverflow;
  document.querySelectorAll('[data-image]').forEach(button => {
    button.addEventListener('click', () => {
      trigger = button;
      image.src = button.dataset.image;
      image.alt = button.querySelector('img')?.alt || button.dataset.caption;
      caption.textContent = button.dataset.caption;
      previousOverflow = document.documentElement.style.overflow;
      imageDialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    });
  });
  imageDialog.querySelector('[data-close]').addEventListener('click', () => imageDialog.close());
  imageDialog.addEventListener('click', event => {
    if (event.target !== imageDialog) return;
    const bounds = imageDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) imageDialog.close();
  });
  imageDialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow || '';
    trigger?.focus({preventScroll: true});
  });
}

// 각 탭 그룹은 자기 패널만 전환하며 모델 API는 호출하지 않습니다.
document.querySelectorAll('[data-tab-group]').forEach(group => {
  const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(item => {
        const active = item === tab;
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
        document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
      });
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        tabs[next].click();
        tabs[next].focus();
      }
    });
  });
});

// 화면 배치에 맞게 페르소나 탭의 접근성 방향을 안내합니다.
const personaTabList = document.querySelector('.persona-tabs');
if (personaTabList) {
  const horizontalTabs = window.matchMedia('(max-width: 800px)');
  const setOrientation = () => personaTabList.setAttribute('aria-orientation', horizontalTabs.matches ? 'horizontal' : 'vertical');
  setOrientation();
  horizontalTabs.addEventListener('change', setOrientation);
}

// 상세 페이지의 읽은 위치를 얇은 진행선으로 표시합니다.
const progress = document.querySelector('.read-progress');
if (progress) {
  let scheduled = false;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, {passive: true});
  window.addEventListener('resize', updateProgress);
  updateProgress();
}
