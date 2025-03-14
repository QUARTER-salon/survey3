/**
* QUARTERアンケート - スクロール位置監視機能
*/

// 即時実行関数式（IIFE）
(function() {
 // ページ読み込み完了時に初期化
 if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', initScrollMonitor);
 } else {
   initScrollMonitor();
 }
 
 // スクロール位置監視機能の初期化
 function initScrollMonitor() {
   // 監視対象のセクションを特定
   const sections = {
     store: document.querySelectorAll('[data-section="store"]'),
     rating: document.querySelectorAll('[data-section="rating"]'),
     info: document.querySelectorAll('[data-section="info"]'),
     service: document.querySelectorAll('[data-section="service"]'),
     feedback: document.querySelectorAll('[data-section="feedback"]')
   };
   
   // スクロールイベントのスロットリング
   let isScrolling = false;
   
   // スクロールイベントリスナーを設定
   window.addEventListener('scroll', function() {
     if (!isScrolling) {
       isScrolling = true;
       
       setTimeout(function() {
         updateActiveNavItem();
         isScrolling = false;
       }, 100);
     }
   });
   
   // 初期状態の更新
   setTimeout(updateActiveNavItem, 500);
   
   // スクロール位置に基づいてアクティブなナビゲーション項目を更新
   function updateActiveNavItem() {
     const viewportHeight = window.innerHeight;
     const scrollTop = window.scrollY || document.documentElement.scrollTop;
     
     let mostVisibleSection = '';
     let maxVisibility = 0;
     
     // 各セクションの可視性をチェック
     for (const section in sections) {
       const elements = sections[section];
       if (elements.length === 0) continue;
       
       let sectionVisibility = 0;
       
       elements.forEach(element => {
         const rect = element.getBoundingClientRect();
         
         if (rect.top < viewportHeight && rect.bottom > 0) {
           const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
           const elementVisibility = visibleHeight / rect.height;
           sectionVisibility += elementVisibility;
         }
       });
       
       if (sectionVisibility > maxVisibility) {
         maxVisibility = sectionVisibility;
         mostVisibleSection = section;
       }
     }
     
     // ナビゲーション項目の更新
     if (mostVisibleSection) {
       const navItems = document.querySelectorAll('.nav-item');
       
       navItems.forEach(item => {
         const itemSection = item.getAttribute('data-section');
         if (itemSection === mostVisibleSection) {
           item.classList.add('active');
         } else {
           item.classList.remove('active');
         }
       });
     }
   }
 }
})();
