/**
 * QUARTERアンケート - デスクトップ対応ナビゲーション機能
 */

// 即時実行関数式（IIFE）
(function() {
  // DOMの読み込み完了時に初期化関数を実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCrossPlatformNavigation);
  } else {
    initCrossPlatformNavigation();
  }
  
  // クロスプラットフォームナビゲーションを初期化
  function initCrossPlatformNavigation() {
    console.log('クロスプラットフォームナビゲーション初期化');
    
    // ナビゲーションアイテムにイベントリスナーを設定
    document.querySelectorAll('.nav-item').forEach(navItem => {
      // デスクトップ用（クリック）
      navItem.addEventListener('click', handleNavigation);
      
      // モバイル用（タッチ）
      navItem.addEventListener('touchend', handleNavigation);
    });
    
    // ナビゲーションイベントを処理
    function handleNavigation(e) {
      e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      
      const navItem = this;
      const section = navItem.getAttribute('data-section');
      console.log('ナビゲーションイベント:', e.type, section);
      
      // ターゲット要素の検索
      let targetElement = null;
      
      // 方法1: data-section属性で検索
      targetElement = document.querySelector(`.question[data-section="${section}"]`);
      
      // 方法2: IDで検索（フォールバック）
      if (!targetElement) {
        targetElement = document.querySelector(`#question-${section}`);
      }
      
      // 方法3: クラス名で検索（フォールバック）
      if (!targetElement) {
        targetElement = document.querySelector(`.${section}-section`);
      }
      
      // 対象要素が見つかった場合の処理
      if (targetElement) {
        // アクティブ状態の更新
        document.querySelectorAll('.nav-item').forEach(item => {
          item.classList.remove('active');
        });
        navItem.classList.add('active');
        
        // スクロール位置の計算
        const targetPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = targetPosition + window.pageYOffset - 80;
        
        try {
          // 1. スムーズスクロール API
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // 2. jQuery風のアニメーション（互換性のため）
          setTimeout(function() {
            const startPosition = window.pageYOffset;
            const distance = offsetPosition - startPosition;
            const duration = 500;
            let start = null;
            
            function step(timestamp) {
              if (!start) start = timestamp;
              const progress = timestamp - start;
              const percent = Math.min(progress / duration, 1);
              const easing = percent < 0.5 ? 2 * percent * percent : -1 + (4 - 2 * percent) * percent;
              
              window.scrollTo(0, startPosition + distance * easing);
              
              if (progress < duration) {
                window.requestAnimationFrame(step);
              }
            }
            
            window.requestAnimationFrame(step);
          }, 10);
          
          // 3. フォールバック：即時スクロール
          setTimeout(function() {
            if (Math.abs(window.pageYOffset - offsetPosition) > 100) {
              window.scrollTo(0, offsetPosition);
            }
          }, 600);
        } catch (error) {
          console.error('スクロールエラー:', error);
          window.scrollTo(0, offsetPosition);
        }
        
        console.log('スクロール実行:', offsetPosition);
      } else {
        console.error('対象セクションが見つかりません:', section);
        console.log('利用可能なセクション:',
          Array.from(document.querySelectorAll('[data-section]'))
            .map(el => el.getAttribute('data-section'))
        );
      }
      
      return false;
    }
  }
  
  // グローバルスコープに公開
  window.initCrossPlatformNavigation = initCrossPlatformNavigation;
})();
