/**
 * QUARTERアンケート - メインJavaScript
 * アプリケーション全体の初期化とグローバル機能
 */

// DOM読み込み完了時の処理
document.addEventListener('DOMContentLoaded', function() {
  console.log('アプリケーション初期化開始');
  
  // 各モジュールの読み込み確認と初期化
  checkDependencies();
  setupWarningHider();
  setupFormSubmission();
});

// 依存関係をチェック
function checkDependencies() {
  try {
    if (typeof CONFIG !== 'undefined') {
      console.log('CONFIG読み込み成功');
    } else {
      console.warn('CONFIG変数が見つかりません');
    }
  } catch (e) {
    console.error('CONFIG読み込みエラー:', e);
  }
}

// 警告非表示機能のセットアップ
function setupWarningHider() {
  window.addEventListener('load', function() {
    setTimeout(function() {
      hideAppsScriptWarnings();
    }, 100);
  });
}

// Apps Script関連の警告を非表示
function hideAppsScriptWarnings() {
  const warnings = document.querySelectorAll(
    '.apps-script-warning, div[role="alert"], .script-application-auth-container, .script-application-auth'
  );
  
  warnings.forEach(function(el) {
    if (el) el.style.display = 'none';
  });
}

// フォーム送信処理の設定
function setupFormSubmission() {
  const submitButton = document.getElementById('submitButton');
  
  if (submitButton) {
    submitButton.addEventListener('click', function() {
      if (typeof window.validateAndSubmit === 'function') {
        window.validateAndSubmit();
      }
    });
  }
}

// アンケート送信後の処理（validation.jsからのコールバック用）
window.handleFormAfterSubmission = function(rating) {
  try {
    // submitContainerをもう一度非表示にする
    const submitContainer = document.querySelector('.submit-container');
    if (submitContainer) {
      submitContainer.classList.add('hidden');
    }
    
    // ページトップにスクロール
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    console.log(`フォーム送信完了: 評価 ${rating}星`);
  } catch (e) {
    console.error('フォーム送信後処理エラー:', e);
  }
};

// コメントをクリップボードにコピー
window.copyComment = function() {
  const commentElement = document.getElementById('comment-to-copy');
  if (!commentElement) return;
  
  commentElement.select();
  
  try {
    // モダンAPIを試す
    if (navigator.clipboard) {
      navigator.clipboard.writeText(commentElement.value)
        .then(function() {
          updateCopyButtonState(true);
        })
        .catch(function(err) {
          console.error('コピーエラー:', err);
          fallbackCopy();
        });
    } else {
      fallbackCopy();
    }
  } catch (e) {
    console.error('クリップボードエラー:', e);
    fallbackCopy();
  }
};

// 古いブラウザ用のコピー機能フォールバック
function fallbackCopy() {
  try {
    // document.execCommandが使用可能かチェック
    if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      document.execCommand('copy');
      updateCopyButtonState(true);
    } else {
      // 両方の方法が失敗した場合
      alert('ブラウザがコピー機能をサポートしていません。テキストを手動でコピーしてください。');
      updateCopyButtonState(false);
    }
  } catch (fallbackErr) {
    alert('コピーできませんでした。お手数ですが手動でコピーしてください。');
    console.error('フォールバックコピーエラー:', fallbackErr);
    updateCopyButtonState(false);
  }
}

// コピーボタンの状態を更新
function updateCopyButtonState(success) {
  const copyButton = document.getElementById('copy-button');
  if (!copyButton) return;
  
  const originalText = copyButton.textContent;
  
  copyButton.textContent = success ? 'コピーしました！' : 'コピーできませんでした';
  copyButton.style.backgroundColor = success ? 'var(--secondary-color)' : 'var(--danger-color)';
  copyButton.style.color = 'white';
  
  setTimeout(function() {
    copyButton.textContent = originalText;
    copyButton.style.backgroundColor = 'white';
    copyButton.style.color = '';
  }, 2000);
}

// Googleマップへリダイレクト
window.redirectToGoogleMaps = function() {
  try {
    const selectedStore = document.querySelector('input[name="store"]:checked');
    const storeName = selectedStore ? selectedStore.value : 'QUARTER';
    
    if (typeof CONFIG !== 'undefined' && CONFIG.STORE_REVIEW_URLS) {
      const url = CONFIG.STORE_REVIEW_URLS[storeName] || CONFIG.STORE_REVIEW_URLS['QUARTER'];
      window.open(url, '_blank');
    } else {
      console.error('STORE_REVIEW_URLS が定義されていません');
    }
  } catch (e) {
    console.error('リダイレクトエラー:', e);
  }
};
